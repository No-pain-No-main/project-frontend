<template>
  <div class="admin-users">
    <h1>Gestión de Estudiantes</h1>
    <p class="muted-text">Administra los estudiantes registrados en el sistema.</p>

    <div class="admin-users__table-wrap">
      <Table
        :columns="columns"
        :rows="store.filteredStudents"
        :loading="store.loading"
        empty-text="No se encontraron estudiantes."
      >
        <!-- HEADERS con filtros -->
        <template #header-documentNumber="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('doc')" />
        </template>
        <template #header-name="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('name')" />
        </template>
        <template #header-email="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('email')" />
        </template>
        <template #header-status="{ column }">
          <ColumnFilter :label="column.label" @toggle="toggleFilter('status')" />
        </template>
        <template #header-actions="{ column }">
          {{ column.label }}
        </template>

        <!-- CELDAS -->
        <template #cell-documentNumber="{ value }">
          <span class="mono">{{ value }}</span>
        </template>

        <template #cell-name="{ row }">
          {{ row.firstName || '' }} {{ row.middleName || '' }} {{ row.lastName || '' }} {{ row.secondLastName || '' }}
        </template>

        <template #cell-email="{ value }">
          <span class="muted-text">{{ value || '—' }}</span>
        </template>

        <template #cell-status="{ row }">
          <span v-if="row.userStatus" :class="['badge', statusClass(row.userStatus.id)]">
            {{ row.userStatus.name }}
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

    <!-- Menú contextual fijo (aparece al hacer clic en lápiz) -->
    <div
      v-if="menuTarget"
      class="actions-menu-fixed"
      :style="{ top: menuPos.top + 'px', left: menuPos.left + 'px' }"
      @click.stop
    >
      <button @click="openEdit(menuTarget)">✏️ Editar</button>
      <button @click="confirmDelete(menuTarget)" class="danger">🗑️ Eliminar</button>
    </div>

    <!-- Filtro desplegable para Documento -->
    <div v-if="activeFilter === 'doc'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por documento</h4>
        <input v-model="store.filterDoc" placeholder="Buscar cédula..." @input="debounceSearch" />
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro desplegable para Nombre -->
    <div v-if="activeFilter === 'name'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por nombre</h4>
        <input v-model="store.filterName" placeholder="Buscar nombre/apellido..." @input="debounceSearch" />
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro desplegable para Email -->
    <div v-if="activeFilter === 'email'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por email</h4>
        <input v-model="store.filterEmail" placeholder="Buscar email..." @input="debounceSearch" />
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Filtro desplegable para Estado (checkboxes) -->
    <div v-if="activeFilter === 'status'" class="filter-overlay" @click="activeFilter = null">
      <div class="filter-popup" @click.stop>
        <h4>Filtrar por estado</h4>
        <label v-for="st in statusOptions" :key="st.id" class="filter-check">
          <input
            type="checkbox"
            :value="st.id"
            :checked="store.filterStatuses.includes(st.id)"
            @change="toggleStatusFilter(st.id)"
          />
          {{ st.name }}
        </label>
        <button class="close-btn" @click="activeFilter = null">Cerrar</button>
      </div>
    </div>

    <!-- Modal Editar Estudiante -->
    <div v-if="editStudent" class="filter-overlay" @click="closeEdit">
      <div class="filter-popup edit-popup" @click.stop>
        <h4>Editar Estudiante</h4>
        <div class="edit-form">
          <label>Nombre <input v-model="editForm.firstName" /></label>
          <label>Segundo nombre <input v-model="editForm.middleName" /></label>
          <label>Apellido <input v-model="editForm.lastName" /></label>
          <label>Segundo apellido <input v-model="editForm.secondLastName" /></label>
          <label>Email <input v-model="editForm.email" /></label>
          <label>
            Estado
            <select v-model.number="editForm.statusId">
              <option :value="1">Activo</option>
              <option :value="2">Suspendido</option>
              <option :value="3">Inactivo</option>
            </select>
          </label>
        </div>
        <div class="edit-actions">
          <button class="close-btn" @click="closeEdit">Cancelar</button>
          <button class="save-btn" @click="saveEdit">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Confirmación Eliminar -->
    <div v-if="deleteTarget" class="filter-overlay" @click="deleteTarget = null">
      <div class="filter-popup" @click.stop>
        <h4>¿Eliminar estudiante?</h4>
        <p>Documento: <strong>{{ deleteTarget.documentNumber }}</strong></p>
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
  { key: 'documentNumber', label: 'Documento' },
  { key: 'name', label: 'Nombre completo' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: '' },
]

const statusOptions = [
  { id: 1, name: 'Activo' },
  { id: 2, name: 'Suspendido' },
  { id: 3, name: 'Inactivo' },
]

// Filter state
const activeFilter = ref(null)
let debounceTimer = null

function toggleFilter(key) {
  activeFilter.value = activeFilter.value === key ? null : key
}

function debounceSearch() {
  clearTimeout(debounceTimer)
}

function toggleStatusFilter(id) {
  const current = [...store.filterStatuses]
  const idx = current.indexOf(id)
  if (idx === -1) current.push(id)
  else current.splice(idx, 1)
  store.filterStatuses = current
}

// Action menu — fixed position popup (never clipped by table)
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

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Edit
const editStudent = ref(null)
const editForm = ref({})

function openEdit(row) {
  closeMenu()
  editStudent.value = row
  editForm.value = {
    firstName: row.firstName || '',
    middleName: row.middleName || '',
    lastName: row.lastName || '',
    secondLastName: row.secondLastName || '',
    email: row.email || '',
    statusId: row.userStatus?.id || 1,
  }
}

function closeEdit() {
  editStudent.value = null
}

async function saveEdit() {
  await store.editStudent(editStudent.value.documentNumber, editForm.value)
  closeEdit()
}

// Delete
const deleteTarget = ref(null)

function confirmDelete(row) {
  closeMenu()
  deleteTarget.value = row
}

async function executeDelete() {
  if (deleteTarget.value) {
    await store.removeStudent(deleteTarget.value.documentNumber)
    deleteTarget.value = null
  }
}

function statusClass(id) {
  switch (id) {
    case 1: return 'badge--green'
    case 2: return 'badge--yellow'
    case 3: return 'badge--red'
    default: return 'badge--gray'
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (!store.students.length) {
    store.loadStudents()
  }
})
</script>

<style scoped>
.admin-users {
  padding: 24px;
}

.admin-users h1 {
  margin-bottom: 4px;
}

.admin-users__table-wrap {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: visible;
  margin-top: 20px;
}

.mono {
  font-family: monospace;
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge--green { background: #d4edda; color: #155724; }
.badge--yellow { background: #fff3cd; color: #856404; }
.badge--red { background: #f8d7da; color: #721c24; }
.badge--gray { background: #e2e3e5; color: #383d41; }

/* Actions cell */
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

/* Fixed-position action menu (never clipped by table overflow) */
.actions-menu-fixed {
  position: fixed;
  z-index: 200;
  background: #fff;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 150px;
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

/* Filter overlay & popup */
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
  min-width: 300px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.filter-popup h4 {
  margin-bottom: 16px;
}

.filter-popup input[type="text"] {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 16px;
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

/* Edit popup */
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