import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LandingPage from '@/views/LandingPage.vue'
import HomeView from '@/views/HomeView.vue'
import CreateRecipeView from '@/views/CreateRecipeView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'

// Router configuration
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: LandingPage,
      meta: { requiresGuest: true }
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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // If the route requires authentication and the user is not logged in, redirect to the landing page
  if (to.meta.requiresAuth && !authStore.user) {
    next('/')
  }
  // If the route does not require authentication, allow access
  else {
    next()
  }
})

export default router
