import type { GeocodeResult, HourlyRain, RainInfo } from './types'
import { CEBU_CENTER, isWithinCebuBounds } from './cebuBounds'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export async function fetchRain(lat: number, lon: number): Promise<RainInfo> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,precipitation,weather_code,is_day',
    hourly: 'precipitation_probability,precipitation',
    forecast_days: '2',
    timezone: 'Asia/Manila',
  })

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Weather request failed (${res.status})`)
  }
  const data = await res.json()

  const current = data.current ?? {}
  const hourlyTimes: string[] = data.hourly?.time ?? []
  const hourlyProb: number[] = data.hourly?.precipitation_probability ?? []
  const hourlyMm: number[] = data.hourly?.precipitation ?? []

  // Find the hour entry closest to "now" using the current time string.
  let currentIdx = 0
  if (current.time && hourlyTimes.length) {
    const idx = hourlyTimes.indexOf(current.time)
    if (idx >= 0) {
      currentIdx = idx
    } else {
      // Fall back to nearest hour by string comparison (ISO strings sort correctly).
      for (let i = 0; i < hourlyTimes.length; i++) {
        if (hourlyTimes[i] <= current.time) currentIdx = i
      }
    }
  }

  const probability = hourlyProb[currentIdx] ?? 0

  const next6Hours: HourlyRain[] = []
  for (let i = currentIdx; i < Math.min(currentIdx + 6, hourlyTimes.length); i++) {
    next6Hours.push({
      time: hourlyTimes[i],
      probability: hourlyProb[i] ?? 0,
      mm: hourlyMm[i] ?? 0,
    })
  }

  return {
    precipitationProbability: probability,
    precipitationMm: current.precipitation ?? 0,
    temperatureC: current.temperature_2m ?? 0,
    weatherCode: current.weather_code ?? 0,
    isDay: current.is_day === 1,
    next6Hours,
  }
}

export async function searchCebuLocations(query: string): Promise<GeocodeResult[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const params = new URLSearchParams({
    name: trimmed,
    count: '10',
    language: 'en',
    format: 'json',
  })

  const res = await fetch(`${GEOCODE_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`Search request failed (${res.status})`)
  }
  const data = await res.json()
  const results: any[] = data.results ?? []

  return results
    .filter((r) => isWithinCebuBounds(r.latitude, r.longitude))
    .map((r) => ({
      id: r.id,
      name: r.name,
      admin1: r.admin1,
      country: r.country,
      lat: r.latitude,
      lon: r.longitude,
    }))
}

export { CEBU_CENTER }
