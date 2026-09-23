import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('./shared/presentation/views/home.vue'),
      meta: { title: 'Home' },
    },
    { path: '/', redirect: '/home' },
  ],
})

router.beforeEach((to) => {
  document.title = to.meta.title ? `Hostera - ${to.meta.title}` : 'Hostera'
})

export default router
