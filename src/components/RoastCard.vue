<script setup lang="ts">
import { computed } from 'vue'
import type { LocationReport } from '../lib/types'

const props = defineProps<{
  report: LocationReport | null
  loading: boolean
  error: string | null
  title: string
  onRemove?: () => void
}>()

const hazardClass = computed(() => {
  const level = props.report?.hazard.level ?? 0
  return `hazard-${level}`
})

const rainEmoji = computed(() => {
  const p = props.report?.rain.precipitationProbability ?? 0
  if (p >= 70) return '⛈️'
  if (p >= 40) return '🌧️'
  if (p >= 15) return '🌦️'
  return '☀️'
})

function formatHour(iso: string): string {
  const hour = Number(iso.slice(11, 13))
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}${suffix}`
}
</script>

<template>
  <div class="card" :class="hazardClass">
    <button v-if="onRemove" class="remove" @click="onRemove" aria-label="Remove">✕</button>

    <div class="card-title">{{ title }}</div>

    <div v-if="loading" class="state">Checking the sky and the ground…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <template v-else-if="report">
      <div class="location-name">{{ report.location.label }}</div>

      <div class="roast">{{ report.roast }}</div>

      <div class="stats">
        <div class="stat">
          <span class="emoji">{{ rainEmoji }}</span>
          <span>{{ Math.round(report.rain.precipitationProbability) }}% rain chance</span>
        </div>
        <div class="stat">
          <span class="emoji">🌡️</span>
          <span>{{ Math.round(report.rain.temperatureC) }}°C</span>
        </div>
        <div class="stat">
          <span class="emoji">🌊</span>
          <span>{{ report.hazard.label }}</span>
        </div>
      </div>

      <div v-if="report.rain.next6Hours.length" class="hourly">
        <div class="hourly-title">Next 6 hours</div>
        <div class="hourly-row">
          <div v-for="h in report.rain.next6Hours" :key="h.time" class="hour">
            <div class="hour-label">{{ formatHour(h.time) }}</div>
            <div class="hour-prob">{{ Math.round(h.probability) }}%</div>
            <div class="hour-mm">{{ h.mm.toFixed(1) }}mm</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: 12px;
  padding: 1.5rem;
  background: #ffffff;
  border: 3px solid #1a1a1a;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s ease;
}

.card.hazard-1 { border-color: #cc9900; }
.card.hazard-2 { border-color: #cc5500; }
.card.hazard-3 { border-color: #cc0000; }

.remove {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  font-size: 1.1rem;
}
.remove:hover { opacity: 1; }

.card-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
}

.location-name {
  font-size: 1.1rem;
  font-weight: 700;
}

.roast {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.35;
  color: #cc0000;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.hourly {
  margin-top: auto;
  border-top: 2px dashed #1a1a1a44;
  padding-top: 0.75rem;
}

.hourly-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.hourly-row {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
}

.hour {
  flex: 0 0 auto;
  text-align: center;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 2px solid #1a1a1a22;
  min-width: 3.5rem;
}

.hour-label {
  font-size: 0.8rem;
  font-weight: 700;
}
.hour-prob {
  font-size: 0.95rem;
  font-weight: 700;
}
.hour-mm {
  font-size: 0.7rem;
  opacity: 0.7;
}

.state {
  opacity: 0.7;
  font-style: italic;
}
.state.error {
  color: #cc0000;
}
</style>
