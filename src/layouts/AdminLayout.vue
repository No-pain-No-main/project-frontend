<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <h2>No Pain No Main</h2>
        <p>Administrador</p>
      </div>

      <nav class="nav-menu">
        <RouterLink to="/admin">Inicio</RouterLink>
        <RouterLink to="/admin/machines/create">Registrar máquina</RouterLink>
        <RouterLink to="/admin/machines/status">Estados de máquinas</RouterLink>
        <RouterLink to="/admin/reservations/history">Historial de reservas</RouterLink>
        <RouterLink to="/admin/reports">Reportes</RouterLink>
      </nav>

      <button class="logout-button" @click="logout">
        Cerrar sesión
      </button>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  background-color: #f4f6f8;
}

.sidebar {
  width: 280px;
  background-color: #142033;
  color: white;
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
}

.brand {
  margin-bottom: 36px;
}

.brand h2 {
  margin: 0;
  font-size: 20px;
}

.brand p {
  margin: 8px 0 0;
  color: #cbd5e1;
  font-size: 14px;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.nav-menu a {
  color: #e5e7eb;
  padding: 12px 14px;
  border-radius: 8px;
  transition: 0.2s ease;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  background-color: #24344d;
  color: white;
}

.logout-button {
  border: 1px solid #475569;
  background-color: transparent;
  color: white;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.logout-button:hover {
  background-color: #24344d;
}

.main-content {
  flex: 1;
  padding: 36px;
}

@media (max-width: 760px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .main-content {
    padding: 24px;
  }
}
</style>
