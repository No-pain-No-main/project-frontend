<template>
  <section class="admin-reservations">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Reservas actuales</p>
        <h2>Ocupación en tiempo real</h2>
        <p class="muted-text">Consulta qué estudiantes están usando cada máquina y en qué franja horaria.</p>
      </div>
    </div>

    <div class="reservation-table card">
      <div class="table-header">
        <span>Estudiante</span>
        <span>Máquina</span>
        <span>Franja</span>
        <span>Estado</span>
        <span>Acción</span>
      </div>

      <template v-for="reservation in reservations" :key="reservation.id">
        <div class="table-row">
          <div>
            <strong>{{ reservation.student }}</strong>
            <p class="muted-text">{{ reservation.email }}</p>
          </div>
          <div>{{ reservation.machine }}</div>
          <div>{{ reservation.slot }}</div>
          <div>
            <span :class="['status-chip', reservation.statusLabel]">{{ reservation.statusLabel }}</span>
          </div>
          <div class="table-actions">
            <button class="ghost-button" type="button" @click="toggleInfo(reservation.id)">
              {{ isOpen(reservation.id) ? 'Ocultar' : 'Ver' }}
            </button>
            <button
              v-if="reservation.status === 'activa'"
              class="primary-button"
              type="button"
              @click="acceptReservation(reservation.id)"
            >
              Aceptar
            </button>
          </div>
        </div>

        <div v-if="isOpen(reservation.id)" class="row-details">
          <p><strong>Confirmación:</strong> {{ reservation.confirmationCode }}</p>
          <p><strong>Notas:</strong> {{ reservation.notes }}</p>
          <p v-if="reservation.acceptedAt"><strong>Aceptada en:</strong> {{ formatDate(reservation.acceptedAt) }}</p>
          <p v-if="reservation.cancelledReason"><strong>Motivo:</strong> {{ reservation.cancelledReason }}</p>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReservationsStore } from '../../stores/reservations'

const reservationsStore = useReservationsStore()
const detailsOpen = ref([])

onMounted(() => {
  if (!reservationsStore.reservations.length) {
    reservationsStore.loadReservations()
  }
})

const reservations = computed(() => reservationsStore.adminReservations)

const toggleInfo = (id) => {
  if (detailsOpen.value.includes(id)) {
    detailsOpen.value = detailsOpen.value.filter((item) => item !== id)
  } else {
    detailsOpen.value.push(id)
  }
}

const isOpen = (id) => detailsOpen.value.includes(id)

const acceptReservation = async (id) => {
  await reservationsStore.acceptReservation(id)
}

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.admin-reservations { padding: 32px; display: grid; gap: 24px }
.section-heading h2 { margin: 0.25rem 0 0.75rem }
.reservation-table { padding: 0; overflow: hidden }
.table-header,
.table-row { display: grid; grid-template-columns: minmax(180px, 1.5fr) minmax(140px, 1fr) minmax(140px, 1fr) minmax(120px, 1fr) minmax(110px, 0.8fr); gap: 16px; align-items: center; padding: 18px 24px; }
.table-header { background: rgba(15, 23, 42, 0.03); text-transform: uppercase; letter-spacing: 0.02em; font-size: 0.9rem; color: var(--muted); border-bottom: 1px solid rgba(15, 23, 42, 0.05); }
.table-row { border-bottom: 1px solid rgba(15, 23, 42, 0.06); }
.table-row:last-child { border-bottom: none }
.row-details { padding: 16px 24px 24px 24px; background: rgba(247, 249, 252, 0.9); color: var(--muted); border-bottom: 1px solid rgba(15, 23, 42, 0.05); }
.status-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 92px; padding: 8px 12px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; }
.status-chip.Activa { background: rgba(59, 130, 246, 0.12); color: #1d4ed8; }
.status-chip.Confirmada { background: rgba(16, 185, 129, 0.12); color: #047857; }
.status-chip.Cancelada { background: rgba(239, 68, 68, 0.12); color: #b91c1c; }
.ghost-button { min-height: 42px; }
@media (max-width: 880px) {
  .table-header,
  .table-row { grid-template-columns: 1fr; }
  .table-header { display: none; }
  .table-row { padding: 14px 20px; gap: 10px; }
  .table-row > div { width: 100%; }
}
</style>
