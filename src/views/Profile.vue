<template>
  <section class="profile-page">
    <h2>Mi perfil</h2>

    <form class="profile-form" @submit.prevent="save">
      <label>
        Nombre
        <input v-model="form.nombre" type="text" placeholder="Tu nombre" />
      </label>

      <label>
        Correo
        <input v-model="form.email" type="email" placeholder="tu@correo.com" />
      </label>

      <label>
        Teléfono
        <input v-model="form.telefono" type="text" placeholder="Opcional" />
      </label>

      <div class="profile-actions">
        <button class="primary-button" type="submit">Guardar cambios</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const form = reactive({
  nombre: auth.user?.nombre || '',
  email: auth.user?.email || '',
  telefono: auth.user?.telefono || '',
})

function save() {
  auth.user = { ...auth.user, nombre: form.nombre, email: form.email, telefono: form.telefono }
  localStorage.setItem('fitbook_user', JSON.stringify(auth.user))
  console.log('Perfil actualizado', auth.user)
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
.profile-actions { margin-top: 12px }
</style>
