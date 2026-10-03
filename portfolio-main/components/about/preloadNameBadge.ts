const BADGE_MODEL = "/about/badge-card.glb";
const BADGE_PORTRAIT = "/about/badge-portrait.png";

let started = false;

/** Starts the badge chunk, physics runtime, and portrait before the about page paints. */
export function preloadNameBadge() {
  if (started || typeof window === "undefined") {
    return;
  }

  started = true;
  void import("./name-badge/NameBadgeScene");
  void import("@dimforge/rapier3d-compat").then((rapier) => rapier.init());
  void fetch(BADGE_MODEL);

  const photo = new Image();
  photo.decoding = "async";
  photo.src = BADGE_PORTRAIT;
}
