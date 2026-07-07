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
      <p class="muted-text">Selecciona tu tipo de acceso para entrar a la plataforma.</p>

      <p v-if="auth.error" class="form-error">{{ auth.error }}</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="role-selector" role="group" aria-label="Tipo de acceso">
          <button
            type="button"
            class="role-option"
            :class="{ active: form.role === 'estudiante' }"
            @click="form.role = 'estudiante'"
          >
            <span class="role-title">Estudiante</span>
            <span class="role-description">Reservas y seguimiento</span>
          </button>
          <button
            type="button"
            class="role-option"
            :class="{ active: form.role === 'admin' }"
            @click="form.role = 'admin'"
          >
            <span class="role-title">Administrador</span>
            <span class="role-description">Gestión de usuarios y máquinas</span>
          </button>
        </div>

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
  role: 'estudiante',
})

function redirectAfterLogin() {
  const redirectTo = route.query.redirect || (auth.isAdmin ? '/admin' : '/student/dashboard')
  router.replace(redirectTo)
}

async function handleSubmit() {
  const success = await auth.login({ ...form })
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

.role-selector {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.role-option {
  border: 1px solid #dce4f0;
  border-radius: 12px;
  padding: 12px;
  background: #f8fbff;
  color: var(--text);
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
}

.role-option.active {
  border-color: var(--blue);
  background: #eaf4ff;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

.role-title {
  display: block;
  font-weight: 700;
  margin-bottom: 4px;
}

.role-description {
  display: block;
  font-size: 0.85rem;
  color: #5b6b82;
}
</style>
