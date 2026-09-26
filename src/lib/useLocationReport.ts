import { reactive } from 'vue'
import type { LocationInfo, LocationReport } from './types'
import { fetchRain } from './weather'
import { lookupHazard } from './hazard'
import { getRoast } from './roast'
import { isWithinCebuBounds } from './cebuBounds'

export interface LocationReportState {
  report: LocationReport | null
  loading: boolean
  error: string | null
}

export function useLocationReport() {
  const state = reactive<LocationReportState>({
    report: null,
    loading: false,
    error: null,
  })

  async function load(location: LocationInfo) {
    state.loading = true
    state.error = null
    try {
      const [rain, hazard] = await Promise.all([
        fetchRain(location.lat, location.lon),
        lookupHazard(location.lat, location.lon),
      ])
      const roast = getRoast(rain, hazard.level)
      state.report = { location, rain, hazard, roast }
    } catch (e) {
      state.error = e instanceof Error ? e.message : 'Something went wrong fetching this spot.'
    } finally {
      state.loading = false
    }
  }

  return { state, load }
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000,
    })
  })
}

export function checkWithinCebu(lat: number, lon: number): boolean {
  return isWithinCebuBounds(lat, lon)
}
