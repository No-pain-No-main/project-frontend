// Esto es un mock temporal de máquinas.
// Cuando conectes la base de datos, crea `services/machineService.js` que haga
// las llamadas reales (GET /machines, PATCH /machines/:id, etc.).
// Dejé los campos (id, name, type, status, image, maxTime) para que pueda mapearlos

export const machineTypes = [
  { label: 'Cardio', value: 'cardio' },
  { label: 'Fuerza libre', value: 'fuerza-libre' },
  { label: 'Máquina guiada', value: 'guiada' },
  { label: 'Funcional', value: 'funcional' },
]

// Estados según RF_8: Disponible | Reservada | Inactiva
export const machineStatuses = [
  { label: 'Disponible', value: 'disponible' },
  { label: 'Reservada', value: 'reservada' },
  { label: 'Inactiva', value: 'inactiva' },
]

export const machines = [
  {
    id: 1,
    name: 'Caminadora Matrix T50',
    type: 'cardio',
    typeLabel: 'Cardio',
    status: 'disponible',
    image: '/maquinas/cardio.png',
    maxTime: '30 min',
  },
  {
    id: 2,
    name: 'Bicicleta estática Keiser M3',
    type: 'cardio',
    typeLabel: 'Cardio',
    status: 'reservada',
    image: '/maquinas/cardio.png',
    maxTime: '30 min',
  },
  {
    id: 3,
    name: 'Rack de sentadilla',
    type: 'fuerza-libre',
    typeLabel: 'Fuerza libre',
    status: 'disponible',
    image: '/maquinas/pecho.png',
    maxTime: '45 min',
  },
  {
    id: 4,
    name: 'Prensa de piernas 45°',
    type: 'guiada',
    typeLabel: 'Máquina guiada',
    status: 'inactiva',
    image: '/maquinas/piernas.png',
    maxTime: '20 min',
  },
  {
    id: 5,
    name: 'Estación funcional TRX',
    type: 'funcional',
    typeLabel: 'Funcional',
    status: 'disponible',
    image: '/maquinas/brazo.png',
    maxTime: '30 min',
  },
  {
    id: 6,
    name: 'Remo Concept2',
    type: 'cardio',
    typeLabel: 'Cardio',
    status: 'disponible',
    image: '/maquinas/cardio.png',
    maxTime: '20 min',
  },
]

// Franjas horarias disponibles para reservar (RF_1).
export const timeSlots = [
  '06:00 - 06:30',
  '06:30 - 07:00',
  '07:00 - 07:30',
  '12:00 - 12:30',
  '12:30 - 13:00',
  '17:00 - 17:30',
  '17:30 - 18:00',
  '18:00 - 18:30',
]
