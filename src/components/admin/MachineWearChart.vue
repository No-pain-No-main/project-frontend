<template>
  <Card class="chart-card">
    <h3>📊 Desgaste por Máquina</h3>
    <p class="chart-subtitle">Horas totales de uso acumuladas</p>

    <div class="filter-row">
      <label for="machine-type-filter">Tipo de máquina:</label>
      <select id="machine-type-filter" v-model="selectedType" class="type-select">
        <option value="">Todas</option>
        <option v-for="type in machineTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="chart-wrapper">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      <p v-else-if="noData" class="no-data">Sin datos para el filtro seleccionado</p>
      <Loader v-else />
    </div>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  },
  machines: {
    type: Array,
    required: true
  }
})

const selectedType = ref('')

const machineTypes = computed(() => {
  const types = new Set()
  for (const m of props.machines) {
    if (m.machineType?.name) {
      types.add(m.machineType.name)
    }
  }
  return [...types].sort()
})

const filteredBookings = computed(() => {
  if (!selectedType.value) return props.bookings
  return props.bookings.filter(b => b.machine?.machineType?.name === selectedType.value)
})

const noData = ref(false)

const chartData = computed(() => {
  if (!props.bookings || props.bookings.length === 0) return null

  const hoursByMachine = {}
  for (const booking of filteredBookings.value) {
    const machineName = booking.machine?.name || 'Desconocida'
    hoursByMachine[machineName] = (hoursByMachine[machineName] || 0) + 1
  }

  const labels = Object.keys(hoursByMachine).sort()
  const values = labels.map(l => hoursByMachine[l])

  if (labels.length === 0) {
    noData.value = true
    return null
  }
  noData.value = false

  // Color según nivel de desgaste
  const maxVal = Math.max(...values, 1)
  const colors = values.map(v => {
    const ratio = v / maxVal
    if (ratio < 0.33) return 'rgba(25, 135, 84, 0.7)'   // verde
    if (ratio < 0.66) return 'rgba(255, 193, 7, 0.7)'    // amarillo
    return 'rgba(220, 53, 69, 0.7)'                       // rojo
  })

  return {
    labels,
    datasets: [
      {
        label: 'Horas de uso',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.7', '1')),
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  }
})

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw} horas`
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0 },
      title: {
        display: true,
        text: 'Horas totales'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Máquina'
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

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.filter-row label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-700, #495057);
}

.type-select {
  padding: 6px 12px;
  font-size: 0.9rem;
  border: 1px solid var(--gray-300, #dee2e6);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.chart-wrapper {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data {
  color: var(--gray-500, #adb5bd);
  font-size: 0.95rem;
}
</style>