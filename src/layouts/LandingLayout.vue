<template>
  <div class="landing-shell">
    <header class="landing-topbar">
      <RouterLink to="/" class="landing-brand">
        <img src="/logo.png" alt="FitBook" />
        <div class="landing-brand__copy">
          <span>Gimnasio UNAL</span>
          <strong>FitBook</strong>
        </div>
      </RouterLink>

      <nav class="landing-actions">
        <RouterLink to="/check-in" class="ghost-button">Check-in</RouterLink>
        <RouterLink to="/login" class="ghost-button">Iniciar sesión</RouterLink>
        <RouterLink to="/register" class="primary-button">Registrarse</RouterLink>
      </nav>
    </header>

    <main class="landing-content">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Footer from '../components/layout/Footer.vue'
</script>

<style scoped>
.landing-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
