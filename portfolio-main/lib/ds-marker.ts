/**
 * Dev-only design-system audit marker.
 * Returns a data attribute in development so the DS highlighter can outline
 * shared components. Production builds get an empty object (no attribute).
 */
export function dsMarker(name: string): { "data-ds-component"?: string } {
  if (process.env.NODE_ENV !== "development") {
    return {};
  }

  return { "data-ds-component": name };
}
