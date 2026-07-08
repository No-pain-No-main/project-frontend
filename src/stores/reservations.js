import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as reservationService from '../services/reservationService'

// Este store usa `reservationService` que está emulado en
// `src/services/reservationService.js`. Cuando tenga la API real,
// actualice ese servicio para hacer `apiClient.get/post/patch` y aquí no tendrá que cambiar nada más que las llamadas si cambian nombres.

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getStudentReservations = (studentId) =>
    reservations.value.filter((reservation) => reservation.studentId === studentId)

  const getActiveReservation = (studentId) =>
    getStudentReservations(studentId).find((reservation) => ['activa', 'aceptada'].includes(reservation.status)) || null

  const getPendingReservations = (studentId) =>
    getStudentReservations(studentId).filter((reservation) => ['activa', 'aceptada'].includes(reservation.status))

  const getPastReservations = (studentId) =>
    getStudentReservations(studentId).filter((reservation) => !['activa', 'aceptada'].includes(reservation.status))

  const lateAlerts = (studentId) =>
    getStudentReservations(studentId).filter((reservation) => reservation.late && reservation.status === 'cancelada')

  const loadReservations = async (studentDocumentNumber) => {
    loading.value = true
    error.value = null
    try {
      reservations.value = await reservationService.fetchReservations(studentDocumentNumber)
    } catch (err) {
      error.value = err.message || 'No se pudieron cargar las reservas.'
    } finally {
      loading.value = false
    }
  }

  const reserveMachine = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const created = await reservationService.createReservation(payload)
      reservations.value.unshift(created)
      return created
    } catch (err) {
      error.value = err.message || 'No se pudo crear la reserva.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelReservation = async (id, reason = 'Cancelada por el estudiante') => {
    loading.value = true
    error.value = null
    try {
      const updated = await reservationService.cancelBooking(id)
      const mapped = {
        ...updated,
        status: 'cancelada',
        statusLabel: 'Cancelada',
        cancelledReason: reason,
        late: false,
      }
      const index = reservations.value.findIndex((item) => item.id === id)
      if (index !== -1) reservations.value[index] = mapped
      return mapped
    } catch (err) {
      error.value = err.message || 'No se pudo cancelar la reserva.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const confirmAttendance = async (id) => {
    loading.value = true
    error.value = null
    try {
      const updated = await reservationService.updateReservation(id, {
        status: 'confirmada',
        statusLabel: 'Confirmada',
        acceptedAt: new Date().toISOString(),
      })
      const index = reservations.value.findIndex((item) => item.id === id)
      if (index !== -1) reservations.value[index] = updated
      return updated
    } catch (err) {
      error.value = err.message || 'No se pudo confirmar la asistencia.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const acceptReservation = async (id) => {
    loading.value = true
    error.value = null
    try {
      const updated = await reservationService.updateReservation(id, {
        status: 'aceptada',
        statusLabel: 'Aceptada',
        acceptedAt: new Date().toISOString(),
      })
      const index = reservations.value.findIndex((item) => item.id === id)
      if (index !== -1) reservations.value[index] = updated
      return updated
    } catch (err) {
      error.value = err.message || 'No se pudo aceptar la reserva.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const markLate = async (id) => {
    loading.value = true
    error.value = null
    try {
      const updated = await reservationService.updateReservation(id, {
        status: 'cancelada',
        statusLabel: 'Cancelada',
        cancelledReason: 'Llegada tarde',
        late: true,
      })
      const index = reservations.value.findIndex((item) => item.id === id)
      if (index !== -1) reservations.value[index] = updated
      return updated
    } catch (err) {
      error.value = err.message || 'No se pudo actualizar la reserva.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    reservations,
    loading,
    error,
    getStudentReservations,
    getActiveReservation,
    getPendingReservations,
    getPastReservations,
    lateAlerts,
    loadReservations,
    reserveMachine,
    cancelReservation,
    acceptReservation,
    confirmAttendance,
    markLate,
  }
})
