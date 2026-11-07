"use client";

/* eslint-disable react/no-unknown-property */
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { COLOR_SCHEME_EVENT } from "@/lib/color-scheme";
import styles from "../NameBadge.module.css";
import {
  CARD,
  CARD_CENTER_Y,
  createBadgeTextures,
  createContactShadowTexture,
  readBadgePalette,
  type BadgePalette
} from "./badgeTexture";

const CARD_MODEL = "/about/badge-card.glb";
const MIN_BADGE_WIDTH = 324;
const CARD_WORLD_WIDTH = CARD.width * 2.25;
/** Strap thickness as a fraction of the badge face. */
const STRAP_PER_CARD = 22 / MIN_BADGE_WIDTH;

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, "args"> & {
      args?: ConstructorParameters<typeof MeshLineMaterial>;
    };
  }
}

useGLTF.preload(CARD_MODEL);

function borderChannels(color: string): [number, number, number] {
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const value =
      hex[1].length === 3
        ? hex[1]
            .split("")
            .map((channel) => channel + channel)
            .join("")
        : hex[1];
    return [
      Number.parseInt(value.slice(0, 2), 16) / 255,
      Number.parseInt(value.slice(2, 4), 16) / 255,
      Number.parseInt(value.slice(4, 6), 16) / 255
    ];
  }
  const channels = color.match(/\d+/g);
  if (channels && channels.length >= 3) {
    return [Number(channels[0]) / 255, Number(channels[1]) / 255, Number(channels[2]) / 255];
  }
  return [237 / 255, 237 / 255, 237 / 255];
}

/** Rounds the face and paints a continuous 1px border in the border token. */
function clipCardCorners(shader: { fragmentShader: string; uniforms: Record<string, { value: THREE.Vector3 }> }, border: THREE.Vector3) {
  const width = CARD.width.toFixed(4);
  const height = CARD.height.toFixed(4);
  const radius = CARD.radius.toFixed(4);
  shader.uniforms.uBorder = { value: border };
  shader.fragmentShader = `uniform vec3 uBorder;\n${shader.fragmentShader}`
    .replace(
      "#include <opaque_fragment>",
      `
      vec2 badgeP = (vMapUv - 0.5) * vec2(${width}, ${height});
      vec2 badgeHalf = vec2(${width}, ${height}) * 0.5;
      float badgeRadius = ${radius};
      vec2 badgeQ = abs(badgeP) - (badgeHalf - vec2(badgeRadius));
      float badgeDist = length(max(badgeQ, 0.0)) + min(max(badgeQ.x, badgeQ.y), 0.0) - badgeRadius;
      float badgePx = clamp(fwidth(badgeDist), 1e-4, 0.008);
      float badgeInside = -badgeDist;
      if (badgeInside <= 0.0) discard;
      #include <opaque_fragment>
      `
    )
    .replace(
      "#include <colorspace_fragment>",
      `
      #include <colorspace_fragment>
      if (badgeInside < badgePx) {
        gl_FragColor.rgb = uBorder;
      }
      `
    );
}

type PointerTarget = {
  releasePointerCapture: (id: number) => void;
  setPointerCapture: (id: number) => void;
};

type LerpedBody = RapierRigidBody & { lerped?: THREE.Vector3 };

type LanyardProps = {
  email?: string;
  job?: string;
  location?: string;
  name?: string;
  onReady?: () => void;
  photo?: string | null;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  lanyardWidth?: number;
};

function badgeFacePixels(height: number, fov: number, dpr: number, baseZ: number) {
  const pixelRatio = dpr > 0 ? dpr : Math.min(window.devicePixelRatio || 2, 3);
  if (height <= 0) {
    return Math.round(MIN_BADGE_WIDTH * pixelRatio);
  }
  const halfFov = (fov * Math.PI) / 180 / 2;
  const tanHalf = Math.tan(halfFov);
  const distanceForMinWidth = (CARD_WORLD_WIDTH * height) / (2 * tanHalf * MIN_BADGE_WIDTH);
  const z = Math.min(baseZ, distanceForMinWidth);
  const cssWidth = (CARD_WORLD_WIDTH * height) / (2 * z * tanHalf);
  return Math.ceil(cssWidth * pixelRatio * 1.15);
}

function useBadgePalette() {
  const [palette, setPalette] = useState(readBadgePalette);

  useEffect(() => {
    const read = () => setPalette(readBadgePalette());
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-theme-preference"]
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", read);
    window.addEventListener(COLOR_SCHEME_EVENT, read);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", read);
      window.removeEventListener(COLOR_SCHEME_EVENT, read);
    };
  }, []);

  return palette;
}

const SLOT_SELECTOR = "[data-badge-slot]";

/** Meshline width is a fraction of the canvas, so scale it back to the badge. */
function strapLineWidth(slotHeight: number, canvasWidth: number, fov: number) {
  const tanHalf = Math.tan(((fov * Math.PI) / 180) / 2);
  return (STRAP_PER_CARD * CARD_WORLD_WIDTH * slotHeight) / (canvasWidth * tanHalf);
}

function slotElement() {
  const slot = document.querySelector(SLOT_SELECTOR);
  return slot instanceof HTMLElement ? slot : null;
}

function isPageControl(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, [role='button']"));
}

/** Pendulum from the lanyard rail's first-open sway: one +30°/s kick, then k=28, damping 2.2. */
const SWAY_DELAY_MS = 60;
const SWAY_IMPULSE = 30;
const SWAY_K = 28;
const SWAY_DAMP = 2.2;
const SWAY_LIMIT = 18;

type FrameState = {
  frames: number;
  height: number;
  stable: boolean;
  width: number;
};

function stepSway(angle: number, velocity: number, dt: number) {
  const nextVelocity = velocity + (-SWAY_K * angle - SWAY_DAMP * velocity) * dt;
  const nextAngle = Math.min(SWAY_LIMIT, Math.max(-SWAY_LIMIT, angle + nextVelocity * dt));
  return { angle: nextAngle, velocity: nextVelocity };
}

/** Frames the slot, but draws on the full viewport so a drag can leave the section. */
function SlotFrame({
  baseZ,
  fov,
  frameState
}: {
  baseZ: number;
  fov: number;
  frameState: RefObject<FrameState>;
}) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  useLayoutEffect(() => {
    (camera as THREE.PerspectiveCamera & { manual?: boolean }).manual = true;
  }, [camera]);

  useFrame(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const canvasRect = gl.domElement.getBoundingClientRect();
    const slot = slotElement();
    if (!slot || canvasRect.width < 1 || canvasRect.height < 1) {
      return;
    }
    const rect = slot.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) {
      return;
    }

    const halfFov = (fov * Math.PI) / 180 / 2;
    const distanceForMinWidth = (CARD_WORLD_WIDTH * rect.height) / (2 * Math.tan(halfFov) * MIN_BADGE_WIDTH);
    perspective.fov = fov;
    perspective.position.z = Math.min(baseZ, distanceForMinWidth);
    perspective.lookAt(0, 0.15, 0);

    const offsetX = canvasRect.left - rect.left;
    const offsetY = canvasRect.top - rect.top;
    perspective.setViewOffset(rect.width, rect.height, offsetX, offsetY, canvasRect.width, canvasRect.height);

    const width = Math.round(canvasRect.width);
    const height = Math.round(canvasRect.height);
    const state = frameState.current;
    if (!state) {
      return;
    }
    if (width === state.width && height === state.height) {
      state.frames += 1;
    } else {
      state.width = width;
      state.height = height;
      state.frames = 0;
    }
    state.stable = state.frames >= 2;
  });

  return null;
}

function CanvasPointer() {
  const events = useThree((state) => state.events);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const compute = events.compute;
    events.compute = (event, state) => {
      const point = event as { clientX?: number; clientY?: number };
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || typeof point.clientX !== "number" || typeof point.clientY !== "number") {
        compute?.(event, state);
        return;
      }
      const x = (point.clientX - rect.left) / rect.width;
      const y = (point.clientY - rect.top) / rect.height;
      state.pointer.set(x * 2 - 1, -y * 2 + 1);
      state.raycaster.setFromCamera(state.pointer, state.camera);
    };
    return () => {
      events.compute = compute;
    };
  }, [events, gl]);

  return null;
}

function ClearColor() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    gl.domElement.style.pointerEvents = "none";
  }, [gl]);

  return null;
}

export default function Lanyard({
  position = [0, 0.1, 18],
  gravity = [0, -40, 0],
  fov = 20,
  name = "",
  job = "",
  location = "",
  email = "",
  photo = null,
  lanyardWidth = 0.62,
  onReady
}: LanyardProps) {
  const palette = useBadgePalette();
  const frameState = useRef<FrameState>({
    frames: 0,
    height: 0,
    stable: false,
    width: 0
  });
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");
  const [sceneReady, setSceneReady] = useState(false);
  const markReady = useCallback(() => {
    setSceneReady(true);
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) {
    return null;
  }

  const portalTarget = document.querySelector(".portfolio-content-shell") ?? document.body;
  const stage = (
    <div className={[isMobile ? styles.stageStatic : styles.stage, sceneReady ? styles.stageReady : ""].filter(Boolean).join(" ")}>
      <Canvas
        camera={{ position, fov }}
        dpr={isMobile ? [1, 2] : [1, 3]}
        eventSource={isMobile ? undefined : document.body}
        gl={{ alpha: true, antialias: false, premultipliedAlpha: true }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          camera.lookAt(0, 0.15, 0);
        }}
      >
        <ClearColor />
        <CanvasPointer />
        <SlotFrame baseZ={position[2]} fov={fov} frameState={frameState} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 7, 8]} intensity={0.85} />
        <Suspense fallback={null}>
          <Physics key={isMobile ? "static" : "interactive"} gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              baseZ={position[2]}
              email={email}
              fov={fov}
              frameState={frameState}
              isMobile={isMobile}
              job={job}
              lanyardWidth={lanyardWidth}
              location={location}
              name={name}
              onReady={markReady}
              palette={palette}
              photo={photo}
            />
          </Physics>
        </Suspense>
        <Environment blur={0.85}>
          <Lightformer
            intensity={0.6}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={0.8}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={1.8}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );

  if (isMobile) {
    return stage;
  }

  return createPortal(stage, portalTarget);
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  name = "",
  job = "",
  location = "",
  email = "",
  photo = null,
  lanyardWidth = 0.62,
  fov = 20,
  baseZ = 18,
  palette,
  frameState,
  onReady
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  name?: string;
  job?: string;
  location?: string;
  email?: string;
  photo?: string | null;
  lanyardWidth?: number;
  fov?: number;
  baseZ?: number;
  palette: BadgePalette;
  frameState: RefObject<FrameState>;
  onReady?: () => void;
}) {
  const viewportDpr = useThree((state) => state.viewport.dpr);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const compiledWithEnv = useRef(false);
  const [faceHeight, setFaceHeight] = useState(482);
  const swallowClick = useRef(false);
  const pixelWidth = badgeFacePixels(faceHeight, fov, viewportDpr, baseZ);

  useEffect(() => {
    const slot = slotElement();
    if (!slot) {
      return undefined;
    }
    const update = () => {
      const height = slot.getBoundingClientRect().height;
      if (height > 0) {
        setFaceHeight(height);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const blockClick = (event: MouseEvent) => {
      if (!swallowClick.current) {
        return;
      }
      swallowClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("click", blockClick, true);
    return () => window.removeEventListener("click", blockClick, true);
  }, []);
  const band = useRef<THREE.Mesh>(null);
  const revealed = useRef(false);
  const readyFrames = useRef(0);
  const hanger = useRef<THREE.Group>(null);
  const sway = useRef({ active: false, angle: 0, kicked: false, startedAt: 0, velocity: 0 });
  const fontEpochRef = useRef(0);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const vec = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(CARD_MODEL);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [fontEpoch, setFontEpoch] = useState(0);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const contactShadow = useMemo(() => createContactShadowTexture(palette.shadow), [palette.shadow]);
  const borderColor = useRef<THREE.Vector3 | null>(null);
  if (borderColor.current === null) {
    const [red, green, blue] = borderChannels(palette.line);
    borderColor.current = new THREE.Vector3(red, green, blue);
  }
  useLayoutEffect(() => {
    const [red, green, blue] = borderChannels(palette.line);
    borderColor.current!.set(red, green, blue);
  }, [palette.line]);
  const clipFace = useCallback((shader: { fragmentShader: string; uniforms: Record<string, { value: THREE.Vector3 }> }) => {
    clipCardCorners(shader, borderColor.current!);
  }, []);
  const maps = useMemo(
    () => createBadgeTextures({ name, job, location, email, photo: photoImg, pixelWidth, palette }),
    [name, job, location, email, photoImg, fontEpoch, pixelWidth, palette]
  );

  useEffect(() => {
    curve.curveType = "chordal";
  }, [curve]);

  useEffect(() => {
    let live = true;
    const finish = () => {
      if (live) {
        setFontEpoch((value) => value + 1);
      }
    };
    if (!document.fonts) {
      finish();
      return () => {
        live = false;
      };
    }
    document.fonts.ready.then(finish);
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!photo) {
      setPhotoImg(null);
      return undefined;
    }
    let live = true;
    const img = new Image();
    img.onload = () => {
      const decoded = typeof img.decode === "function" ? img.decode() : Promise.resolve();
      decoded.then(
        () => {
          if (live) {
            setPhotoImg(img);
          }
        },
        () => {
          if (live) {
            setPhotoImg(img);
          }
        }
      );
    };
    img.onerror = () => {
      if (live) {
        setPhotoFailed(true);
      }
    };
    img.src = photo;
    return () => {
      live = false;
    };
  }, [photo]);

  useEffect(
    () => () => {
      contactShadow.dispose();
    },
    [contactShadow]
  );

  useEffect(
    () => () => {
      maps.front.dispose();
      maps.back.dispose();
    },
    [maps]
  );

  const fixedBody = fixed as RefObject<RapierRigidBody>;
  const joint1 = j1 as RefObject<RapierRigidBody>;
  const joint2 = j2 as RefObject<RapierRigidBody>;
  const joint3 = j3 as RefObject<RapierRigidBody>;
  const cardBody = card as RefObject<RapierRigidBody>;

  useRopeJoint(fixedBody, joint1, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);
  useRopeJoint(joint1, joint2, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);
  useRopeJoint(joint2, joint3, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);
  useSphericalJoint(joint3, cardBody, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (!hovered) {
      return undefined;
    }
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useEffect(() => {
    if (!dragged) {
      return undefined;
    }
    const release = () => drag(false);
    window.addEventListener("pointerup", release);
    return () => window.removeEventListener("pointerup", release);
  }, [dragged]);

  fontEpochRef.current = fontEpoch;

  useFrame((state, delta) => {
    const metal = materials.metal as THREE.MeshStandardMaterial;
    const renderer = gl as THREE.WebGLRenderer;
    if (scene.environment && metal.envMap !== scene.environment) {
      metal.envMap = scene.environment;
      metal.needsUpdate = true;
      compiledWithEnv.current = false;
    }
    if (scene.environment && metal.envMap === scene.environment && !compiledWithEnv.current) {
      compiledWithEnv.current = true;
      void renderer.compileAsync(scene, camera);
    }

    const photoReady = !photo || photoImg || photoFailed;
    const frameReady = frameState.current?.stable === true && fontEpochRef.current > 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!revealed.current && frameReady && photoReady && card.current && band.current) {
      readyFrames.current += 1;
      if (readyFrames.current >= 2) {
        revealed.current = true;
        if (!reducedMotion) {
          sway.current.startedAt = performance.now();
          sway.current.active = true;
        }
        onReady?.();
      }
    } else if (!revealed.current) {
      readyFrames.current = 0;
    }

    if (dragged && sway.current.active) {
      sway.current.active = false;
      sway.current.angle = 0;
      sway.current.velocity = 0;
    }
    if (hanger.current && sway.current.active) {
      const elapsed = performance.now() - sway.current.startedAt;
      if (!sway.current.kicked && elapsed >= SWAY_DELAY_MS) {
        sway.current.velocity += SWAY_IMPULSE;
        sway.current.kicked = true;
      }
      if (sway.current.kicked) {
        const next = stepSway(sway.current.angle, sway.current.velocity, Math.min(delta, 1 / 30));
        sway.current.angle = next.angle;
        sway.current.velocity = next.velocity;
        if (Math.abs(sway.current.angle) < 0.02 && Math.abs(sway.current.velocity) < 0.05) {
          sway.current.angle = 0;
          sway.current.velocity = 0;
          sway.current.active = false;
        }
      }
      hanger.current.rotation.z = (sway.current.angle * Math.PI) / 180;
    } else if (hanger.current) {
      hanger.current.rotation.z = 0;
    }

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach((ref) => {
        const body = ref.current as LerpedBody | null;
        if (!body) {
          return;
        }
        if (!body.lerped) {
          body.lerped = new THREE.Vector3().copy(body.translation());
        }
        const clampedDistance = Math.max(0.1, Math.min(1, body.lerped.distanceTo(body.translation())));
        body.lerped.lerp(body.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      const joint2Body = j2.current as LerpedBody;
      const joint1Body = j1.current as LerpedBody;
      const originX = hanger.current?.position.x ?? 0;
      const originY = hanger.current?.position.y ?? 4;
      const originZ = hanger.current?.position.z ?? 0;
      const placeStrap = (target: THREE.Vector3, source: { x: number; y: number; z: number }) => {
        target.set(source.x - originX, source.y - originY, source.z - originZ);
      };
      placeStrap(curve.points[0], j3.current.translation());
      placeStrap(curve.points[1], joint2Body.lerped ?? j2.current.translation());
      placeStrap(curve.points[2], joint1Body.lerped ?? j1.current.translation());
      placeStrap(curve.points[3], fixed.current.translation());
      (band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(isMobile ? 16 : 32));
      const slotHeight = slotElement()?.getBoundingClientRect().height ?? 0;
      if (slotHeight > 1 && state.size.width > 1) {
        (band.current.material as MeshLineMaterial).lineWidth =
          strapLineWidth(slotHeight, state.size.width, fov) * (lanyardWidth / 0.62);
      }
      if (!isMobile) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false);
      }
    }
  });

  const halfW = (CARD.width * 2.25) / 2;
  const halfH = (CARD.height * 2.25) / 2;
  const colliderY = -1.2 + CARD_CENTER_Y * 2.25;
  const clip = nodes.clip as THREE.Mesh;
  const clamp = nodes.clamp as THREE.Mesh;

  return (
    <>
      <group ref={hanger} position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps} type={isMobile ? "fixed" : "dynamic"}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps} type={isMobile ? "fixed" : "dynamic"}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps} type={isMobile ? "fixed" : "dynamic"}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -4.5, 0]}
          ref={card}
          {...segmentProps}
          type={isMobile ? "fixed" : dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[halfW, halfH, 0.02]} position={[0, colliderY, -0.05]} />
          <group
            frustumCulled={false}
            scale={2.25}
            position={[0, -1.2, -0.05]}
            {...(isMobile ? { raycast: () => undefined } : {})}
            onPointerOver={() => {
              if (!isMobile) {
                hover(true);
              }
            }}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              if (isMobile) {
                return;
              }
              (event.target as unknown as PointerTarget).releasePointerCapture(event.pointerId);
              drag(false);
            }}
            onPointerDown={(event) => {
              if (isMobile || isPageControl(event.nativeEvent.target)) {
                return;
              }
              event.stopPropagation();
              event.nativeEvent.preventDefault();
              swallowClick.current = true;
              (event.target as unknown as PointerTarget).setPointerCapture(event.pointerId);
              drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current!.translation())));
            }}
          >
            <mesh frustumCulled={false} position={[0, CARD_CENTER_Y - CARD.height * 0.2, -0.12]}>
              <planeGeometry args={[CARD.width * 0.5, CARD.height * 0.1]} />
              <meshBasicMaterial map={contactShadow} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh frustumCulled={false} position={[0, CARD_CENTER_Y, CARD.depth / 2 + 0.001]}>
              <planeGeometry args={[CARD.width, CARD.height]} />
              <meshBasicMaterial
                map={maps.front}
                toneMapped={false}
                customProgramCacheKey={() => "badge-face-border"}
                onBeforeCompile={clipFace}
              />
            </mesh>
            <mesh frustumCulled={false} position={[0, CARD_CENTER_Y, -CARD.depth / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD.width, CARD.height]} />
              <meshBasicMaterial
                map={maps.back}
                toneMapped={false}
                customProgramCacheKey={() => "badge-face-border"}
                onBeforeCompile={clipFace}
              />
            </mesh>
            <mesh frustumCulled={false} geometry={clip.geometry} material={materials.metal} />
            <mesh frustumCulled={false} geometry={clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
        <mesh ref={band} frustumCulled={false}>
          <meshLineGeometry />
          <meshLineMaterial
            color={palette.strap}
            depthTest={false}
            resolution={[1000, 1000]}
            lineWidth={lanyardWidth}
          />
        </mesh>
      </group>
    </>
  );
}
