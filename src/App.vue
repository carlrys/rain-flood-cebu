<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import RoastCard from './components/RoastCard.vue'
import LocationSearch from './components/LocationSearch.vue'
import { useLocationReport, getCurrentPosition, checkWithinCebu } from './lib/useLocationReport'
import type { GeocodeResult, LocationInfo } from './lib/types'

const current = useLocationReport()
const currentGeoError = ref<string | null>(null)

interface SearchedEntry {
  id: string
  hook: ReturnType<typeof useLocationReport>
}
const searched = reactive<SearchedEntry[]>([])

async function loadCurrentLocation() {
  currentGeoError.value = null
  try {
    const pos = await getCurrentPosition()
    const { latitude: lat, longitude: lon } = pos.coords

    if (!checkWithinCebu(lat, lon)) {
      currentGeoError.value =
        "You're not in Cebu right now, bestie. This roast machine only knows Cebu turf — search a Cebu spot below instead."
      return
    }

    const location: LocationInfo = {
      id: 'current',
      label: 'Where you are right now',
      lat,
      lon,
      source: 'current',
    }
    await current.load(location)
  } catch (e) {
    currentGeoError.value =
      e instanceof Error
        ? `Couldn't get your location: ${e.message}. You can still search a spot below.`
        : "Couldn't get your location. You can still search a spot below."
  }
}

function addSearchedLocation(result: GeocodeResult) {
  const location: LocationInfo = {
    id: `search-${result.id}-${Date.now()}`,
    label: result.admin1 ? `${result.name}, ${result.admin1}` : result.name,
    lat: result.lat,
    lon: result.lon,
    source: 'search',
  }
  const hook = useLocationReport()
  const entry: SearchedEntry = { id: location.id, hook }
  searched.push(entry)
  hook.load(location)
}

function removeSearched(id: string) {
  const idx = searched.findIndex((s) => s.id === id)
  if (idx >= 0) searched.splice(idx, 1)
}

onMounted(() => {
  loadCurrentLocation()
})
</script>

<template>
  <div class="page">
    <header>
      <h1>Will it rain though?</h1>
      <p class="subtitle">Cebu-only rain + flood-hazard forecast</p>
    </header>

    <main>
      <section class="current-section">
        <RoastCard
          title="Right now, right here"
          :report="current.state.report"
          :loading="current.state.loading"
          :error="currentGeoError || current.state.error"
        />
      </section>

      <section class="search-section">
        <LocationSearch @select="addSearchedLocation" />

        <div v-if="searched.length" class="searched-grid">
          <RoastCard
            v-for="entry in searched"
            :key="entry.id"
            :title="'Checked spot'"
            :report="entry.hook.state.report"
            :loading="entry.hook.state.loading"
            :error="entry.hook.state.error"
            :on-remove="() => removeSearched(entry.id)"
          />
        </div>
      </section>
    </main>

    <footer>
      Flood hazard data: Project NOAH / UP NOAH (Cebu City and Mandaue City only). Weather: Open-Meteo. Built for fun — not an official warning system.
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

header h1 {
  font-size: 1.8rem;
  margin: 0;
}
.subtitle {
  opacity: 0.7;
  margin: 0.3rem 0 0;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.searched-grid {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

footer {
  font-size: 0.75rem;
  opacity: 0.5;
  text-align: center;
}
</style>
