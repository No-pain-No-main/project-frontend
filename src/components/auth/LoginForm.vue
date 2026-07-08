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
      <p class="muted-text">Selecciona tu tipo de acceso para entrar al sistema.</p>

      <div class="role-switcher" role="tablist" aria-label="Tipo de acceso">
        <button
          type="button"
          class="role-switcher__button"
          :class="{ active: selectedRole === 'student' }"
          @click="selectRole('student')"
        >
          Estudiante
        </button>
        <button
          type="button"
          class="role-switcher__button"
          :class="{ active: selectedRole === 'admin' }"
          @click="selectRole('admin')"
        >
          Administrador
        </button>
      </div>

      <p v-if="auth.error" class="form-error">{{ auth.error }}</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="documentNumber">{{ selectedRole === 'admin' ? 'Documento del administrador' : 'Número de documento' }}</label>
          <input
            id="documentNumber"
            v-model="form.documentNumber"
            type="text"
            required
            autocomplete="username"
            :placeholder="selectedRole === 'admin' ? '1018456789' : '1018456789'"
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

      <p class="auth-card__footer">
        ¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  documentNumber: '',
  password: '',
})

const selectedRole = ref('student')

function selectRole(role) {
  selectedRole.value = role
  auth.error = null
}

function redirectAfterLogin() {
  const redirectTo = route.query.redirect || (selectedRole.value === 'admin' ? '/admin' : '/student/dashboard')
  router.replace(redirectTo)
}

async function handleSubmit() {
  const success = await auth.login(form, selectedRole.value)
  if (success) redirectAfterLogin()
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

.role-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 16px 0 8px;
}

.role-switcher__button {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-switcher__button.active {
  background: var(--blue);
  border-color: var(--blue);
  color: white;
}
</style>
