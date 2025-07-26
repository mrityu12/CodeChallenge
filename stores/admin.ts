import { defineStore } from 'pinia'
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore'

interface AdminUser {
  email: string
  addedBy: string
  addedAt: Date
  displayName?: string
}

export const useAdminStore = defineStore('admin', () => {
  const { $firebase } = useNuxtApp()
  const admins = ref<AdminUser[]>([])
  const loading = ref(false)

  const fetchAdmins = async () => {
    loading.value = true
    try {
      const adminsRef = collection($firebase.db, 'admins')
      const q = query(adminsRef, orderBy('addedAt', 'desc'))
      const snapshot = await getDocs(q)
      
      admins.value = snapshot.docs.map(doc => ({
        email: doc.id,
        ...doc.data(),
        addedAt: doc.data().addedAt?.toDate() || new Date()
      })) as AdminUser[]
    } catch (error) {
      console.error('Error fetching admins:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const addAdmin = async (email: string, addedBy: string) => {
    try {
      const adminDoc = doc($firebase.db, 'admins', email)
      await setDoc(adminDoc, {
        addedBy,
        addedAt: new Date(),
        email
      })
      
      // Refresh the list
      await fetchAdmins()
    } catch (error) {
      console.error('Error adding admin:', error)
      throw error
    }
  }

  const removeAdmin = async (email: string) => {
    try {
      const adminDoc = doc($firebase.db, 'admins', email)
      await deleteDoc(adminDoc)
      
      // Refresh the list
      await fetchAdmins()
    } catch (error) {
      console.error('Error removing admin:', error)
      throw error
    }
  }

  return {
    admins: readonly(admins),
    loading: readonly(loading),
    fetchAdmins,
    addAdmin,
    removeAdmin
  }
})