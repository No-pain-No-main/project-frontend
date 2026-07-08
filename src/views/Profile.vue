<template>
  <section class="profile-page">
    <h2>Mi perfil</h2>

    <form class="profile-form" @submit.prevent="save">
      <label>
        Nombre
        <input v-model="form.firstName" type="text" placeholder="Tu nombre" />
      </label>

      <label>
        Apellido
        <input v-model="form.lastName" type="text" placeholder="Tu apellido" />
      </label>

      <label>
        Correo
        <input v-model="form.email" type="email" placeholder="tu@correo.com" />
      </label>

      <p v-if="feedback" class="profile-feedback" :class="feedbackType">{{ feedback }}</p>

      <div class="profile-actions">
        <button class="primary-button" type="submit" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import apiClient from '../services/apiClient'

const auth = useAuthStore()
const saving = ref(false)
const feedback = ref('')
const feedbackType = ref('')

const form = reactive({
  firstName: auth.user?.nombre?.split(' ')[0] || '',
  lastName: auth.user?.nombre?.split(' ').slice(1).join(' ') || '',
  email: auth.user?.email || '',
})

async function save() {
  saving.value = true
  feedback.value = ''

  const role = auth.role
  const doc = auth.user?.documentNumber
  const endpoint = role === 'admin' ? '/administrators' : '/students'

  try {
    const { data } = await apiClient.put(`${endpoint}/${doc}`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    })

    auth.user = {
      ...auth.user,
      nombre: `${data.firstName || form.firstName} ${data.lastName || form.lastName}`.trim(),
      email: data.email || form.email,
    }
    localStorage.setItem('fitbook_user', JSON.stringify(auth.user))
    feedback.value = 'Perfil actualizado correctamente.'
    feedbackType.value = 'success'
  } catch (err) {
    feedback.value = err?.response?.data || 'Error al guardar los cambios.'
    feedbackType.value = 'error'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
}
.profile-form {
  display: grid;
  gap: 12px;
}
.profile-form label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}
.profile-form input {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(15,23,42,0.08);
}
.profile-form input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}
.profile-actions { margin-top: 12px }
.profile-feedback { font-weight: 700; }
.profile-feedback.success { color: #047857; }
.profile-feedback.error { color: #b91c1c; }
</style>
