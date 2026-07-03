import apiClient from './apiClient'

// ── ENDPOINTS ESPERADOS DEL BACKEND ──────────────────────────────────────
// Ajusta las rutas y los nombres de los campos cuando tu backend los defina.
// Lo importante es que el backend te devuelva SIEMPRE el rol del usuario
// ("admin" | "estudiante") en login y en /me, porque de eso depende
// todo el control de acceso del frontend.

export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  // Se espera algo como: { token: "...", user: { id, nombre, email, rol } }
  return data
}

export async function register({ nombre, email, password }) {
  const { data } = await apiClient.post('/auth/register', { nombre, email, password })
  // Se espera algo como: { token: "...", user: { id, nombre, email, rol } }
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  // Se espera: { id, nombre, email, rol }
  return data
}

export function logout() {
  localStorage.removeItem('fitbook_token')
  localStorage.removeItem('fitbook_user')
}
