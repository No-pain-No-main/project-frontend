<template>
  <form class="machine-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <h1>Registrar Máquina</h1>
      <p>Agrega una nueva máquina al inventario del gimnasio.</p>
    </div>

    <div class="form-grid">
      <AppInput
        id="machineId"
        v-model="form.id"
        label="ID Máquina"
        placeholder="ELP-001"
        required
      />

      <AppInput
        id="machineName"
        v-model="form.name"
        label="Nombre"
        placeholder="Elíptica"
        required
      />

      <AppSelect
        id="machineStatus"
        v-model="form.status"
        label="Estado"
        placeholder="Seleccione"
        :options="statusOptions"
        required
      />

      <AppSelect
        id="machineType"
        v-model="form.type"
        label="Tipo"
        placeholder="Seleccione"
        :options="typeOptions"
        required
      />
    </div>

    <div class="textarea-group">
      <label for="technicalComponents">Componentes Técnicos</label>
      <textarea
        id="technicalComponents"
        v-model="form.technicalComponents"
        placeholder="Ingrese componentes separados por comas. Ej: Motor, Cable de acero, Pantalla"
      ></textarea>
    </div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <AppButton type="submit" :disabled="loading">
      {{ loading ? 'Registrando...' : 'Registrar Máquina' }}
    </AppButton>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import AppInput from '../common/AppInput.vue'
import AppSelect from '../common/AppSelect.vue'
import AppButton from '../common/AppButton.vue'

const form = reactive({
  id: '',
  name: '',
  status: '',
  type: '',
  technicalComponents: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const statusOptions = [
  { value: 'Activa', label: 'Activa' },
  { value: 'Inactiva', label: 'Inactiva' },
  { value: 'Mantenimiento', label: 'Mantenimiento' }
]

const typeOptions = [
  { value: 'Cardio', label: 'Cardio' },
  { value: 'Fuerza', label: 'Fuerza' },
  { value: 'Funcional', label: 'Funcional' },
  { value: 'Otro', label: 'Otro' }
]

function resetForm() {
  form.id = ''
  form.name = ''
  form.status = ''
  form.type = ''
  form.technicalComponents = ''
}

function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  setTimeout(() => {
    loading.value = false

    if (!form.id || !form.name || !form.status || !form.type) {
      errorMessage.value = 'Debe completar todos los campos obligatorios.'
      return
    }

    /*
      TODO:
      Cuando el backend tenga endpoint de máquinas,
      aquí se reemplaza la simulación por machineService.createMachine().
    */

    successMessage.value = `Máquina ${form.name} (${form.id}) registrada correctamente.`
    resetForm()
  }, 700)
}
</script>

<style scoped>
.machine-form {
  width: 100%;
  max-width: 720px;
  background-color: white;
  padding: 36px;
  border-radius: 8px;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.14);
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-top: 5px solid #142033;
}

.form-header h1 {
  margin: 0;
  color: #142033;
  font-size: 28px;
}

.form-header p {
  margin: 8px 0 0;
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.textarea-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.textarea-group label {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

textarea {
  min-height: 110px;
  resize: vertical;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 14px;
  font-size: 15px;
}

textarea:focus {
  outline: none;
  border-color: #142033;
  box-shadow: 0 0 0 2px rgba(20, 32, 51, 0.12);
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .machine-form {
    padding: 28px;
  }
}
</style>
