import apiClient from './apiClient'

//Aquí uso rutas tipo `/auth/login`, `/auth/register`, `/auth/me`.
//Cuando arme los endpoints reales, reemplace estas rutas o ajuste
//   `apiClient.baseURL` según convenga.
// Yo lo asumí que el login devuelve { token, user: { id, nombre, email, rol } }.
// por si algo el backend usa otros nombres, mapea los campos en este servicio.

export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function register({ nombre, email, password }) {
  const { data } = await apiClient.post('/auth/register', { nombre, email, password })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data
}

export function logout() {
  localStorage.removeItem('fitbook_token')
  localStorage.removeItem('fitbook_user')
}
