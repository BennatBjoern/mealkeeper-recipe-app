<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 overflow-x-hidden">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div class="flex items-center justify-between">
          <h1
            class="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            🍳 MealKeeper
          </h1>
          <div class="flex space-x-2 md:space-x-4">
            <button v-if="!authStore.user" @click="showLogin = true"
              class="px-3 md:px-6 py-2 text-orange-600 font-medium hover:text-orange-700 cursor-pointer transition-colors text-sm md:text-base">
              Anmelden
            </button>
            <button v-if="!authStore.user" @click="showRegister = true"
              class="px-3 md:px-6 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-pink-700 cursor-pointer transition-all shadow-lg text-sm md:text-base">
              <span class="hidden sm:inline">Jetzt starten</span>
              <span class="sm:hidden">Jetzt starten</span>
            </button>
            <router-link v-else to="/recipes"
              class="px-3 md:px-6 py-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all shadow-lg text-sm md:text-base">
              <span class="hidden sm:inline">Zu meinen Rezepten</span>
              <span class="sm:hidden">Meine Rezepte</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-6xl mx-auto px-6 py-24 text-center">
      <div class="mb-12">
        <div
          class="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-8">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          Kostenlos und sicher
        </div>
        <h1
          class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-orange-700 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
          Deine Rezepte.<br>
          Immer griffbereit.
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Sammle, organisiere und teile deine Lieblingsrezepte. Mit automatischer Portionsanpassung, Bild-Upload und
          einfacher Navigation.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button @click="showRegister = true"
            class="px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:from-orange-700 cursor-pointer hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto">
            Kostenlos starten
          </button>
          <button @click="scrollToFeatures"
            class="px-8 py-4 border-2 border-gray-200 text-gray-900 font-medium rounded-2xl hover:bg-gray-50 transition-all cursor-pointer hover:shadow-lg w-full sm:w-auto">
            Features entdecken
          </button>
        </div>
      </div>

      <!-- Visual Preview -->
      <div class="relative mt-16">
        <div
          class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-3xl blur-3xl">
        </div>
        <div class="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-left">
              <div
                class="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Einfache Bedienung</h3>
              <p class="text-gray-600">Intuitive Oberfläche für schnelles Rezept-Management.</p>
            </div>
            <div class="text-left">
              <div
                class="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Portionsanpassung</h3>
              <p class="text-gray-600">Automatische Skalierung aller Zutatenmengen.</p>
            </div>
            <div class="text-left">
              <div
                class="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Cloud-Sync</h3>
              <p class="text-gray-600">Alle Rezepte sicher in der Cloud gespeichert.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="max-w-6xl mx-auto px-6 py-24">
      <div class="text-center mb-20">
        <h2
          class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
          Alles, was du für deine Rezepte brauchst
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Von der einfachen Rezept-Erstellung bis zur professionellen Organisation – MealKeeper macht es dir leicht.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
          <div
            class="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Rezepte verwalten</h3>
          <p class="text-gray-600 leading-relaxed">Erstelle, bearbeite und organisiere deine Rezepte mit Drag & Drop für
            Zutaten und Schritte.</p>
        </div>
        <div class="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
          <div
            class="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Portionsanpassung</h3>
          <p class="text-gray-600 leading-relaxed">Skaliere Zutatenmengen automatisch für jede Anzahl Portionen –
            perfekt für jede Gelegenheit.</p>
        </div>
        <div class="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
          <div
            class="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Bild-Upload</h3>
          <p class="text-gray-600 leading-relaxed">Lade appetitliche Fotos hoch und mache deine Rezepte visuell
            ansprechend.</p>
        </div>
        <div class="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
          <div
            class="w-14 h-14 bg-gradient-to-r from-rose-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Suche & Filter*</h3>
          <p class="text-gray-600 leading-relaxed">Finde deine Rezepte schnell mit der intelligenten Suchfunktion.</p>
          <p class="text-gray-600 leading-relaxed font-size-xs">*in der nächsten Version</p>
        </div>
        <div class="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
          <div
            class="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Privat & Sicher</h3>
          <p class="text-gray-600 leading-relaxed">Deine Rezepte sind nur für dich sichtbar und sicher verschlüsselt.
          </p>
        </div>
        <div class="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
          <div
            class="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Responsive Design</h3>
          <p class="text-gray-600 leading-relaxed">Funktioniert perfekt auf Desktop, Tablet und Smartphone.</p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-orange-600 to-pink-600 text-white py-24">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">Bereit für deine Rezepte?</h2>
        <p class="text-xl mb-12 opacity-90">Vertraue jetzt auf MealKeeper.</p>
        <button @click="showRegister = true"
          class="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl hover:bg-gray-50 cursor-pointer transition-all shadow-2xl transform hover:-translate-y-1">
          Jetzt kostenlos starten
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-12">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">🍳 MealKeeper</h3>
        <p class="text-gray-600 mb-8">Deine Rezepte. Dein Zuhause. Deine Küche.</p>
        <div class="flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-500">
          <span>&copy; 2026 MealKeeper</span>
        </div>
      </div>
    </footer>

    <!-- Login/Register Modal -->
    <div v-if="showLogin || showRegister" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModals">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ showLogin ? 'Anmelden' : 'Registrieren' }}</h2>
          <button @click="closeModals" class="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
          {{ authStore.error }}
        </div>

        <!-- Register Form -->
        <form v-if="showRegister" @submit.prevent="register" class="space-y-4">
          <input
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            type="text" v-model="username" placeholder="Benutzername" required />
          <input
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            type="email" v-model="email" placeholder="E-Mail" required />
          <!-- Passwort mit Toggle -->
          <div class="relative">
            <input
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Passwort" required />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <div class="relative">
            <input
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              :type="showPasswordConfirm ? 'text' : 'password'" v-model="passwordConfirm"
              placeholder="Passwort bestätigen" required />
            <button type="button" @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <svg v-if="showPasswordConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <button type="submit" :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 cursor-pointer transition-all">
            {{ authStore.loading ? 'Lädt...' : 'Registrieren' }}
          </button>
          <p class="text-center text-sm text-gray-600">
            Hast du schon einen Account?
            <button type="button" @click="showLogin = true; showRegister = false"
              class="text-orange-600 font-medium hover:underline cursor-pointer">
              Jetzt anmelden
            </button>
          </p>
        </form>

        <!-- Login Form -->
        <form v-if="showLogin" @submit.prevent="login" class="space-y-4">
          <input
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            type="email" v-model="email" placeholder="E-Mail" required />
          <div class="relative">
            <input
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Passwort" required />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <button type="submit" :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 cursor-pointer transition-all">
            {{ authStore.loading ? 'Lädt...' : 'Anmelden' }}
          </button>
          <p class="text-center text-sm text-gray-600">
            Noch kein Account?
            <button type="button" @click="showLogin = false; showRegister = true"
              class="text-orange-600 font-medium hover:underline cursor-pointer">
              Jetzt registrieren
            </button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports for Auth Store, Router and Vue
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Stores and Router Imports
const authStore = useAuthStore()
const router = useRouter()

// Modal States for Login and Register
const showLogin = ref(false)
const showRegister = ref(false)
const email = ref('')
const password = ref('')
const username = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

// Close Modals Function to reset the form
function closeModals() {
  showLogin.value = false
  showRegister.value = false
  email.value = ''
  password.value = ''
  username.value = ''
  passwordConfirm.value = ''
  showPassword.value = false
  showPasswordConfirm.value = false
}

// Scroll to Features Section
function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

// Register Function to register a new user
async function register() {
  await authStore.signUp(email.value, password.value, username.value, passwordConfirm.value)
  if (!authStore.error) {
    closeModals()
    router.push('/recipes')
  }
}

// Login Function to login a user
async function login() {
  await authStore.signIn(email.value, password.value)
  if (authStore.user) {
    closeModals()
    router.push('/recipes')
  }
}
</script>
