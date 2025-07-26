<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">
              CodeChallenge
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4" v-if="!authStore.loading">
            <template v-if="authStore.user">
              <NuxtLink 
                to="/question" 
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Challenge
              </NuxtLink>
              
              <NuxtLink 
                v-if="authStore.isAdmin" 
                to="/admin" 
                class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </NuxtLink>
              
              <div class="flex items-center space-x-3">
                <img 
                  v-if="authStore.user.photoURL" 
                  :src="authStore.user.photoURL" 
                  :alt="authStore.user.displayName || 'User'"
                  class="w-8 h-8 rounded-full"
                >
                <span class="text-sm text-gray-700">
                  {{ authStore.user.displayName || authStore.user.email }}
                </span>
                <button 
                  @click="handleLogout"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </template>
            
            <template v-else>
              <NuxtLink 
                to="/login" 
                class="btn-primary"
              >
                Login
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
    
    <!-- Loading overlay -->
    <div v-if="authStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

// Initialize auth when the layout loads
onMounted(() => {
  authStore.initializeAuth()
})

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>