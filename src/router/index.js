import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import AuthLayout from '../layouts/AuthLayout.vue'
import LandingLayout from '../layouts/LandingLayout.vue'
import StudentLayout from '../layouts/StudentLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const Home = () => import('../views/Home.vue')
const LoginForm = () => import('../components/auth/LoginForm.vue')
const RegisterForm = () => import('../components/auth/RegisterForm.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Reservations = () => import('../views/Reservations.vue')
const Machines = () => import('../views/Machines.vue')
const CheckIn = () => import('../views/CheckIn.vue')
const Profile = () => import('../views/Profile.vue')
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const AdminUsers = () => import('../views/admin/AdminUsers.vue')
const AdminMachines = () => import('../views/admin/AdminMachines.vue')
const AdminBookings = () => import('../views/admin/AdminBookings.vue')
const AdminReports = () => import('../views/admin/AdminReports.vue')
const NotFound = () => import('../views/NotFound.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── Landing pública ───────────────────────────────────────────────
    {
      path: '/',
      component: LandingLayout,
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'check-in', name: 'check-in', component: CheckIn },
      ],
    },

    // ── Autenticación ─────────────────────────────────────────────────
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: LoginForm, meta: { guestOnly: true } },
        { path: 'register', name: 'register', component: RegisterForm, meta: { guestOnly: true } },
      ],
    },

    // ── Zona estudiante ───────────────────────────────────────────────
    {
      path: '/student',
      component: StudentLayout,
      meta: { requiresAuth: true, role: 'student' },
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        { path: 'dashboard', name: 'dashboard', component: Dashboard },
        { path: 'profile', name: 'profile', component: Profile },
        { path: 'reservas', name: 'reservations', component: Reservations },
        { path: 'maquinas', name: 'machines', component: Machines },
      ],
    },

    // ── Zona administrador ────────────────────────────────────────────
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', redirect: { name: 'admin-dashboard' } },
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
        { path: 'usuarios', name: 'admin-users', component: AdminUsers },
        { path: 'maquinas', name: 'admin-machines', component: AdminMachines },
        { path: 'reservas', name: 'admin-bookings', component: AdminBookings },
        { path: 'reportes', name: 'admin-reports', component: AdminReports },
      ],
    },

    // ── 404 ───────────────────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()

  // Proteger rutas que requieren autenticación
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Redirigir usuarios autenticados fuera de login/register
  if (to.meta.guestOnly && auth.isAuthenticated) {
    if (auth.role === 'admin') return '/admin/dashboard'
    return '/student/dashboard'
  }

  // Validar rol específico
  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'home' }
  }

  return true
})

export default router
