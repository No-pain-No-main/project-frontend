import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import LandingLayout from '../layouts/LandingLayout.vue'
import StudentLayout from '../layouts/StudentLayout.vue'

const Home = () => import('../views/Home.vue')
const LoginForm = () => import('../components/auth/LoginForm.vue')
const RegisterForm = () => import('../components/auth/RegisterForm.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Reservations = () => import('../views/Reservations.vue')
const Machines = () => import('../views/Machines.vue')
const CheckIn = () => import('../views/CheckIn.vue')
const Admin = () => import('../views/Admin.vue')
const AdminMachines = () => import('../views/admin/AdminMachines.vue')
const AdminUsers = () => import('../views/admin/AdminUsers.vue')
const AdminStats = () => import('../views/admin/AdminStats.vue')
const Profile = () => import('../views/Profile.vue')
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
      meta: { requiresAuth: true, role: 'estudiante' },
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
        { path: '', name: 'admin', component: Admin },
        { path: 'profile', name: 'admin-profile', component: Profile },
        { path: 'maquinas', name: 'admin-machines', component: AdminMachines },
        { path: 'usuarios', name: 'admin-users', component: AdminUsers },
        { path: 'estadisticas', name: 'admin-stats', component: AdminStats },
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
    return auth.role === 'admin' ? '/admin' : '/student/dashboard'
  }

  return true
})

export default router
