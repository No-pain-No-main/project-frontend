import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export default {
  async login(correo, password) {
    try {
      const response = await api.post('/login', { correo, password })
      return response.data
    } catch (error) {
      if (error.response) {
        return error.response.data
      }
      return { success: false, message: 'Error de conexion con el servidor' }
    }
  }
}