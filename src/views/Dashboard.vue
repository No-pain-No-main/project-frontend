<template>
  <section class="dashboard">
    <!-- Tarjeta de bienvenida -->
    <div class="hero-panel">
      <div>
        <p class="section-kicker">Bienvenido de nuevo</p>
        <h2>Hola, {{ studentName }}</h2>
        <p>
          Tienes <strong>{{ summary.activas }} reserva(s) activa(s)</strong> esta semana.
          Revisa tu próxima franja o aparta una nueva máquina antes de que se agote la disponibilidad.
        </p>
        <div v-if="lateMessage" class="dashboard-alert">
          <strong>Atención:</strong> {{ lateMessage }}
        </div>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <section class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Navegación</p>
          <h3>Accesos rápidos</h3>
        </div>
      </div>

      <div class="quick-links">
        <RouterLink v-for="link in quickLinks" :key="link.label" :to="link.to" class="quick-link">
          <span class="card-icon" :class="link.tone">
            <font-awesome-icon :icon="['fas', link.icon]" />
          </span>
          <span>{{ link.label }}</span>
        </RouterLink>
      </div>
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

const quickLinks = [
  { label: 'Reservar máquina', to: '/student/maquinas', icon: 'calendar-check', tone: 'blue' },
  { label: 'Mis reservas', to: '/student/reservas', icon: 'clipboard-check', tone: 'green' },
]

onMounted(() => {
  if (!reservationsStore.reservations.length) {
    reservationsStore.loadReservations(auth.user?.documentNumber)
  }
})

const studentName = computed(() => auth.user?.nombre || 'Estudiante')
const studentReservations = computed(() => reservationsStore.getStudentReservations(studentId))
const lateMessage = computed(() => {
  const lateItems = reservationsStore.lateAlerts(studentId)
  return lateItems.length
    ? 'Tu reserva fue cancelada por llegada tarde. Verifica tus horarios y evita futuros contratiempos.'
    : ''
})

const summary = computed(() => ({
  activas: studentReservations.value.filter((reservation) => reservation.status === 'activa').length,
  confirmadas: studentReservations.value.filter((reservation) => reservation.status === 'confirmada').length,
  horasSemana: Math.round(studentReservations.value.filter((reservation) => reservation.status === 'confirmada').length * 0.75 * 10) / 10,
}))

const cancelNextReservation = async () => {
  if (!nextReservation.value) return
  await reservationsStore.cancelReservation(nextReservation.value.id, 'Cancelada por el estudiante')
}

</script>
