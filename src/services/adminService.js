import apiClient from './apiClient'

// ── Students ──────────────────────────────────────────────
export async function fetchStudents() {
  const { data } = await apiClient.get('/students')
  return data
}

export async function updateStudentStatus(documentNumber, statusId) {
  const { data } = await apiClient.patch(`/students/${documentNumber}/status`, { statusId })
  return data
}

export async function updateStudent(documentNumber, payload) {
  const { data } = await apiClient.put(`/students/${documentNumber}`, payload)
  return data
}

export async function deleteStudent(documentNumber) {
  const { data } = await apiClient.delete(`/students/${documentNumber}`)
  return data
}

// ── Machines ──────────────────────────────────────────────
export async function fetchMachines() {
  const { data } = await apiClient.get('/machines')
  return data
}

export async function createMachine(jsonPayload) {
  const { data } = await apiClient.post('/machines', jsonPayload, {
    headers: { 'Content-Type': 'application/json' }
  })
  return data
}

export async function updateMachine(machineId, payload) {
  const { data } = await apiClient.put(`/machines/${machineId}`, payload)
  return data
}

export async function deleteMachine(machineId) {
  const { data } = await apiClient.delete(`/machines/${machineId}`)
  return data
}