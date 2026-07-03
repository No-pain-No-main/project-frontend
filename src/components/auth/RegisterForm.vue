<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-card__brand">
        <img src="/logo.png" alt="FitBook" />
        <div>
          <p class="section-kicker">FitBook</p>
          <strong>Gimnasio UNAL</strong>
        </div>
      </div>

      <h2>Crea tu cuenta</h2>
      <p class="muted-text">Regístrate como estudiante para empezar a reservar máquinas.</p>

      <p v-if="auth.error" class="form-error">{{ auth.error }}</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="nombre">Nombre completo</label>
          <input id="nombre" v-model="form.nombre" type="text" required autocomplete="name" />
        </div>

        <div class="form-field">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            placeholder="tu.correo@unal.edu.co"
          />
        </div>

        <div class="form-field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <!--
          No se deja elegir rol en un formulario público: todo registro
          nuevo entra como "estudiante" por defecto. Las cuentas admin se
          crean aparte (seed en backend, panel interno o invitación).
        -->

        <button class="primary-button" type="submit" :disabled="auth.loading">
          <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
          {{ auth.loading ? 'Creando cuenta...' : 'Registrarme' }}
        </button>
      </form>

      <p class="auth-card__footer">
        ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  nombre: '',
  email: '',
  password: '',
})

async function handleSubmit() {
  const success = await auth.register(form)
  if (success) router.push('/student/dashboard')
}
</script>
