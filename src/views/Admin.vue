<template>
  <section class="admin-dashboard">
    <header class="dashboard-header">
      <div>
        <p class="section-kicker">Administrador</p>
        <h1>Inicio</h1>
        <p class="muted-text">Gestiona tu área desde la vista principal con los accesos directos más importantes.</p>
      </div>

    </header>

    <div class="dashboard-grid">
      <section class="quick-actions card">
        <div class="panel-header">
          <div>
            <p class="section-kicker">Acciones rápidas</p>
            <h2>Comandos</h2>
          </div>
        </div>
        <div class="action-grid">
          <RouterLink v-for="action in quickActions" :key="action.label" :to="action.to" class="action-card">
            <div class="action-icon" :class="action.color">
              <font-awesome-icon :icon="['fas', action.icon]" />
            </div>
            <div>
              <strong>{{ action.label }}</strong>
              <small>{{ action.description }}</small>
            </div>
          </RouterLink>
        </div>
      </section>


    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const adminName = computed(() => auth.user?.nombre || 'Admin FitBook')
const adminInitials = computed(() => {
  const names = adminName.value.split(' ')
  return names.map((part) => part.charAt(0)).slice(0, 2).join('').toUpperCase()
})

const quickActions = [
  { label: 'Gestionar Máquinas', description: 'Agregar, editar o eliminar equipos', icon: 'gears', to: '/admin/maquinas', color: 'blue' },
  { label: 'Gestionar Estudiantes', description: 'Controlar usuarios y accesos', icon: 'users', to: '/admin/usuarios', color: 'green' },
  { label: 'Registrar Máquina', description: 'Añadir nuevo equipo al catálogo', icon: 'plus-circle', to: '/admin/maquinas', color: 'purple' },
  { label: 'Ver Estadísticas', description: 'Analizar uso y tendencias', icon: 'chart-simple', to: '/admin/estadisticas', color: 'amber' },
]

</script>

<style scoped>
.admin-dashboard { padding: 32px; display: grid; gap: 28px }
.dashboard-header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 18px; align-items: flex-start; }
.dashboard-header > div { max-width: 680px }
.dashboard-header h1 { margin: 8px 0 10px; font-size: clamp(2rem, 2.4vw, 2.8rem); }
.dashboard-header__actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.home-action { width: 46px; height: 46px; border-radius: 16px; background: #fff; border: 1px solid rgba(15,23,42,0.08); color: var(--blue); display: grid; place-items: center; }
.profile-chip { display: inline-flex; align-items: center; gap: 12px; background: #fff; border: 1px solid rgba(15,23,42,0.08); padding: 10px 16px; border-radius: 18px; box-shadow: 0 10px 24px rgba(15,23,42,0.06); text-decoration: none; color: inherit; }
.profile-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,#2f6fed,#2fd1a1); color:#fff; display:grid; place-items:center; font-weight:800; }
.profile-chip small { display: block; margin-top: 4px; font-size: 0.8rem; color: var(--muted); }
.quick-stats { display:grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 18px; }
.stat-card { display:flex; align-items:center; justify-content: space-between; padding: 22px; border-radius: 24px; background: #fff; border: 1px solid rgba(15,23,42,0.05); box-shadow: 0 18px 40px rgba(21,33,64,0.06); transition: transform 0.25s ease, border-color 0.25s ease; }
.stat-card:hover { transform: translateY(-3px); border-color: rgba(47,111,237,0.2); }
.stat-card__icon { width: 50px; height: 50px; border-radius: 16px; display:grid; place-items:center; background: rgba(47,111,237,0.1); color: var(--blue); }
.stat-card.green .stat-card__icon { background: rgba(16,185,129,0.12); color:#10b981; }
.stat-card.purple .stat-card__icon { background: rgba(139,92,246,0.12); color:#8b5cf6; }
.stat-card.teal .stat-card__icon { background: rgba(20,184,166,0.12); color:#14b8a6; }
.stat-card.amber .stat-card__icon { background: rgba(245,158,11,0.12); color:#f59e0b; }
.stat-card.red .stat-card__icon { background: rgba(239,68,68,0.12); color:#ef4444; }
.stat-card.indigo .stat-card__icon { background: rgba(99,102,241,0.12); color:#6366f1; }
.stat-card.blue .stat-card__icon { background: rgba(47,111,237,0.12); color:#2f6fed; }
.stat-card { gap: 16px; }
.stat-card p { color: var(--muted); margin:0; }
.stat-card strong { font-size: 1.2rem; }
.stat-card__delta { font-size: 0.85rem; font-weight:700; }
.stat-card__delta.positive { color: #10b981; }
.stat-card__delta.negative { color: #ef4444; }
.dashboard-grid { display:grid; grid-template-columns: 1fr; gap: 22px; }
.card { background:#fff; border-radius:24px; padding:24px; border:1px solid rgba(15,23,42,0.05); box-shadow: 0 24px 48px rgba(15,23,42,0.06); }
.panel-header { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:18px; }
.panel-header h2 { margin:0; }
.action-grid { display:grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap:12px; }
.action-card { text-align:left; padding:18px; border-radius:18px; border:1px solid rgba(15,23,42,0.07); background:#f8fbff; display:flex; gap:12px; align-items:flex-start; transition: transform 0.2s ease; min-width:0; }
.action-card:hover { transform: translateY(-3px); }
.action-card > div { min-width:0; }
.action-card strong, .action-card small { display:block; overflow-wrap: break-word; word-break: break-word; }
.action-card strong { margin-bottom:6px; }
.recent-table { width:100%; border-collapse: collapse; }
.recent-table th, .recent-table td { text-align:left; padding:16px 12px; }
.recent-table th { color: var(--muted); font-weight:700; font-size:0.9rem; }
.recent-table tbody tr { border-top:1px solid rgba(15,23,42,0.06); }
.status-chip { padding: 4px 10px; border-radius:999px; font-size:0.82rem; font-weight:700; }
.status-chip.Activa { background: rgba(16,185,129,0.12); color:#047857; }
.status-chip.Completa { background: rgba(47,111,237,0.12); color:#1d4ed8; }
.status-chip.Cancelada { background: rgba(239,68,68,0.12); color:#b91c1c; }
.status-grid { display:grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap:14px; }
.status-card { display:flex; align-items:center; gap:14px; padding:18px; border-radius:20px; border:1px solid rgba(15,23,42,0.06); background:#fff; }
.status-dot { width:14px; height:14px; border-radius:50%; }
.status-dot.green { background:#10b981; }
.status-dot.amber { background:#f59e0b; }
.status-dot.red { background:#ef4444; }
.ghost-button { min-height: 42px; }
@media (max-width: 1100px) {
  .quick-stats { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .dashboard-grid { grid-template-columns: 1fr; }
  .action-grid, .charts-grid, .status-grid { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .admin-dashboard { padding: 18px; }
  .dashboard-header__actions { flex-direction: column; align-items: stretch; }
  .search-box { min-width: auto; width: 100%; }
  .profile-chip { width: 100%; justify-content: space-between; }
}
</style>
