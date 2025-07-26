import { defineStore } from 'pinia'
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const { $firebase } = useNuxtApp()
  const user = ref<User | null>(null)
  const isAdmin = ref(false)
  const loading = ref(true)

  // Admin emails - in production, store these in Firestore
  const adminEmails = [
    'admin@example.com',
    'your-admin-email@gmail.com'
  ]

  const checkAdminStatus = async (email: string) => {
    try {
      // Check if user is in admin collection
      const adminDoc = await getDoc(doc($firebase.db, 'admins', email))
      return adminDoc.exists()
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  const initializeAuth = () => {
    onAuthStateChanged($firebase.auth, async (firebaseUser) => {
      user.value = firebaseUser
      
      if (firebaseUser?.email) {
        isAdmin.value = await checkAdminStatus(firebaseUser.email)
        
        // Save user to Firestore if not exists
        const userDocRef = doc($firebase.db, 'users', firebaseUser.email)
        const userDoc = await getDoc(userDocRef)
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date(),
            lastLoginAt: new Date()
          })
        } else {
          // Update last login
          await setDoc(userDocRef, {
            lastLoginAt: new Date()
          }, { merge: true })
        }
      } else {
        isAdmin.value = false
      }
      
      loading.value = false
    })
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup($firebase.auth, $firebase.googleProvider)
      return result.user
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut($firebase.auth)
      isAdmin.value = false
      await navigateTo('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    user: readonly(user),
    isAdmin: readonly(isAdmin),
    loading: readonly(loading),
    initializeAuth,
    signInWithGoogle,
    logout,
    checkAdminStatus
  }
})