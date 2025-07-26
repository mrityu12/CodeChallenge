export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize
  if (authStore.loading) {
    return
  }
  
  // If user is not authenticated, redirect to login
  if (!authStore.user) {
    return navigateTo('/login')
  }
})