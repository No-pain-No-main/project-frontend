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

      <RouterLink to="/student/maquinas" class="primary-button">
        <font-awesome-icon :icon="['fas', 'calendar-check']" />
        Reservar máquina
      </RouterLink>
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

    <!-- Máquinas disponibles -->
    <section class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Catálogo</p>
          <h3>Máquinas disponibles ahora</h3>
        </div>
        <RouterLink to="/student/maquinas" class="ghost-button">Ver todas</RouterLink>
      </div>

      <div class="mini-machine-list">
        <article v-for="machine in availableMachines" :key="machine.nombre" class="mini-machine">
          <span class="card-icon green">
            <font-awesome-icon :icon="['fas', machine.icon]" />
          </span>
          <div>
            <strong>{{ machine.nombre }}</strong>
            <p class="muted-text">{{ machine.tipo }}</p>
          </div>
          <span class="badge green">Disponible</span>
        </article>
      </div>
    </section>

    <!-- Actividad reciente -->
    <section class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Historial</p>
          <h3>Actividad reciente</h3>
        </div>
        <RouterLink to="/student/reservas" class="ghost-button">Ver todo</RouterLink>
      </div>

      <div v-if="pastReservations.length" class="history-list">
        <article v-for="r in pastReservations.slice(0,3)" :key="r.id" class="history-item">
          <div>
            <strong>{{ r.machine }}</strong>
            <p class="muted-text">{{ r.slot }} · {{ r.statusLabel }}</p>
          </div>
          <div class="history-meta">
            <p v-if="r.acceptedAt" class="muted-text">Actualizada: {{ new Date(r.acceptedAt).toLocaleDateString('es-CO') }}</p>
            <p v-else class="muted-text">Creada: {{ new Date(r.createdAt).toLocaleDateString('es-CO') }}</p>
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

const quickLinks = [
  { label: 'Reservar máquina', to: '/student/maquinas', icon: 'calendar-check', tone: 'blue' },
  { label: 'Mis reservas', to: '/student/reservas', icon: 'clipboard-check', tone: 'green' },
]

const availableMachines = [
  { nombre: 'Remo sentado', tipo: 'Espalda', icon: 'dumbbell' },
  { nombre: 'Caminadora 1', tipo: 'Cardio', icon: 'heart-pulse' },
  { nombre: 'Zona TRX', tipo: 'Funcional', icon: 'person-running' },
]

const recentActivity = [
  { time: '07:00', title: 'Reserva confirmada', text: 'Banco plano · estudiante validado' },
  { time: '10:30', title: 'Franja con alta demanda', text: 'Zona de fuerza al 92% de ocupación' },
  { time: '17:00', title: 'Reserva zona funcional', text: 'Duración máxima: 45 minutos' },
]

onMounted(() => {
  if (!reservationsStore.reservations.length) {
    reservationsStore.loadReservations()
  }
})

const studentName = computed(() => auth.user?.nombre || 'Estudiante')
const studentReservations = computed(() => reservationsStore.getStudentReservations(studentId))
const pastReservations = computed(() => reservationsStore.getPastReservations(studentId))
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
