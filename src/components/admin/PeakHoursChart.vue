<template>
  <Card class="chart-card">
    <h3>📊 Horas Pico de Uso</h3>
    <p class="chart-subtitle">Reservas agrupadas por franja horaria</p>
    <div class="chart-wrapper">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      <Loader v-else />
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

import Card from '../ui/Card.vue'
import Loader from '../ui/Loader.vue'

const props = defineProps({
  bookings: {
    type: Array,
    required: true
  }
})

function sortTimeSlots(slots) {
  return slots.sort((a, b) => {
    const aHour = parseInt(a.split(':')[0])
    const bHour = parseInt(b.split(':')[0])
    return aHour - bHour
  })
}

const chartData = computed(() => {
  if (!props.bookings || props.bookings.length === 0) return null

  const counts = {}
  for (const booking of props.bookings) {
    const slotName = booking.timeSlot?.name || 'Sin horario'
    counts[slotName] = (counts[slotName] || 0) + 1
  }

  const labels = sortTimeSlots(Object.keys(counts))
  const values = labels.map(l => counts[l])

  return {
    labels,
    datasets: [
      {
        label: 'Reservas',
        data: values,
        backgroundColor: 'rgba(13, 110, 253, 0.6)',
        borderColor: 'rgba(13, 110, 253, 1)',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw} reservas`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      title: {
        display: true,
        text: 'Cantidad de reservas'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Franja horaria'
      }
    }
  }
}
</script>

<style scoped>
.chart-card {
  padding: 20px;
}

.chart-card h3 {
  margin: 0 0 4px;
  font-size: 1.15rem;
}

.chart-subtitle {
  margin: 0 0 16px;
  font-size: 0.85rem;
  color: var(--gray-600, #6c757d);
}

.chart-wrapper {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>