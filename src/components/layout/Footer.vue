<template>
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
      <div class="landing-footer__contact">
        <span>Contacto: </span>
        <a class="contact-link" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        <span>, </span>
        <a class="contact-link" :href="`tel:+57${phoneDigits}`">+57 {{ phoneFormatted }}</a>
      </div>
    </nav>

    <p class="landing-footer__legal">
      © {{ currentYear }} No pain - No main() · Universidad Nacional de Colombia
    </p>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
const contactEmail = 'segutierrezro@unal.edu.co'
const phoneDigits = '3202905778'
const phoneFormatted = '320 290 5778'
</script>
