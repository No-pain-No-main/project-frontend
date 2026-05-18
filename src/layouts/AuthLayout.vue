<template>
  <main class="auth-layout">
    <section class="auth-content">
      <RouterView />
    </section>
  </main>
</template>

<script setup>
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #f4f6f8;
}

.auth-content {
  min-height: 100vh;
}
</style>
