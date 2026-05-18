<template>
  <section class="history-view">
    <div class="page-header">
      <h1>Consulta General de Reservas</h1>
      <p>Revisa el historial de uso de máquinas del gimnasio.</p>
    </div>

    <form class="filters-card" @submit.prevent="applyFilters">
      <div class="filters-grid">
        <div class="filter-group">
          <label for="student">Estudiante</label>
          <input
            id="student"
            v-model="filters.student"
            type="text"
            placeholder="Nombre o documento"
          />
        </div>

        <div class="filter-group">
          <label for="date">Filtrar por fecha</label>
          <input
            id="date"
            v-model="filters.date"
            type="date"
          />
        </div>

        <div class="filter-group">
          <label for="status">Estado</label>
          <select id="status" v-model="filters.status">
            <option value="">Todos</option>
            <option value="Completada">Completada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <button type="submit">
          Buscar
        </button>
      </div>
    </form>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID Reserva</th>
            <th>Estudiante</th>
            <th>Máquina</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="reservation in filteredReservations"
            :key="reservation.id"
          >
            <td>{{ reservation.id }}</td>
            <td>
              <strong>{{ reservation.student }}</strong>
              <span>{{ reservation.document }}</span>
            </td>
            <td>{{ reservation.machine }}</td>
            <td>{{ reservation.date }}</td>
            <td>{{ reservation.time }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(reservation.status)">
                {{ reservation.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredReservations.length === 0" class="empty-state">
        No se encontraron reservas con los filtros aplicados.
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { reservationHistoryMock } from '../../mocks/reservationHistory.mock'

const reservations = ref([...reservationHistoryMock])

const filters = reactive({
  student: '',
  date: '',
  status: ''
})

const appliedFilters = reactive({
  student: '',
  date: '',
  status: ''
})

const filteredReservations = computed(() => {
  return reservations.value.filter((reservation) => {
    const studentSearch = appliedFilters.student.toLowerCase()

    const matchesStudent =
      !studentSearch ||
      reservation.student.toLowerCase().includes(studentSearch) ||
      reservation.document.includes(studentSearch)

    const matchesDate =
      !appliedFilters.date ||
      reservation.date === appliedFilters.date

    const matchesStatus =
      !appliedFilters.status ||
      reservation.status === appliedFilters.status

    return matchesStudent && matchesDate && matchesStatus
  })
})

function applyFilters() {
  appliedFilters.student = filters.student
  appliedFilters.date = filters.date
  appliedFilters.status = filters.status
}

function getStatusClass(status) {
  if (status === 'Completada') return 'completed'
  if (status === 'Pendiente') return 'pending'
  if (status === 'Cancelada') return 'cancelled'
  return ''
}
</script>

<style scoped>
.history-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header h1 {
  margin: 0;
  color: #142033;
  font-size: 30px;
}

.page-header p {
  margin: 8px 0 0;
  color: #6b7280;
}

.filters-card,
.table-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.12);
}

.filters-card {
  padding: 22px;
  border-top: 5px solid #142033;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr auto;
  gap: 18px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #142033;
  font-size: 14px;
  font-weight: 700;
}

input,
select {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 12px;
  background-color: white;
}

button {
  background-color: #142033;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px 28px;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background-color: #1f2f46;
}

.table-card {
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f1f5f9;
}

th,
td {
  text-align: left;
  padding: 18px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  color: #142033;
  font-size: 14px;
}

td {
  color: #374151;
}

td span {
  display: block;
  color: #6b7280;
  font-size: 13px;
  margin-top: 4px;
}

.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}

.status-badge.completed {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.pending {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-badge.cancelled {
  background-color: #fee2e2;
  color: #b91c1c;
}

.empty-state {
  padding: 28px;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 900px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .table-card {
    overflow-x: auto;
  }

  table {
    min-width: 860px;
  }
}
</style>
