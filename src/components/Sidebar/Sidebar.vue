<template>
  <div v-if="mobileOpen" class="sidebar-backdrop" @click="closeMobileSidebar" />

  <aside class="sidebar" :class="{ 'is-open': mobileOpen }">
    <div class="sidebar__brand">
      <img src="/logo.png" alt="FitBook" class="sidebar__logo" />

      <div class="sidebar__brand-copy">
        <span>Gimnasio UNAL</span>
        <strong>FitBook</strong>
      </div>
    </div>

    <nav class="sidebar__nav" aria-label="Principal">
      <template v-if="auth.isAdmin">
        <SidebarLink
          to="/admin"
          :icon="['fas', 'users-gear']"
          label="Administracion"
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
        <SidebarLink
          to="/student/check-in"
          :icon="['fas', 'clipboard-check']"
          label="Check-in"
          @navigate="closeMobileSidebar"
        />
        <SidebarLink
          to="/student/about"
          :icon="['fas', 'user-graduate']"
          label="Progreso"
          @navigate="closeMobileSidebar"
        />
      </template>
    </nav>

    <section v-if="auth.isAuthenticated" class="sidebar__summary" aria-label="Sesion">
      <span>Conectado como</span>
      <strong>{{ auth.user?.nombre || auth.user?.email }}</strong>
      <button class="ghost-button" type="button" style="margin-top: 10px" @click="handleLogout">
        Cerrar sesión
      </button>
    </section>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import SidebarLink from './SidebarLink.vue'
import { closeMobileSidebar, mobileOpen } from './state'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
