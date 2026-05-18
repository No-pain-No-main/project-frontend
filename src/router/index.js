import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue')
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: () => import('../views/student/StudentDashboardView.vue')
  },
  {
    path: '/student/reservations/create',
    name: 'CreateReservation',
    component: () => import('../views/student/CreateReservationView.vue')
  },
  {
    path: '/student/reservations',
    name: 'MyReservations',
    component: () => import('../views/student/MyReservationsView.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboardView.vue')
  },
  {
    path: '/admin/machines/create',
    name: 'CreateMachine',
    component: () => import('../views/admin/CreateMachineView.vue')
  },
  {
    path: '/admin/machines/status',
    name: 'MachineStatus',
    component: () => import('../views/admin/MachineStatusView.vue')
  },
  {
    path: '/admin/reservations/history',
    name: 'ReservationHistory',
    component: () => import('../views/admin/ReservationHistoryView.vue')
  },
  {
    path: '/admin/reports',
    name: 'Reports',
    component: () => import('../views/admin/ReportsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router