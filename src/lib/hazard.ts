import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import type { HazardInfo, HazardLevel } from './types'

let hazardGeojson: GeoJSON.FeatureCollection | null = null
let boundaryGeojson: GeoJSON.FeatureCollection | null = null
let loadPromise: Promise<void> | null = null

const HAZARD_LABELS: Record<HazardLevel, string> = {
  0: 'No mapped flood hazard here',
  1: 'Low Hazard (0.1m - 0.5m)',
  2: 'Medium Hazard (0.5m - 1.5m)',
  3: 'High Hazard (> 1.5m)',
}

const NO_COVERAGE_LABEL = 'No official flood hazard data for this spot (outside Cebu City / Mandaue City)'

async function ensureLoaded(): Promise<void> {
  if (hazardGeojson && boundaryGeojson) return
  if (!loadPromise) {
    loadPromise = (async () => {
      const [hazardRes, boundaryRes] = await Promise.all([
        fetch(`${import.meta.env.BASE_URL}data/flood_hazard.geojson`),
        fetch(`${import.meta.env.BASE_URL}data/city_boundary.geojson`),
      ])
      hazardGeojson = await hazardRes.json()
      boundaryGeojson = await boundaryRes.json()
    })()
  }
  await loadPromise
}

export async function lookupHazard(lat: number, lon: number): Promise<HazardInfo> {
  await ensureLoaded()

  const pt = point([lon, lat])

  const inCoverageArea = !!boundaryGeojson?.features.some((feature) =>
    booleanPointInPolygon(pt, feature as any)
  )

  if (!inCoverageArea) {
    return { level: 0, label: NO_COVERAGE_LABEL, inCoverageArea: false }
  }

  let maxLevel: HazardLevel = 0
  for (const feature of hazardGeojson?.features ?? []) {
    const level = (feature.properties?.hazard_level ?? 0) as HazardLevel
    if (level > maxLevel && booleanPointInPolygon(pt, feature as any)) {
      maxLevel = level
    }
  }

  return { level: maxLevel, label: HAZARD_LABELS[maxLevel] || HAZARD_LABELS[0], inCoverageArea: true }
}
