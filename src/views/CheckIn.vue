<template>
  <section class="checkin-page">
    <div class="hero-panel">
      <div>
        <p class="section-kicker">Check-in estudiantil</p>
        <h2>Verifica tu ingreso en segundos</h2>
        <p>
          Ingresa tu número de documento para confirmar la reserva más próxima asociada a tu cuenta.
        </p>
      </div>

      <form class="checkin-form" @submit.prevent="verifyCheckIn">
        <label for="documentInput">Número de documento</label>
        <input id="documentInput" v-model="documentInput" type="text" placeholder="1018456789" required />

        <button class="primary-button" type="submit" :disabled="loading">
          {{ loading ? 'Verificando...' : 'Verificar check-in' }}
        </button>
        <p v-if="feedback" class="checkin-message" :class="feedbackType">{{ feedback }}</p>
      </form>
    </div>

    <section v-if="selectedBooking" class="content-band">
      <div class="reservation-card">
        <div>
          <p class="section-kicker">Reserva verificada</p>
          <h3>{{ selectedBooking.machine?.name || selectedBooking.machine || 'Reserva activa' }}</h3>
          <p class="muted-text">{{ selectedBooking.slot || selectedBooking.timeSlot || 'Franja activa' }}</p>
          <p class="muted-text">Documento: {{ selectedBooking.studentDocumentNumber || documentInput }}</p>
        </div>

        <div class="reservation-status">
          <span class="status-chip" :class="selectedBooking.status || 'Activa'">{{ selectedBooking.statusLabel || 'Confirmada' }}</span>
        </div>
      </div>

      <div class="info-card">
        <h3>Estado del ingreso</h3>
        <p class="muted-text">
          El check-in quedó verificado correctamente para este documento.
        </p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '../services/apiClient'

const documentInput = ref('')
const selectedBooking = ref(null)
const feedback = ref('')
const feedbackType = ref('')
const loading = ref(false)

const verifyCheckIn = async () => {
  const documentNumber = documentInput.value.trim()

  if (!documentNumber) {
    selectedBooking.value = null
    feedback.value = 'Ingresa un número de documento válido.'
    feedbackType.value = 'error'
    return
  }

  loading.value = true
  feedback.value = ''
  feedbackType.value = ''
  selectedBooking.value = null

  try {
    const { data } = await apiClient.post(`/validator/confirm/${encodeURIComponent(documentNumber)}`)

    if (typeof data === 'string') {
      throw new Error(data)
    }

    selectedBooking.value = data
    feedback.value = 'El check-in fue verificado correctamente.'
    feedbackType.value = 'success'
  } catch (err) {
    feedback.value = err?.response?.data?.message || err?.message || 'No se pudo verificar el documento.'
    feedbackType.value = 'error'
  } finally {
    loading.value = false
  }
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
