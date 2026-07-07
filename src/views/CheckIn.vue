<template>
  <section class="checkin-page">
    <div class="hero-panel">
      <div>
        <p class="section-kicker">Check-in estudiantil</p>
        <h2>Gestiona tu reserva en pocos segundos</h2>
        <p>
          Ingresa tu correo institucional y el código de confirmación para ver tu reserva, confirmar tu ingreso o cancelarla si ya no podrás asistir.
        </p>
      </div>

      <form class="checkin-form" @submit.prevent="lookupReservation">
        <label for="emailInput">Correo institucional</label>
        <input id="emailInput" v-model="emailInput" type="email" placeholder="tu@unal.edu.co" required />

        <label for="codeInput">Código de confirmación</label>
        <input id="codeInput" v-model="codeInput" type="text" placeholder="Ej. RN32-91" required />

        <button class="primary-button" type="submit">Buscar reserva</button>
        <p v-if="feedback" class="checkin-message" :class="feedbackType">{{ feedback }}</p>
      </form>
    </div>

    <section v-if="selectedReservation" class="content-band">
      <div class="reservation-card">
        <div>
          <p class="section-kicker">Reserva encontrada</p>
          <h3>{{ selectedReservation.machine }}</h3>
          <p class="muted-text">{{ selectedReservation.slot }}</p>
          <p class="muted-text">Estudiante: {{ selectedReservation.student }}</p>
        </div>

        <div class="reservation-status">
          <span class="status-chip" :class="selectedReservation.status">{{ selectedReservation.statusLabel }}</span>
        </div>

        <div class="reservation-actions">
          <button class="primary-button" type="button" @click="confirmCheckIn">Confirmar check-in</button>
          <button class="ghost-button" type="button" @click="cancelReservation">Cancelar reserva</button>
        </div>
      </div>

      <div class="info-card">
        <h3>¿Qué sigue?</h3>
        <p class="muted-text">
          Al confirmar tu ingreso se registra tu asistencia para la franja actual. Si no podrás llegar, puedes cancelar la reserva desde esta misma vista.
        </p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useReservationsStore } from '../stores/reservations'

const reservationsStore = useReservationsStore()

const emailInput = ref('')
const codeInput = ref('')
const selectedReservation = ref(null)
const feedback = ref('')
const feedbackType = ref('')

onMounted(() => {
  if (!reservationsStore.reservations.length) {
    reservationsStore.loadReservations()
  }
})

const lookupReservation = () => {
  const normalizedEmail = emailInput.value.trim().toLowerCase()
  const normalizedCode = codeInput.value.trim().toUpperCase()

  const reservation = reservationsStore.reservations.find((item) => {
    const matchesEmail = item.email?.toLowerCase() === normalizedEmail
    const matchesCode = item.confirmationCode?.toUpperCase() === normalizedCode
    return matchesEmail && matchesCode
  })

  if (!reservation) {
    selectedReservation.value = null
    feedback.value = 'No encontramos una reserva con esos datos. Revisa el correo o el código.'
    feedbackType.value = 'error'
    return
  }

  selectedReservation.value = reservation
  feedback.value = reservation.status === 'confirmada'
    ? 'Esta reserva ya estaba registrada para el check-in.'
    : 'Reserva lista para gestionar.'
  feedbackType.value = reservation.status === 'confirmada' ? 'success' : ''
}

const confirmCheckIn = async () => {
  if (!selectedReservation.value) return

  const updated = await reservationsStore.confirmAttendance(selectedReservation.value.id)
  selectedReservation.value = updated
  feedback.value = 'Tu check-in quedó registrado correctamente.'
  feedbackType.value = 'success'
}

const cancelReservation = async () => {
  if (!selectedReservation.value) return

  const updated = await reservationsStore.cancelReservation(selectedReservation.value.id, 'Cancelada por el estudiante')
  selectedReservation.value = updated
  feedback.value = 'La reserva se canceló correctamente.'
  feedbackType.value = 'error'
}
</script>

<style scoped>
.checkin-page { padding: 32px; display: grid; gap: 24px }
.hero-panel { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 18px; align-items: flex-start; padding: 24px; background: #fff; border-radius: 24px; box-shadow: 0 24px 48px rgba(15,23,42,0.06); }
.checkin-form { display: grid; gap: 10px; min-width: min(320px, 100%); padding: 20px; background: #f8fafc; border-radius: 20px; border: 1px solid rgba(15,23,42,0.08); }
.checkin-form label { font-weight: 700; }
.checkin-form input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(15,23,42,0.12); background: #fff; }
.reservation-card { display: grid; grid-template-columns: 1.3fr 0.8fr 1.2fr; gap: 20px; align-items: center; padding: 24px; background: #fff; border-radius: 24px; border: 1px solid rgba(15,23,42,0.08); }
.reservation-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.status-chip { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border-radius: 999px; font-weight: 700; }
.status-chip.Activa { background: rgba(59,130,246,0.12); color: #1d4ed8; }
.status-chip.Confirmada { background: rgba(16,185,129,0.12); color: #047857; }
.status-chip.Cancelada { background: rgba(239,68,68,0.12); color: #b91c1c; }
.checkin-message { margin-top: 0; font-weight: 700; }
.checkin-message.success { color: #047857; }
.checkin-message.error { color: #b91c1c; }
.info-card { padding: 24px; background: #fff; border-radius: 24px; border: 1px solid rgba(15,23,42,0.08); }
@media (max-width: 840px) {
  .hero-panel, .reservation-card { flex-direction: column; grid-template-columns: 1fr; }
  .reservation-actions { justify-content: stretch; }
}
</style>
