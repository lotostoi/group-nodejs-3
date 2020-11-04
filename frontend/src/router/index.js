import { createRouter, createWebHashHistory } from 'vue-router'
import Tasks from '../views/Tasks.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Tasks,
  },
  {
    path: '/registration',
    name: 'registration',
    component: () => import('../views/registration.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
