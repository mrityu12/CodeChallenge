<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button 
              @click="goBack"
              class="text-gray-600 hover:text-gray-900"
            >
              ← Back to Question
            </button>
            <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div v-if="user" class="flex items-center space-x-4">
            <img :src="user.photoURL" :alt="user.displayName" class="w-8 h-8 rounded-full">
            <span class="text-sm text-gray-700">{{ user.displayName }}</span>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Admin</span>
            <button 
              @click="logout"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Access Denied for Non-Admins -->
    <div v-if="user && !isAdmin" class="max-w-4xl mx-auto py-12 px-4 text-center">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8">
        <div class="flex justify-center mb-4">
          <svg class="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
        <p class="text-red-700">You don't have admin privileges to access this page.</p>
        <button 
          @click="goBack"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back to Question
        </button>
      </div>
    </div>

    <!-- Login Required -->
    <div v-else-if="!user" class="max-w-4xl mx-auto py-12 px-4 text-center">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-8">
        <h2 class="text-2xl font-bold text-blue-900 mb-4">Admin Login Required</h2>
        <p class="text-blue-700 mb-6">Please sign in with your admin Google account.</p>
        <button
          @click="signInWithGoogle"
          :disabled="signingIn"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ signingIn ? 'Signing in...' : 'Sign in with Google' }}
        </button>
      </div>
    </div>

    <!-- Admin Dashboard Content -->
    <main v-else-if="isAdmin" class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Submissions</dt>
                <dd class="text-lg font-medium text-gray-900">{{ allSubmissions.length }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Unique Users</dt>
                <dd class="text-lg font-medium text-gray-900">{{ uniqueUsers.length }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Most Used Language</dt>
                <dd class="text-lg font-medium text-gray-900">{{ mostUsedLanguage }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'submissions'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              All Submissions ({{ allSubmissions.length }})
            </button>
            <button
              @click="activeTab = 'admins'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Admin Management
            </button>
          </nav>
        </div>
      </div>

      <!-- Submissions Tab -->
      <div v-if="activeTab === 'submissions'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">All User Submissions</h2>
          <div class="flex items-center space-x-4">
            <select 
              v-model="languageFilter"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button
              @click="loadAllSubmissions"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading submissions...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSubmissions.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-gray-600">No submissions found.</p>
        </div>

        <!-- Submissions List -->
        <div v-else class="space-y-4">
          <div
            v-for="submission in filteredSubmissions"
            :key="submission.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <!-- Submission Header -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-4">
                  <img 
                    :src="submission.userPhoto || 'https://via.placeholder.com/40'" 
                    :alt="submission.userName"
                    class="w-10 h-10 rounded-full"
                  >
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ submission.userName }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ submission.userEmail }}</p>
                    <p class="text-sm text-gray-500">
                      Submitted {{ formatDate(submission.submittedAt) }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ submission.language }}
                  </span>
                  <button
                    @click="toggleSubmissionCode(submission.id)"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {{ expandedSubmissions.has(submission.id) ? 'Hide Code' : 'View Code' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Code Preview -->
            <div v-if="expandedSubmissions.has(submission.id)" class="p-0">
              <div class="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ submission.language }}.{{ getFileExtension(submission.language) }}</span>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-400">{{ submission.code.split('\n').length }} lines</span>
                  <button 
                    @click="copyCode(submission.code)"
                    class="text-xs text-gray-400 hover:text-white"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div class="bg-gray-900 p-4 overflow-x-auto max-h-96 overflow-y-auto">
                <pre class="text-sm text-gray-100"><code>{{ submission.code }}</code></pre>
              </div>
            </div>
            <div v-else class="p-4 bg-gray-50">
              <div class="text-sm text-gray-600">
                <div class="flex items-center justify-between">
                  <span>{{ submission.questionTitle }}</span>
                  <span class="text-xs">{{ submission.code.length }} characters</span>
                </div>
                <pre class="mt-2 text-xs text-gray-500 truncate font-mono">{{ submission.code.substring(0, 120) }}{{ submission.code.length > 120 ? '...' : '' }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Management Tab -->
      <div v-if="activeTab === 'admins'" class="space-y-6">
        <!-- Add New Admin -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Admin</h3>
          
          <form @submit.prevent="addNewAdmin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div class="flex space-x-3">
                <input
                  v-model="newAdminEmail"
                  type="email"
                  placeholder="Enter admin email address"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  :disabled="!newAdminEmail.trim() || addingAdmin"
                  class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ addingAdmin ? 'Adding...' : 'Add Admin' }}
                </button>
              </div>
            </div>
            
            <div v-if="adminMessage" :class="[
              'p-3 rounded-md text-sm',
              adminMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            ]">
              {{ adminMessage.text }}
            </div>
          </form>
        </div>

        <!-- Current Admins -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Current Admins</h3>
            <button
              @click="loadAdminUsers"
              :disabled="loadingAdmins"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loadingAdmins ? 'Loading...' : 'Refresh' }}
            </button>
          </div>

            <!-- Enhanced Admin List with better organization -->
            <div v-if="ADMIN_EMAILS.length > 0">
              <h4 class="text-sm font-medium text-gray-700 mb-3 border-b pb-2">System Administrators</h4>
              <div
                v-for="email in ADMIN_EMAILS"
                :key="'system-' + email"
                class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 mb-3"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ email }}</p>
                    <p class="text-sm text-blue-600 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      System Admin (Protected)
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                    Super Admin
                  </span>
                  <span v-if="email === user.email" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    You
                  </span>
                </div>
              </div>
            </div>

            <!-- Database Admins -->
            <div v-if="adminUsers.length > 0">
              <h4 class="text-sm font-medium text-gray-700 mb-3 border-b pb-2 mt-6">Database Administrators</h4>
              <div
                v-for="admin in adminUsers"
                :key="admin.email"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ admin.email.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ admin.email }}</p>
                    <p class="text-sm text-gray-600">
                      Added {{ formatDate(admin.addedAt) }}
                    </p>
                    <p class="text-xs text-gray-500">
                      by {{ admin.addedByName || admin.addedBy }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    Admin
                  </span>
                  <span v-if="admin.email === user.email" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    You
                  </span>
                  <button
                    @click="removeAdmin(admin.email)"
                    :disabled="admin.email === user.email || removingAdmin === admin.email"
                    class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    :title="admin.email === user.email ? 'Cannot remove yourself' : 'Remove admin privileges'"
                  >
                    {{ removingAdmin === admin.email ? 'Removing...' : 'Remove' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty state for database admins -->
            <div v-if="adminUsers.length === 0 && !loadingAdmins" class="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p class="mt-2 text-sm text-gray-600">No additional admins added yet</p>
              <p class="text-xs text-gray-500">Use the form above to add new admin users</p>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore'

// Firebase configuration - Replace with your config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Admin emails - Replace with actual admin emails
const ADMIN_EMAILS = ['admin@example.com', 'admin2@example.com']

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Reactive data
const user = ref(null)
const signingIn = ref(false)
const loading = ref(false)
const loadingAdmins = ref(false)
const activeTab = ref('submissions')
const allSubmissions = ref([])
const adminUsers = ref([])
const expandedSubmissions = ref(new Set())
const languageFilter = ref('')
const newAdminEmail = ref('')
const addingAdmin = ref(false)
const removingAdmin = ref(null)
const adminMessage = ref(null)

// Enhanced computed property for admin check with database integration
const isAdmin = computed(() => {
  if (!user.value) return false
  
  // Check system admins first
  if (ADMIN_EMAILS.includes(user.value.email)) return true
  
  // Check database admins
  return adminUsers.value.some(admin => 
    admin.email === user.value.email && admin.status === 'active'
  )
})

// Enhanced method to get all admin emails (system + database)
const getAllAdminEmails = computed(() => {
  const systemAdmins = ADMIN_EMAILS
  const dbAdmins = adminUsers.value
    .filter(admin => admin.status === 'active')
    .map(admin => admin.email)
  
  return [...new Set([...systemAdmins, ...dbAdmins])]
})

const uniqueUsers = computed(() => {
  const emails = new Set(allSubmissions.value.map(s => s.userEmail))
  return Array.from(emails)
})

const mostUsedLanguage = computed(() => {
  const langCount = {}
  allSubmissions.value.forEach(s => {
    langCount[s.language] = (langCount[s.language] || 0) + 1
  })
  
  let mostUsed = ''
  let maxCount = 0
  for (const [lang, count] of Object.entries(langCount)) {
    if (count > maxCount) {
      maxCount = count
      mostUsed = lang
    }
  }
  
  return mostUsed || 'N/A'
})

const filteredSubmissions = computed(() => {
  if (!languageFilter.value) return allSubmissions.value
  return allSubmissions.value.filter(s => s.language === languageFilter.value)
})

// Methods
const signInWithGoogle = async () => {
  try {
    signingIn.value = true
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error('Sign in error:', error)
    alert('Failed to sign in. Please try again.')
  } finally {
    signingIn.value = false
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const goBack = () => {
  window.location.href = '/question' // Or use your routing method
}

const loadAllSubmissions = async () => {
  // Double-check admin access before loading sensitive data
  if (!user.value || (!ADMIN_EMAILS.includes(user.value.email) && !adminUsers.value.some(admin => admin.email === user.value.email))) {
    console.error('Unauthorized access attempt to submissions')
    window.location.href = '/question'
    return
  }

  try {
    loading.value = true
    const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    allSubmissions.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`Loaded ${allSubmissions.value.length} submissions for admin review`)
  } catch (error) {
    console.error('Error loading submissions:', error)
    alert('Failed to load submissions. Please check your admin permissions.')
  } finally {
    loading.value = false
  }
}

const loadAdminUsers = async () => {
  try {
    loadingAdmins.value = true
    const querySnapshot = await getDocs(collection(db, 'admins'))
    adminUsers.value = querySnapshot.docs.map(doc => ({
      email: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt?.toDate() || new Date()
    }))
  } catch (error) {
    console.error('Error loading admin users:', error)
  } finally {
    loadingAdmins.value = false
  }
}

const addNewAdmin = async () => {
  if (!newAdminEmail.value.trim()) {
    adminMessage.value = {
      type: 'error',
      text: 'Please enter a valid email address.'
    }
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newAdminEmail.value.trim())) {
    adminMessage.value = {
      type: 'error',
      text: 'Please enter a valid email format.'
    }
    return
  }

  // Check if already an admin
  const emailToAdd = newAdminEmail.value.trim().toLowerCase()
  if (ADMIN_EMAILS.includes(emailToAdd) || adminUsers.value.some(admin => admin.email.toLowerCase() === emailToAdd)) {
    adminMessage.value = {
      type: 'error',
      text: 'This email is already an admin.'
    }
    return
  }

  try {
    addingAdmin.value = true
    adminMessage.value = null

    const adminData = {
      email: emailToAdd,
      addedAt: Timestamp.now(),
      addedBy: user.value.email,
      addedByName: user.value.displayName || user.value.email,
      status: 'active'
    }

    // Add to Firestore
    await setDoc(doc(db, 'admins', emailToAdd), adminData)
    
    adminMessage.value = {
      type: 'success',
      text: `Successfully added ${emailToAdd} as admin. They can now access the admin dashboard.`
    }
    
    newAdminEmail.value = ''
    await loadAdminUsers()
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      adminMessage.value = null
    }, 5000)
    
  } catch (error) {
    console.error('Add admin error:', error)
    adminMessage.value = {
      type: 'error',
      text: 'Failed to add admin. Please check your permissions and try again.'
    }
  } finally {
    addingAdmin.value = false
  }
}

const removeAdmin = async (email) => {
  // Prevent self-removal
  if (email === user.value.email) {
    alert('You cannot remove yourself as an admin.')
    return
  }

  // Prevent removal of system admins
  if (ADMIN_EMAILS.includes(email)) {
    alert('System admins cannot be removed from the database.')
    return
  }

  const confirmMessage = `⚠️ WARNING: Are you sure you want to remove "${email}" as an admin?\n\nThis will:\n• Revoke their admin dashboard access\n• Remove them from the admin database\n\nThis action cannot be undone.`
  
  if (!confirm(confirmMessage)) {
    return
  }

  try {
    removingAdmin.value = email
    
    // Remove from Firestore
    await deleteDoc(doc(db, 'admins', email))
    
    // Show success message
    adminMessage.value = {
      type: 'success',
      text: `Successfully removed ${email} from admin privileges.`
    }
    
    // Reload admin list
    await loadAdminUsers()
    
    // Clear message after 3 seconds
    setTimeout(() => {
      adminMessage.value = null
    }, 3000)
    
  } catch (error) {
    console.error('Remove admin error:', error)
    alert('Failed to remove admin. Please check your permissions and try again.')
  } finally {
    removingAdmin.value = null
  }
}

const toggleSubmissionCode = (submissionId) => {
  if (expandedSubmissions.value.has(submissionId)) {
    expandedSubmissions.value.delete(submissionId)
  } else {
    expandedSubmissions.value.add(submissionId)
  }
}

const getFileExtension = (language) => {
  const extensions = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp'
  }
  return extensions[language] || 'txt'
}

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    // You could show a toast notification here
  } catch (error) {
    console.error('Failed to copy code:', error)
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Route protection and initialization
const checkAdminAccess = () => {
  // Redirect non-admins immediately
  if (user.value && !ADMIN_EMAILS.includes(user.value.email)) {
    alert('Access Denied: You do not have admin privileges.')
    window.location.href = '/question'
    return false
  }
  return true
}

// Initialize auth state and load data
onMounted(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser
    
    // Route protection: redirect if not admin
    if (firebaseUser) {
      if (!ADMIN_EMAILS.includes(firebaseUser.email)) {
        alert('Access Denied: Admin privileges required.')
        window.location.href = '/question'
        return
      }
      
      // Load admin data
      await loadAllSubmissions()
      await loadAdminUsers()
    } else {
      // Redirect if not logged in
      setTimeout(() => {
        if (!user.value) {
          alert('Please sign in with admin credentials.')
          window.location.href = '/question'
        }
      }, 3000)
    }
  })
  
  // Additional security check on component mount
  setTimeout(() => {
    if (user.value && !checkAdminAccess()) {
      return
    }
  }, 1000)
})
</script>

<style scoped>
/* Custom scrollbar for code blocks */
pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: #374151;
}

pre::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>