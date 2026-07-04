<template>
  <section class="page-404">
    <div class="page-card soft-card">
      <h1>404</h1>
      <p>Ups, esta página no existe.</p>
      <p>Prueba volver al inicio o revisa que la URL esté bien escrita.</p>
      <router-link to="/" class="button primary">Ir al inicio</router-link>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.page-404 {
  min-height: calc(100vh - 140px);
  display: grid;
  place-items: center;
  padding: 40px 16px;
}
.page-card {
  width: min(520px, 100%);
  text-align: center;
  padding: 32px 28px;
}
.page-card h1 {
  font-size: clamp(4rem, 7vw, 6rem);
  margin-bottom: 18px;
}
.page-card p {
  margin: 0 0 12px;
  color: #4b5563;
}
.button.primary {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  border-radius: 999px;
  background: #4f46e5;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  margin-top: 14px;
}
</style>
