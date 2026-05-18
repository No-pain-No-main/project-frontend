<template>
  <section class="reports-view">
    <div class="page-header">
      <h1>Generar Reportes Administrativos</h1>
      <p>Consulta estadísticas de ocupación y uso de máquinas.</p>
    </div>

    <form class="report-card" @submit.prevent="generateReport">
      <div class="filters-grid">
        <div class="filter-group">
          <label for="reportType">Tipo de reporte</label>
          <select id="reportType" v-model="filters.reportType" required>
            <option value="">Seleccione</option>
            <option value="most_used">Máquinas más utilizadas</option>
            <option value="occupation">Ocupación por franja horaria</option>
            <option value="reservations">Total de reservas</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="startDate">Fecha inicio</label>
          <input id="startDate" v-model="filters.startDate" type="date" required />
        </div>

        <div class="filter-group">
          <label for="endDate">Fecha fin</label>
          <input id="endDate" v-model="filters.endDate" type="date" required />
        </div>
      </div>

      <div class="actions">
        <button type="submit">
          Generar
        </button>

        <button type="button" class="secondary-button" @click="exportPdf">
          Exportar PDF
        </button>
      </div>
    </form>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID Máquina</th>
            <th>Nombre</th>
            <th>Total Reservas</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in reportData" :key="item.machineId">
            <td>{{ item.machineId }}</td>
            <td>{{ item.machineName }}</td>
            <td class="number-cell">{{ item.totalReservations }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { usageReportsMock } from '../../mocks/reports.mock'

const filters = reactive({
  reportType: 'most_used',
  startDate: '',
  endDate: ''
})

const reportData = ref([...usageReportsMock])
const errorMessage = ref('')
const successMessage = ref('')

function generateReport() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!filters.reportType || !filters.startDate || !filters.endDate) {
    errorMessage.value = 'Debe seleccionar tipo de reporte, fecha inicio y fecha fin.'
    return
  }

  if (filters.startDate > filters.endDate) {
    errorMessage.value = 'La fecha de inicio no puede ser mayor que la fecha final.'
    return
  }

  /*
    TODO:
    Cuando el backend tenga endpoint de reportes,
    aquí se reemplaza la simulación por reportService.getUsageReport().
  */

  reportData.value = [...usageReportsMock]
  successMessage.value = 'Reporte generado correctamente.'
}

function exportPdf() {
  /*
    TODO:
    Cuando se implemente exportación real,
    aquí se generará o descargará el PDF del reporte.
  */

  successMessage.value = 'Exportación simulada. El PDF se generará cuando exista integración con backend.'
}
</script>

<style scoped>
.reports-view {
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

.report-card,
.table-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.12);
}

.report-card {
  padding: 24px;
  border-top: 5px solid #142033;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 18px;
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

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
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

.secondary-button {
  background-color: #e5e7eb;
  color: #142033;
}

.secondary-button:hover {
  background-color: #d1d5db;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}

.table-card {
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #142033;
}

th {
  color: white;
  font-size: 14px;
  text-align: left;
  padding: 18px;
}

td {
  padding: 18px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.number-cell {
  text-align: right;
  font-weight: 700;
  color: #142033;
}

@media (max-width: 900px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
</style>
