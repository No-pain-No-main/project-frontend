import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as adminService from '../services/adminService'

export const useAdminStore = defineStore('admin', () => {
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Filtros por columna (estilo Excel)
  const filterDoc = ref('')
  const filterName = ref('')
  const filterEmail = ref('')
  const filterStatuses = ref([]) // array de IDs: [1], [2,3], etc.

  const filteredStudents = computed(() => {
    let result = students.value

    const qDoc = filterDoc.value.toLowerCase().trim()
    if (qDoc) {
      result = result.filter(s => s.documentNumber?.toLowerCase().includes(qDoc))
    }

    const qName = filterName.value.toLowerCase().trim()
    if (qName) {
      result = result.filter(s => {
        const full = `${s.firstName || ''} ${s.middleName || ''} ${s.lastName || ''} ${s.secondLastName || ''}`
        return full.toLowerCase().includes(qName)
      })
    }

    const qEmail = filterEmail.value.toLowerCase().trim()
    if (qEmail) {
      result = result.filter(s => s.email?.toLowerCase().includes(qEmail))
    }

    if (filterStatuses.value.length > 0) {
      result = result.filter(s => filterStatuses.value.includes(s.userStatus?.id))
    }

    return result
  })

  async function loadStudents() {
    loading.value = true
    error.value = null
    try {
      students.value = await adminService.fetchStudents()
    } catch (err) {
      error.value = 'No se pudieron cargar los estudiantes.'
    } finally {
      loading.value = false
    }
  }

  async function changeStudentStatus(documentNumber, statusId) {
    try {
      const updated = await adminService.updateStudentStatus(documentNumber, statusId)
      const idx = students.value.findIndex(s => s.documentNumber === documentNumber)
      if (idx !== -1) {
        students.value[idx] = updated
      }
      return true
    } catch (err) {
      error.value = 'No se pudo actualizar el estado del estudiante.'
      return false
    }
  }

  async function editStudent(documentNumber, payload) {
    try {
      const updated = await adminService.updateStudent(documentNumber, payload)
      const idx = students.value.findIndex(s => s.documentNumber === documentNumber)
      if (idx !== -1) {
        students.value[idx] = updated
      }
      return true
    } catch (err) {
      error.value = 'No se pudo actualizar el estudiante.'
      return false
    }
  }

  async function removeStudent(documentNumber) {
    try {
      await adminService.deleteStudent(documentNumber)
      students.value = students.value.filter(s => s.documentNumber !== documentNumber)
      return true
    } catch (err) {
      error.value = 'No se pudo eliminar el estudiante.'
      return false
    }
  }

  // ── Machines ─────────────────────────────────────────
  const machines = ref([])
  const machinesLoading = ref(false)
  const filterMachName = ref('')
  const filterMachTypes = ref([])
  const filterMachStatuses = ref([])

  const filteredMachines = computed(() => {
    let result = machines.value

    const qName = filterMachName.value.toLowerCase().trim()
    if (qName) {
      result = result.filter(m => m.name?.toLowerCase().includes(qName))
    }

    if (filterMachTypes.value.length > 0) {
      result = result.filter(m => filterMachTypes.value.includes(m.machineType?.id))
    }

    if (filterMachStatuses.value.length > 0) {
      result = result.filter(m => filterMachStatuses.value.includes(m.machineStatus?.id))
    }

    return result
  })

  async function loadMachines() {
    machinesLoading.value = true
    error.value = null
    try {
      machines.value = await adminService.fetchMachines()
    } catch (err) {
      error.value = 'No se pudieron cargar las máquinas.'
    } finally {
      machinesLoading.value = false
    }
  }

  async function addMachine(jsonPayload) {
    try {
      const created = await adminService.createMachine(jsonPayload)
      if (created && created.id) {
        machines.value.push(created)
      } else {
        await loadMachines()
      }
      return true
    } catch (err) {
      error.value = 'No se pudo crear la máquina.'
      return false
    }
  }

  async function editMachine(machineId, payload) {
    try {
      const updated = await adminService.updateMachine(machineId, payload)
      const idx = machines.value.findIndex(m => m.id === machineId)
      if (idx !== -1) machines.value[idx] = updated
      return true
    } catch (err) {
      error.value = 'No se pudo actualizar la máquina.'
      return false
    }
  }

  async function removeMachine(machineId) {
    try {
      await adminService.deleteMachine(machineId)
      machines.value = machines.value.filter(m => m.id !== machineId)
      return true
    } catch (err) {
      error.value = 'No se pudo eliminar la máquina.'
      return false
    }
  }

  function resetMachineFilters() {
    filterMachName.value = ''
    filterMachTypes.value = []
    filterMachStatuses.value = []
  }

  return {
    students,
    loading,
    error,
    filterDoc,
    filterName,
    filterEmail,
    filterStatuses,
    filteredStudents,
    loadStudents,
    changeStudentStatus,
    editStudent,
    removeStudent,
    // Machines
    machines,
    machinesLoading,
    filterMachName,
    filterMachTypes,
    filterMachStatuses,
    filteredMachines,
    loadMachines,
    addMachine,
    editMachine,
    removeMachine,
    resetMachineFilters,
  }
})