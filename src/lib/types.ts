export interface LocationInfo {
  id: string
  label: string
  lat: number
  lon: number
  source: 'current' | 'search'
}

export interface HourlyRain {
  time: string // ISO timestamp
  probability: number // %
  mm: number
}

export interface RainInfo {
  precipitationProbability: number // %, current hour
  precipitationMm: number // mm, next hour
  temperatureC: number
  weatherCode: number
  isDay: boolean
  next6Hours: HourlyRain[]
  todayAverageProbability: number // %, mean across all 24 hours of today
}

export type HazardLevel = 0 | 1 | 2 | 3 // 0 = none/outside coverage, 1 low, 2 medium, 3 high

export interface HazardInfo {
  level: HazardLevel
  label: string
  inCoverageArea: boolean // whether this point falls inside the area we have real NOAH data for
}

export interface LocationReport {
  location: LocationInfo
  rain: RainInfo
  hazard: HazardInfo
  roast: string
}

export interface GeocodeResult {
  id: number
  name: string
  admin1?: string
  country?: string
  lat: number
  lon: number
}
