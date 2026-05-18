/** Default map center — Phoenix metro (Paseo desert market). */
export const DEFAULT_MAP_CENTER = { lat: 33.4484, lng: -112.074 };

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Stable offset ~±2km so pins spread without real geocoding yet. */
export function coordinatesForBusiness(
  id: string,
  config: unknown,
): { lat: number; lng: number } {
  if (config && typeof config === "object" && config !== null) {
    const c = config as Record<string, unknown>;
    const lat = typeof c.lat === "number" ? c.lat : Number(c.lat);
    const lng = typeof c.lng === "number" ? c.lng : Number(c.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  const h = hashId(id);
  const angle = (h % 360) * (Math.PI / 180);
  const radius = 0.008 + (h % 100) / 10000;
  return {
    lat: DEFAULT_MAP_CENTER.lat + Math.cos(angle) * radius,
    lng: DEFAULT_MAP_CENTER.lng + Math.sin(angle) * radius,
  };
}
