import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

// Recipes Store
export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentRecipe = ref(null)

  // Fetch Recipes
  async function fetchRecipes() {
    loading.value = true
    error.value = null

    try {
      let query = supabase.from('recipes').select('*').order('created_at', { ascending: false })

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      recipes.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Fetch recipes error:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch Recipe by ID
  async function fetchRecipeById(id) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*), recipe_steps(*)')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }
      currentRecipe.value = data
    } catch (err) {
      error.value = err.message
      currentRecipe.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    loading,
    error,
    currentRecipe,
    fetchRecipes,
    fetchRecipeById,
  }
})
