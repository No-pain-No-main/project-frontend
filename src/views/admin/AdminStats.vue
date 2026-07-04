<template>
  <section class="admin-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Administración</p>
        <h3>Estadísticas</h3>
      </div>
    </div>

    <div class="stats-grid admin-stats-grid">
      <article class="soft-card blue">
        <span class="card-icon blue"><font-awesome-icon :icon="['fas', 'chart-line']" /></span>
        <p>Reservas esta semana</p>
        <strong>198</strong>
      </article>
      <article class="soft-card green">
        <span class="card-icon green"><font-awesome-icon :icon="['fas', 'dumbbell']" /></span>
        <p>Máquinas disponibles</p>
        <strong>18</strong>
      </article>
      <article class="soft-card amber">
        <span class="card-icon amber"><font-awesome-icon :icon="['fas', 'calendar-day']" /></span>
        <p>Reservas hoy</p>
        <strong>34</strong>
      </article>
      <article class="soft-card purple">
        <span class="card-icon purple"><font-awesome-icon :icon="['fas', 'user-graduate']" /></span>
        <p>Estudiantes activos</p>
        <strong>1.240</strong>
      </article>
    </div>

    <div class="admin-stats-summary">
      <article class="stat-summary-card">
        <h4>Uso de máquinas</h4>
        <p>La ocupación promedio de máquinas esta semana es del 78%, con un aumento del 14% frente a la semana anterior.</p>
      </article>
      <article class="stat-summary-card">
        <h4>Balance de reservas</h4>
        <p>Las reservas en horas pico (17:00-20:00) representan el 42% del total. El sistema está listo para manejar la demanda.</p>
      </article>
    </div>

    <section class="admin-stats-users">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Historial por estudiante</p>
          <h3>Reservas de usuarios</h3>
        </div>
      </div>

      <div class="users-list">
        <article v-for="user in groupedStudents" :key="user.studentId" class="user-card soft-card">
          <header class="user-card__header">
            <div>
              <strong>{{ user.student }}</strong>
              <p class="muted-text">{{ user.email }}</p>
            </div>
            <div class="user-card__meta">
              <span class="badge">{{ user.reservations.length }}</span>
              <button class="ghost-button" @click="toggle(user.studentId)">{{ isOpen(user.studentId) ? 'Ocultar' : 'Ver reservas' }}</button>
            </div>
          </header>

          <div v-if="isOpen(user.studentId)" class="user-card__body">
            <div class="reservations-grid">
              <article v-for="r in user.reservations" :key="r.id" class="reservation-card soft-card">
                <div class="reservation-card__main">
                  <strong>{{ r.machine }}</strong>
                  <p class="muted-text">{{ r.slot }}</p>
                </div>
                <div class="reservation-card__meta">
                  <p class="muted-text">{{ r.statusLabel }}</p>
                  <p class="muted-text">Código: {{ r.confirmationCode }}</p>
                  <p v-if="r.cancelledReason" class="muted-text">Motivo: {{ r.cancelledReason }}</p>
                </div>
              </article>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReservationsStore } from '../../stores/reservations'

const reservationsStore = useReservationsStore()

onMounted(() => {
  if (!reservationsStore.reservations.length) reservationsStore.loadReservations()
})

const reservations = computed(() => reservationsStore.adminReservations)

// Agrupa reservas por studentId
const groupedStudents = computed(() => {
  const map = new Map()
  reservations.value.forEach((r) => {
    const id = r.studentId ?? r.email
    if (!map.has(id)) {
      map.set(id, { studentId: id, student: r.student, email: r.email, reservations: [] })
    }
    map.get(id).reservations.push(r)
  })
  // convertir a array ordenado por nombre
  return Array.from(map.values()).sort((a, b) => a.student.localeCompare(b.student))
})

const openUsers = ref([])
const toggle = (id) => {
  if (openUsers.value.includes(id)) openUsers.value = openUsers.value.filter((x) => x !== id)
  else openUsers.value.push(id)
}
const isOpen = (id) => openUsers.value.includes(id)
</script>

<style scoped>
.admin-stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; margin-top: 22px; }
.soft-card { display:flex; align-items:center; justify-content:space-between; padding: 24px; border-radius: 24px; box-shadow: 0 20px 40px rgba(15,23,42,0.05); border: 1px solid rgba(15,23,42,0.05); }
.card-icon { width: 48px; height: 48px; border-radius: 16px; display:grid; place-items:center; color:#fff; }
.card-icon.blue { background:#2f6fed; }
.card-icon.green { background:#10b981; }
.card-icon.amber { background:#f59e0b; }
.card-icon.purple { background:#8b5cf6; }
.stat-summary-card { background:#fff; border-radius:24px; padding:24px; border:1px solid rgba(15,23,42,0.06); box-shadow: 0 18px 36px rgba(15,23,42,0.05); margin-top:18px; }
.stat-summary-card h4 { margin-bottom: 10px; }
@media (max-width: 900px) {
  .admin-stats-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}

.admin-stats-users { margin-top: 28px; }
.users-list { display: grid; gap: 12px; margin-top: 12px; }
.user-card { display:flex; flex-direction:column; padding: 18px; }
.user-card__header { display:flex; justify-content:space-between; align-items:center; }
.user-card__header strong { font-size: 1rem; }
.user-card__meta { display:flex; gap:10px; align-items:center; }
.badge { background:#eef2ff; color:#4338ca; padding:6px 10px; border-radius:999px; font-weight:600; }
.ghost-button { background: transparent; border: 1px solid rgba(15,23,42,0.06); padding:6px 10px; border-radius:12px; cursor:pointer; }
.user-card__body { margin-top: 12px; }
.reservations-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:12px; }
.reservation-card { display:flex; flex-direction:column; gap:8px; padding:12px; }
.reservation-card__main { display:flex; flex-direction:column; }
.reservation-card__meta { display:flex; flex-direction:column; gap:4px; font-size: 0.85rem; color: #6b7280; }
.muted-text { color: #6b7280; margin:0; }

@media (max-width: 620px) {
  .admin-stats-grid { grid-template-columns: 1fr; }
}
</style>
