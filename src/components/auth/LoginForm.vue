<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <h1>Bienvenido</h1>
      <p>Gimnasio UNAL - Sede Bogotá</p>
    </div>

    <AppInput
      id="documento"
      v-model="form.documento"
      label="Número de Documento"
      placeholder="Ingrese su documento"
      required
    />

    <AppInput
      id="password"
      v-model="form.password"
      label="Contraseña"
      type="password"
      placeholder="********"
      required
    />

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <AppButton type="submit" :disabled="loading">
      {{ loading ? 'Ingresando...' : 'Ingresar al Sistema' }}
    </AppButton>

    <p class="register-text">
      ¿No tienes cuenta?
      <RouterLink to="/register">Regístrate aquí</RouterLink>
    </p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '../common/AppInput.vue'
import AppButton from '../common/AppButton.vue'

const router = useRouter()

const form = reactive({
  documento: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  setTimeout(() => {
    loading.value = false

    if (!form.documento || !form.password) {
      errorMessage.value = 'Debe ingresar documento y contraseña.'
      return
    }

    /*
      TODO:
      Cuando el backend tenga endpoint de login,
      aquí se reemplaza la simulación por authService.login().
    */

    if (form.documento === 'admin') {
      router.push('/admin')
    } else {
      router.push('/student')
    }
  }, 600)
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 390px;
  background-color: white;
  padding: 36px;
  border-radius: 8px;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 5px solid #142033;
}

.form-header {
  text-align: center;
  margin-bottom: 8px;
}

.form-header h1 {
  margin: 0;
  font-size: 28px;
  color: #142033;
}

.form-header p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.register-text {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.register-text a {
  color: #142033;
  font-weight: 700;
}
</style>
