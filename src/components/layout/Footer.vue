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
        <div class="contact-group">
          <strong>Contacto: </strong>
          <a class="contact-link" :href="`mailto:${contactEmails[0]}`">{{ contactEmails[0] }}</a>
          <span>, </span>
          <a class="contact-link" :href="`mailto:${contactEmails[1]}`">{{ contactEmails[1] }}</a>
          <span>, </span>
          <a class="contact-link" :href="`mailto:${contactEmails[2]}`">{{ contactEmails[2] }}</a>
          <span>, </span>
          <a class="contact-link" :href="`mailto:${contactEmails[3]}`">{{ contactEmails[3] }}</a>
          <span>, </span>
          <a class="contact-link" :href="`mailto:${contactEmails[4]}`">{{ contactEmails[4] }}</a>
        </div>
        <div class="contact-group">
          <strong>Línea de atención: </strong>
          <a class="contact-link" :href="`tel:+57${phoneDigits[0]}`">+57 {{ phoneFormatted[0] }}</a>
          <span>, </span>
          <a class="contact-link" :href="`tel:+57${phoneDigits[1]}`">+57 {{ phoneFormatted[1] }}</a>
        </div>
      </div>
    </nav>

  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
const contactEmails = [
  'segutierrezro@unal.edu.co',
  'yjimenezh@unal.edu.co',
  'mhincapies@unal.edu.co',
  'julramirezdi@unal.edu.co',
  'asanchezq@unal.edu.co',
]
const phoneDigits = ['3202905778', '3107973895']
const phoneFormatted = ['320 290 5778', '310 797 3895']
</script>
