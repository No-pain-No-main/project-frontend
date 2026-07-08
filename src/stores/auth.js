import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authService from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('fitbook_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('fitbook_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))
  const role = computed(() => user.value?.rol || null)
  function persistSession({ token: newToken, user: newUser }) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('fitbook_token', newToken)
    localStorage.setItem('fitbook_user', JSON.stringify(newUser))
  }

  async function login(credentials, role = 'student') {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login({ ...credentials, role })
      persistSession(data)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'No se pudo iniciar sesión.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = null
    try {
      const userData = await authService.register(payload)
      user.value = userData
      localStorage.setItem('fitbook_user', JSON.stringify(userData))
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'No se pudo completar el registro.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    try {
      const freshUser = await authService.fetchCurrentUser()
      user.value = freshUser
      localStorage.setItem('fitbook_user', JSON.stringify(freshUser))
    } catch {
      logout()
    }
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    role,
    login,
    register,
    logout,
    fetchCurrentUser,
  }
})
