<template>
  <section class="machines-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Máquinas</p>
        <h3>Reservar máquina</h3>
      </div>
    </div>

    <div class="machines-toolbar">
      <SearchBar v-model="search" placeholder="Buscar máquina..." />
      <FilterBar v-model="typeFilter" :options="filterOptions" />
    </div>

    <div v-if="loading" class="machines-empty">Cargando máquinas…</div>

    <div v-else-if="filteredMachines.length" class="machines-grid">
      <MachineCard
        v-for="machine in filteredMachines"
        :key="machine.id"
        :machine="machine"
        mode="student"
        @reserve="openReserveModal"
        @details="openDetailsModal"
      />
    </div>

    <EmptyState
      v-else
      :icon="['fas', 'dumbbell']"
      title="No encontramos máquinas"
      description="Prueba con otro nombre o cambia el filtro de tipo."
    />

    <Modal v-model="showDetails" title="Detalle de la máquina" size="sm">
      <template v-if="selectedMachine">
        <img :src="selectedMachine.image" :alt="selectedMachine.name" class="machine-detail__image" />
        <h3>{{ selectedMachine.name }}</h3>
        <p class="muted-text">{{ selectedMachine.typeLabel }}</p>
        <Badge :tone="statusTone(selectedMachine.status)">{{ statusLabel(selectedMachine.status) }}</Badge>
      </template>
      <template #footer>
        <Button variant="outline" size="sm" @click="showDetails = false">Cerrar</Button>
        <Button
          variant="primary"
          size="sm"
          :disabled="selectedMachine?.status !== 'disponible'"
          @click="showDetails = false; openReserveModal(selectedMachine)"
        >
          Reservar
        </Button>
      </template>
    </Modal>

    <Modal v-model="showReserve" title="Reservar máquina" size="sm">
      <template v-if="selectedMachine">
        <p><strong>{{ selectedMachine.name }}</strong></p>
        <p class="muted-text">Elige un día de la semana actual y una franja de 30 minutos disponible.</p>

        <div class="week-picker">
          <button
            v-for="day in weekDays"
            :key="day.value"
            type="button"
            class="week-picker__day"
            :class="{ 'is-active': day.value === selectedDate }"
            @click="selectedDate = day.value"
          >
            <span>{{ day.label }}</span>
            <small>{{ day.short }}</small>
          </button>
        </div>

        <div v-if="loadingSlots" class="machines-empty">Consultando franjas…</div>
        <div v-else-if="availableSlots.length" class="timeslot-grid">
          <button
            v-for="slot in availableSlots"
            :key="slot.name"
            type="button"
            class="timeslot-chip"
            :class="{ 'is-active': selectedSlot?.name === slot.name }"
            @click="selectedSlot = slot"
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
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '../components/ui/SearchBar.vue'
import FilterBar from '../components/ui/FilterBar.vue'
import Modal from '../components/ui/Modal.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Alert from '../components/ui/Alert.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import MachineCard from '../components/cards/MachineCard.vue'
import { useAuthStore } from '../stores/auth'
import * as reservationService from '../services/reservationService'

const auth = useAuthStore()
const search = ref('')
const route = useRoute()
const router = useRouter()

const machines = ref([])
const loading = ref(false)
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

onMounted(() => {
  if (route.query.q) search.value = String(route.query.q)
  loadMachines()
})

watch(search, (val) => {
  router.replace({ query: { ...route.query, q: val || undefined } })
})

watch(selectedDate, () => {
  if (selectedMachine.value) loadAvailability()
})

const typeFilter = ref('todas')
const filterOptions = [
  { label: 'Todas', value: 'todas' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Fuerza libre', value: 'fuerza-libre' },
  { label: 'Máquina guiada', value: 'guiada' },
  { label: 'Funcional', value: 'funcional' },
]

const filteredMachines = computed(() =>
  machines.value.filter((machine) => {
    const matchesSearch = machine.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesType = typeFilter.value === 'todas' || machine.type === typeFilter.value
    return matchesSearch && matchesType
  }),
)

const statusMap = {
  disponible: { tone: 'success', label: 'Disponible' },
  reservada: { tone: 'warning', label: 'Reservada' },
  inactiva: { tone: 'danger', label: 'Inactiva' },
}
const statusTone = (status) => statusMap[status]?.tone || 'neutral'
const statusLabel = (status) => statusMap[status]?.label || status

const showDetails = ref(false)
const selectedMachine = ref(null)

function openDetailsModal(machine) {
  selectedMachine.value = machine
  showDetails.value = true
}

const showReserve = ref(false)
const selectedSlot = ref(null)
const confirmed = ref(false)

async function loadMachines() {
  loading.value = true
  try {
    machines.value = await reservationService.fetchMachines()
  } finally {
    loading.value = false
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
  } finally {
    loadingSlots.value = false
  }
}

async function openReserveModal(machine) {
  selectedMachine.value = machine
  selectedSlot.value = null
  confirmed.value = false
  feedback.value = ''
  showReserve.value = true
  selectedDate.value = getDefaultDateValue()
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
      confirmed.value = true
      feedback.value = `Tu reserva quedó creada para ${selectedDate.value} en la franja ${selectedSlot.value.name}.`
      feedbackTone.value = 'success'
      feedbackTitle.value = '¡Reserva creada!'
      await loadAvailability()
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
