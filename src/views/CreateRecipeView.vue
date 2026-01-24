<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
    <!-- Navigation Header -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div class="max-w-2xl mx-auto px-3 md:px-6 py-3 md:py-4">
        <div class="flex justify-between items-center">
          <button
            class="flex items-center px-2 md:px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors text-sm md:text-base"
            type="button" @click="goBack">
            <svg class="w-5 h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span class="hidden sm:inline">Zurück</span>
          </button>

          <h1
            class="text-base md:text-lg font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            {{ isEditMode ? 'Rezept bearbeiten' : 'Rezept erstellen' }}
          </h1>

          <div class="flex gap-1 md:gap-2">
            <button
              class="flex items-center gap-1 px-2 md:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all cursor-pointer text-xs md:text-sm"
              type="button" @click="confirmReset">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="sm:inline">Reset</span>
            </button>
            <button
              class="px-3 md:px-6 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-xs md:text-sm"
              type="button" @click="saveRecipe" form="recipe-form" :disabled="!isFormValid || recipesStore.loading">
              {{ recipesStore.loading ? 'Speichere...' : 'Speichern' }}
            </button>
          </div>
        </div>
      </div>
    </nav>




    <div class="max-w-2xl mx-auto p-6">
      <form class="space-y-8" id="recipe-form" @submit.prevent="saveRecipe">
        <!-- General Error -->
        <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {{ errors.general }}
        </div>

        <!-- Title Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Rezepttitel *
          </label>
          <input
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            id="title" type="text" v-model="title" placeholder="Wie heißt dein Rezept?" maxlength="150" />
          <div class="flex justify-between mt-1">
            <div v-if="errors.title" class="text-red-600 text-sm">{{ errors.title }}</div>
            <div class="text-sm text-gray-500">{{ title.length }}/150</div>
          </div>
        </div>

        <!-- Basic Info Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Grundinformationen</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
                Dauer in Minuten *
              </label>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                id="duration" type="number" v-model.number="duration" placeholder="z.B. 30" min="1" />
              <div v-if="errors.duration" class="text-red-600 text-sm mt-1">
                {{ errors.duration }}
              </div>
            </div>

            <div>
              <label for="mealType" class="block text-sm font-medium text-gray-700 mb-2">
                Mahlzeit *
              </label>
              <select id="mealType" v-model="mealType"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all">
                <option value="Frühstück">Frühstück</option>
                <option value="Vorspeise">Vorspeise</option>
                <option value="Hauptspeise">Hauptspeise</option>
                <option value="Beilage">Beilage</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
              </select>
              <div v-if="errors.mealType" class="text-red-600 text-sm mt-1">
                {{ errors.mealType }}
              </div>
            </div>
          </div>

          <!-- Portions Control -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Portionen</label>
            <div class="flex items-center space-x-3">
              <button type="button" @click="portions > 1 && portions--" :disabled="portions <= 1"
                class="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-orange-600 font-bold transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>

              <input
                class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-20 px-3 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-lg md:text-base"
                type="number" v-model.number="portions" min="1" />

              <button type="button" @click="portions++"
                class="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 flex items-center justify-center text-orange-600 font-bold transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                  </path>
                </svg>
              </button>

              <span class="text-sm text-gray-600">{{
                portions === 1 ? 'Portion' : 'Portionen'
                }}</span>
            </div>

          </div>
        </div>

        <!-- Ingredients Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Zutaten
            <span class="text-sm font-normal text-gray-500">({{ ingredients.length }} {{ ingredients.length === 1 ?
              'Zutat' : 'Zutaten' }})</span>
          </h3>

          <!-- Existing Ingredients -->
          <draggable v-model="ingredients" handle=".drag-handle" animation="150" item-key="index" class="space-y-3 mb-4"
            v-if="ingredients.length > 0">
            <template #item="{ element: ingredient, index }">
              <div
                class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                <!-- Drag Handle -->
                <div class="drag-handle cursor-move p-1 text-orange-400 hover:text-orange-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                  </svg>
                </div>

                <span class="flex-1 mx-3 text-gray-900">{{ ingredient }}</span>

                <div class="flex items-center space-x-2">
                  <button type="button" @click="editIngredient(index)"
                    class="p-1 text-orange-600 hover:text-orange-800 transition-colors" title="Bearbeiten">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                  </button>
                  <button type="button" @click="removeIngredient(index)"
                    class="p-1 text-red-600 hover:text-red-800 transition-colors" title="Löschen">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>

          <!-- Add Ingredient -->
          <div class="flex flex-col sm:flex-row gap-2">
            <input
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              type="text" v-model="currentIngredient" placeholder="z.B. 200g Mehl"
              @keydown.enter="addOrUpdateIngredient" />
            <button type="button" @click="addOrUpdateIngredient" :disabled="!currentIngredient.trim()"
              class="px-4 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md whitespace-nowrap">
              {{ editingIngredientIndex !== null ? 'Aktualisieren' : 'Hinzufügen' }}
            </button>
            <button v-if="editingIngredientIndex !== null" type="button" @click="cancelEditIngredient"
              class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all whitespace-nowrap">
              Abbrechen
            </button>
          </div>

        </div>

        <!-- Steps Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Zubereitung
            <span class="text-sm font-normal text-gray-500">({{ steps.length }} {{ steps.length === 1 ? 'Schritt' :
              'Schritte'
            }})</span>
          </h3>

          <!-- Existing Steps -->
          <draggable v-model="steps" handle=".drag-handle" animation="150" item-key="index" class="space-y-3 mb-4"
            v-if="steps.length > 0">
            <template #item="{ element: step, index }">
              <div
                class="flex items-start justify-between p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200">
                <!-- Drag Handle -->
                <div class="drag-handle cursor-move p-1 text-orange-400 hover:text-orange-600 mt-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                  </svg>
                </div>

                <div class="flex-1 mx-3">
                  <div class="text-sm font-medium text-orange-600 mb-1">Schritt {{ index + 1 }}</div>
                  <div class="text-gray-900">{{ step }}</div>
                </div>

                <div class="flex items-center space-x-2">
                  <button type="button" @click="editStep(index)"
                    class="p-1 text-orange-600 hover:text-orange-800 transition-colors" title="Bearbeiten">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                  </button>
                  <button type="button" @click="removeStep(index)"
                    class="p-1 text-red-600 hover:text-red-800 transition-colors" title="Löschen">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>

          <!-- Add Step -->
          <div class="flex flex-col gap-2">
            <textarea
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-y min-h-[80px]"
              v-model="currentStep" :placeholder="editingStepIndex !== null
                ? 'Schritt bearbeiten'
                : `Schritt ${steps.length + 1} hinzufügen`
                " @keydown.enter.prevent="addOrUpdateStep" rows="3"></textarea>
            <div class="flex flex-col sm:flex-row gap-2">
              <button type="button" @click="addOrUpdateStep" :disabled="!currentStep.trim()"
                class="px-4 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md whitespace-nowrap flex-1 sm:flex-initial">
                {{ editingStepIndex !== null ? 'Aktualisieren' : 'Hinzufügen' }}
              </button>
              <button v-if="editingStepIndex !== null" type="button" @click="cancelEditStep"
                class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all whitespace-nowrap flex-1 sm:flex-initial">
                Abbrechen
              </button>
            </div>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Rezeptbild (optional)</h3>

          <!-- Upload Area -->
          <div
            class="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors bg-gradient-to-br from-orange-50 to-pink-50">
            <input id="image" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />

            <!-- Upload State -->
            <div v-if="!imagePreview && !isUploading">
              <svg class="w-12 h-12 mx-auto text-orange-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6">
                </path>
              </svg>
              <label for="image" class="cursor-pointer">
                <span class="text-orange-600 hover:text-orange-700 font-medium">Bild hochladen</span>
                <span class="text-gray-600"> oder hier hineinziehen</span>
              </label>
              <p class="text-sm text-gray-500 mt-2">PNG, JPG bis zu 10MB</p>
            </div>

            <!-- Loading State -->
            <div v-else-if="isUploading" class="py-8">
              <div
                class="w-12 h-12 mx-auto mb-4 border-4 border-orange-600 border-t-transparent rounded-full animate-spin">
              </div>
              <p class="text-gray-600">Bild wird hochgeladen...</p>
            </div>

            <!-- Preview State -->
            <div v-else class="space-y-4">
              <img :src="imagePreview" alt="Vorschau" class="max-w-xs max-h-48 mx-auto rounded-lg shadow-md" />
              <div class="flex justify-center space-x-3">
                <label for="image"
                  class="px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-lg hover:from-orange-700 hover:to-pink-700 cursor-pointer transition-all shadow-md">
                  Bild ändern
                </label>
                <button type="button" @click="removeImage"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- Confirmation Modal -->
  <div v-if="showResetConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="showResetConfirmation = false">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all">
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
        {{ isEditMode ? 'Änderungen verwerfen?' : 'Felder leeren?' }}
      </h3>
      <p class="text-gray-600 mb-6 text-center">
        {{ resetModalText }}
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="showResetConfirmation = false"
          class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
          Abbrechen
        </button>
        <button @click="executeReset"
          class="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 cursor-pointer transition-all shadow-md">
          {{ isEditMode ? 'Verwerfen' : 'Alles löschen' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports for Vue, Router, Stores and Supabase
import { useRecipesStore } from '@/stores/recipes'
import { useAuthStore } from '@/stores/auth'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import draggable from 'vuedraggable'

// Form States
const title = ref('')
const portions = ref(2)
const duration = ref(30)
const mealType = ref('Hauptspeise')
const ingredients = ref([])
const currentIngredient = ref('')
const editingIngredientIndex = ref(null)
const steps = ref([])
const currentStep = ref('')
const editingStepIndex = ref(null)
const selectedImage = ref(null)
const imagePreview = ref('')
const uploadedImageUrl = ref('')
const recipesStore = useRecipesStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isUploading = ref(false)
const errors = ref({})
const LS_KEY = 'mealkeeper-create-recipe' // Local Storage Key for Recipe Data
const originalRecipeData = ref(null)
const showResetConfirmation = ref(false)

// Check if the route is an edit route
const isEditMode = computed(() => !!route.params.id)

// Reset Modal Text based on mode
const resetModalText = computed(() => {
  return isEditMode.value
    ? 'Alle Änderungen werden verworfen und die Original-Daten wiederhergestellt. Diese Aktion kann nicht rückgängig gemacht werden.'
    : 'Alle eingegebenen Daten werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.'
})


// Function to check if the form is valid
const isFormValid = computed(() => {
  const hasTitle = title.value && title.value.trim().length > 0 && title.value.length <= 150
  const hasIngredients = ingredients.value.length > 0
  const hasSteps = steps.value.length > 0
  const hasDuration = duration.value > 0
  const hasMealType = mealType.value && mealType.value.trim().length > 0

  return hasTitle && hasIngredients && hasSteps && hasDuration && hasMealType
})

// Function to add or update an ingredient
function addOrUpdateIngredient() {
  if (!currentIngredient.value.trim()) return

  if (editingIngredientIndex.value !== null) {
    // Update the ingredient at the original position
    ingredients.value[editingIngredientIndex.value] = currentIngredient.value.trim()
    cancelEditIngredient()
  } else {
    // Add new ingredient
    ingredients.value.push(currentIngredient.value.trim())
    currentIngredient.value = ''
  }
}

// Function to remove an ingredient
function removeIngredient(index) {
  ingredients.value.splice(index, 1)
  // If the ingredient is being edited, cancel the edit
  if (editingIngredientIndex.value === index) {
    cancelEditIngredient()
  }
}

// Function to edit an ingredient
function editIngredient(index) {
  currentIngredient.value = ingredients.value[index]
  editingIngredientIndex.value = index
}

// Function to cancel the edit of an ingredient
function cancelEditIngredient() {
  currentIngredient.value = ''
  editingIngredientIndex.value = null
}

// Function to add or update a step
function addOrUpdateStep() {
  if (!currentStep.value.trim()) return

  if (editingStepIndex.value !== null) {
    // Update the step at the original position
    steps.value[editingStepIndex.value] = currentStep.value.trim()
    cancelEditStep()
  } else {
    // Add new step
    steps.value.push(currentStep.value.trim())
    currentStep.value = ''
  }
}

// Function to remove a step
function removeStep(index) {
  steps.value.splice(index, 1)
  // If the step is being edited, cancel the edit
  if (editingStepIndex.value === index) {
    cancelEditStep()
  }
}

// Function to edit a step
function editStep(index) {
  currentStep.value = steps.value[index]
  editingStepIndex.value = index
}

// Function to cancel the edit of a step
function cancelEditStep() {
  currentStep.value = ''
  editingStepIndex.value = null
}

// Function to handle the image upload
async function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  // Check the file size (10mb max)
  if (file.size > 10 * 1024 * 1024) {
    errors.value.general = 'Datei ist zu groß. Maximum 10MB erlaubt.'
    return
  }

  // Check the file type
  if (!file.type.startsWith('image/')) {
    errors.value.general = 'Nur Bilddateien sind erlaubt.'
    return
  }

  // Instant preview
  selectedImage.value = file
  imagePreview.value = URL.createObjectURL(file)

  // Upload in the background
  const uploadedPath = await uploadToSupabase(file)
  if (uploadedPath) {
    uploadedImageUrl.value = uploadedPath
    console.log('Bild erfolgreich hochgeladen:', uploadedPath)
  }
}

// Function to remove the image
function removeImage() {
  selectedImage.value = null
  imagePreview.value = ''
  uploadedImageUrl.value = ''

  // Clear the file input
  const fileInput = document.getElementById('image')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Function to go back to the recipes list
function goBack() {
  router.push('/recipes')
}

// Function to upload the image to Supabase
async function uploadToSupabase(file) {
  if (!file) return null

  isUploading.value = true
  try {
    const fileName = `recipes/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { data, error } = await supabase.storage.from('recipe-images').upload(fileName, file)

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('recipe-images').getPublicUrl(data.path)

    return publicUrl
  } catch (err) {
    console.error('Upload failed:', err)
    return null
  } finally {
    isUploading.value = false
  }
}

// Function to validate the form
function validateForm() {
  errors.value = {}

  if (!title.value.trim()) {
    errors.value.title = 'Titel ist erforderlich'
  } else if (title.value.length > 150) {
    errors.value.title = 'Titel darf maximal 150 Zeichen haben'
  }

  if (!duration.value || duration.value <= 0) {
    errors.value.duration = 'Dauer muss größer als 0 sein'
  }

  if (!mealType.value) {
    errors.value.mealType = 'Mahlzeit muss ausgewählt werden'
  }

  if (ingredients.value.length === 0 && steps.value.length === 0) {
    errors.value.general = 'Mindestens eine Zutat oder ein Schritt ist erforderlich'
  }

  return Object.keys(errors.value).length === 0
}

// Function to reset the form
function resetForm() {
  title.value = ''
  portions.value = 2
  duration.value = 30
  mealType.value = 'Hauptspeise'
  ingredients.value = []
  steps.value = []
  currentIngredient.value = ''
  currentStep.value = ''
  editingIngredientIndex.value = null
  editingStepIndex.value = null
  removeImage()
  errors.value = {}
}

// Function to load the form data from local storage
function loadFromLocalStorage() {
  const saved = localStorage.getItem(LS_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      title.value = data.title || ''
      portions.value = data.portions || 2
      duration.value = data.duration || 30
      mealType.value = data.mealType || 'Hauptspeise'
      ingredients.value = data.ingredients || []
      steps.value = data.steps || []
      uploadedImageUrl.value = data.uploadedImageUrl || ''
      imagePreview.value = data.imagePreview || ''
    } catch (err) {
      console.error('Fehler beim Laden des localStorage:', err)
      // Remove localStorage
      localStorage.removeItem(LS_KEY)
    }
  }
}

// Function to load the recipe data
async function loadRecipeData() {
  if (!route.params.id) {
    return
  }

  await recipesStore.fetchRecipeById(route.params.id)

  const recipe = recipesStore.currentRecipe
  if (recipe) {
    // Fill the form values with the existing recipe data
    title.value = recipe.title || ''
    portions.value = recipe.portions || 2
    duration.value = recipe.duration_minutes || 30
    mealType.value = recipe.meal_type || 'Hauptspeise'

    // Copy the ingredients and steps arrays
    ingredients.value = recipe.recipe_ingredients.map((ing) => ing.ingredient_text)
    steps.value = recipe.recipe_steps.map((step) => step.step_text)

    // Set the image URL
    uploadedImageUrl.value = recipe.image_url || ''
    imagePreview.value = recipe.image_url || ''

    // Store the original data for reset
    originalRecipeData.value = {
      title: recipe.title || '',
      portions: recipe.portions || 2,
      duration: recipe.duration_minutes || 30,
      mealType: recipe.meal_type || 'Hauptspeise',
      ingredients: [...recipe.recipe_ingredients.map((ing) => ing.ingredient_text)],
      steps: [...recipe.recipe_steps.map((step) => step.step_text)],
      uploadedImageUrl: recipe.image_url || '',
      imagePreview: recipe.image_url || ''
    }
  }
}

// Function to save the recipe
async function saveRecipe() {
  if (!validateForm()) return

  const recipeData = {
    title: title.value.trim(),
    duration_minutes: parseInt(duration.value),
    portions: parseInt(portions.value),
    meal_type: mealType.value,
    user_id: authStore.user.id,
    image_url: uploadedImageUrl.value || '',
  }

  const ingredientsData = ingredients.value
  const stepsData = steps.value

  try {
    let savedRecipe
    if (isEditMode.value) {
      // Update route: get the updated recipe back
      savedRecipe = await recipesStore.updateRecipe(
        route.params.id,
        recipeData,
        ingredientsData,
        stepsData,
      )
    } else {
      // Create route: create new recipe
      savedRecipe = await recipesStore.createRecipe(recipeData, ingredientsData, stepsData)
      // Remove localStorage
      localStorage.removeItem(LS_KEY)
    }

    resetForm()

    // Navigate to the detail page of the saved recipe
    router.push(`/recipes/${savedRecipe.id}`)
  } catch (err) {
    errors.value.general = 'Fehler beim Speichern: ' + err.message
    console.error(err)
  }
}

// Function to show reset confirmation
function confirmReset() {
  showResetConfirmation.value = true
}

// Function to execute reset (wird vom Modal aufgerufen)
function executeReset() {
  resetToOriginal()
  showResetConfirmation.value = false
}

// Function to reset to original state
function resetToOriginal() {
  if (isEditMode.value && originalRecipeData.value) {
    title.value = originalRecipeData.value.title
    portions.value = originalRecipeData.value.portions
    duration.value = originalRecipeData.value.duration
    mealType.value = originalRecipeData.value.mealType
    ingredients.value = [...originalRecipeData.value.ingredients]
    steps.value = [...originalRecipeData.value.steps]
    uploadedImageUrl.value = originalRecipeData.value.uploadedImageUrl
    imagePreview.value = originalRecipeData.value.imagePreview

    const fileInput = document.getElementById('image')
    if (fileInput) {
      fileInput.value = ''
    }
    selectedImage.value = null
  } else {
    resetForm()
    localStorage.removeItem(LS_KEY)
  }
  currentIngredient.value = ''
  currentStep.value = ''
  editingIngredientIndex.value = null
  editingStepIndex.value = null
  errors.value = {}
}

// Function to load the recipe data on mount
onMounted(() => {
  if (isEditMode.value) {
    loadRecipeData()
  } else {
    loadFromLocalStorage()
  }
})

// Function to watch the edit mode
watch(isEditMode, (newVal) => {
  if (newVal) {
    loadRecipeData()
  }
})

// Function to watch the form data
watch(
  [title, portions, duration, mealType, ingredients, steps, uploadedImageUrl, imagePreview],
  ([
    newTitle,
    newPortions,
    newDuration,
    newMealType,
    newIngredients,
    newSteps,
    newImageUrl,
    newPreview,
  ]) => {
    // Only save if not in edit mode
    if (!isEditMode.value) {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          title: newTitle,
          portions: newPortions,
          duration: newDuration,
          mealType: newMealType,
          ingredients: newIngredients,
          steps: newSteps,
          uploadedImageUrl: newImageUrl,
          imagePreview: newPreview,
        }),
      )
    }
  },
  { deep: true },
)
</script>
