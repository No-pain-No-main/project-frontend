import axios from 'axios'

// La URL base sale de una variable de entorno (ver archivo .env).
// Así, cuando el backend cambie de puerto/dominio, solo tocas el .env.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: agrega el token a cada request automáticamente si existe.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitbook_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuesta: si el backend responde 401 (token vencido/invalido),
// limpiamos la sesión local. La redirección la maneja el router guard.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitbook_token')
      localStorage.removeItem('fitbook_user')
    }
    return Promise.reject(error)
  },
)

export default apiClient
