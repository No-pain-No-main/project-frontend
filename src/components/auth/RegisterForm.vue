<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <h1>Registro de Estudiante</h1>
      <p>Gimnasio UNAL</p>
    </div>

    <div class="form-grid">
      <AppInput
        id="nombres"
        v-model="form.nombres"
        label="Nombres"
        placeholder="Ingrese sus nombres"
        required
      />

      <AppInput
        id="apellidos"
        v-model="form.apellidos"
        label="Apellidos"
        placeholder="Ingrese sus apellidos"
        required
      />

      <AppSelect
        id="tipoDocumento"
        v-model="form.tipoDocumento"
        label="Tipo Documento"
        placeholder="Seleccione"
        :options="documentTypes"
        required
      />

      <AppInput
        id="numeroDocumento"
        v-model="form.numeroDocumento"
        label="Número Documento"
        placeholder="Ingrese su documento"
        required
      />

      <AppInput
        id="fechaNacimiento"
        v-model="form.fechaNacimiento"
        label="Fecha de Nacimiento"
        type="date"
        required
      />

      <AppSelect
        id="sexo"
        v-model="form.sexo"
        label="Sexo"
        placeholder="Seleccione"
        :options="sexOptions"
        required
      />
    </div>

    <AppInput
      id="correoInstitucional"
      v-model="form.correoInstitucional"
      label="Correo Institucional"
      type="email"
      placeholder="usuario@unal.edu.co"
      required
    />

    <div class="form-grid">
      <AppInput
        id="telefono"
        v-model="form.telefono"
        label="Teléfono"
        placeholder="Ingrese su teléfono"
      />

      <AppInput
        id="fraseSecreta"
        v-model="form.fraseSecreta"
        label="Frase Secreta (Seguridad)"
        placeholder="Ingrese una frase secreta"
        required
      />
    </div>

    <AppInput
      id="password"
      v-model="form.password"
      label="Contraseña"
      type="password"
      placeholder="Ingrese su contraseña"
      required
    />

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <AppButton type="submit" :disabled="loading">
      {{ loading ? 'Registrando...' : 'Finalizar Registro' }}
    </AppButton>

    <p class="login-text">
      ¿Ya tienes cuenta?
      <RouterLink to="/login">Inicia sesión aquí</RouterLink>
    </p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '../common/AppInput.vue'
import AppSelect from '../common/AppSelect.vue'
import AppButton from '../common/AppButton.vue'

const router = useRouter()

const form = reactive({
  nombres: '',
  apellidos: '',
  tipoDocumento: '',
  numeroDocumento: '',
  fechaNacimiento: '',
  sexo: '',
  correoInstitucional: '',
  telefono: '',
  fraseSecreta: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const documentTypes = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'PAS', label: 'Pasaporte' }
]

const sexOptions = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
  { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo' }
]

function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  setTimeout(() => {
    loading.value = false

    if (
      !form.nombres ||
      !form.apellidos ||
      !form.tipoDocumento ||
      !form.numeroDocumento ||
      !form.fechaNacimiento ||
      !form.sexo ||
      !form.correoInstitucional ||
      !form.fraseSecreta ||
      !form.password
    ) {
      errorMessage.value = 'Debe completar todos los campos obligatorios.'
      return
    }

    /*
      TODO:
      Cuando el backend tenga endpoint de registro,
      aquí se reemplaza la simulación por authService.register().
      El backend deberá validar que el documento sea único.
    */

    successMessage.value = 'Usuario registrado correctamente.'

    setTimeout(() => {
      router.push('/login')
    }, 900)
  }, 700)
}
</script>

<style scoped>
.register-form {
  width: 100%;
  max-width: 660px;
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
  margin-bottom: 8px;
}

.form-header h1 {
  margin: 0;
  font-size: 26px;
  color: #142033;
}

.form-header p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
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

.login-text {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.login-text a {
  color: #142033;
  font-weight: 700;
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .register-form {
    padding: 28px;
  }
}
</style>
