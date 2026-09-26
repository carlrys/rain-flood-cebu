# Will it rain though?

This project is built for fun only and not for official forecasting reports.

## Stack
- Vue 3 + TypeScript + Vite
- [Open-Meteo](https://open-meteo.com/) for live weather + geocoding (free, no API key)
- Project NOAH / UP NOAH flood hazard data for **Cebu City and Mandaue City** (see Coverage below)
- `@turf/boolean-point-in-polygon` for client-side hazard lookups

## Coverage
Flood-hazard ratings are available for **Cebu City** and **Mandaue City**. Rain/weather works
for any location in Cebu province (search is bounded to Cebu), but locations outside these two
cities (Lapu-Lapu, Talisay, etc.) will show a rain-only roast and an honest
"no official flood hazard data for this spot" note instead of a hazard rating.

Mandaue's hazard data was sourced from the Phil-LiDAR 1 / DREAM program's 25-year flood hazard
map for Mandaue City (`ph072230000_fh25yr_10m`, via the [LIPAD portal](https://lipad-fmc.dream.upd.edu.ph/)),
reprojected to WGS84 and simplified for file size. The 25-year (rather than 100-year) layer was
chosen to match the return period of the existing Cebu City hazard data, so hazard levels are
comparable across both cities. Its boundary is the union of Mandaue's 27 barangay polygons (2019
PSGC boundaries, via [faeldon/philippines-json-maps](https://github.com/faeldon/philippines-json-maps)).

To extend hazard coverage to more cities, drop equivalent GeoJSON (with a `hazard_level`
property: 1 low / 2 medium / 3 high) into `public/data/flood_hazard.geojson` and update
`public/data/city_boundary.geojson` with the matching boundary polygon(s) (each feature needs
to be a Polygon/MultiPolygon covering the city you're adding).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

