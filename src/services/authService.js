import apiClient from './apiClient'

export async function login({ documentNumber, password, role = 'estudiante' }) {
  const selectedRole = role === 'admin' ? 'admin' : 'estudiante'
  const endpoint = selectedRole === 'admin' ? '/auth/admin/login' : '/auth/student/login'
  const { data } = await apiClient.post(endpoint, { documentNumber, password })
  return buildSession(data, selectedRole)
}

function buildSession(data, defaultRole) {
  const normalizedRole = defaultRole === 'admin' ? 'admin' : 'estudiante'

  return {
    token: data.token,
    user: {
      id: data.documentNumber,
      nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      email: data.email || '',
      rol: data.role ? data.role.toLowerCase() : normalizedRole,
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
