<template>
  <section class="machines-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Administración</p>
        <h3>Gestión de máquinas</h3>
      </div>
      <Button variant="primary" :icon="['fas', 'plus']" @click="openCreateModal">
        Registrar máquina
      </Button>
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
        mode="admin"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @toggle-status="toggleStatus"
      />
    </div>

    <EmptyState
      v-else
      :icon="['fas', 'dumbbell']"
      title="No hay máquinas que coincidan"
      description="Prueba con otro nombre o cambia el filtro de tipo."
    />

    <Modal v-model="showForm" :title="editingMachine ? 'Editar máquina' : 'Registrar máquina'" size="md">
      <div class="admin-form">
        <Input v-model="form.name" label="Nombre" placeholder="Ej. Caminadora Matrix T50" />
        <Select v-model="form.type" label="Tipo" :options="machineTypes" placeholder="Selecciona un tipo" />
        <Select v-model="form.status" label="Estado" :options="machineStatuses" placeholder="Selecciona un estado" />
        <Input v-model="form.maxTime" label="Tiempo máximo de uso" placeholder="Ej. 30 min" />
        <Input v-model="form.image" label="Imagen (URL)" placeholder="/maquinas/nombre.jpg" />
      </div>

      <template #footer>
        <Button variant="outline" size="sm" @click="showForm = false">Cancelar</Button>
        <Button variant="primary" size="sm" @click="saveMachine">Guardar</Button>
      </template>
    </Modal>

    <Modal v-model="showDeleteConfirm" title="Eliminar máquina" size="sm">
      <p v-if="machineToDelete">
        ¿Seguro que quieres eliminar <strong>{{ machineToDelete.name }}</strong> del catálogo?
        Esta acción no se puede deshacer y la máquina dejará de aparecer para los estudiantes (RF_9).
      </p>
      <template #footer>
        <Button variant="outline" size="sm" @click="showDeleteConfirm = false">Cancelar</Button>
        <Button variant="danger" size="sm" @click="confirmDelete">Sí, eliminar</Button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import SearchBar from '../../components/ui/SearchBar.vue'
import FilterBar from '../../components/ui/FilterBar.vue'
import Modal from '../../components/ui/Modal.vue'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Select from '../../components/ui/Select.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import MachineCard from '../../components/cards/MachineCard.vue'
import { machines, machineTypes, machineStatuses } from '../../mocks/machines'

const machineList = reactive([...machines])

const search = ref('')
const typeFilter = ref('todas')
const filterOptions = [{ label: 'Todas', value: 'todas' }, ...machineTypes]

const filteredMachines = computed(() =>
  machineList.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesType = typeFilter.value === 'todas' || m.type === typeFilter.value
    return matchesSearch && matchesType
  }),
)

const showForm = ref(false)
const editingMachine = ref(null)
const form = reactive({ name: '', type: '', status: 'disponible', maxTime: '', image: '' })

function openCreateModal() {
  editingMachine.value = null
  Object.assign(form, { name: '', type: '', status: 'disponible', maxTime: '', image: '' })
  showForm.value = true
}

function openEditModal(machine) {
  editingMachine.value = machine
  Object.assign(form, {
    name: machine.name,
    type: machine.type,
    status: machine.status,
    maxTime: machine.maxTime,
    image: machine.image,
  })
  showForm.value = true
}

function saveMachine() {
  const typeLabel = machineTypes.find((t) => t.value === form.type)?.label || form.type

  if (editingMachine.value) {
    Object.assign(editingMachine.value, { ...form, typeLabel })
  } else {
    machineList.push({
      id: Date.now(),
      ...form,
      typeLabel,
    })
  }
  showForm.value = false
}

// ── Cambiar estado ────────────────────────────
function toggleStatus(machine) {
  machine.status = machine.status === 'inactiva' ? 'disponible' : 'inactiva'
}

// ── Eliminar ───────────────────────────────────────────────────────
const showDeleteConfirm = ref(false)
const machineToDelete = ref(null)

function openDeleteModal(machine) {
  machineToDelete.value = machine
  showDeleteConfirm.value = true
}

function confirmDelete() {
  const index = machineList.findIndex((m) => m.id === machineToDelete.value.id)
  if (index !== -1) machineList.splice(index, 1)
  showDeleteConfirm.value = false
}
</script>
