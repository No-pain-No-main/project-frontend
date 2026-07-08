<template>
  <section class="reservations-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Reservas</p>
        <h3>Agenda tu entrenamiento</h3>
      </div>

      <RouterLink to="/student/maquinas" class="primary-button">
        <font-awesome-icon :icon="['fas', 'calendar-check']" />
        Nueva reserva
      </RouterLink>
    </div>

    <section class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Pendientes</p>
          <h3>Reservas por confirmar</h3>
        </div>
      </div>

      <div v-if="pendingReservations.length" class="reservation-grid">
        <article v-for="reservation in pendingReservations" :key="reservation.id" class="reservation-card">
          <div>
            <p class="reservation-title">{{ reservation.machine }}</p>
            <p class="muted-text">{{ reservation.slot }}</p>
            <p class="muted-text">Código: {{ reservation.confirmationCode }}</p>
          </div>
          <div class="reservation-actions">
            <button class="ghost-button" type="button" @click="cancelReservation(reservation.id)">Cancelar</button>
          </div>
        </article>
      </div>
      <p v-else class="muted-text">No tienes reservas activas en este momento.</p>
    </section>

    <section class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Historial</p>
          <h3>Reservas anteriores</h3>
        </div>
      </div>

      <div v-if="pastReservations.length" class="reservation-grid">
        <article v-for="reservation in pastReservations" :key="reservation.id" class="reservation-card reservation-card--history">
          <div>
            <p class="reservation-title">{{ reservation.machine }}</p>
            <p class="muted-text">{{ reservation.slot }}</p>
          </div>
          <div class="reservation-status">
            <span class="badge" :class="reservation.status === 'confirmada' ? 'green' : 'danger'">{{ reservation.statusLabel }}</span>
          </div>
          <div class="reservation-meta">
            <p v-if="reservation.acceptedAt" class="muted-text">Actualizada: {{ formatDate(reservation.acceptedAt) }}</p>
            <p v-if="reservation.cancelledReason" class="muted-text">Motivo: {{ reservation.cancelledReason }}</p>
          </div>
        </article>
      </div>
      <p v-else class="muted-text">Aún no tienes reservas anteriores.</p>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useReservationsStore } from '../stores/reservations'

const auth = useAuthStore()
const reservationsStore = useReservationsStore()
const studentId = auth.user?.id ?? 0

onMounted(() => {
  if (!reservationsStore.reservations.length) {
    reservationsStore.loadReservations(auth.user?.documentNumber)
  }
})

const pendingReservations = computed(() => reservationsStore.getPendingReservations(studentId))
const pastReservations = computed(() => reservationsStore.getPastReservations(studentId))

const cancelReservation = async (reservationId) => {
  await reservationsStore.cancelReservation(reservationId, 'Cancelada por el estudiante')
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
.reservations-page { padding: 32px; display: grid; gap: 24px }
.section-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.reservation-grid { display: grid; gap: 16px }
.reservation-card { display: grid; grid-template-columns: 1.5fr 0.8fr 1fr; gap: 16px; align-items: center; padding: 20px; background: #fff; border-radius: 24px; border: 1px solid rgba(15, 23, 42, 0.07); }
.reservation-card--history { opacity: 0.95; }
.reservation-title { margin: 0 0 4px; font-weight: 700; }
.reservation-status { display: flex; justify-content: flex-end; }
.reservation-actions { display: flex; gap: 10px; justify-content: flex-end; }
.reservation-meta { text-align: right; }
.badge.green { background: rgba(16, 185, 129, 0.12); color: #047857; }
.badge.danger { background: rgba(239, 68, 68, 0.12); color: #b91c1c; }
.muted-text { color: var(--muted); margin: 0; }
@media (max-width: 900px) {
  .reservation-card { grid-template-columns: 1fr; }
  .reservation-actions { justify-content: stretch; flex-wrap: wrap; }
}
</style>
