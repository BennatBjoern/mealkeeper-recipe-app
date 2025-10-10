import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/CreateRecipeView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Check if the user is authenticated
router.beforeEach(async (to, form, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  while (!authStore.isInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  if (requiresAuth && !authStore.user) {
    next('/')
  } else {
    next()
  }
})

export default router
