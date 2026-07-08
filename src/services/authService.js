import apiClient from './apiClient'

export async function login({ documentNumber, password }, role = 'student') {
  const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/student/login'
  const { data } = await apiClient.post(endpoint, { documentNumber, password })
  return buildSession(data, role)
}

function buildSession(data, defaultRole) {
  const normalizedRole = (data.role || defaultRole || 'student').toString().toLowerCase()

  return {
    token: data.token,
    user: {
      id: data.documentNumber,
      nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      email: data.email || '',
      rol: normalizedRole === 'admin' ? 'admin' : 'student',
      documentNumber: data.documentNumber,
    },
  }
}

export async function register(payload) {
  const { data } = await apiClient.post('/student', payload)

  return {
    id: data.documentNumber,
    nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email,
    rol: 'student',
    documentNumber: data.documentNumber,
  }
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return {
    id: data.documentNumber,
    nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email || '',
    rol: data.role || 'student',
    documentNumber: data.documentNumber,
  }
}

export function logout() {
  localStorage.removeItem('fitbook_token')
  localStorage.removeItem('fitbook_user')
}
