<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <button
        class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        type="button"
        @click="goBack"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Zurück
      </button>

      <h1 class="text-lg font-semibold text-gray-900">Rezept erstellen</h1>

      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        type="button"
        @click="saveRecipe"
        form="recipe-form"
        :disabled="!isFormValid || recipesStore.loading"
      >
        {{ recipesStore.loading ? 'Speichere...' : 'Speichern' }}
      </button>
    </nav>

    <div class="max-w-2xl mx-auto p-6">
      <form class="space-y-8" id="recipe-form" @submit.prevent="saveRecipe">
        <!-- General Error -->
        <div
          v-if="errors.general"
          class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
        >
          {{ errors.general }}
        </div>

        <!-- Title Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Rezepttitel *
          </label>
          <input
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            id="title"
            type="text"
            v-model="title"
            placeholder="Wie heißt dein Rezept?"
            maxlength="150"
          />
          <div class="flex justify-between mt-1">
            <div v-if="errors.title" class="text-red-600 text-sm">{{ errors.title }}</div>
            <div class="text-sm text-gray-500">{{ title.length }}/150</div>
          </div>
        </div>

        <!-- Basic Info Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Grundinformationen</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-2">
                Dauer in Minuten *
              </label>
              <input
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                id="duration"
                type="number"
                v-model.number="duration"
                placeholder="z.B. 30"
                min="1"
              />
              <div v-if="errors.duration" class="text-red-600 text-sm mt-1">
                {{ errors.duration }}
              </div>
            </div>

            <div>
              <label for="mealType" class="block text-sm font-medium text-gray-700 mb-2">
                Mahlzeit *
              </label>
              <select
                id="mealType"
                v-model="mealType"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
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
              <button
                type="button"
                @click="portions > 1 && portions--"
                :disabled="portions <= 1"
                class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  ></path>
                </svg>
              </button>

              <input
                class="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                type="number"
                v-model.number="portions"
                min="1"
              />

              <button
                type="button"
                @click="portions++"
                class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </button>

              <span class="text-sm text-gray-600">{{
                portions === 1 ? 'portion' : 'Portionen'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Ingredients Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Zutaten
            <span class="text-sm font-normal text-gray-500">({{ ingredients.length }})</span>
          </h3>

          <!-- Existing Ingredients -->
          <draggable
            v-model="ingredients"
            handle=".drag-handle"
            animation="150"
            item-key="index"
            class="space-y-3 mb-4"
            v-if="ingredients.length > 0"
          >
            <template #item="{ element: ingredient, index }">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <!-- Drag Handle -->
                <div class="drag-handle cursor-move p-1 text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8h16M4 16h16"
                    ></path>
                  </svg>
                </div>

                <span class="flex-1 mx-3 text-gray-900">{{ ingredient }}</span>

                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="editIngredient(index)"
                    class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Bearbeiten"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="removeIngredient(index)"
                    class="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Löschen"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>

          <!-- Add Ingredient -->
          <div class="flex space-x-2">
            <input
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="text"
              v-model="currentIngredient"
              placeholder="z.B. 200g Mehl"
              @keyup.enter="addOrUpdateIngredient"
            />
            <button
              type="button"
              @click="addOrUpdateIngredient"
              :disabled="!currentIngredient.trim()"
              class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {{ editingIngredientIndex !== null ? 'Aktualisieren' : 'Hinzufügen' }}
            </button>
            <button
              v-if="editingIngredientIndex !== null"
              type="button"
              @click="cancelEditIngredient"
              class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Abbrechen
            </button>
          </div>
        </div>

        <!-- Steps Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Zubereitung
            <span class="text-sm font-normal text-gray-500"
              >({{ steps.length }} {{ steps.length === 1 ? 'Schritt' : 'Schritte' }})</span
            >
          </h3>

          <!-- Existing Steps -->
          <draggable
            v-model="steps"
            handle=".drag-handle"
            animation="150"
            item-key="index"
            class="space-y-3 mb-4"
            v-if="steps.length > 0"
          >
            <template #item="{ element: step, index }">
              <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg border">
                <!-- Drag Handle -->
                <div class="drag-handle cursor-move p-1 text-gray-400 hover:text-gray-600 mt-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8h16M4 16h16"
                    ></path>
                  </svg>
                </div>

                <div class="flex-1 mx-3">
                  <div class="text-sm font-medium text-blue-600 mb-1">Schritt {{ index + 1 }}</div>
                  <div class="text-gray-900">{{ step }}</div>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="editStep(index)"
                    class="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Bearbeiten"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="removeStep(index)"
                    class="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Löschen"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>

          <!-- Add Step -->
          <div class="flex space-x-2">
            <input
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              type="text"
              v-model="currentStep"
              :placeholder="
                editingStepIndex !== null
                  ? 'Schritt bearbeiten'
                  : `Schritt ${steps.length + 1} hinzufügen`
              "
              @keyup.enter="addOrUpdateStep"
            />
            <button
              type="button"
              @click="addOrUpdateStep"
              :disabled="!currentStep.trim()"
              class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {{ editingStepIndex !== null ? 'Aktualisieren' : 'Hinzufügen' }}
            </button>
            <button
              v-if="editingStepIndex !== null"
              type="button"
              @click="cancelEditStep"
              class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Abbrechen
            </button>
          </div>
        </div>

        <!-- Image Upload Section -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Rezeptbild (optional)</h3>

          <!-- Upload Area -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
          >
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
            />

            <!-- Upload State -->
            <div v-if="!imagePreview && !isUploading">
              <svg
                class="w-12 h-12 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <label for="image" class="cursor-pointer">
                <span class="text-blue-600 hover:text-blue-700 font-medium">Bild hochladen</span>
                <span class="text-gray-600"> oder hier hineinziehen</span>
              </label>
              <p class="text-sm text-gray-500 mt-2">PNG, JPG bis zu 10MB</p>
            </div>

            <!-- Loading State -->
            <div v-else-if="isUploading" class="py-8">
              <div
                class="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
              ></div>
              <p class="text-gray-600">Bild wird hochgeladen...</p>
            </div>

            <!-- Preview State -->
            <div v-else class="space-y-4">
              <img
                :src="imagePreview"
                alt="Vorschau"
                class="max-w-xs max-h-48 mx-auto rounded-lg shadow-sm"
              />
              <div class="flex justify-center space-x-3">
                <label
                  for="image"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Bild ändern
                </label>
                <button
                  type="button"
                  @click="removeImage"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRecipesStore } from '@/stores/recipes'
import { useAuthStore } from '@/stores/auth'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import draggable from 'vuedraggable'

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
const isEditMode = computed(() => !!route.params.id)
const LS_KEY = 'mealkeeper-create-recipe'

const isFormValid = computed(() => {
  const hasTitle = title.value && title.value.trim().length > 0 && title.value.length <= 150
  const hasIngredients = ingredients.value.length > 0
  const hasSteps = steps.value.length > 0
  const hasDuration = duration.value > 0
  const hasMealType = mealType.value && mealType.value.trim().length > 0

  return hasTitle && hasIngredients && hasSteps && hasDuration && hasMealType
})

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

function removeIngredient(index) {
  ingredients.value.splice(index, 1)
  // If the ingredient is being edited, cancel the edit
  if (editingIngredientIndex.value === index) {
    cancelEditIngredient()
  }
}

function editIngredient(index) {
  currentIngredient.value = ingredients.value[index]
  editingIngredientIndex.value = index
}

function cancelEditIngredient() {
  currentIngredient.value = ''
  editingIngredientIndex.value = null
}

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

function removeStep(index) {
  steps.value.splice(index, 1)
  // If the step is being edited, cancel the edit
  if (editingStepIndex.value === index) {
    cancelEditStep()
  }
}

function editStep(index) {
  currentStep.value = steps.value[index]
  editingStepIndex.value = index
}

function cancelEditStep() {
  currentStep.value = ''
  editingStepIndex.value = null
}

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

function goBack() {
  router.push('/')
}

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
  }
}

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

onMounted(() => {
  if (isEditMode.value) {
    loadRecipeData()
  } else {
    loadFromLocalStorage()
  }
})

watch(isEditMode, (newVal) => {
  if (newVal) {
    loadRecipeData()
  }
})

// Save form on changes
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
