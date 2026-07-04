import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import LandingLayout from '../layouts/LandingLayout.vue'
import StudentLayout from '../layouts/StudentLayout.vue'

// Lazy loading: cada vista se descarga solo cuando el usuario navega a ella.
const Home = () => import('../views/Home.vue')
const LoginForm = () => import('../components/auth/LoginForm.vue')
const RegisterForm = () => import('../components/auth/RegisterForm.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Reservations = () => import('../views/Reservations.vue')
const Machines = () => import('../views/Machines.vue')
const CheckIn = () => import('../views/CheckIn.vue')
const About = () => import('../views/About.vue')
const Admin = () => import('../views/Admin.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── Landing pública ───────────────────────────────────────────────
    {
      path: '/',
      component: LandingLayout,
      children: [{ path: '', name: 'home', component: Home }],
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
        { path: 'reservas', name: 'reservations', component: Reservations },
        { path: 'maquinas', name: 'machines', component: Machines },
        { path: 'check-in', name: 'check-in', component: CheckIn },
        { path: 'about', name: 'about', component: About },
      ],
    },

    // ── Zona administrador ────────────────────────────────────────────
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [{ path: '', name: 'admin', component: Admin }],
    },

    // ── 404 ───────────────────────────────────────────────────────────
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// ── Guarda global de navegación ───────────────────────────────────────────
// to.meta ya viene fusionado con el meta del layout padre (/student, /admin),
// así que basta con declarar requiresAuth/role una sola vez en el padre.
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    next(auth.isAdmin ? '/admin' : '/student/dashboard')
    return
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    next(auth.isAdmin ? '/admin' : '/student/dashboard')
    return
  }

  next()
})

export default router
