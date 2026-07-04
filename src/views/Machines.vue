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

    <div v-if="filteredMachines.length" class="machines-grid">
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

    <!-- Modal: más información -->
    <Modal v-model="showDetails" title="Detalle de la máquina" size="sm">
      <template v-if="selectedMachine">
        <img :src="selectedMachine.image" :alt="selectedMachine.name" class="machine-detail__image" />
        <h3>{{ selectedMachine.name }}</h3>
        <p class="muted-text">{{ selectedMachine.typeLabel }} · Uso máximo {{ selectedMachine.maxTime }}</p>
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

    <!-- Modal: reservar -->
    <Modal v-model="showReserve" title="Reservar máquina" size="sm">
      <template v-if="selectedMachine">
        <p><strong>{{ selectedMachine.name }}</strong></p>
        <p class="muted-text">Selecciona una franja horaria disponible dentro de la semana en curso.</p>

        <div class="timeslot-grid">
          <button
            v-for="slot in timeSlots"
            :key="slot"
            type="button"
            class="timeslot-chip"
            :class="{ 'is-active': slot === selectedSlot }"
            @click="selectedSlot = slot"
          >
            {{ slot }}
          </button>
        </div>

        <Alert v-if="confirmed" tone="success" title="¡Reserva creada!" class="machines-alert">
          Tu máquina quedó reservada en la franja {{ selectedSlot }}. Recuerda confirmar tu asistencia al llegar.
        </Alert>
      </template>

      <template #footer>
        <Button variant="outline" size="sm" @click="closeReserveModal">Cancelar</Button>
        <Button variant="primary" size="sm" :disabled="!selectedSlot" @click="confirmReservation">
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
import { machines, machineTypes, timeSlots } from '../mocks/machines'

const search = ref('')
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.query.q) search.value = String(route.query.q)
})

watch(search, (val) => {
  router.replace({ query: { ...route.query, q: val || undefined } })
})
const typeFilter = ref('todas')

const filterOptions = [{ label: 'Todas', value: 'todas' }, ...machineTypes]

const filteredMachines = computed(() =>
  machines.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesType = typeFilter.value === 'todas' || m.type === typeFilter.value
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

// ── Modal "más información" ─────────────────────────────────────────────
const showDetails = ref(false)
const selectedMachine = ref(null)

function openDetailsModal(machine) {
  selectedMachine.value = machine
  showDetails.value = true
}

// ── Modal de reserva ─────────────────────────────────────────────────────
const showReserve = ref(false)
const selectedSlot = ref('')
const confirmed = ref(false)

function openReserveModal(machine) {
  selectedMachine.value = machine
  selectedSlot.value = ''
  confirmed.value = false
  showReserve.value = true
}

function closeReserveModal() {
  showReserve.value = false
}

function confirmReservation() {
  confirmed.value = true
}
</script>
