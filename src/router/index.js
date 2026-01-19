import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LandingPage from '@/views/LandingPage.vue'
import HomeView from '@/views/HomeView.vue'
import CreateRecipeView from '@/views/CreateRecipeView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: LandingPage,
    },
    {
      path: '/recipes',
      name: 'Home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'CreateRecipe',
      component: CreateRecipeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/recipes/:id',
      name: 'RecipeDetail',
      component: RecipeDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/recipes/:id/edit',
      name: 'EditRecipe',
      component: CreateRecipeView,
      meta: { requiresAuth: true }
    }
  ],
  // Restore scroll position on navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for the Auth to initialize
  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }
  
  // If the route requires authentication and the user is not logged in, redirect to the landing page
  if (to.meta.requiresAuth && !authStore.user) {
    next('/')
  }
  // Allow access to the route
  else {
    next()
  }
})

export default router
