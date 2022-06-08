import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, authGuardHome } from '@/utils/guards/authGuard';
import HelloWorld from '@/components/HelloWorld.vue';
import TheWelcome from '@/components/TheWelcome.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HelloWorld,
      beforeEnter: [authGuardHome]
    },
    {
      path: '/about',
      name: 'about',
      component: TheWelcome,
      beforeEnter: [authGuard]
    }
  ]
})

export default router
