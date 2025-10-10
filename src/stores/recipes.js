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

  // Create Recipe
  async function createRecipe(recipeData, ingredientsData = [], stepsData = []) {
    loading.value = true
    error.value = null

    try {
      // Save the main recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([recipeData])
        .select()
        .single()

      if (recipeError) {
        throw new Error(recipeError.message)
      }

      // Save the ingredients
      if (ingredientsData.length > 0) {
        const ingredientsToInsert = ingredientsData.map((ingredient, index) => ({
          recipe_id: recipe.id,
          ingredient_text: ingredient,
          order_index: index,
        }))

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsToInsert)

        if (ingredientsError) {
          // Rollback: Delete the recipe
          await supabase.from('recipes').delete().eq('id', recipe.id)
          throw new Error('Fehler beim Speichern der Zutaten: ' + ingredientsError.message)
        }
      }

      // Save the steps
      if (stepsData.length > 0) {
        const stepsToInsert = stepsData.map((step, index) => ({
          recipe_id: recipe.id,
          step_text: step,
          step_number: index + 1,
        }))

        const { error: stepsError } = await supabase.from('recipe_steps').insert(stepsToInsert)

        if (stepsError) {
          // Rollback: Delete the recipe and the ingredients
          await supabase.from('recipes').delete().eq('id', recipe.id)
          throw new Error('Fehler beim Speichern der Schritte: ' + stepsError.message)
        }
      }

      // Update the local state
      recipes.value.unshift(recipe)
      return recipe
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update Recipe
  async function updateRecipe(id, recipeData, ingredientsData, stepsData) {
    loading.value = true
    error.value = null

    try {
      let { error: updateError } = await supabase.from('recipes').update(recipeData).eq('id', id)
      if (updateError) throw updateError

      // Alte Zutaten und Schritte löschen
      await supabase.from('recipe_ingredients').delete().eq('recipe_id', id)
      await supabase.from('recipe_steps').delete().eq('recipe_id', id)

      // Zutaten und Schritte parallel einfügen (schneller als nacheinander)
      const ingredientsToInsert = ingredientsData.map((ingredient, index) => ({
        recipe_id: id,
        ingredient_text: ingredient,
        order_index: index + 1,
      }))
      const stepsToInsert = stepsData.map((step, index) => ({
        recipe_id: id,
        step_text: step,
        step_number: index + 1,
      }))

      const [ingredientsResult, stepsResult] = await Promise.all([
        supabase.from('recipe_ingredients').insert(ingredientsToInsert),
        supabase.from('recipe_steps').insert(stepsToInsert),
      ])

      if (ingredientsResult.error) throw ingredientsResult.error
      if (stepsResult.error) throw stepsResult.error

      // Get the updated recipe
      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(*), recipe_steps(*)')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Update the local state
      currentRecipe.value = data

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete Recipe
  async function deleteRecipe(id) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase.from('recipes').delete().eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      recipes.value = recipes.value.filter((recipe) => recipe.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
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
    createRecipe,
    updateRecipe,
    deleteRecipe,
    fetchRecipeById,
  }
})
