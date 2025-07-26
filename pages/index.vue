<template>
  <div class="text-center px-4">
    <!-- Hero Section -->
    <div class="max-w-3xl mx-auto mt-20">
      <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
        Welcome to <span class="text-primary-600">CodeChallenge</span>
      </h1>
      <p class="mt-6 text-xl text-gray-600">
        Test your programming skills with our coding challenges.
        <br class="hidden sm:block" />
        Sign in to get started and showcase your solutions.
      </p>

      <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          v-if="!authStore.user"
          to="/login"
          class="btn-primary text-lg px-8 py-3"
          aria-label="Sign in to start coding"
        >
          Get Started
        </NuxtLink>

        <NuxtLink
          v-else
          to="/question"
          class="btn-primary text-lg px-8 py-3"
          aria-label="Start solving challenges"
        >
          Start Challenge
        </NuxtLink>

        <a href="#features" class="btn-secondary text-lg px-8 py-3">
          Learn More
        </a>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div class="card p-6">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Code Editor</h3>
        <p class="text-gray-600">
          Write and test your code with our built-in editor featuring syntax highlighting and multi-language support.
        </p>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Instant Submission</h3>
        <p class="text-gray-600">
          Submit your solutions instantly and track your progress with our seamless submission system.
        </p>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
        <p class="text-gray-600">
          Admins can view all submissions and manage users via a comprehensive dashboard.
        </p>
      </div>
    </div>

    <!-- Current Challenge Preview -->
    <div v-if="authStore.user && currentQuestion" class="mt-24 max-w-4xl mx-auto">
      <div class="card p-8 text-left">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Current Challenge</h2>
        <div>
          <div class="flex items-center gap-2 mb-3">
            <h3 class="text-xl font-semibold text-gray-800">{{ currentQuestion.title }}</h3>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              {{ currentQuestion.difficulty }}
            </span>
          </div>
          <p class="text-gray-600 mb-4">{{ currentQuestion.description }}</p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in currentQuestion.tags"
              :key="tag"
              class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          <NuxtLink to="/question" class="btn-primary">
            Start Coding →
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const submissionsStore = useSubmissionsStore()

const currentQuestion = ref(null)

onMounted(async () => {
  try {
    currentQuestion.value = await submissionsStore.getCurrentQuestion()
  } catch (error) {
    console.error('Error loading current question:', error)
  }
})
</script>
