<template>
  <section class="admin-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Administración</p>
        <h3>Gestión de usuarios</h3>
      </div>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td><span :class="['status-chip', user.status]">{{ user.status }}</span></td>
          <td class="actions-cell">
            <button class="ghost-button" @click="editUser(user)">Editar</button>
            <button class="ghost-button" :class="user.status === 'Activo' ? 'danger' : 'secondary'" @click="toggleUserStatus(user)">
              {{ user.status === 'Activo' ? 'Deshabilitar' : 'Habilitar' }}
            </button>
            <button class="ghost-button danger" @click="confirmDeleteUser(user)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal v-model="showForm" :title="editingUser ? 'Editar usuario' : 'Nuevo usuario'" size="md">
      <div class="admin-form">
        <Input v-model="form.name" label="Nombre" placeholder="Ej. Laura Gómez" />
        <Input v-model="form.email" label="Correo electrónico" placeholder="Ej. laura.gomez@unal.edu.co" />
        <Select v-model="form.role" label="Rol" :options="roleOptions" placeholder="Selecciona un rol" />
      </div>

      <template #footer>
        <Button variant="outline" size="sm" @click="showForm = false">Cancelar</Button>
        <Button variant="primary" size="sm" :disabled="!canSave" @click="saveUser">Guardar</Button>
      </template>
    </Modal>

    <Modal v-model="showDeleteConfirm" title="Eliminar usuario" size="sm">
      <p v-if="userToDelete">
        ¿Estás seguro de eliminar a <strong>{{ userToDelete.name }}</strong>? Esta acción es irreversible en la simulación.
      </p>
      <template #footer>
        <Button variant="outline" size="sm" @click="showDeleteConfirm = false">Cancelar</Button>
        <Button variant="danger" size="sm" @click="deleteUser">Eliminar</Button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Select from '../../components/ui/Select.vue'
import Modal from '../../components/ui/Modal.vue'

const users = reactive([
  { id: 1, name: 'Laura Gómez', email: 'laura.gomez@unal.edu.co', role: 'Estudiante', status: 'Activo' },
  { id: 2, name: 'Carlos Díaz', email: 'carlos.diaz@unal.edu.co', role: 'Estudiante', status: 'Activo' },
  { id: 3, name: 'María Ramírez', email: 'maria.ramirez@unal.edu.co', role: 'Estudiante', status: 'Inactivo' },
  { id: 4, name: 'Admin Demo', email: 'admin@unal.edu.co', role: 'Administrador', status: 'Activo' },
])

const showForm = ref(false)
const showDeleteConfirm = ref(false)
const editingUser = ref(null)
const userToDelete = ref(null)

const roleOptions = [
  { label: 'Estudiante', value: 'Estudiante' },
  { label: 'Administrador', value: 'Administrador' },
]

const form = reactive({ name: '', email: '', role: '' })

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const canSave = computed(() => form.name.trim().length > 0 && emailValid.value && form.role)

function editUser(user) {
  editingUser.value = user
  Object.assign(form, { name: user.name, email: user.email, role: user.role })
  showForm.value = true
}

function saveUser() {
  if (!canSave.value) return

  if (editingUser.value) {
    Object.assign(editingUser.value, { ...form })
  }
  showForm.value = false
}

function toggleUserStatus(user) {
  user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo'
}

function confirmDeleteUser(user) {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

function deleteUser() {
  const index = users.findIndex((item) => item.id === userToDelete.value?.id)
  if (index !== -1) users.splice(index, 1)
  showDeleteConfirm.value = false
}
</script>

<style scoped>
.admin-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
.admin-table th, .admin-table td { padding: 14px 12px; text-align: left; border-bottom: 1px solid rgba(15,23,42,0.08); }
.status-chip { padding: 6px 10px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; }
.status-chip.Activo { background: rgba(16,185,129,0.12); color: #047857; }
.status-chip.Inactivo { background: rgba(239,68,68,0.12); color: #991b1b; }
.admin-table tbody tr:hover { background: rgba(47,111,237,0.05); }
.admin-form { display: grid; gap: 16px; margin-top: 8px; }
button.danger { color: var(--red); }
</style>
