<template>
  <div class="admin-bookings">
    <h1>Gestión de Reservas</h1>
    <p class="muted-text">Administra las reservas del gimnasio.</p>

    <div class="admin-bookings__table-wrap">
      <Table
        :columns="columns"
        :rows="localFiltered"
        :loading="store.bookingsLoading"
        empty-text="No se encontraron reservas."
      >
        <!-- HEADERS con filtros -->
        <template #header-student="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('student')" />
        </template>
        <template #header-machine="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('machine')" />
        </template>
        <template #header-date="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('date')" />
        </template>
        <template #header-time="{ column }">
          {{ column.label }}
        </template>
        <template #header-status="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('status')" />
        </template>
        <template #header-actions="{ column }">
          {{ column.label }}
        </template>

        <!-- CELDAS -->
        <template #cell-student="{ row }">
          <div v-if="row.student">
            <strong>{{ row.student.firstName || '' }} {{ row.student.lastName || '' }}</strong>
            <div class="muted-text small">{{ row.student.documentNumber }}</div>
          </div>
          <span v-else class="muted-text">—</span>
        </template>

        <template #cell-machine="{ row }">
          <span v-if="row.machine">{{ row.machine.name || '—' }}</span>
          <span v-else class="muted-text">—</span>
        </template>

        <template #cell-date="{ row }">
          {{ row.date || '—' }}
        </template>

        <template #cell-time="{ row }">
          {{ row.timeSlot?.name || '—' }}
        </template>

        <template #cell-status="{ row }">
          <span v-if="row.bookingStatus" :class="['badge', statusClass(row.bookingStatus.id)]">
            {{ row.bookingStatus.name }}
          </span>
          <span v-else class="badge badge--gray">Sin estado</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="actions-cell">
            <button class="icon-btn" title="Acciones" @click="toggleMenu($event, row)">
              <font-awesome-icon :icon="['fas', 'pencil']" />
            </button>
          </div>
        </template>
      </Table>
    </div>

    <!-- Menú contextual fijo -->
    <div
      v-if="menuTarget"
      class="actions-menu-fixed"
      :style="{ top: menuPos.top + 'px', left: menuPos.left + 'px' }"
      @click.stop
    >
      <button v-if="canCancel(menuTarget)" @click="executeCancel(menuTarget)">✖️ Cancelar</button>
      <button @click="openEdit(menuTarget)">✏️ Editar estado</button>
      <button v-if="canDelete(menuTarget)" @click="confirmDelete(menuTarget)" class="danger">🗑️ Eliminar</button>
    </div>

    <!-- Filtro Estudiante -->
    <div v-if="activeFilter === 'student'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por estudiante</h4>
        <input v-model="store.filterBookStudent" placeholder="Buscar nombre o documento..." />
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro Máquina -->
    <div v-if="activeFilter === 'machine'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por máquina</h4>
        <input v-model="filterMachine" placeholder="Buscar máquina..." />
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro Fecha (rango) -->
    <div v-if="activeFilter === 'date'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por fecha</h4>
        <label class="filter-label">Desde
          <input type="date" v-model="store.filterBookDateFrom" />
        </label>
        <label class="filter-label">Hasta
          <input type="date" v-model="store.filterBookDateTo" />
        </label>
        <button class="close-btn" @click="clearDateFilters">Limpiar fechas</button>
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro Estado (checkboxes) -->
    <div v-if="activeFilter === 'status'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por estado</h4>
        <label v-for="st in statusOptions" :key="st.id" class="filter-check">
          <input
            type="checkbox"
            :value="st.id"
            :checked="store.filterBookStatuses.includes(st.id)"
            @change="toggleStatusFilter(st.id)"
          />
          {{ st.name }}
        </label>
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Modal Editar Estado -->
    <div v-if="editTarget" class="filter-overlay" @click="closeEdit">
      <div class="filter-popup edit-popup" @click.stop>
        <h4>Cambiar estado de reserva</h4>
        <p class="muted-text">
          Reserva de <strong>{{ editTarget.student?.firstName || '' }} {{ editTarget.student?.lastName || '' }}</strong>
          — Máquina: <strong>{{ editTarget.machine?.name || '—' }}</strong>
        </p>
        <div class="edit-form">
          <label>
            Estado
            <select v-model.number="editStatusId">
              <option v-for="st in statusOptions" :key="st.id" :value="st.id">{{ st.name }}</option>
            </select>
          </label>
        </div>
        <div class="edit-actions">
          <button class="close-btn" @click="closeEdit">Cancelar</button>
          <button class="save-btn" @click="saveEdit">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Confirmación Cancelar -->
    <div v-if="cancelTarget" class="filter-overlay" @click="cancelTarget = null">
      <div class="filter-popup" @click.stop>
        <h4>¿Cancelar reserva?</h4>
        <p>
          Estudiante: <strong>{{ cancelTarget.student?.firstName || '' }} {{ cancelTarget.student?.lastName || '' }}</strong><br />
          Máquina: <strong>{{ cancelTarget.machine?.name || '—' }}</strong><br />
          Fecha: <strong>{{ cancelTarget.date || '—' }}</strong>
        </p>
        <p class="muted-text">La reserva se marcará como cancelada.</p>
        <div class="edit-actions">
          <button class="close-btn" @click="cancelTarget = null">Volver</button>
          <button class="save-btn" @click="confirmCancel">Cancelar reserva</button>
        </div>
      </div>
    </div>

    <!-- Confirmación Eliminar -->
    <div v-if="deleteTarget" class="filter-overlay" @click="deleteTarget = null">
      <div class="filter-popup" @click.stop>
        <h4>¿Eliminar reserva?</h4>
        <p>
          Estudiante: <strong>{{ deleteTarget.student?.firstName || '' }} {{ deleteTarget.student?.lastName || '' }}</strong><br />
          Máquina: <strong>{{ deleteTarget.machine?.name || '—' }}</strong><br />
          Fecha: <strong>{{ deleteTarget.date || '—' }}</strong>
        </p>
        <p class="muted-text">Esta acción no se puede deshacer. Se recomienda cancelar antes de eliminar.</p>
        <div class="edit-actions">
          <button class="close-btn" @click="deleteTarget = null">Volver</button>
          <button class="save-btn danger" @click="executeDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAdminStore } from '../../stores/admin'
import Table from '../../components/ui/Table.vue'
import ColumnFilter from '../../components/ui/ColumnFilter.vue'

const store = useAdminStore()

const columns = [
  { key: 'student', label: 'Estudiante' },
  { key: 'machine', label: 'Máquina' },
  { key: 'date', label: 'Fecha' },
  { key: 'time', label: 'Hora' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: '' },
]

const statusOptions = [
  { id: 1, name: 'Activa' },
  { id: 2, name: 'Cancelada' },
  { id: 3, name: 'Confirmada' },
]

// Filter state
const activeFilter = ref(null)
const filterMachine = ref('')

function toggleFilter(key) {
  activeFilter.value = activeFilter.value === key ? null : key
}

function toggleStatusFilter(id) {
  const current = [...store.filterBookStatuses]
  const idx = current.indexOf(id)
  if (idx === -1) current.push(id)
  else current.splice(idx, 1)
  store.filterBookStatuses = current
}

function clearDateFilters() {
  store.filterBookDateFrom = ''
  store.filterBookDateTo = ''
}

// Action menu
const menuTarget = ref(null)
const menuPos = reactive({ top: 0, left: 0 })

function toggleMenu(event, row) {
  if (menuTarget.value === row) {
    menuTarget.value = null
    return
  }
  const rect = event.currentTarget.getBoundingClientRect()
  menuPos.top = rect.bottom + 4
  menuPos.left = rect.left
  menuTarget.value = row
}

function closeMenu() {
  menuTarget.value = null
}

function handleClickOutside(e) {
  if (menuTarget.value && !e.target.closest('.actions-menu-fixed') && !e.target.closest('.icon-btn')) {
    closeMenu()
  }
}

function canCancel(row) {
  // Solo se puede cancelar si no está ya cancelada
  return row.bookingStatus?.id !== 2
}

function canDelete(row) {
  // Solo se puede eliminar si está cancelada
  return row.bookingStatus?.id === 2
}

// Cancel
const cancelTarget = ref(null)

async function executeCancel(row) {
  closeMenu()
  cancelTarget.value = row
}

async function confirmCancel() {
  if (cancelTarget.value) {
    await store.cancelBooking(cancelTarget.value.id)
    cancelTarget.value = null
  }
}

// Edit status
const editTarget = ref(null)
const editStatusId = ref(1)

function openEdit(row) {
  closeMenu()
  editTarget.value = row
  editStatusId.value = row.bookingStatus?.id || 1
}

function closeEdit() {
  editTarget.value = null
}

async function saveEdit() {
  if (editTarget.value) {
    await store.changeBookingStatus(editTarget.value.id, editStatusId.value)
    closeEdit()
  }
}

// Delete
const deleteTarget = ref(null)

function confirmDelete(row) {
  closeMenu()
  deleteTarget.value = row
}

async function executeDelete() {
  if (deleteTarget.value) {
    // Eliminar del backend (no hay endpoint DELETE bookings, usamos cancel + hidden)
    // Marcamos como cancelada si no lo está, y luego removemos localmente
    if (deleteTarget.value.bookingStatus?.id !== 2) {
      await store.cancelBooking(deleteTarget.value.id)
    }
    // Removemos del array local (el backend DELETE no existe, pero filtramos local)
    store.bookings = store.bookings.filter(b => b.id !== deleteTarget.value.id)
    deleteTarget.value = null
  }
}

function statusClass(id) {
  switch (id) {
    case 1: return 'badge--green'
    case 2: return 'badge--red'
    case 3: return 'badge--blue'
    default: return 'badge--gray'
  }
}

// Computed para filtrar por máquina (filtro local en la vista, no en store)
const localFiltered = computed(() => {
  const rows = store.filteredBookings
  const qMachine = filterMachine.value.toLowerCase().trim()
  if (!qMachine) return rows
  return rows.filter(b => b.machine?.name?.toLowerCase().includes(qMachine))
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (!store.bookings.length) {
    store.loadBookings()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.admin-bookings {
  padding: 24px;
}

.admin-bookings h1 {
  margin-bottom: 4px;
}

.admin-bookings__table-wrap {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: visible;
  margin-top: 20px;
}

.small {
  font-size: 0.8rem;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--green { background: #d4edda; color: #155724; }
.badge--red { background: #f8d7da; color: #721c24; }
.badge--blue { background: #cce5ff; color: #004085; }
.badge--gray { background: #e2e3e5; color: #383d41; }

.actions-cell {
  display: flex;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--gray-600);
  font-size: 1rem;
}

.icon-btn:hover {
  background: var(--gray-100);
  color: var(--blue);
}

.actions-menu-fixed {
  position: fixed;
  z-index: 200;
  background: #fff;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 160px;
  overflow: hidden;
}

.actions-menu-fixed button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.actions-menu-fixed button:hover {
  background: var(--gray-100);
}

.actions-menu-fixed button.danger {
  color: #dc3545;
}

.actions-menu-fixed button.danger:hover {
  background: #f8d7da;
}

.filter-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
}

.filter-popup {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  min-width: 320px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.filter-popup h4 {
  margin-bottom: 16px;
}

.filter-popup input[type="text"],
.filter-popup input[type="date"] {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.filter-check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

.filter-label {
  display: block;
  font-size: 0.9rem;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.filter-label input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 4px;
  box-sizing: border-box;
}

.close-btn {
  padding: 8px 16px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 8px;
}

.close-btn:hover {
  background: var(--gray-100);
}

.edit-popup {
  min-width: 380px;
}

.edit-form label {
  display: block;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--gray-700);
}

.edit-form input,
.edit-form select {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 4px;
  box-sizing: border-box;
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.save-btn {
  padding: 8px 20px;
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn.danger {
  background: #dc3545;
}
</style>