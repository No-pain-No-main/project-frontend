<template>
  <div v-if="mobileOpen" class="sidebar-backdrop" @click="closeMobileSidebar" />

  <aside class="sidebar" :class="{ 'is-open': mobileOpen, 'is-collapsed': collapsed }">
    <div class="sidebar__brand">
      <RouterLink to="/" class="sidebar__brand-link">
        <img src="/logo.png" alt="FitBook" class="sidebar__logo" />

        <div class="sidebar__brand-copy">
          <span>Gimnasio UNAL</span>
          <strong>FitBook</strong>
        </div>
      </RouterLink>
    </div>

    <nav class="sidebar__nav" aria-label="Principal">
      <template v-if="auth.isAdmin">
        <SidebarLink
          to="/admin"
          :icon="['fas', 'house']"
          label="Inicio"
          @navigate="closeMobileSidebar"
        />
        <SidebarLink
          to="/admin/maquinas"
          :icon="['fas', 'dumbbell']"
          label="Máquinas"
          @navigate="closeMobileSidebar"
        />
        <SidebarLink
          to="/admin/usuarios"
          :icon="['fas', 'users-gear']"
          label="Usuarios"
          @navigate="closeMobileSidebar"
        />
        <SidebarLink
          to="/admin/estadisticas"
          :icon="['fas', 'chart-line']"
          label="Estadísticas"
          @navigate="closeMobileSidebar"
        />
        
        
      </template>

      <template v-else>
        <SidebarLink
          to="/student/dashboard"
          :icon="['fas', 'house']"
          label="Inicio"
          @navigate="closeMobileSidebar"
        />
        <SidebarLink
          to="/student/reservas"
          :icon="['fas', 'calendar-check']"
          label="Reservas"
          @navigate="closeMobileSidebar"
        />
        <SidebarLink
          to="/student/maquinas"
          :icon="['fas', 'dumbbell']"
          label="Maquinas"
          @navigate="closeMobileSidebar"
        />
      </template>
    </nav>

    <button
      class="sidebar__collapse-toggle"
      type="button"
      :aria-label="collapsed ? 'Expandir menú' : 'Colapsar menú'"
      :title="collapsed ? 'Expandir menú' : 'Colapsar menú'"
      @click="toggleCollapsed"
    >
      <font-awesome-icon :icon="['fas', collapsed ? 'angles-right' : 'angles-left']" />
      <span v-if="!collapsed">Colapsar menú</span>
    </button>

    <section v-if="auth.isAuthenticated" class="sidebar__summary" aria-label="Sesion">
      <span>Conectado como</span>
      <strong>{{ auth.user?.nombre || auth.user?.email }}</strong>
      <button class="ghost-button" type="button" style="margin-top: 10px" @click="handleLogout">
        <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
        <span v-if="!collapsed">Cerrar sesión</span>
      </button>
    </section>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import SidebarLink from './SidebarLink.vue'
import { closeMobileSidebar, collapsed, mobileOpen, toggleCollapsed } from './state'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {  auth.logout()
  router.push('/login')
}
</script>
