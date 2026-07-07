import apiClient from './apiClient'

// Aquí construí datos de ejemplo para desarrollar la UI.
// Cuando la base de datos esté lista, estas funciones podrán reemplazarse por llamadas reales.

const reservations = [
  {
    id: 1,
    studentId: 0,
    student: 'Sebastián Gómez',
    email: 'sebastian.gomez@unal.edu.co',
    machine: 'Press de banca plano',
    slot: '07:00 - 07:45',
    status: 'activa',
    statusLabel: 'Activa',
    confirmationCode: 'RN32-91',
    notes: 'Recuerda confirmar tu asistencia desde la portería antes de iniciar la franja.',
    late: false,
    cancelledReason: null,
    acceptedAt: null,
    createdAt: '2026-07-03T08:40:00.000Z',
    updatedAt: '2026-07-03T08:40:00.000Z',
  },
  {
    id: 2,
    studentId: 0,
    student: 'Sebastián Gómez',
    email: 'sebastian.gomez@unal.edu.co',
    machine: 'Caminadora Matrix T50',
    slot: '09:00 - 09:45',
    status: 'confirmada',
    statusLabel: 'Confirmada',
    confirmationCode: 'RG08-44',
    notes: 'Llegó a tiempo y confirmó su asistencia correctamente.',
    late: false,
    cancelledReason: null,
    acceptedAt: '2026-07-02T09:05:00.000Z',
    createdAt: '2026-07-01T14:10:00.000Z',
    updatedAt: '2026-07-02T09:05:00.000Z',
  },
  {
    id: 3,
    studentId: 0,
    student: 'Sebastián Gómez',
    email: 'sebastian.gomez@unal.edu.co',
    machine: 'Prensa de piernas',
    slot: '11:00 - 11:45',
    status: 'cancelada',
    statusLabel: 'Cancelada',
    confirmationCode: 'PL11-90',
    notes: 'Reserva cancelada por llegada tarde. Aparecerá un aviso la próxima vez que entres.',
    late: true,
    cancelledReason: 'Llegada tarde',
    acceptedAt: null,
    createdAt: '2026-07-01T10:10:00.000Z',
    updatedAt: '2026-07-01T11:55:00.000Z',
  },
]

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 100))

const slotDefinitions = [
  { id: 11, name: '06:00 - 06:30', startTime: '06:00:00' },
  { id: 12, name: '06:30 - 07:00', startTime: '06:30:00' },
  { id: 13, name: '07:00 - 07:30', startTime: '07:00:00' },
  { id: 14, name: '07:30 - 08:00', startTime: '07:30:00' },
  { id: 15, name: '12:00 - 12:30', startTime: '12:00:00' },
  { id: 16, name: '12:30 - 13:00', startTime: '12:30:00' },
  { id: 17, name: '17:00 - 17:30', startTime: '17:00:00' },
  { id: 18, name: '17:30 - 18:00', startTime: '17:30:00' },
]

const slotMap = new Map(slotDefinitions.map((slot) => [slot.name, slot]))

function normalizeMachine(machine) {
  const statusName = machine.machineStatus?.name || machine.status || ''
  const typeName = machine.machineType?.name || machine.type || ''

  const statusMap = {
    disponible: 'disponible',
    reservada: 'reservada',
    inactiva: 'inactiva',
    disponible: 'disponible',
  }

  const normalizedStatus = statusMap[statusName?.toLowerCase()] || 'disponible'

  const typeKey = typeName?.toLowerCase() || ''
  const typeMap = {
    caminadora: 'cardio',
    elliptica: 'cardio',
    'bicicleta de spinning': 'cardio',
    'fuerza libre': 'fuerza-libre',
    guiada: 'guiada',
    funcional: 'funcional',
    cardio: 'cardio',
  }

  return {
    id: machine.id,
    name: machine.name,
    type: typeMap[typeKey] || 'cardio',
    typeLabel: typeName || 'Cardio',
    status: normalizedStatus,
    image: machine.image || '/maquinas/cardio.png',
    maxTime: machine.maxTime || null,
  }
}

export async function fetchReservations() {
  return delay(reservations.map((reservation) => ({ ...reservation })))
}

export async function fetchMachines() {
  try {
    const { data } = await apiClient.get('/machines')
    return data.map(normalizeMachine)
  } catch (err) {
    // If authorization fails (403) or server rejects, try public test endpoint as fallback
    if (err.response && err.response.status === 403) {
      const { data } = await apiClient.get('/test/machines')
      return data.map(normalizeMachine)
    }
    throw err
  }
}

export async function fetchAvailability(machineId, date) {
  const { data } = await apiClient.get(`/availability/${machineId}/${date}`)
  const slotNames = Array.isArray(data) ? data : []
  return slotNames.map((name) => slotMap.get(name) || { id: null, name, startTime: null })
}

export async function createBooking({ machineId, date, timeSlot, studentDocumentNumber }) {
  const payload = {
    student: { documentNumber: studentDocumentNumber },
    machine: { id: machineId },
    date,
    timeSlot,
    bookingStatus: { id: 1 },
  }

  const { data } = await apiClient.post('/bookings', payload)
  return data
}

export async function createReservation(payload) {
  const nextId = reservations.length ? Math.max(...reservations.map((item) => item.id)) + 1 : 1
  const newReservation = {
    id: nextId,
    studentId: payload.studentId,
    student: payload.student,
    email: payload.email,
    machine: payload.machine,
    slot: payload.slot,
    status: 'activa',
    statusLabel: 'Activa',
    confirmationCode: payload.confirmationCode || `RN${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`,
    notes: payload.notes || 'Confirma tu asistencia en portería antes de comenzar.',
    late: false,
    cancelledReason: null,
    acceptedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  reservations.unshift(newReservation)
  return delay({ ...newReservation })
}

export async function updateReservation(id, changes) {
  const index = reservations.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Reserva no encontrada')
  }

  reservations[index] = {
    ...reservations[index],
    ...changes,
    updatedAt: new Date().toISOString(),
  }
  return delay({ ...reservations[index] })
}
