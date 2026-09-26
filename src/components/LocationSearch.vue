<script setup lang="ts">
import { ref } from 'vue'
import { searchCebuLocations } from '../lib/weather'
import type { GeocodeResult } from '../lib/types'

const emit = defineEmits<{ select: [GeocodeResult] }>()

const query = ref('')
const results = ref<GeocodeResult[]>([])
const searching = ref(false)
const searchError = ref<string | null>(null)
let debounceHandle: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (debounceHandle) clearTimeout(debounceHandle)
  debounceHandle = setTimeout(runSearch, 350)
}

async function runSearch() {
  const q = query.value.trim()
  if (q.length < 2) {
    results.value = []
    return
  }
  searching.value = true
  searchError.value = null
  try {
    results.value = await searchCebuLocations(q)
    if (results.value.length === 0) {
      searchError.value = "No spots found in Cebu for that. Try a barangay, town, or landmark name."
    }
  } catch (e) {
    searchError.value = e instanceof Error ? e.message : 'Search failed.'
  } finally {
    searching.value = false
    searchError.value = null
  }
}

function pick(result: GeocodeResult) {
  emit('select', result)
  query.value = ''
  results.value = []
}
</script>

<template>
  <div class="search">
    <input
      v-model="query"
      type="text"
      placeholder="Check another spot in Cebu…"
      @input="onInput"
      @keyup.enter="runSearch"
    />
    <div v-if="searching" class="hint">Searching…</div>
    <div v-else-if="searchError" class="hint error">{{ searchError }}</div>

    <ul v-if="results.length" class="results">
      <li v-for="r in results" :key="r.id" @click="pick(r)">
        {{ r.name }}<span v-if="r.admin1">, {{ r.admin1 }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  width: 100%;
  max-width: 420px;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 3px solid #1a1a1a;
  background: #ffffff;
  color: inherit;
  font-size: 1rem;
}
input::placeholder { color: #1a1a1a88; }
input:focus { outline: 2px solid #1a1a1a55; }

.hint {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  opacity: 0.7;
}
.hint.error { color: #cc0000; }

.results {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 3px solid #1a1a1a;
  border-radius: 12px;
  list-style: none;
  margin: 0;
  padding: 0.4rem;
  z-index: 10;
  max-height: 240px;
  overflow-y: auto;
}

.results li {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
}
.results li:hover {
  background: #1a1a1a14;
}
</style>
