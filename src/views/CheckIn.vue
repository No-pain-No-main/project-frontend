<template>
  <section class="checkin-page">
    <!-- Paso 1: Login del validador -->
    <div v-if="!validatorToken" class="hero-panel">
      <div>
        <p class="section-kicker">Check-in estudiantil</p>
        <h2>Acceso de validador</h2>
        <p>
          Ingresa tus credenciales de validador para gestionar el check-in de estudiantes.
        </p>
      </div>

      <form class="checkin-form" @submit.prevent="validatorLogin">
        <label for="validatorDoc">Documento</label>
        <input id="validatorDoc" v-model="validatorDoc" type="text" placeholder="Documento del validador" required />

        <label for="validatorPass">Contraseña</label>
        <input id="validatorPass" v-model="validatorPass" type="password" placeholder="Contraseña" required />

        <button class="primary-button" type="submit" :disabled="loginLoading">
          {{ loginLoading ? 'Ingresando...' : 'Ingresar' }}
        </button>
        <p v-if="loginFeedback" class="checkin-message" :class="loginFeedbackType">{{ loginFeedback }}</p>
      </form>
    </div>

    <!-- Paso 2: Verificar check-in de estudiante -->
    <div v-else class="hero-panel">
      <div>
        <p class="section-kicker">Check-in estudiantil</p>
        <h2>Verifica el ingreso</h2>
        <p>
          Ingresa el número de documento del estudiante para validar su reserva más próxima.
        </p>
      </div>

      <form class="checkin-form" @submit.prevent="verifyCheckIn">
        <label for="studentDoc">Documento del estudiante</label>
        <input id="studentDoc" v-model="studentDoc" type="text" placeholder="1018456789" required />

        <button class="primary-button" type="submit" :disabled="checkinLoading">
          {{ checkinLoading ? 'Verificando...' : 'Verificar reserva' }}
        </button>
        <p v-if="checkinFeedback" class="checkin-message" :class="checkinFeedbackType">{{ checkinFeedback }}</p>
      </form>
    </div>

    <!-- Resultado del check-in -->
    <section v-if="confirmedBooking" class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Reserva confirmada</p>
          <h3>Check-in exitoso</h3>
        </div>
      </div>

      <div class="reservation-card">
        <div>
          <p class="reservation-title">{{ confirmedBooking.machine?.name || 'Máquina' }}</p>
          <p class="muted-text">
            Franja: {{ confirmedBooking.timeSlot?.name || '—' }}
          </p>
          <p class="muted-text">
            Fecha: {{ confirmedBooking.date || '—' }}
          </p>
          <p class="muted-text">
            Estudiante: {{ confirmedBooking.student?.firstName || '' }} {{ confirmedBooking.student?.lastName || '' }}
          </p>
        </div>

        <div class="reservation-status">
          <span class="status-chip Confirmada">Confirmada</span>
        </div>
      </div>

      <div class="info-card">
        <h3>Estado del ingreso</h3>
        <p class="muted-text">
          El check-in quedó verificado correctamente. La reserva ha sido confirmada.
        </p>
      </div>

      <div class="checkin-actions">
        <button class="ghost-button" type="button" @click="resetResult">Verificar otro estudiante</button>
        <button class="ghost-button" type="button" @click="logoutValidator">Cerrar sesión</button>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '../services/apiClient'

// ── Login del validador ───────────────────────────────
const validatorToken = ref('')
const validatorDoc = ref('')
const validatorPass = ref('')
const loginLoading = ref(false)
const loginFeedback = ref('')
const loginFeedbackType = ref('')

const validatorLogin = async () => {
  if (!validatorDoc.value.trim() || !validatorPass.value.trim()) {
    loginFeedback.value = 'Ingresa documento y contraseña.'
    loginFeedbackType.value = 'error'
    return
  }

  loginLoading.value = true
  loginFeedback.value = ''

  try {
    const { data } = await apiClient.post('/auth/validator/login', {
      documentNumber: validatorDoc.value.trim(),
      password: validatorPass.value,
    })

    if (data.token) {
      validatorToken.value = data.token
      loginFeedback.value = ''
    } else {
      throw new Error('Token no recibido')
    }
  } catch (err) {
    loginFeedback.value = err?.response?.data?.message || err?.message || 'Credenciales inválidas.'
    loginFeedbackType.value = 'error'
  } finally {
    loginLoading.value = false
  }
}

const logoutValidator = () => {
  validatorToken.value = ''
  validatorDoc.value = ''
  validatorPass.value = ''
  confirmedBooking.value = null
  studentDoc.value = ''
}

// ── Verificación del estudiante ───────────────────────
const studentDoc = ref('')
const checkinLoading = ref(false)
const checkinFeedback = ref('')
const checkinFeedbackType = ref('')
const confirmedBooking = ref(null)

const verifyCheckIn = async () => {
  const documentNumber = studentDoc.value.trim()
  if (!documentNumber) {
    checkinFeedback.value = 'Ingresa un número de documento válido.'
    checkinFeedbackType.value = 'error'
    return
  }

  checkinLoading.value = true
  checkinFeedback.value = ''
  confirmedBooking.value = null

  try {
    const { data } = await apiClient.post(
      `/validator/confirm/${encodeURIComponent(documentNumber)}`,
      {},
      { headers: { Authorization: `Bearer ${validatorToken.value}` } }
    )

    if (typeof data === 'string') {
      throw new Error(data)
    }

    confirmedBooking.value = data
    checkinFeedback.value = 'Reserva confirmada exitosamente.'
    checkinFeedbackType.value = 'success'
  } catch (err) {
    checkinFeedback.value = err?.response?.data?.message || err?.message || 'No se encontró una reserva próxima.'
    checkinFeedbackType.value = 'error'
  } finally {
    checkinLoading.value = false
  }
}

const resetResult = () => {
  confirmedBooking.value = null
  studentDoc.value = ''
  checkinFeedback.value = ''
}
</script>

<style scoped>
.checkin-page { padding: 32px; display: grid; gap: 24px }
.hero-panel { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 18px; align-items: flex-start; padding: 24px; background: #fff; border-radius: 24px; box-shadow: 0 24px 48px rgba(15,23,42,0.06); }
.checkin-form { display: grid; gap: 10px; min-width: min(320px, 100%); padding: 20px; background: #f8fafc; border-radius: 20px; border: 1px solid rgba(15,23,42,0.08); }
.checkin-form label { font-weight: 700; }
.checkin-form input { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(15,23,42,0.12); background: #fff; }
.reservation-card { display: grid; grid-template-columns: 1.5fr 0.8fr; gap: 20px; align-items: center; padding: 24px; background: #fff; border-radius: 24px; border: 1px solid rgba(15,23,42,0.08); }
.reservation-title { margin: 0 0 4px; font-weight: 700; }
.reservation-status { display: flex; justify-content: flex-end; }
.status-chip { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border-radius: 999px; font-weight: 700; }
.status-chip.Confirmada { background: rgba(16,185,129,0.12); color: #047857; }
.checkin-message { margin-top: 0; font-weight: 700; }
.checkin-message.success { color: #047857; }
.checkin-message.error { color: #b91c1c; }
.info-card { padding: 24px; background: #fff; border-radius: 24px; border: 1px solid rgba(15,23,42,0.08); }
.checkin-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
.muted-text { color: var(--muted); margin: 0 0 4px; }
@media (max-width: 840px) {
  .hero-panel, .reservation-card { flex-direction: column; grid-template-columns: 1fr; }
}
</style>
