<template>
  <section class="checkin-page">
    <div class="hero-panel hero-panel--compact">
      <div>
        <p class="section-kicker">Portería</p>
        <h2>Validación de ingreso</h2>
        <p>
          Ingresa el código de confirmación que el estudiante debe presentar para validar su asistencia.
        </p>
      </div>

      <div class="hero-actions" v-if="activeReservation">
        <div class="checkin-code">
          <span>Código activo</span>
          <strong>{{ activeReservation.confirmationCode }}</strong>
        </div>
        <button class="primary-button" type="button" @click="confirmCheckIn">
          <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
          Registrar ingreso
        </button>
      </div>

      <div class="hero-actions" v-else>
        <p class="muted-text">No hay reservas activas para confirmar en este momento.</p>
      </div>
    </div>

    <section class="content-band" v-if="activeReservation">
      <div class="reservation-card">
        <div>
          <p class="section-kicker">Reserva actual</p>
          <h3>{{ activeReservation.student }}</h3>
          <p class="muted-text">{{ activeReservation.email }}</p>
        </div>
        <div>
          <strong>{{ activeReservation.machine }}</strong>
          <p class="muted-text">{{ activeReservation.slot }}</p>
        </div>
        <div>
          <span class="status-chip" :class="activeReservation.status">{{ activeReservation.statusLabel }}</span>
        </div>
      </div>

      <div class="checkin-panel">
        <label for="codeInput">Ingrese el código del estudiante</label>
        <input id="codeInput" v-model="codeInput" type="text" :placeholder="`Ej. ${activeReservation.confirmationCode}`" />
        <button class="primary-button" type="button" @click="validateCode">Validar código</button>
        <p v-if="message" :class="['checkin-message', messageType]">{{ message }}</p>
      </div>

      <div class="activity-list">
        <article class="activity-item">
          <span>CC</span>
          <div>
            <strong>Documento validado</strong>
            <p>Reserva activa encontrada para la franja actual</p>
          </div>
        </article>

        <article class="activity-item">
          <span>45</span>
          <div>
            <strong>Tiempo de uso</strong>
            <p>Se libera la máquina automáticamente al finalizar</p>
          </div>
        </article>
      </div>
    </section>

    <section class="content-band" v-else>
      <p class="muted-text">Aquí se mostrará tu reserva activa a la hora de confirmar asistencia.</p>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useReservationsStore } from '../stores/reservations'

const auth = useAuthStore()
const reservationsStore = useReservationsStore()
const studentId = auth.user?.id ?? 0

const codeInput = ref('')
const message = ref('')
const messageType = ref('')

onMounted(() => {
  if (!reservationsStore.reservations.length) {
    reservationsStore.loadReservations()
  }
})

const activeReservation = computed(() => reservationsStore.getActiveReservation(studentId))

const validateCode = async () => {
  if (!activeReservation.value) {
    message.value = 'No tienes ninguna reserva activa para confirmar.'
    messageType.value = 'error'
    return
  }

  if (!codeInput.value.trim()) {
    message.value = 'Ingresa el código de confirmación.'
    messageType.value = 'error'
    return
  }

  if (codeInput.value.trim().toUpperCase() === activeReservation.value.confirmationCode) {
    message.value = 'Asistencia confirmada. ¡Ingreso registrado!'
    messageType.value = 'success'
    await reservationsStore.confirmAttendance(activeReservation.value.id)
  } else {
    message.value = 'Código incorrecto. Verifica el número con el estudiante.'
    messageType.value = 'error'
  }
}

const confirmCheckIn = () => {
  if (activeReservation.value) {
    codeInput.value = activeReservation.value.confirmationCode
    validateCode()
  }
}
</script>

<style scoped>
.checkin-page { padding: 32px; display: grid; gap: 24px }
.hero-panel { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 18px; align-items: flex-start; padding: 24px; background: #fff; border-radius: 24px; box-shadow: 0 24px 48px rgba(15,23,42,0.06); }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.checkin-code { display: flex; flex-direction: column; gap: 4px; background: rgba(59,130,246,0.1); padding: 14px 18px; border-radius: 18px; }
.checkin-code span { text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; color: #2563eb; }
.checkin-code strong { font-size: 1.45rem; letter-spacing: 0.12em; }
.reservation-card { display: grid; grid-template-columns: 1.3fr 1fr 0.8fr; gap: 20px; align-items: center; padding: 24px; background: #fff; border-radius: 24px; border: 1px solid rgba(15,23,42,0.08); }
.status-chip { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border-radius: 999px; font-weight: 700; }
.status-chip.Activa { background: rgba(59,130,246,0.12); color: #1d4ed8; }
.status-chip.Confirmada { background: rgba(16,185,129,0.12); color: #047857; }
.checkin-panel { display: grid; gap: 12px; padding: 24px; background: #fff; border-radius: 24px; border: 1px solid rgba(15,23,42,0.08); }
.checkin-panel label { font-weight: 700; }
.checkin-panel input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(15,23,42,0.12); background: #f8fafc; }
.checkin-message { margin-top: 0; font-weight: 700; }
.checkin-message.success { color: #047857; }
.checkin-message.error { color: #b91c1c; }
.activity-list { display: grid; gap: 14px; }
.activity-item { display: flex; gap: 14px; align-items: center; padding: 18px; border-radius: 20px; background: #fff; border: 1px solid rgba(15,23,42,0.08); }
.activity-item span { width: 46px; height: 46px; border-radius: 16px; display: grid; place-items: center; background: rgba(15,23,42,0.06); font-weight: 700; }
@media (max-width: 840px) {
  .reservation-card { grid-template-columns: 1fr; }
  .hero-panel { flex-direction: column; }
  .hero-actions { width: 100%; justify-content: stretch; }
}
</style>
