<template>
  <div class="admin-machines">
    <div class="admin-machines__header">
      <div>
        <h1>Gestión de Máquinas</h1>
        <p class="muted-text">Administra las máquinas del gimnasio.</p>
      </div>
      <button class="add-btn" @click="openCreate">+ Agregar máquina</button>
    </div>

    <div class="admin-machines__table-wrap">
      <Table
        :columns="columns"
        :rows="store.filteredMachines"
        :loading="store.machinesLoading"
        empty-text="No se encontraron máquinas."
      >
        <template #header-name="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('name')" />
        </template>
        <template #header-type="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('type')" />
        </template>
        <template #header-status="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('status')" />
        </template>
        <template #header-actions="{ column }">{{ column.label }}</template>

        <template #cell-id="{ value }">
          <span class="mono">#{{ value }}</span>
        </template>

        <template #cell-name="{ value }">
          <strong>{{ value }}</strong>
        </template>

        <template #cell-type="{ row }">
          <span class="badge badge--blue">{{ row.machineType?.name || '—' }}</span>
        </template>

        <template #cell-status="{ row }">
          <span v-if="row.machineStatus" :class="['badge', machStatusClass(row.machineStatus.id)]">
            {{ row.machineStatus.name }}
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
      <button @click="openEdit(menuTarget)">✏️ Editar</button>
      <button @click="confirmDelete(menuTarget)" class="danger">🗑️ Eliminar</button>
    </div>

    <!-- Filtro Nombre -->
    <div v-if="activeFilter === 'name'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por nombre</h4>
        <input v-model="store.filterMachName" placeholder="Buscar nombre..." />
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro Tipo -->
    <div v-if="activeFilter === 'type'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por tipo</h4>
        <label v-for="t in typeOptions" :key="t.id" class="filter-check">
          <input type="checkbox" :value="t.id" :checked="store.filterMachTypes.includes(t.id)"
            @change="toggleTypeFilter(t.id)" /> {{ t.name }}
        </label>
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro Estado -->
    <div v-if="activeFilter === 'status'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por estado</h4>
        <label v-for="s in statusOptions" :key="s.id" class="filter-check">
          <input type="checkbox" :value="s.id" :checked="store.filterMachStatuses.includes(s.id)"
            @change="toggleStatusFilter(s.id)" /> {{ s.name }}
        </label>
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Modal Crear/Editar Máquina -->
    <div v-if="showForm" class="filter-overlay" @click="showForm = false">
      <div class="filter-popup edit-popup" @click.stop>
        <h4>{{ editing ? 'Editar Máquina' : 'Agregar Máquina' }}</h4>
        <div class="edit-form">
          <label>Nombre <input v-model="form.name" placeholder="Nombre de la máquina" required /></label>
          <p v-if="formError" class="form-error">{{ formError }}</p>
          <label>Tipo
            <select v-model.number="form.typeId">
              <option v-for="t in typeOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </label>
          <label>Estado
            <select v-model.number="form.statusId">
              <option v-for="s in statusOptions" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </label>
        </div>
        <div class="edit-actions">
          <button class="close-btn" @click="showForm = false">Cancelar</button>
          <button class="save-btn" @click="saveForm">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Confirmación Eliminar -->
    <div v-if="deleteTarget" class="filter-overlay" @click="deleteTarget = null">
      <div class="filter-popup" @click.stop>
        <h4>¿Eliminar máquina?</h4>
        <p><strong>{{ deleteTarget.name }}</strong> (ID: {{ deleteTarget.id }})</p>
        <p class="muted-text">Esta acción no se puede deshacer.</p>
        <div class="edit-actions">
          <button class="close-btn" @click="deleteTarget = null">Cancelar</button>
          <button class="save-btn danger" @click="executeDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useAdminStore } from '../../stores/admin'
import Table from '../../components/ui/Table.vue'
import ColumnFilter from '../../components/ui/ColumnFilter.vue'

const store = useAdminStore()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: '' },
]

const typeOptions = [
  { id: 1, name: 'Caminadora' },
  { id: 2, name: 'Elíptica' },
  { id: 3, name: 'Bicicleta de Spinning' },
]

const statusOptions = [
  { id: 1, name: 'Disponible' },
  { id: 2, name: 'Inactiva' },
  { id: 3, name: 'Reservada' },
]

// Filters
const activeFilter = ref(null)
function toggleFilter(key) {
  activeFilter.value = activeFilter.value === key ? null : key
}
function toggleTypeFilter(id) {
  const c = [...store.filterMachTypes]; const i = c.indexOf(id); i === -1 ? c.push(id) : c.splice(i, 1); store.filterMachTypes = c
}
function toggleStatusFilter(id) {
  const c = [...store.filterMachStatuses]; const i = c.indexOf(id); i === -1 ? c.push(id) : c.splice(i, 1); store.filterMachStatuses = c
}

// Menu
const menuTarget = ref(null)
const menuPos = reactive({ top: 0, left: 0 })
function toggleMenu(event, row) {
  if (menuTarget.value === row) { menuTarget.value = null; return }
  const r = event.currentTarget.getBoundingClientRect()
  menuPos.top = r.bottom + 4; menuPos.left = r.left; menuTarget.value = row
}
function closeMenu() { menuTarget.value = null }
function handleClickOutside(e) {
  if (menuTarget.value && !e.target.closest('.actions-menu-fixed') && !e.target.closest('.icon-btn')) closeMenu()
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// Form
const showForm = ref(false)
const editing = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', typeId: 1, statusId: 1 })
const formError = ref('')

function openCreate() {
  editing.value = false; editingId.value = null
  form.name = ''; form.typeId = 1; form.statusId = 1; formError.value = ''; showForm.value = true
}

function openEdit(row) {
  closeMenu()
  editing.value = true; editingId.value = row.id
  form.name = row.name; form.typeId = row.machineType?.id || 1; form.statusId = row.machineStatus?.id || 1
  formError.value = ''; showForm.value = true
}

async function saveForm() {
  if (!form.name.trim()) {
    formError.value = 'El nombre de la máquina es obligatorio.'
    return
  }
  formError.value = ''
  if (editing.value) {
    await store.editMachine(editingId.value, { name: form.name, typeId: form.typeId, statusId: form.statusId })
  } else {
    await store.addMachine(JSON.stringify({ name: form.name, machineType: { id: form.typeId }, machineStatus: { id: form.statusId } }))
  }
  showForm.value = false
}

// Delete
const deleteTarget = ref(null)
function confirmDelete(row) { closeMenu(); deleteTarget.value = row }
async function executeDelete() {
  if (deleteTarget.value) { await store.removeMachine(deleteTarget.value.id); deleteTarget.value = null }
}

function machStatusClass(id) {
  switch (id) { case 1: return 'badge--green'; case 2: return 'badge--gray'; case 3: return 'badge--yellow'; default: return 'badge--gray' }
}

onMounted(() => { if (!store.machines.length) store.loadMachines() })
</script>

<style scoped>
.admin-machines { padding: 24px; }
.admin-machines__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.admin-machines h1 { margin-bottom: 4px; }
.admin-machines__table-wrap { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); overflow: visible; }
.add-btn { padding: 10px 20px; background: var(--blue); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; }
.add-btn:hover { opacity: 0.9; }
.mono { font-family: monospace; font-weight: 600; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.badge--green { background: #d4edda; color: #155724; }
.badge--yellow { background: #fff3cd; color: #856404; }
.badge--blue { background: #cce5ff; color: #004085; }
.badge--gray { background: #e2e3e5; color: #383d41; }
.actions-cell { display: flex; align-items: center; }
.icon-btn { background: none; border: none; cursor: pointer; padding: 6px 10px; border-radius: 6px; color: var(--gray-600); font-size: 1rem; }
.icon-btn:hover { background: var(--gray-100); color: var(--blue); }
.actions-menu-fixed { position: fixed; z-index: 200; background: #fff; border: 1px solid var(--gray-300); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 150px; overflow: hidden; }
.actions-menu-fixed button { display: block; width: 100%; text-align: left; padding: 10px 16px; border: none; background: none; cursor: pointer; font-size: 0.9rem; }
.actions-menu-fixed button:hover { background: var(--gray-100); }
.actions-menu-fixed button.danger { color: #dc3545; }
.actions-menu-fixed button.danger:hover { background: #f8d7da; }
.filter-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.2); display: flex; align-items: flex-start; justify-content: center; padding-top: 80px; }
.filter-popup { background: #fff; border-radius: 12px; padding: 24px; min-width: 300px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.filter-popup h4 { margin-bottom: 16px; }
.filter-popup input[type="text"] { width: 100%; padding: 10px 14px; border: 1px solid var(--gray-300); border-radius: 8px; font-size: 0.95rem; margin-bottom: 16px; box-sizing: border-box; }
.filter-check { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.95rem; cursor: pointer; }
.close-btn { padding: 8px 16px; border: 1px solid var(--gray-300); border-radius: 8px; background: #fff; cursor: pointer; font-size: 0.9rem; margin-top: 8px; }
.close-btn:hover { background: var(--gray-100); }
.edit-popup { min-width: 360px; }
.edit-form label { display: block; margin-bottom: 12px; font-size: 0.9rem; color: var(--gray-700); }
.edit-form input, .edit-form select { display: block; width: 100%; padding: 8px 12px; border: 1px solid var(--gray-300); border-radius: 8px; font-size: 0.9rem; margin-top: 4px; box-sizing: border-box; }
.form-error { color: #dc3545; font-size: 0.85rem; margin: -8px 0 12px 0; }
.edit-actions { display: flex; gap: 12px; margin-top: 16px; }
.save-btn { padding: 8px 20px; background: var(--blue); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
.save-btn:hover { opacity: 0.9; }
.save-btn.danger { background: #dc3545; }
</style>