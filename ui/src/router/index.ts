import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/utils/guards/authGuard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/components/Home.vue')
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
      beforeEnter: [authGuard]
    },
    {
      path: '/search/:query',
      name: 'search',
      component: () => import('@/components/Search.vue'),
      props: true,
      beforeEnter: [authGuard]
    },
    {
      path: '/show/:id',
      name: 'show',
      component: () => import('@/components/Show.vue'),
      props: true,
      beforeEnter: [authGuard]
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('@/components/Home.vue'),
      props: true,
      beforeEnter: [authGuard]
    }
  ]
})

export default router
