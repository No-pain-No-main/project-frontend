import apiClient from './apiClient'

export async function login({ documentNumber, password }) {
  // Intentar login como estudiante primero
  try {
    const { data } = await apiClient.post('/auth/student/login', { documentNumber, password })
    return buildSession(data, 'student')
  } catch {
    // Si falla, intentar como administrador
    const { data } = await apiClient.post('/auth/admin/login', { documentNumber, password })
    return buildSession(data, 'admin')
  }
}

function buildSession(data, defaultRole) {
  return {
    token: data.token,
    user: {
      id: data.documentNumber,
      nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      email: data.email || '',
      rol: data.role ? data.role.toLowerCase() : defaultRole,
      documentNumber: data.documentNumber,
    },
  }
}

export async function register(payload) {
  const { data } = await apiClient.post('/students', payload)

  return {
    id: data.documentNumber,
    nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email,
    rol: 'estudiante',
    documentNumber: data.documentNumber,
  }
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data
}

export function logout() {
  localStorage.removeItem('fitbook_token')
  localStorage.removeItem('fitbook_user')
}
