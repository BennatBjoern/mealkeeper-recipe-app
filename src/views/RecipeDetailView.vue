<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
    <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <button @click="router.push('/recipes')"
            class="flex items-center cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Zurück
          </button>

          <div class="flex space-x-2">
            <button
              class="flex items-center gap-1 cursor-pointer bg-gradient-to-r from-orange-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-pink-700 transition-all text-sm font-medium shadow-md"
              @click="editRecipe">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                </path>
              </svg>
              Bearbeiten
            </button>
            <button
              class="flex items-center gap-1 cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-md"
              @click="confirmDelete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                </path>
              </svg>
              Löschen
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto p-6">
      <!-- Loading State -->
      <div v-if="recipesStore.loading" class="text-center py-12">
        <div
          class="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4">
        </div>
        <p class="text-gray-600">Rezept wird geladen...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="recipesStore.error"
        class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
        <h3 class="text-lg font-semibold mb-2">Fehler beim Laden</h3>
        <p>{{ recipesStore.error }}</p>
      </div>

      <!-- Recipe Content -->
      <div v-else-if="recipesStore.currentRecipe" class="space-y-6">
        <!-- Recipe Header -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          <!-- Recipe Image -->
          <div class="aspect-video bg-gray-200 relative">
            <img :src="`${recipesStore.currentRecipe.image_url}?width=600&quality=70` ||
              '/default-recipe.jpg'
              " :alt="recipesStore.currentRecipe.title" loading="lazy" class="w-full h-full object-cover"
              @error="$event.target.src = '/default-recipe.jpg'" />
          </div>

          <!-- Recipe Info -->
          <div class="p-6">
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {{ recipesStore.currentRecipe.title }}
            </h1>

            <!-- Meta Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Duration -->
              <div class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">{{ recipesStore.currentRecipe.duration_minutes }} Minuten</span>
              </div>

              <!-- Meal Type -->
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                  </path>
                </svg>
                <span
                  class="inline-block bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {{ recipesStore.currentRecipe.meal_type }}
                </span>
              </div>

              <!-- Created Date -->
              <div class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm">
                  Erstellt am {{ formatDate(recipesStore.currentRecipe.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ingredients Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h1 class="text-xl font-semibold text-gray-900 mb-4">Zutaten für {{ currentPortions }} Portionen</h1>

          <div class="flex items-center space-x-3 mb-6">
            <button @click="currentPortions > 1 && currentPortions--"
              class="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-orange-600 font-bold transition-all"
              :disabled="currentPortions <= 1">
              -
            </button>

            <input type="number" v-model.number="currentPortions" min="1"
              class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-20 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />

            <button @click="currentPortions++"
              class="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 flex justify-center items-center text-orange-600 font-bold transition-all">
              +
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="(ingredient, index) in adjustedIngredients" :key="index"
              class="flex items-center p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
              {{ ingredient }}
            </div>
          </div>
        </div>

        <!-- Preparation Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
          v-if="recipesStore.currentRecipe?.recipe_steps?.length > 0">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Zubereitung</h2>
          <div class="mb-3" v-for="step in sortedSteps" :key="step.id">
            <div class="p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200 space-x-3">
              <h3 class="font-semibold text-orange-600">Schritt {{ step.step_number }}:</h3>
              <span>{{ step.step_text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="text-center py-12">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Rezept nicht gefunden</h3>
        <p class="text-gray-600">Das gewünschte Rezept existiert nicht.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports for Vue, Router and Stores
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'

// Stores and Router Imports
const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()
const currentPortions = ref(null)

// Function to calculate the portion multiplier
const portionMultiplier = computed(() => {
  return currentPortions.value && recipesStore.currentRecipe?.portions
    ? currentPortions.value / recipesStore.currentRecipe.portions
    : 1
})

// Function to adjust the ingredients of the recipe
const adjustedIngredients = computed(() => {
  const originalIngredients = recipesStore.currentRecipe?.recipe_ingredients || []

  return originalIngredients.map((ingredient) => {
    const parsedData = parseIngredient(ingredient.ingredient_text)

    let newQuantity = parsedData.quantity
    if (newQuantity && portionMultiplier.value) {
      newQuantity = parsedData.quantity * portionMultiplier.value
    }

    const formattedQuantity = formatQuantity(newQuantity)

    if (!parsedData.quantity) {
      return parsedData.ingredient
    }

    return `${formattedQuantity}${parsedData.unit} ${parsedData.ingredient}`
  })
})

// Function to parse the ingredient of the recipe
function parseIngredient(ingredientText) {
  // Delete leading and double spaces
  ingredientText = ingredientText.trim().replace(/\s+/g, ' ')

  // Accept optional leading and double spaces
  const regex =
    /^(\d+(?:[.,]\d+)?)(?:\s*(g|kg|ml|l|EL|TL|Stk|Prise|Prisen|Bund|Becher|Tasse|Scheibe|Dose))?\s*(.*)$/i

  const match = ingredientText.match(regex)

  if (match) {
    return {
      quantity: parseFloat(match[1].replace(',', '.')), // Dezimalpunkt einheitlich
      unit: match[2] || '',
      ingredient: match[3].trim(),
    }
  } else {
    return {
      quantity: null,
      unit: '',
      ingredient: ingredientText,
    }
  }
}

// Function to format the quantity of the ingredients
function formatQuantity(quantity) {
  if (!quantity || isNaN(quantity)) {
    return ''
  }
  const rounded = Math.round(quantity * 10) / 10

  if (rounded === Math.floor(rounded)) {
    return rounded.toString()
  } else {
    return rounded.toFixed(1)
  }
}

// Function to format the date of the recipe
function formatDate(dateString) {
  if (dateString) {
    const date = new Date(dateString)
    if (!isNaN(date)) {
      return date.toLocaleDateString('de-DE')
    } else {
      return 'Unbekannt'
    }
  } else {
    return 'Unbekannt'
  }
}

// Function to sort the steps of the recipe
const sortedSteps = computed(() => {
  const steps = recipesStore.currentRecipe?.recipe_steps || []
  return steps.slice().sort((a, b) => a.step_number - b.step_number)
})

// Function to fetch the recipe by id
onMounted(async () => {
  const recipeId = route.params.id
  if (recipeId) {
    await recipesStore.fetchRecipeById(recipeId)
    currentPortions.value = recipesStore.currentRecipe?.portions || 2
  }
})

// Function to edit the recipe
function editRecipe() {
  router.push(`/recipes/${route.params.id}/edit`)
}

// Function to confirm the deletion of the recipe
async function confirmDelete() {
  if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
    try {
      await recipesStore.deleteRecipe(route.params.id)
      router.push('/recipes')
    } catch (err) {
      alert('Fehler beim Löschen: ' + err.message)
    }
  }
}
</script>
