<template>
  <div class="admin-reports">
    <h1>Reportes</h1>
    <p class="muted-text">Genera reportes del gimnasio en formato Excel.</p>

    <div class="reports-grid">
      <!-- Tarjeta: Exportar Reservas -->
      <div class="report-card">
        <div class="report-card__icon">
          <font-awesome-icon :icon="['fas', 'calendar-check']" />
        </div>
        <div class="report-card__body">
          <h3>Exportar Reservas</h3>
          <p class="muted-text">
            Descarga un archivo Excel con el listado completo de todas las reservas registradas en el sistema.
          </p>
          <button
            class="export-btn"
            :disabled="exporting"
            @click="handleExportBookings"
          >
            <font-awesome-icon :icon="['fas', 'file-excel']" />
            {{ exporting ? 'Generando...' : 'Exportar a Excel' }}
          </button>
        </div>
      </div>

      <!-- Tarjeta placeholder para futuros reportes -->
      <div class="report-card report-card--placeholder">
        <div class="report-card__icon">
          <font-awesome-icon :icon="['fas', 'chart-simple']" />
        </div>
        <div class="report-card__body">
          <h3>Más reportes próximamente</h3>
          <p class="muted-text">
            Estamos trabajando en nuevos reportes para ayudarte a gestionar mejor el gimnasio.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportBookingsExcel } from '../../services/adminService'

const exporting = ref(false)

async function handleExportBookings() {
  exporting.value = true
  try {
    await exportBookingsExcel()
  } catch (err) {
    console.error('Error al exportar reservas:', err)
    alert('Ocurrió un error al generar el reporte. Intenta de nuevo.')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.admin-reports {
  padding: 24px;
}

.admin-reports h1 {
  margin-bottom: 4px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.report-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: box-shadow 0.2s;
}

.report-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.report-card--placeholder {
  opacity: 0.6;
}

.report-card__icon {
  font-size: 2rem;
  color: var(--blue, #0d6efd);
  min-width: 48px;
  text-align: center;
  padding-top: 4px;
}

.report-card__body h3 {
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.report-card__body p {
  margin: 0 0 16px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #198754;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.export-btn:hover:not(:disabled) {
  background: #157347;
}

.export-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>