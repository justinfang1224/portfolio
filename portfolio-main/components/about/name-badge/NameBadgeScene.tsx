"use client";

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
import { MeshLineGeometry, MeshLineMaterial, type MeshLineMaterialParameters } from "meshline";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import {
  CARD,
  CARD_CENTER_Y,
  createBadgeGeometry,
  createBadgeTextures,
  createContactShadowTexture,
  readBadgePalette,
  type BadgePalette
} from "./badgeTexture";

const CARD_MODEL = "/about/badge-card.glb";
const BADGE_SCALE = 2.25 * 1.2 * 1.1 * 1.15;
/** Camera frame the badge scale is composed in. The layout slot is shorter than this frame. */
const FRAME_HEIGHT = 560;
const CROPPED_FRAME_HEIGHT = 536;
/** Clip ring position in the unscaled group. Keeps the strap seated in the clasp when the badge scales. */
const CLIP_ANCHOR_Y = 1.2;
const CARD_JOINT_Y = 1.5;

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

useGLTF.preload(CARD_MODEL);

type NameBadgeSceneProps = {
  email: string;
  frameloop?: "always" | "never";
  job: string;
  location: string;
  name: string;
  onLoaded?: () => void;
  onReady?: () => void;
  photo: string;
};

function badgeSlot() {
  return document.querySelector<HTMLElement>("section[aria-label='Name badge']");
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
    window.addEventListener("portfolio:color-scheme", read);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", read);
      window.removeEventListener("portfolio:color-scheme", read);
    };
  }, []);

  return palette;
}

export default function NameBadgeScene({
  frameloop = "always",
  onLoaded,
  onReady,
  ...props
}: NameBadgeSceneProps) {
  const palette = useBadgePalette();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cameraPosition: [number, number, number] = isMobile ? [0, 0.1, 24.3] : [0, 0.1, 18];

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 20 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      frameloop={frameloop}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
      onCreated={({ gl, camera, setEvents }) => {
        gl.setClearColor(new THREE.Color(palette.background), 0);
        camera.lookAt(0, 0.15, 0);
        const canvas = gl.domElement;
        setEvents({
          compute(event, state) {
            const rect = canvas.getBoundingClientRect();
            const width = rect.width || 1;
            const height = rect.height || 1;
            state.pointer.set(
              ((event.clientX - rect.left) / width) * 2 - 1,
              -((event.clientY - rect.top) / height) * 2 + 1
            );
            state.raycaster.setFromCamera(state.pointer, state.camera);
          }
        });
      }}
    >
      <ClearColor color={palette.background} />
      <OpenFrame />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 7, 8]} intensity={0.85} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} onLoaded={onLoaded} onReady={onReady} palette={palette} {...props} />
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
  );
}

function ClearColor({ color }: { color: string }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.setClearColor(new THREE.Color(color), 0);
  }, [color, gl]);
  return null;
}
function OpenFrame() {
  useFrame(({ camera, gl }) => {
    const perspective = camera as THREE.PerspectiveCamera;
    const canvas = gl.domElement;
    const slot = badgeSlot();
    if (!slot) {
      perspective.clearViewOffset();
      return;
    }
    const canvasRect = canvas.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    if (canvasRect.width < 1 || canvasRect.height < 1 || slotRect.width < 1) {
      return;
    }
    const fullHeight =
      Math.abs(slotRect.height - CROPPED_FRAME_HEIGHT) <= 1 ? FRAME_HEIGHT : slotRect.height;
    perspective.setViewOffset(
      slotRect.width,
      fullHeight,
      canvasRect.left - slotRect.left,
      canvasRect.top - slotRect.top,
      canvasRect.width,
      canvasRect.height
    );
  });
  return null;
}

function Band({
  email,
  isMobile,
  job,
  location,
  maxSpeed = 50,
  minSpeed = 0,
  name,
  onLoaded,
  onReady,
  palette,
  photo
}: NameBadgeSceneProps & {
  isMobile: boolean;
  maxSpeed?: number;
  minSpeed?: number;
  palette: BadgePalette;
}) {
  const band = useRef<THREE.Mesh>(null);
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
  const [fontEpoch, setFontEpoch] = useState(0);
  const [curve] = useState(() => {
    const strap = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, 4, 0)
    ]);
    strap.curveType = "chordal";
    return strap;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const lerped = useRef<{ j1?: THREE.Vector3; j2?: THREE.Vector3 }>({});
  const loadedRef = useRef(false);
  const presentFrames = useRef(0);
  const settleFrames = useRef(0);
  const totalFrames = useRef(0);

  const cardGeom = useMemo(() => createBadgeGeometry(), []);
  const contactShadow = useMemo(() => createContactShadowTexture(palette.shadow), [palette.shadow]);
  const maps = useMemo(
    () => createBadgeTextures({ name, job, location, email, photo: photoImg, palette }),
    [name, job, location, email, photoImg, palette, fontEpoch]
  );

  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) {
        setFontEpoch((value) => value + 1);
      }
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    const img = new Image();
    img.onload = () => {
      if (live) {
        setPhotoImg(img);
      }
    };
    img.src = photo;
    return () => {
      live = false;
    };
  }, [photo]);

  useEffect(
    () => () => {
      cardGeom.dispose();
      contactShadow.dispose();
    },
    [cardGeom, contactShadow]
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

  useFrame((state, delta) => {
    if (card.current && !loadedRef.current) {
      totalFrames.current += 1;
      const velocity = card.current.linvel();
      const spin = card.current.angvel();
      const resting =
        Math.hypot(velocity.x, velocity.y, velocity.z) < 0.08 &&
        Math.hypot(spin.x, spin.y, spin.z) < 0.08;

      settleFrames.current = resting ? settleFrames.current + 1 : 0;

      if (settleFrames.current > 20 || totalFrames.current > 180) {
        loadedRef.current = true;
        onLoaded?.();
      }
    }

    if (card.current) {
      if (!badgeSlot()) {
        presentFrames.current = 0;
      } else {
        presentFrames.current += 1;
        if (presentFrames.current === 1) {
          onReady?.();
        }
      }
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
      (["j1", "j2"] as const).forEach((key) => {
        const body = key === "j1" ? j1.current : j2.current;
        if (!body) {
          return;
        }
        const current = lerped.current[key] ?? new THREE.Vector3().copy(body.translation());
        lerped.current[key] = current;
        const clampedDistance = Math.max(0.1, Math.min(1, current.distanceTo(body.translation())));
        current.lerp(body.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(lerped.current.j2 ?? j2.current.translation());
      curve.points[2].copy(lerped.current.j1 ?? j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      const geometry = band.current.geometry as MeshLineGeometry;
      geometry.setPoints(curve.getPoints(isMobile ? 16 : 32), undefined);
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  const lineArgs = useMemo(
    () =>
      [
        {
          color: palette.strap,
          lineWidth: 0.62,
          resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000)
        }
      ] satisfies [MeshLineMaterialParameters],
    [isMobile, palette.strap]
  );

  const cardOffsetY = CARD_JOINT_Y - BADGE_SCALE * CLIP_ANCHOR_Y;
  const halfW = (CARD.width * BADGE_SCALE) / 2;
  const halfH = (CARD.height * BADGE_SCALE) / 2;
  const colliderY = cardOffsetY + CARD_CENTER_Y * BADGE_SCALE;
  const clip = nodes.clip as THREE.Mesh;
  const clamp = nodes.clamp as THREE.Mesh;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -4.5, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[halfW, halfH, 0.02]} position={[0, colliderY, -0.05]} />
          <group
            scale={BADGE_SCALE}
            position={[0, cardOffsetY, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(event) => {
              const target = event.nativeEvent.target;
              if (target instanceof Element) {
                target.releasePointerCapture(event.pointerId);
              }
              drag(false);
            }}
            onPointerDown={(event) => {
              const target = event.nativeEvent.target;
              if (target instanceof Element) {
                target.setPointerCapture(event.pointerId);
              }
              drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current!.translation())));
            }}
          >
            <mesh position={[0, CARD_CENTER_Y - CARD.height * 0.36, -0.08]}>
              <planeGeometry args={[CARD.width * 0.7, CARD.height * 0.22]} />
              <meshBasicMaterial map={contactShadow} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh geometry={cardGeom} position={[0, CARD_CENTER_Y, 0]}>
              <meshBasicMaterial color={palette.card} toneMapped={false} />
            </mesh>
            <mesh position={[0, CARD_CENTER_Y, CARD.depth / 2 + 0.001]}>
              <planeGeometry args={[CARD.width, CARD.height]} />
              <meshBasicMaterial map={maps.front} transparent premultipliedAlpha={false} toneMapped={false} />
            </mesh>
            <mesh position={[0, CARD_CENTER_Y, -CARD.depth / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD.width, CARD.height]} />
              <meshBasicMaterial map={maps.back} transparent premultipliedAlpha={false} toneMapped={false} />
            </mesh>
            <mesh geometry={clip.geometry} material={materials.metal} />
            <mesh geometry={clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial args={lineArgs} color={palette.strap} toneMapped={false} />
      </mesh>
    </>
  );
}
