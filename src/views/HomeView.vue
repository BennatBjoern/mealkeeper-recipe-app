<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation for logged in users -->
    <nav v-if="authStore.user" class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <router-link
              to="/"
              class="px-3 py-2 text-gray-600 font-medium border-b-2 border-transparent"
            >
              <h1 class="text-xl font-bold text-gray-900">MealKeeper</h1>
            </router-link>
          </div>
          <div class="flex space-x-2">
            <router-link
              to="/create"
              class="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Erstellen
            </router-link>
            <button
              @click="logout"
              class="flex items-center gap-1 cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
                />
              </svg>
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Login/Register form-->
    <div v-if="!authStore.user" class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <img src="/public/logo.png" alt="MealKeeper" class="w-64 h-64 mx-auto" />
        <h1 class="text-3xl font-bold text-gray-900 mb-2">MealKeeper</h1>
        <p class="text-gray-600">Deine digitale Rezeptsammlung</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <!-- Tab System -->
        <div class="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all"
            @click="showLogin = false"
            :class="
              !showLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            "
          >
            Registrieren
          </button>
          <button
            class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all"
            @click="showLogin = true"
            :class="
              showLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            "
          >
            Login
          </button>
        </div>

        <!-- Error Message -->
        <div
          v-if="authStore.error"
          class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4"
        >
          {{ authStore.error }}
        </div>

        <!-- Register Form -->
        <div v-if="!showLogin">
          <form @submit.prevent="register" class="space-y-4">
            <div>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="text"
                v-model="username"
                placeholder="Benutzername"
                required
              />
            </div>
            <div>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="email"
                v-model="email"
                placeholder="E-Mail"
                required
              />
            </div>
            <div>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="password"
                v-model="password"
                placeholder="Passwort"
                required
              />
            </div>
            <div>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="password"
                v-model="passwordConfirm"
                placeholder="Passwort bestätigen"
                required
              />
            </div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {{ authStore.loading ? 'Lädt...' : 'Registrieren' }}
            </button>
          </form>
        </div>

        <!-- Login Form -->
        <div v-if="showLogin">
          <form @submit.prevent="login" class="space-y-4">
            <div>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-all transition-all"
                type="email"
                v-model="email"
                placeholder="E-Mail"
                required
              />
            </div>
            <div>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                type="password"
                v-model="password"
                placeholder="Passwort"
                required
              />
            </div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {{ authStore.loading ? 'Lädt...' : 'Anmelden' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Recipe area for users -->
    <div v-if="authStore.user" class="max-w-6xl mx-auto p-4 pt-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Deine Rezepte</h1>
        <p class="text-gray-600">Verwalte und entdecke deine Lieblingsrezepte</p>
      </div>

      <!-- Search Section -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              placeholder="Rezepte durchsuchen..."
              v-model="searchTerm"
              @input="onSearchInput"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="recipesStore.loading" class="text-center py-12">
        <div
          class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600">Rezepte werden geladen...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="recipesStore.error"
        class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center"
      >
        <svg
          class="w-12 h-12 mx-auto mb-4 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 class="text-lg font-semibold mb-2">Fehler beim Laden der Rezepte</h3>
        <p>{{ recipesStore.error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="recipesStore.recipes.length === 0" class="text-center py-12">
        <div
          class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Noch keine Rezepte vorhanden</h3>
        <p class="text-gray-600 mb-6">Erstelle dein erstes Rezept und baue deine Sammlung auf!</p>
        <router-link
          to="/create"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Erstes Rezept erstellen
        </router-link>
      </div>

      <!-- Recipe Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          @click="goToRecipe(recipe.id)"
          v-for="recipe in recipesStore.recipes"
          :key="recipe.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
        >
          <!-- Recipe Image -->
          <div class="aspect-video bg-gray-200 relative overflow-hidden">
            <img
              :src="recipe.image_url || '/default-recipe.jpg'"
              :alt="recipe.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              @error="$event.target.src = '/default-recipe.jpg'"
            />
            <div class="absolute top-3 left-3 right-3 flex justify-between items-start">
              <!-- Duration Badge left -->
              <div
                class="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {{ recipe.duration_minutes }} Min
              </div>
              <!-- Meal Type Badge right -->
              <span
                class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700"
              >
                {{ recipe.meal_type }}
              </span>
            </div>
          </div>

          <!-- Recipe Title -->
          <div class="p-4">
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
            >
              {{ recipe.title }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, watch } from 'vue'
import { useRecipesStore } from '@/stores/recipes'
import { useRouter } from 'vue-router'

const showLogin = ref(false)
const email = ref('')
const password = ref('')
const username = ref('')
const passwordConfirm = ref('')
const authStore = useAuthStore()
const recipesStore = useRecipesStore()
const router = useRouter()
const searchTerm = ref('')

// Go to Recipe
function goToRecipe(recipeId) {
  router.push(`/recipes/${recipeId}`)
}

// Search Input
async function onSearchInput() {
  await recipesStore.fetchRecipes(searchTerm.value)
}

// Register
async function register() {
  await authStore.signUp(email.value, password.value, username.value, passwordConfirm.value)
  if (!authStore.error) {
    console.log('Erfolgreich registriert')
  }
}

// Login
async function login() {
  await authStore.signIn(email.value, password.value)
  if (authStore.user) {
    console.log('Erfolgreich eingeloggt')
  }
}

// Logout
async function logout() {
  await authStore.signOut()
  console.log('Erfolgreich abgemeldet')
}

// Watch User
watch(
  () => authStore.user,
  async (user) => {
    if (user) {
      await recipesStore.fetchRecipes()
    }
  },
  { immediate: true },
)
</script>
