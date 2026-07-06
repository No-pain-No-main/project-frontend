<template>
  <header class="navbar">
    <div>
      <p class="navbar__eyebrow">Hola, estudiante</p>
      <h1>{{ title }}</h1>
    </div>

    <div class="navbar__actions">
      <button class="icon-button" type="button" aria-label="Buscar" @click="toggleSearch">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </button>

      <div v-if="showSearch" class="navbar__search">
        <input
          ref="searchInput"
          v-model="searchTerm"
          type="search"
          placeholder="Buscar máquinas..."
          @keyup.enter="submitSearch"
        />
        <button class="icon-button" type="button" aria-label="Ir" @click="submitSearch">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>

      <button class="profile-button" type="button" aria-label="Perfil" @click="goToProfile">
        <font-awesome-icon :icon="['fas', 'user']" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ref, nextTick } from 'vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const showSearch = ref(false)
const searchTerm = ref('')
const searchInput = ref(null)

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    nextTick(() => searchInput.value && searchInput.value.focus())
  }
}

function submitSearch() {
  const path = auth.isAdmin ? '/admin/maquinas' : '/student/maquinas'
  router.push({ path, query: { q: searchTerm.value || undefined } })
  showSearch.value = false
}

const titles = {
  home: 'Inicio',
  dashboard: 'Panel general',
  reservations: 'Reservas',
  machines: 'Maquinas',
  'check-in': 'Check-in',
  admin: 'Administracion',
  'admin-machines': 'Gestión de máquinas',
  'admin-users': 'Usuarios',
  'admin-stats': 'Estadísticas',
  'admin-settings': 'Configuración',
}

const title = computed(() => titles[route.name] || 'FitBook')

function goToProfile() {

  if (auth.isAdmin) router.push('/admin/profile')
  else router.push('/student/profile')
}
</script>
