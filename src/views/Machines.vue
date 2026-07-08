<template>
  <section class="machines-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Máquinas</p>
        <h3>Reservar máquina</h3>
      </div>
    </div>

    <div class="machines-stepper">
      <div class="machines-stepper__card">
        <p class="section-kicker">Paso 1</p>
        <h4>Selecciona un día</h4>
        <div class="week-picker">
          <button
            v-for="day in weekDays"
            :key="day.value"
            type="button"
            class="week-picker__day"
            :class="{ 'is-active': day.value === selectedDate }"
            @click="selectDate(day.value)"
          >
            <span>{{ day.label }}</span>
            <small>{{ day.short }}</small>
          </button>
        </div>
      </div>

      <div v-if="selectedDate" class="machines-stepper__card">
        <p class="section-kicker">Paso 2</p>
        <h4>Elige una categoría</h4>
        <div v-if="categoriesLoading" class="machines-helper">Consultando categorías…</div>
        <div v-else class="category-picker">
          <button
            v-for="option in categoryOptions"
            :key="option.value"
            type="button"
            class="category-chip"
            :class="{ 'is-active': selectedCategory === option.value }"
            @click="selectCategory(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!selectedDate" class="machines-empty">Elige un día para ver las categorías disponibles.</div>
    <div v-else-if="selectedDate && !selectedCategory" class="machines-empty">Ahora selecciona una categoría para ver las máquinas disponibles.</div>
    <div v-else-if="machinesLoading" class="machines-empty">Cargando máquinas…</div>
    <div v-else-if="machinePageState.items.length" class="machines-results">
      <div class="machines-grid">
        <article v-for="machine in machinePageState.items" :key="machine.id" class="machine-card machine-card--full">
          <div class="machine-card__media">
            <img :src="machine.image || `/maquinas/${defaultImageMap[machine.type] || 'cardio.png'}`" :alt="machine.name" loading="lazy" />
          </div>

          <div class="machine-card__body">
            <p class="machine-card__type">{{ machine.typeLabel || machine.type }}</p>
            <h3>{{ machine.name }}</h3>
          </div>

          <div class="machine-card__actions">
            <Button variant="outline" size="sm" @click="openDetailsModal(machine)">Más información</Button>
            <Button variant="primary" size="sm" @click="openReserveModal(machine)">
              Reservar
            </Button>
          </div>
        </article>
      </div>
    </div>

    <EmptyState
      v-else
      :icon="['fas', 'dumbbell']"
      title="No encontramos máquinas"
      description="Prueba con otra categoría o cambia el día para ver más opciones."
    />

    <Modal v-model="showDetails" title="Detalle de la máquina" size="sm">
      <template v-if="selectedMachine">
        <img :src="selectedMachine.image" :alt="selectedMachine.name" class="machine-detail__image" />
        <h3>{{ selectedMachine.name }}</h3>
        <p class="muted-text">{{ selectedMachine.typeLabel }}</p>
      </template>
      <template #footer>
        <Button variant="outline" size="sm" @click="showDetails = false">Cerrar</Button>
        <Button variant="primary" size="sm" @click="showDetails = false; openReserveModal(selectedMachine)">Reservar</Button>
      </template>
    </Modal>

    <Modal v-model="showReserve" title="Reservar máquina" size="sm">
      <template v-if="selectedMachine">
        <p><strong>{{ selectedMachine.name }}</strong></p>
        <p class="muted-text">Selecciona una franja de 30 minutos disponible para {{ selectedDateLabel }}.</p>

        <div v-if="loadingSlots" class="machines-empty">Consultando franjas…</div>
        <div v-else-if="availableSlots.length" class="timeslot-grid">
          <button
            v-for="slot in availableSlots"
            :key="slot.name"
            type="button"
            class="timeslot-chip"
            :class="{ 'is-active': selectedSlot?.name === slot.name, 'is-occupied': slot.occupied }"
            :disabled="slot.occupied"
            @click="selectSlot(slot)"
          >
            {{ slot.name }}
          </button>
        </div>
        <p v-else class="muted-text">No hay franjas disponibles para este día.</p>

        <Alert v-if="feedback" :tone="feedbackTone" :title="feedbackTitle" class="machines-alert">
          {{ feedback }}
        </Alert>
      </template>

      <template #footer>
        <Button variant="outline" size="sm" @click="closeReserveModal">Cancelar</Button>
        <Button variant="primary" size="sm" :disabled="!selectedSlot || loadingSlots" @click="confirmReservation">
          Confirmar reserva
        </Button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import Button from '../components/ui/Button.vue'
import Alert from '../components/ui/Alert.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import Modal from '../components/ui/Modal.vue'
import { useAuthStore } from '../stores/auth'
import * as reservationService from '../services/reservationService'

const auth = useAuthStore()

const loadingSlots = ref(false)
const availableSlots = ref([])
const feedback = ref('')
const feedbackTone = ref('success')
const feedbackTitle = ref('¡Reserva creada!')

function startOfWeek(date) {
  const target = new Date(date)
  const day = target.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  target.setDate(target.getDate() + mondayOffset)
  target.setHours(0, 0, 0, 0)
  return target
}

function formatDateValue(date) {
  return date.toISOString().slice(0, 10)
}

function buildWeekDays() {
  const base = startOfWeek(new Date())
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(base)
    date.setDate(base.getDate() + index)
    return {
      value: formatDateValue(date),
      label: date.toLocaleDateString('es-CO', { weekday: 'short' }),
      short: date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }),
    }
  })
}

function getDefaultDateValue() {
  const today = new Date()
  const currentWeekStart = startOfWeek(today)
  const day = new Date(today)
  if (day.getDay() === 0 || day.getDay() === 6) {
    return formatDateValue(currentWeekStart)
  }
  return formatDateValue(day)
}

const weekDays = ref(buildWeekDays())
const selectedDate = ref(getDefaultDateValue())
const selectedDateLabel = computed(() => {
  const day = weekDays.value.find((item) => item.value === selectedDate.value)
  return day ? day.label : selectedDate.value
})

const categoryOptions = ref([])
const categoriesLoading = ref(false)
const selectedCategory = ref(null)
const machinesLoading = ref(false)
const machinePageState = ref({ items: [], totalElements: 0, totalPages: 1, page: 0, size: 6 })

const defaultImageMap = {
  caminadora: 'cardio.png',
  eliptica: 'piernas.png',
  'bicicleta-spinning': 'espalda.png',
}

const showDetails = ref(false)
const selectedMachine = ref(null)

function openDetailsModal(machine) {
  selectedMachine.value = machine
  showDetails.value = true
}

const showReserve = ref(false)
const selectedSlot = ref(null)

function selectDate(date) {
  selectedDate.value = date
  selectedCategory.value = null
  selectedMachine.value = null
  selectedSlot.value = null
  machinePageState.value = { items: [], totalElements: 0, totalPages: 1, page: 0, size: 6 }
  feedback.value = ''
}

function selectCategory(value) {
  selectedCategory.value = value
  selectedMachine.value = null
  selectedSlot.value = null
  feedback.value = ''
  loadMachines()
}

function selectSlot(slot) {
  if (slot?.occupied) return
  selectedSlot.value = slot
}

onMounted(() => {
  loadCategories()
})

async function loadCategories() {
  categoriesLoading.value = true
  try {
    const categories = await reservationService.fetchMachineCategories()
    categoryOptions.value = categories
  } finally {
    categoriesLoading.value = false
  }
}

async function loadMachines() {
  if (!selectedDate.value || !selectedCategory.value) {
    machinePageState.value = { items: [], totalElements: 0, totalPages: 1, page: 0, size: 6 }
    return
  }

  machinesLoading.value = true
  try {
    const payload = await reservationService.fetchMachines({
      type: selectedCategory.value,
    })

    machinePageState.value = payload
  } finally {
    machinesLoading.value = false
  }
}

async function loadAvailability() {
  if (!selectedMachine.value || !selectedDate.value) {
    availableSlots.value = []
    return
  }

  loadingSlots.value = true
  try {
    availableSlots.value = await reservationService.fetchAvailability(selectedMachine.value.id, selectedDate.value)
    selectedSlot.value = null
  } catch (error) {
    availableSlots.value = []
    feedback.value = 'No fue posible consultar franjas en este momento. Intenta de nuevo más tarde.'
    feedbackTone.value = 'critical'
    feedbackTitle.value = 'Error de disponibilidad'
  } finally {
    loadingSlots.value = false
  }
}

async function openReserveModal(machine) {
  selectedMachine.value = machine
  selectedSlot.value = null
  feedback.value = ''
  showReserve.value = true
  await loadAvailability()
}

function closeReserveModal() {
  showReserve.value = false
  feedback.value = ''
}

async function confirmReservation() {
  if (!selectedMachine.value || !selectedSlot.value || !selectedDate.value) return

  try {
    const result = await reservationService.createBooking({
      machineId: selectedMachine.value.id,
      date: selectedDate.value,
      timeSlot: selectedSlot.value,
      studentDocumentNumber: auth.user?.documentNumber,
    })

    if (result && typeof result === 'object' && result.id) {
      feedback.value = `Tu reserva quedó creada para ${selectedDateLabel.value} en la franja ${selectedSlot.value.name}.`
      feedbackTone.value = 'success'
      feedbackTitle.value = '¡Reserva creada!'
      selectedSlot.value = null
      return
    }

    feedback.value = typeof result === 'string' ? result : 'No se pudo crear la reserva.'
    feedbackTone.value = 'danger'
    feedbackTitle.value = 'No se pudo reservar'
  } catch (error) {
    feedback.value = error.response?.data?.message || 'No se pudo crear la reserva.'
    feedbackTone.value = 'danger'
    feedbackTitle.value = 'No se pudo reservar'
  }
}
</script>
