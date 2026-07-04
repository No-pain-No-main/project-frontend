// Aquí construí datos de ejemplo para desarrollar la UI.
// cuando conecte la DB, remplace estas funciones por calls reales a los endpoints
// Yo dejé la forma de cada objeto para que pueda mapearla al modelo real.

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

export async function fetchReservations() {
  // Aquí devuelvo un clon simulado. Reemplaza por:
  // return apiClient.get('/reservations')
  return delay(reservations.map((reservation) => ({ ...reservation })))
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
  // Reemplazar por POST real:
  // const { data } = await apiClient.post('/reservations', payload)
  // return data
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
  // Reemplazar por PATCH real:
  // const { data } = await apiClient.patch(`/reservations/${id}`, changes)
  // return data
  return delay({ ...reservations[index] })
}
