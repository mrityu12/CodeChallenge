export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize
  if (authStore.loading) {
    return
  }
  
  // Check if user is authenticated
  if (!authStore.user) {
    return navigateTo('/login')
  }
  
  // Check if user is admin
  if (!authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.'
    })
  }
})