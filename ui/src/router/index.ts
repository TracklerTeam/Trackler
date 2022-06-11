import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, authGuardHome } from '@/utils/guards/authGuard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/components/Header.vue'),
      beforeEnter: [authGuardHome]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/Login.vue')
    }
  ]
})

export default router
