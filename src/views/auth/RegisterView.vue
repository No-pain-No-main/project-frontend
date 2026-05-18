<template>
  <section class="register-view">
    <RegisterForm />
  </section>
</template>

<script setup>
import RegisterForm from '../../components/auth/RegisterForm.vue'
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  padding: 32px 24px;
}
</style>
