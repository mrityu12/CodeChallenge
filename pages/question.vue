<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold text-gray-900">SDE Coding Challenge Platform</h1>
          
          <div v-if="user" class="flex items-center space-x-4">
            <img :src="user.photoURL" :alt="user.displayName" class="w-8 h-8 rounded-full">
            <span class="text-sm text-gray-700">{{ user.displayName }}</span>
            <button 
              v-if="isAdmin" 
              @click="goToAdmin"
              class="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Admin Panel
            </button>
            <button 
              @click="logout"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
          
          <div v-else class="flex items-center">
            <button
              @click="signInWithGoogle"
              :disabled="signingIn"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Login Required Message -->
      <div v-if="!user" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to SDE Coding Challenge Platform</h2>
          <p class="text-gray-600 mb-6">Please sign in with your Google account to access programming challenges and track your progress.</p>
        </div>
      </div>

      <!-- Programming Challenge -->
      <div v-else class="space-y-8">
        <!-- Current Question Display -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-900">Current Challenge</h2>
              <div class="flex items-center space-x-2">
                <span 
                  v-if="currentQuestion" 
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getDifficultyClass(currentQuestion.difficulty)"
                >
                  {{ currentQuestion.difficulty }}
                </span>
                <button 
                  @click="loadRandomQuestion" 
                  class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  Load New Challenge
                </button>
              </div>
            </div>
            
            <div v-if="currentQuestion" class="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold text-blue-900 mb-3">
                🎯 {{ currentQuestion.title }}
              </h3>
              <p class="text-blue-800 leading-relaxed mb-4">
                {{ currentQuestion.description }}
              </p>
              
              <!-- Tags -->
              <div v-if="currentQuestion.tags && currentQuestion.tags.length" class="mb-4">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in currentQuestion.tags"
                    :key="tag"
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              
              <!-- Requirements -->
              <div v-if="currentQuestion.requirements" class="text-sm text-blue-700">
                <p><strong>Requirements:</strong></p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li v-for="req in currentQuestion.requirements" :key="req">{{ req }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Code Editor Section -->
          <div class="space-y-4">
            <!-- Language Selector and Stats -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <label class="text-sm font-medium text-gray-700">Programming Language:</label>
                <select 
                  v-model="selectedLanguage" 
                  class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div class="text-sm text-gray-500">
                Total Submissions: {{ submissionCount }}
              </div>
            </div>

            <!-- Code Editor -->
            <div class="border border-gray-300 rounded-lg overflow-hidden">
              <div class="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span class="text-sm text-gray-300">{{ selectedLanguage }}.{{ getFileExtension() }}</span>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="loadTemplate"
                    class="text-xs text-gray-400 hover:text-white"
                  >
                    Load Template
                  </button>
                  <button 
                    @click="resetCode"
                    class="text-xs text-gray-400 hover:text-white"
                  >
                    Reset Code
                  </button>
                </div>
              </div>
              <textarea
                v-model="code"
                class="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
                :placeholder="getPlaceholder()"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-600">
                <span class="text-green-600">●</span> Auto-saved locally
              </div>
              
              <button
                @click="submitSolution"
                :disabled="!code.trim() || submitting || !currentQuestion"
                class="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ submitting ? 'Submitting...' : 'Submit Solution' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Submission History -->
        <div v-if="userSubmissions.length > 0" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Recent Submissions</h3>
          <div class="space-y-3">
            <div
              v-for="(submission, index) in userSubmissions.slice(0, 5)"
              :key="submission.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div>
                  <span class="text-sm font-medium text-gray-900">{{ submission.questionTitle }}</span>
                  <div class="text-xs text-gray-500">
                    {{ submission.language }} • {{ formatDate(submission.submittedAt) }}
                  </div>
                </div>
                <span 
                  v-if="submission.difficulty"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getDifficultyClass(submission.difficulty)"
                >
                  {{ submission.difficulty }}
                </span>
              </div>
              <button 
                @click="loadSubmission(submission)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Load Code
              </button>
            </div>
          </div>
          
          <div v-if="userSubmissions.length > 5" class="mt-4 text-center">
            <button class="text-sm text-gray-500 hover:text-gray-700">
              View All Submissions ({{ userSubmissions.length }})
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Solution Submitted!</h3>
          <p class="text-sm text-gray-600 mb-4">Your code has been successfully submitted and saved. Great work!</p>
          <div class="flex space-x-3">
            <button
              @click="loadRandomQuestion"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next Challenge
            </button>
            <button
              @click="showSuccessModal = false"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Continue Coding
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore'

// Use Nuxt Firebase plugin
const { $firebase } = useNuxtApp()
const { auth, db, googleProvider } = $firebase

// Admin emails - Replace with actual admin emails
const ADMIN_EMAILS = ['admin@example.com', 'admin2@example.com']

// Sample questions database
const sampleQuestions = [
  {
    id: 'prime-numbers',
    title: 'Prime Numbers Generator',
    description: 'Write a function that generates and prints the first 100 prime numbers. Your solution should be efficient and well-commented. Consider the algorithm\'s time complexity and optimize where possible.',
    difficulty: 'Medium',
    tags: ['algorithms', 'mathematics', 'optimization'],
    requirements: [
      'Function should print exactly 100 prime numbers',
      'Include comments explaining your approach',
      'Choose any programming language you\'re comfortable with'
    ]
  },
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    description: 'Given an array of integers and a target sum, return the indices of two numbers that add up to the target. You may assume that each input would have exactly one solution.',
    difficulty: 'Easy',
    tags: ['arrays', 'hash-tables', 'algorithms'],
    requirements: [
      'Return indices, not the numbers themselves',
      'Each input has exactly one solution',
      'Cannot use the same element twice'
    ]
  },
  {
    id: 'binary-tree-traversal',
    title: 'Binary Tree Traversal',
    description: 'Implement three different tree traversal methods (in-order, pre-order, post-order) for a binary tree. Include both recursive and iterative solutions.',
    difficulty: 'Hard',
    tags: ['trees', 'recursion', 'data-structures'],
    requirements: [
      'Implement all three traversal methods',
      'Provide both recursive and iterative solutions',
      'Handle edge cases (empty tree, single node)'
    ]
  }
]

// Reactive data
const user = ref(null)
const signingIn = ref(false)
const submitting = ref(false)
const showSuccessModal = ref(false)
const selectedLanguage = ref('javascript')
const code = ref('')
const userSubmissions = ref([])
const submissionCount = ref(0)
const currentQuestion = ref(null)

// Computed properties
const isAdmin = computed(() => {
  return user.value && ADMIN_EMAILS.includes(user.value.email)
})

// Code templates for different languages
const getCodeTemplate = (language, question) => {
  const templates = {
    javascript: {
      'prime-numbers': `// Write a function to print the first 100 prime numbers
function printFirst100Primes() {
  // Your implementation here
  // Example approach: Use Sieve of Eratosthenes or trial division
  
}

printFirst100Primes();`,
      
      'two-sum': `// Two Sum Problem
function twoSum(nums, target) {
  // Your implementation here
  // Hint: Consider using a hash map for O(n) solution
  
}

// Test case
console.log(twoSum([2, 7, 11, 15], 9)); // Should return [0, 1]`,

      'binary-tree-traversal': `// Binary Tree Traversal
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function inorderTraversal(root) {
  // Your implementation here
  
}

function preorderTraversal(root) {
  // Your implementation here
  
}

function postorderTraversal(root) {
  // Your implementation here
  
}`
    },

    python: {
      'prime-numbers': `# Write a function to print the first 100 prime numbers
def print_first_100_primes():
    # Your implementation here
    # Example approach: Use Sieve of Eratosthenes or trial division
    pass

print_first_100_primes()`,

      'two-sum': `# Two Sum Problem
def two_sum(nums, target):
    # Your implementation here
    # Hint: Consider using a dictionary for O(n) solution
    pass

# Test case
print(two_sum([2, 7, 11, 15], 9))  # Should return [0, 1]`,

      'binary-tree-traversal': `# Binary Tree Traversal
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    # Your implementation here
    pass

def preorder_traversal(root):
    # Your implementation here
    pass

def postorder_traversal(root):
    # Your implementation here
    pass`
    },

    java: {
      'prime-numbers': `// Write a function to print the first 100 prime numbers
public class PrimeNumbers {
    public static void printFirst100Primes() {
        // Your implementation here
        // Example approach: Use Sieve of Eratosthenes or trial division
        
    }
    
    public static void main(String[] args) {
        printFirst100Primes();
    }
}`,

      'two-sum': `// Two Sum Problem
import java.util.*;

public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        // Your implementation here
        // Hint: Consider using HashMap for O(n) solution
        return new int[]{};
    }
    
    public static void main(String[] args) {
        TwoSum ts = new TwoSum();
        int[] result = ts.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(result)); // Should print [0, 1]
    }
}`,

      'binary-tree-traversal': `// Binary Tree Traversal
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class TreeTraversal {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Your implementation here
        return new ArrayList<>();
    }
    
    public List<Integer> preorderTraversal(TreeNode root) {
        // Your implementation here
        return new ArrayList<>();
    }
    
    public List<Integer> postorderTraversal(TreeNode root) {
        // Your implementation here
        return new ArrayList<>();
    }
}`
    },

    cpp: {
      'prime-numbers': `// Write a function to print the first 100 prime numbers
#include <iostream>
using namespace std;

void printFirst100Primes() {
    // Your implementation here
    // Example approach: Use Sieve of Eratosthenes or trial division
    
}

int main() {
    printFirst100Primes();
    return 0;
}`,

      'two-sum': `// Two Sum Problem
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your implementation here
    // Hint: Consider using unordered_map for O(n) solution
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}`,

      'binary-tree-traversal': `// Binary Tree Traversal
#include <iostream>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

vector<int> inorderTraversal(TreeNode* root) {
    // Your implementation here
    return {};
}

vector<int> preorderTraversal(TreeNode* root) {
    // Your implementation here
    return {};
}

vector<int> postorderTraversal(TreeNode* root) {
    // Your implementation here
    return {};
}`
    }
  }
  
  return templates[language]?.[question?.id] || `// Write your ${language} solution here...`
}

// Methods
const signInWithGoogle = async () => {
  try {
    signingIn.value = true
    await signInWithPopup(auth, googleProvider)
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
    userSubmissions.value = []
    submissionCount.value = 0
    code.value = ''
    currentQuestion.value = null
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const goToAdmin = () => {
  // Navigate to admin page - you'll need to implement routing
  window.location.href = '/admin'
}

const loadRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * sampleQuestions.length)
  currentQuestion.value = sampleQuestions[randomIndex]
  loadTemplate()
}

const loadTemplate = () => {
  if (currentQuestion.value) {
    code.value = getCodeTemplate(selectedLanguage.value, currentQuestion.value)
  }
}

const submitSolution = async () => {
  if (!code.value.trim() || !currentQuestion.value) {
    alert('Please write your solution before submitting.')
    return
  }

  try {
    submitting.value = true
    
    const submission = {
      userEmail: user.value.email,
      userName: user.value.displayName || user.value.email,
      code: code.value,
      language: selectedLanguage.value,
      questionId: currentQuestion.value.id,
      questionTitle: currentQuestion.value.title,
      difficulty: currentQuestion.value.difficulty,
      tags: currentQuestion.value.tags || [],
      submittedAt: Timestamp.now()
    }

    await addDoc(collection(db, 'submissions'), submission)
    
    showSuccessModal.value = true
    submissionCount.value++
    await loadUserSubmissions()
    
  } catch (error) {
    console.error('Submission error:', error)
    alert('Failed to submit solution. Please try again.')
  } finally {
    submitting.value = false
  }
}

const loadUserSubmissions = async () => {
  if (!user.value) return

  try {
    // First, try the optimized query with index
    const q = query(
      collection(db, 'submissions'),
      where('userEmail', '==', user.value.email),
      orderBy('submittedAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    userSubmissions.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    submissionCount.value = userSubmissions.value.length
  } catch (error) {
    console.error('Error loading submissions with index:', error)
    
    // Fallback: Load without ordering (if index doesn't exist yet)
    try {
      const fallbackQuery = query(
        collection(db, 'submissions'),
        where('userEmail', '==', user.value.email)
      )
      
      const fallbackSnapshot = await getDocs(fallbackQuery)
      const submissions = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sort in JavaScript instead
      userSubmissions.value = submissions.sort((a, b) => {
        const aTime = a.submittedAt?.toDate?.() || new Date(0)
        const bTime = b.submittedAt?.toDate?.() || new Date(0)
        return bTime - aTime // Newest first
      })
      
      submissionCount.value = userSubmissions.value.length
    } catch (fallbackError) {
      console.error('Error loading submissions (fallback):', fallbackError)
    }
  }
}

const loadSubmission = (submission) => {
  code.value = submission.code
  selectedLanguage.value = submission.language
  
  // Try to find and load the corresponding question
  const question = sampleQuestions.find(q => q.id === submission.questionId)
  if (question) {
    currentQuestion.value = question
  }
}

const resetCode = () => {
  loadTemplate()
}

const getFileExtension = () => {
  const extensions = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp'
  }
  return extensions[selectedLanguage.value]
}

const getPlaceholder = () => {
  return `Write your ${selectedLanguage.value} solution here...`
}

const getDifficultyClass = (difficulty) => {
  const classes = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Hard': 'bg-red-100 text-red-800'
  }
  return classes[difficulty] || 'bg-gray-100 text-gray-800'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Watchers
watch(selectedLanguage, () => {
  loadTemplate()
})

// Initialize auth state
onMounted(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser
    if (firebaseUser) {
      await loadUserSubmissions()
      if (!currentQuestion.value) {
        loadRandomQuestion()
      }
    } else {
      code.value = ''
      userSubmissions.value = []
      submissionCount.value = 0
      currentQuestion.value = null
    }
  })
})
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #374151;
}

textarea::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:active:not(:disabled) {
  transform: translateY(0);
}
</style>