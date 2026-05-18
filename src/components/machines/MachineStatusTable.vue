<template>
  <div class="table-card">
    <table>
      <thead>
        <tr>
          <th>ID Máquina</th>
          <th>Nombre</th>
          <th>Estado Actual</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="machine in localMachines"
          :key="machine.id"
        >
          <td>{{ machine.id }}</td>
          <td>{{ machine.name }}</td>
          <td>
            <span class="status-badge" :class="getStatusClass(machine.status)">
              {{ machine.status }}
            </span>
          </td>
          <td>
            <select v-model="machine.newStatus">
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Reservada">Reservada</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="actions">
      <button @click="saveChanges">
        Guardar Cambios
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  machines: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['save'])

const localMachines = reactive(
  props.machines.map(machine => ({
    ...machine,
    newStatus: machine.status
  }))
)

function getStatusClass(status) {
  if (status === 'Activa') return 'active'
  if (status === 'Inactiva') return 'inactive'
  if (status === 'Mantenimiento') return 'maintenance'
  if (status === 'Reservada') return 'reserved'
  return ''
}

function saveChanges() {
  const changes = localMachines.map(machine => ({
    id: machine.id,
    name: machine.name,
    previousStatus: machine.status,
    newStatus: machine.newStatus
  }))

  emit('save', changes)

  localMachines.forEach(machine => {
    machine.status = machine.newStatus
  })
}
</script>

<style scoped>
.table-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 26px rgba(15, 23, 42, 0.14);
  overflow: hidden;
  border-top: 5px solid #142033;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f1f5f9;
}

th,
td {
  text-align: left;
  padding: 18px;
  border-bottom: 1px solid #e5e7eb;
}

th {
  color: #142033;
  font-size: 14px;
}

td {
  color: #374151;
  font-size: 15px;
}

select {
  width: 180px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px;
  background-color: white;
}

.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background-color: #e5e7eb;
  color: #374151;
}

.status-badge.maintenance {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.reserved {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}

.actions button {
  background-color: #142033;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px 20px;
  font-weight: 700;
  cursor: pointer;
}

.actions button:hover {
  background-color: #1f2f46;
}

@media (max-width: 760px) {
  .table-card {
    overflow-x: auto;
  }

  table {
    min-width: 720px;
  }
}
</style>
