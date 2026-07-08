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

      <div class="role-toggle">
        <button
          :class="['role-btn', { active: selectedRole === 'student' }]"
          type="button"
          @click="selectedRole = 'student'"
        >
          <font-awesome-icon :icon="['fas', 'user-graduate']" />
          Estudiante
        </button>
        <button
          :class="['role-btn', { active: selectedRole === 'admin' }]"
          type="button"
          @click="selectedRole = 'admin'"
        >
          <font-awesome-icon :icon="['fas', 'user-tie']" />
          Administrador
        </button>
      </div>

      <h2>Inicia sesión</h2>
      <p class="muted-text">
        {{
          selectedRole === 'admin'
            ? 'Ingresa tus credenciales de administrador.'
            : 'Ingresa tus credenciales para entrar al sistema.'
        }}
      </p>

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

      <p v-if="selectedRole === 'student'" class="auth-card__footer">
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

const selectedRole = ref('student')

const form = reactive({
  documentNumber: '',
  password: '',
})

function redirectAfterLogin() {
  if (selectedRole.value === 'admin') {
    router.replace(route.query.redirect || '/admin/dashboard')
  } else {
    router.replace(route.query.redirect || '/student/dashboard')
  }
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

.role-toggle {
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--gray-300);
  margin-bottom: 20px;
}

.role-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  background: var(--gray-100);
  color: var(--gray-600);
  transition: background 0.2s, color 0.2s;
}

.role-btn.active {
  background: var(--blue);
  color: #fff;
}

.role-btn:not(.active):hover {
  background: var(--gray-200);
}
</style>