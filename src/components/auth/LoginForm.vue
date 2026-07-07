<template>
  <section class="auth-page">
    <div class="auth-card">
      <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>

      <div class="auth-card__brand">
        <img src="/logo.png" alt="FitBook" />
        <div>
          <p class="section-kicker">FitBook</p>
          <strong>Gimnasio UNAL</strong>
        </div>
      </div>

      <h2>Inicia sesión</h2>
      <p class="muted-text">Accede con tu correo institucional para gestionar tus reservas.</p>

      <p v-if="auth.error" class="form-error">{{ auth.error }}</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="documentNumber">Número de documento</label>
          <input
            id="documentNumber"
            v-model="form.documentNumber"
            type="text"
            required
            autocomplete="username"
            placeholder="1018456789"
          />
        </div>

        <div class="form-field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <button class="primary-button" type="submit" :disabled="auth.loading">
          <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
          {{ auth.loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
      
      <div v-if="isDev" class="dev-shortcut">
        <p class="muted-text">Modo desarrollo — entrar sin backend:</p>
        <div class="dev-shortcut__actions">
          <button class="ghost-button" type="button" @click="handleDemoLogin('estudiante')">
            Demo estudiante
          </button>
          <button class="ghost-button" type="button" @click="handleDemoLogin('admin')">
            Demo administrador
          </button>
        </div>
      </div>

      <p class="auth-card__footer">
        ¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isDev = import.meta.env.DEV

const form = reactive({
  documentNumber: '',
  password: '',
})

function redirectAfterLogin() {
  const redirectTo = route.query.redirect || (auth.isAdmin ? '/admin' : '/student/dashboard')
  router.replace(redirectTo)
}

async function handleSubmit() {
  const success = await auth.login(form)
  if (success) redirectAfterLogin()
}

function handleDemoLogin(role) {
  auth.loginAsDemo(role)
  redirectAfterLogin()
}
</script>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-weight: 700;
  color: var(--blue);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
