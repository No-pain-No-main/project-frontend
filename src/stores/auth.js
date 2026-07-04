import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authService from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // ── ESTADO ────────────────────────────────────────────────────────────
  const token = ref(localStorage.getItem('fitbook_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('fitbook_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  // ── GETTERS (computed) ───────────────────────────────────────────────
  const isAuthenticated = computed(() => Boolean(token.value))
  const role = computed(() => user.value?.rol || null)
  const isAdmin = computed(() => role.value === 'admin')

  // ── ACCIONES ──────────────────────────────────────────────────────────
  function persistSession({ token: newToken, user: newUser }) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('fitbook_token', newToken)
    localStorage.setItem('fitbook_user', JSON.stringify(newUser))
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login(credentials)
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
      const data = await authService.register(payload)
      persistSession(data)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'No se pudo completar el registro.'
      return false
    } finally {
      loading.value = false
    }
  }

  // Al recargar la página, si hay token pero no hay user en memoria confiable,
  // se puede llamar esto para revalidar la sesión contra el backend.
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

  // ── SOLO DESARROLLO ───────────────────────────────────────────────────
  // Simula una sesión localmente, sin llamar al backend. Útil mientras el
  // backend todavía no expone /auth/login. NO se usa en producción: el
  // botón que la invoca solo existe cuando import.meta.env.DEV es true.
  function loginAsDemo(demoRole = 'estudiante') {
    persistSession({
      token: 'demo-token',
      user: {
        id: 0,
        nombre: demoRole === 'admin' ? 'Admin Demo' : 'Estudiante Demo',
        email: 'demo@fitbook.local',
        rol: demoRole,
      },
    })
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
    isAdmin,
    login,
    register,
    logout,
    loginAsDemo,
    fetchCurrentUser,
  }
})
