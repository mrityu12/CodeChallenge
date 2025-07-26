import { defineStore } from 'pinia'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  getDoc
} from 'firebase/firestore'

interface Submission {
  id?: string
  userEmail: string
  userName: string
  questionId: string
  questionTitle: string
  code: string
  language: string
  submittedAt: Date
}

interface Question {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  createdAt: Date
}

export const useSubmissionsStore = defineStore('submissions', () => {
  const { $firebase } = useNuxtApp()
  const submissions = ref<Submission[]>([])
  const currentQuestion = ref<Question | null>(null)
  const loading = ref(false)

  // Default question for demo
  const defaultQuestion: Question = {
    id: 'prime-numbers-100',
    title: 'First 100 Prime Numbers',
    description: 'Write a function that prints the first 100 prime numbers. Your function should be efficient and well-documented.',
    difficulty: 'Medium',
    tags: ['algorithms', 'mathematics', 'prime-numbers'],
    createdAt: new Date()
  }

  const getCurrentQuestion = async () => {
    try {
      // For demo purposes, we'll use the default question
      // In production, you might fetch from Firestore
      currentQuestion.value = defaultQuestion
      return defaultQuestion
    } catch (error) {
      console.error('Error fetching question:', error)
      currentQuestion.value = defaultQuestion
      return defaultQuestion
    }
  }

  const submitCode = async (code: string, language: string = 'javascript') => {
    const authStore = useAuthStore()
    if (!authStore.user || !currentQuestion.value) {
      throw new Error('User not authenticated or no question selected')
    }

    try {
      const submission = {
        userEmail: authStore.user.email!,
        userName: authStore.user.displayName || authStore.user.email!,
        questionId: currentQuestion.value.id,
        questionTitle: currentQuestion.value.title,
        code,
        language,
        submittedAt: new Date()
      }

      const docRef = await addDoc(collection($firebase.db, 'submissions'), submission)
      
      return { id: docRef.id, ...submission }
    } catch (error) {
      console.error('Error submitting code:', error)
      throw error
    }
  }

  const getUserSubmissions = async (userEmail: string) => {
    loading.value = true
    try {
      const submissionsRef = collection($firebase.db, 'submissions')
      const q = query(
        submissionsRef, 
        where('userEmail', '==', userEmail),
        orderBy('submittedAt', 'desc')
      )
      const snapshot = await getDocs(q)
      
      const userSubmissions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date()
      })) as Submission[]

      return userSubmissions
    } catch (error) {
      console.error('Error fetching user submissions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getAllSubmissions = async () => {
    loading.value = true
    try {
      const submissionsRef = collection($firebase.db, 'submissions')
      const q = query(submissionsRef, orderBy('submittedAt', 'desc'))
      const snapshot = await getDocs(q)
      
      submissions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date()
      })) as Submission[]

      return submissions.value
    } catch (error) {
      console.error('Error fetching all submissions:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    submissions: readonly(submissions),
    currentQuestion: readonly(currentQuestion),
    loading: readonly(loading),
    getCurrentQuestion,
    submitCode,
    getUserSubmissions,
    getAllSubmissions
  }
})