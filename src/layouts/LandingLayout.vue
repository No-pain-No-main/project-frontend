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
        <RouterLink to="/login" class="ghost-button">Iniciar sesión</RouterLink>
        <RouterLink to="/register" class="primary-button">Registrarse</RouterLink>
      </nav>
    </header>

    <main class="landing-content">
      <RouterView />
    </main>

    <footer class="landing-footer">
      <div class="landing-footer__brand">
        <img src="/logo.png" alt="FitBook" />
        <div>
          <strong>FitBook</strong>
          <p>Gestión de reservas del gimnasio UNAL sede Bogotá.</p>
        </div>
      </div>

      <nav class="landing-footer__links" aria-label="Enlaces">
        <RouterLink to="/login">Iniciar sesión</RouterLink>
        <RouterLink to="/register">Registrarse</RouterLink>
        <a href="mailto:nopainnomain@unal.edu.co">Contacto</a>
      </nav>

      <p class="landing-footer__legal">
        © {{ currentYear }} No pain - No main() · Universidad Nacional de Colombia
      </p>
    </footer>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
