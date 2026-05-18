import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/LoginView.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/auth/RegisterView.vue')
      }
    ]
  },
  {
    path: '/student',
    component: () => import('../layouts/StudentLayout.vue'),
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: () => import('../views/student/StudentDashboardView.vue')
      },
      {
        path: 'reservations/create',
        name: 'CreateReservation',
        component: () => import('../views/student/CreateReservationView.vue')
      },
      {
        path: 'reservations',
        name: 'MyReservations',
        component: () => import('../views/student/MyReservationsView.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboardView.vue')
      },
      {
        path: 'machines/create',
        name: 'CreateMachine',
        component: () => import('../views/admin/CreateMachineView.vue')
      },
      {
        path: 'machines/status',
        name: 'MachineStatus',
        component: () => import('../views/admin/MachineStatusView.vue')
      },
      {
        path: 'reservations/history',
        name: 'ReservationHistory',
        component: () => import('../views/admin/ReservationHistoryView.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('../views/admin/ReportsView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
