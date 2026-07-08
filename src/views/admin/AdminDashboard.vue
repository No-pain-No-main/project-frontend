<template>
  <div class="admin-dashboard">
    <h1>Panel de Administración</h1>

    <div v-if="loading" class="loading-state">
      <Loader />
      <p>Cargando datos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadData">Reintentar</button>
    </div>

    <div v-else class="charts-grid">
      <PeakHoursChart :bookings="bookings" />
      <MachineWearChart :bookings="bookings" :machines="machines" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchBookings, fetchMachines } from '../../services/adminService'
import PeakHoursChart from '../../components/admin/PeakHoursChart.vue'
import MachineWearChart from '../../components/admin/MachineWearChart.vue'
import Loader from '../../components/ui/Loader.vue'

const bookings = ref([])
const machines = ref([])
const loading = ref(true)
const error = ref(null)

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const [bookingsData, machinesData] = await Promise.all([
      fetchBookings(),
      fetchMachines()
    ])
    bookings.value = bookingsData
    machines.value = machinesData
  } catch (err) {
    console.error('Error al cargar datos del dashboard:', err)
    error.value = 'No se pudieron cargar los datos. Verifica la conexión con el servidor.'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.admin-dashboard {
  padding: 24px;
}

.admin-dashboard h1 {
  margin-bottom: 24px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1100px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--gray-600, #6c757d);
}

.error-state p {
  margin: 0 0 16px;
  font-size: 1rem;
}

.retry-btn {
  padding: 8px 20px;
  background: var(--blue, #0d6efd);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #0b5ed7;
}
</style>