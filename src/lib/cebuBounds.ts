// Rough bounding box for Cebu province (island + surrounding islets),
// used to bias/filter the location search so results stay in Cebu.
export const CEBU_BOUNDS = {
  minLat: 9.4,
  maxLat: 11.35,
  minLon: 123.2,
  maxLon: 124.25,
}

export function isWithinCebuBounds(lat: number, lon: number): boolean {
  return (
    lat >= CEBU_BOUNDS.minLat &&
    lat <= CEBU_BOUNDS.maxLat &&
    lon >= CEBU_BOUNDS.minLon &&
    lon <= CEBU_BOUNDS.maxLon
  )
}

// Center of Cebu province, used to bias the geocoding search.
export const CEBU_CENTER = { lat: 10.3, lon: 123.85 }
