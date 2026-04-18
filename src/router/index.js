import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SecretView from '../views/SecretView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/secret/:secretPhrase?',
    name: 'Secret',
    component: SecretView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router