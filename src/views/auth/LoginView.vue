<template>
  <section class="login-view">
    <LoginForm />
  </section>
</template>

<script setup>
import LoginForm from '../../components/auth/LoginForm.vue'
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  padding: 24px;
}
</style>
