<template>
  <header class="navbar">
    <button class="icon-button navbar__menu" type="button" aria-label="Abrir menu" @click="toggleMobileSidebar">
      <span />
      <span />
      <span />
    </button>

    <div>
      <p class="navbar__eyebrow">Hola, estudiante</p>
      <h1>{{ title }}</h1>
    </div>

    <div class="navbar__actions">
      <button class="icon-button" type="button" aria-label="Buscar">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </button>
      <button class="profile-button" type="button" aria-label="Perfil">FB</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { toggleMobileSidebar } from './Sidebar/state'

const route = useRoute()

const titles = {
  home: 'Inicio',
  dashboard: 'Panel general',
  reservations: 'Reservas',
  machines: 'Maquinas',
  'check-in': 'Check-in',
  about: 'Progreso',
  admin: 'Administracion',
}

const title = computed(() => titles[route.name] || 'FitBook')
</script>
