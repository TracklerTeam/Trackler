import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, authGuardHome, authGuardDashboard } from '@/utils/guards/authGuard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/components/Home.vue'),
      beforeEnter: [authGuardHome]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/components/Home.vue'),
      beforeEnter: [authGuardDashboard]
    }
  ]
})

export default router
