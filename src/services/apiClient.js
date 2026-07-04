import axios from 'axios'

// Aquí va la URL base de la API.
// Yo la emulé con `VITE_API_URL` en .env; ponga aquí el endpoint real
// cuando conecte la base de datos 

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitbook_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
