<template>
  <section class="auth-page">
    <div class="auth-card register-card">
      <RouterLink to="/" class="back-link">← Volver al inicio</RouterLink>

      <div class="auth-card__brand">
        <img src="/logo.png" alt="FitBook" />
        <div>
          <p class="section-kicker">FitBook</p>
          <strong>Gimnasio UNAL</strong>
        </div>
      </div>

      <div class="register-header">
        <h2>
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          {{ isEdit ? 'Editar perfil' : 'Registro de usuario' }}
        </h2>
        <p class="muted-text">Completa los datos para crear o actualizar tu cuenta.</p>
      </div>

      <div class="progress">
        <div class="progress__bar">
          <div class="progress__fill" :style="{ width: `${(step / 3) * 100}%` }"></div>
        </div>
        <div class="progress__label">Paso {{ step }} / 3</div>
      </div>

      <form class="register-form" @submit.prevent="onSubmit">
        <!-- Paso 1: Información personal -->
        <fieldset v-show="step === 1" class="step">
          <legend><font-awesome-icon :icon="['fas', 'id-badge']" /> Información personal</legend>

          <div class="grid">
            <div class="form-field">
              <label>Nombre(s) *</label>
              <input v-model="form.nombres" type="text" :class="fieldClass('nombres')" />
              <small v-if="errors.nombres" class="field-error">{{ errors.nombres }}</small>
            </div>

            <div class="form-field">
              <label>Segundo nombre</label>
              <input v-model="form.segundoNombre" type="text" />
            </div>

            <div class="form-field">
              <label>Primer apellido *</label>
              <input v-model="form.primerApellido" type="text" :class="fieldClass('primerApellido')" />
              <small v-if="errors.primerApellido" class="field-error">{{ errors.primerApellido }}</small>
            </div>

            <div class="form-field">
              <label>Segundo apellido</label>
              <input v-model="form.segundoApellido" type="text" />
            </div>

            <div class="form-field">
              <label>Fecha de nacimiento *</label>
              <input v-model="form.fechaNacimiento" type="date" :class="fieldClass('fechaNacimiento')" />
              <small v-if="errors.fechaNacimiento" class="field-error">{{ errors.fechaNacimiento }}</small>
            </div>

            <div class="form-field">
              <label>Género</label>
              <select v-model="form.genero">
                <option value="">-- Selecciona --</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
                <option>Prefiero no decir</option>
              </select>
            </div>
          </div>
        </fieldset>

        <!-- Paso 2: Información académica -->
        <fieldset v-show="step === 2" class="step">
          <legend><font-awesome-icon :icon="['fas', 'graduation-cap']" /> Información académica</legend>

          <div class="grid">
            <div class="form-field">
              <label>Tipo de documento *</label>
              <select v-model="form.tipoDocumento" :class="fieldClass('tipoDocumento')">
                <option value="">-- Selecciona --</option>
                <option value="cc">Cédula de ciudadanía</option>
                <option value="ti">Tarjeta de identidad</option>
                <option value="ce">Cédula de extranjería</option>
              </select>
              <small v-if="errors.tipoDocumento" class="field-error">{{ errors.tipoDocumento }}</small>
            </div>

            <div class="form-field">
              <label>Número de documento *</label>
              <input v-model="form.numeroDocumento" type="text" :class="fieldClass('numeroDocumento')" />
              <small v-if="errors.numeroDocumento" class="field-error">{{ errors.numeroDocumento }}</small>
            </div>

            <div class="form-field">
              <label>Correo institucional (@unal.edu.co) *</label>
              <input v-model="form.email" type="email" placeholder="tu@unal.edu.co" :class="fieldClass('email')" />
              <small v-if="errors.email" class="field-error">{{ errors.email }}</small>
            </div>

            <div class="form-field">
              <label>Número de teléfono</label>
              <input v-model="form.telefono" type="tel" />
            </div>
          </div>
        </fieldset>

        <!-- Paso 3: Seguridad -->
        <fieldset v-show="step === 3" class="step">
          <legend><font-awesome-icon :icon="['fas', 'lock']" /> Seguridad</legend>

          <div class="grid">
            <div class="form-field">
              <label>Contraseña *</label>
              <input v-model="form.password" type="password" :class="fieldClass('password')" />
              <small class="muted-text">Mínimo 8 caracteres, incluye letras y números.</small>
              <div class="password-meter">
                <div class="meter-bar" :class="passwordStrengthClass" :style="{ width: passwordScore + '%' }"></div>
              </div>
              <small v-if="errors.password" class="field-error">{{ errors.password }}</small>
            </div>

            <div class="form-field">
              <label>Confirmar contraseña *</label>
              <input v-model="form.passwordConfirm" type="password" :class="fieldClass('passwordConfirm')" />
              <small v-if="errors.passwordConfirm" class="field-error">{{ errors.passwordConfirm }}</small>
            </div>

            <div class="form-field">
              <label>Frase secreta (recuperación)</label>
              <input v-model="form.fraseSecreta" type="text" />
            </div>

            <div class="form-field checkbox-field">
              <label>
                <input type="checkbox" v-model="form.acceptTerms" /> Acepto los <a href="#">términos y condiciones</a> *
              </label>
              <small v-if="errors.acceptTerms" class="field-error">{{ errors.acceptTerms }}</small>
            </div>
          </div>
        </fieldset>

        <div class="actions">
          <button type="button" class="ghost-button" @click="prevStep" :disabled="step===1">Anterior</button>
          <button v-if="step < 3" type="button" class="primary-button" @click="nextStep">Siguiente</button>
          <button v-else type="submit" class="primary-button">{{ isEdit ? 'Guardar cambios' : 'Crear cuenta' }}</button>
        </div>
      </form>

      <p class="auth-card__footer">
        ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  isEdit: { type: Boolean, default: false },
  initialData: { type: Object, default: () => ({}) },
})

const auth = useAuthStore()
const router = useRouter()

const step = ref(1)
function setStep(n) { step.value = n }
function stepNumber() { return step.value }

const stepProxy = computed({ get: () => step.value, set: (v) => (step.value = v) })

const form = reactive({
  nombres: props.initialData.nombres || '',
  segundoNombre: props.initialData.segundoNombre || '',
  primerApellido: props.initialData.primerApellido || '',
  segundoApellido: props.initialData.segundoApellido || '',
  fechaNacimiento: props.initialData.fechaNacimiento || '',
  genero: props.initialData.genero || '',
  tipoDocumento: props.initialData.tipoDocumento || '',
  numeroDocumento: props.initialData.numeroDocumento || '',
  email: props.initialData.email || '',
  telefono: props.initialData.telefono || '',
  password: '',
  passwordConfirm: '',
  fraseSecreta: props.initialData.fraseSecreta || '',
  acceptTerms: false,
})

const errors = reactive({})

function validateStep(current) {
  // reset errors for step
  Object.keys(errors).forEach((k) => delete errors[k])
  if (current === 1) {
    if (!form.nombres) errors.nombres = 'Requerido'
    if (!form.primerApellido) errors.primerApellido = 'Requerido'
    if (!form.fechaNacimiento) errors.fechaNacimiento = 'Requerido'
  }
  if (current === 2) {
    if (!form.tipoDocumento) errors.tipoDocumento = 'Requerido'
    if (!form.numeroDocumento) errors.numeroDocumento = 'Requerido'
    if (!form.email) errors.email = 'Requerido'
    else if (!/^[^@\s]+@unal\.edu\.co$/.test(form.email)) errors.email = 'Debes usar correo @unal.edu.co'
  }
  if (current === 3) {
    if (!form.password || form.password.length < 8) errors.password = 'Mínimo 8 caracteres'
    if (form.password !== form.passwordConfirm) errors.passwordConfirm = 'No coincide'
    if (!form.acceptTerms && !props.isEdit) errors.acceptTerms = 'Debes aceptar los términos'
  }
  return Object.keys(errors).length === 0
}

function fieldClass(name) {
  return errors[name] ? 'input-error' : ''
}

function nextStep() {
  if (validateStep(step.value)) step.value = Math.min(3, step.value + 1)
}

function prevStep() {
  step.value = Math.max(1, step.value - 1)
}

function passwordScoreCalc(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score += 30
  if (/[A-Z]/.test(pw)) score += 20
  if (/[0-9]/.test(pw)) score += 25
  if (/[^A-Za-z0-9]/.test(pw)) score += 25
  return Math.min(100, score)
}

const passwordScore = computed(() => passwordScoreCalc(form.password))
const passwordStrengthClass = computed(() => {
  if (passwordScore.value < 40) return 'weak'
  if (passwordScore.value < 75) return 'medium'
  return 'strong'
})

async function onSubmit() {
  if (!validateStep(3)) return

  if (props.isEdit) {
    auth.user = { ...auth.user, ...form }
    localStorage.setItem('fitbook_user', JSON.stringify(auth.user))
    return
  }

  const documentTypeId = form.tipoDocumento === 'cc' ? 1 : form.tipoDocumento === 'ce' ? 2 : 1
  const genderId = form.genero === 'Masculino' ? 1 : form.genero === 'Femenino' ? 2 : form.genero === 'Otro' ? 3 : 3

  const payload = {
    documentNumber: form.numeroDocumento,
    firstName: form.nombres,
    middleName: form.segundoNombre || '',
    lastName: form.primerApellido,
    secondLastName: form.segundoApellido || '',
    email: form.email,
    documentType: { id: documentTypeId },
    birthDate: form.fechaNacimiento,
    phone: form.telefono || '',
    gender: { id: genderId },
    userStatus: { id: 1 },
    passwordHash: form.password,
  }

  const success = await auth.register(payload)
  if (success) router.replace({ path: '/login', query: { registered: '1' } })
}

const stepValue = step

const passwordScorePercent = passwordScore

const isEdit = props.isEdit

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

.register-card { max-width: 820px; margin: 24px auto; padding: 20px; border-radius: 14px; box-shadow: 0 18px 40px rgba(13, 38, 76, 0.08); background: #fff; }
.register-header h2 { display:flex; align-items:center; gap:10px; font-size:1.4rem }
.progress { display:flex; align-items:center; gap:12px; margin: 12px 0 18px }
.progress__bar { flex:1; height:8px; background: #eef4ff; border-radius: 999px; overflow:hidden }
.progress__fill { height:100%; background: linear-gradient(90deg,var(--blue), #2fd1a1); transition: width 0.4s ease }
.progress__label { min-width:70px; font-weight:700; color:var(--muted) }
.register-form { display:flex; flex-direction:column; gap:12px }
.step { border:0; padding:0 }
.grid { display:grid; grid-template-columns: repeat(2, 1fr); gap:12px }
.form-field { display:flex; flex-direction:column }
.form-field input, .form-field select { padding:10px 12px; border-radius:10px; border:1px solid rgba(15,23,42,0.06) }
.input-error { border-color: var(--red) !important }
.field-error { color: var(--red); font-size:0.85rem }
.password-meter { height:8px; background: #f1f5f9; border-radius:8px; margin-top:8px; overflow:hidden }
.meter-bar { height:100%; transition: width 0.2s ease }
.meter-bar.weak { background: var(--red) }
.meter-bar.medium { background: #f59e0b }
.meter-bar.strong { background: #10b981 }
.actions { display:flex; gap:10px; justify-content:flex-end; margin-top:10px }
.checkbox-field label { display:flex; align-items:center; gap:8px }

@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr }
  .register-card { margin:12px; padding:16px }
  .actions { justify-content: space-between }
}
</style>
