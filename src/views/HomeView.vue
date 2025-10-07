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
    <div v-if="!authStore.user" class="max-w-md mx-auto pt-20 px-4">
      <div class="text-center mb-8">
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
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const showLogin = ref(false)
const email = ref('')
const password = ref('')
const username = ref('')
const passwordConfirm = ref('')
const authStore = useAuthStore()

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
</script>
