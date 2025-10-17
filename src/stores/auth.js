import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isInitialized = ref(false)
  const passwordMinLength = 6

  // Helper function for German error messages
  function translateSupabaseError(errorMessage) {
    if (!errorMessage) return ''

    const translations = [
      { en: 'Invalid login credentials', de: 'Ungültige Anmeldedaten' },
      { en: 'User already registered', de: 'Benutzer ist bereits registriert' },
      { en: 'User not found', de: 'Benutzer nicht gefunden' },
      { en: 'Invalid email', de: 'Ungültige E-Mail-Adresse' },
      { en: 'Password cannot be empty', de: 'Passwort darf nicht leer sein' },
      { en: 'Session expired', de: 'Sitzung abgelaufen, bitte neu anmelden' },
    ]

    for (const t of translations) {
      if (errorMessage.includes(t.en)) {
        return t.de
      }
    }
    // Fallback - give the original message if no translation is found
    return errorMessage
  }

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

      // Check for Supabase errors and translate
      if (result.error) {
        error.value = translateSupabaseError(result.error.message)
        loading.value = false
        return
      }
      error.value = null
    } catch (err) {
      error.value = translateSupabaseError(err.message)
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
        error.value = translateSupabaseError(result.error.message)
      }
    } catch (err) {
      error.value = translateSupabaseError(err.message)
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
    translateSupabaseError,
    signUp,
    signIn,
    signOut,
    initializeAuth,
  }
})
