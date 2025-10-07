import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isInitialized = ref(false)
  const passwordMinLength = 6

  async function signUp(email, password, username, passwordConfirm) {
    loading.value = true
    error.value = null

    if (password.length < passwordMinLength) {
      error.value = `Das Passwort muss mindestens ${passwordMinLength} Zeichen lang sein`
      loading.value = false
      return
    }

    if (password !== passwordConfirm) {
      error.value = 'Passwörter stimmen nicht überein'
      loading.value = false
      return
    }

    try {
      const result = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { username } },
      })

      // User successfully registered
      if (result.data.user) {
        user.value = result.data.user
        console.log('Benutzer erfolgreich registriert')
      }
    } catch (err) {
      error.value = err.message
    }

    loading.value = false
  }

  async function signIn(email, password) {
    loading.value = true
    error.value = null
    try {
      const result = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (result.data.user) {
        user.value = result.data.user
      }
      if (result.error) {
        error.value = result.error.message
      }
    } catch (err) {
      error.value = err.message
    }
    loading.value = false
  }

  async function signOut() {
    loading.value = true
    await supabase.auth.signOut()
    user.value = null
    loading.value = false
  }

  async function initializeAuth() {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Session error:', error)
      }
      if (data.session) {
        user.value = data.session.user
      }
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
    isInitialized.value = true
    loading.value = false
  }

  return {
    user,
    loading,
    error,
    isInitialized,
    signUp,
    signIn,
    signOut,
    initializeAuth,
  }
})
