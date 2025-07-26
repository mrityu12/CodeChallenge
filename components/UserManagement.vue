<template>
  <div class="bg-white shadow rounded-lg p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Admin Management</h2>
      <button @click="showAddModal = true" class="flex items-center bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        Add Admin
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Admins List -->
    <div v-else-if="admins.length > 0" class="space-y-4">
      <div
        v-for="admin in admins"
        :key="admin.email"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ admin.email }}</p>
            <p class="text-xs text-gray-500">Added by {{ admin.addedBy }} • {{ formatDate(admin.addedAt) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Admin</span>
          <button
            @click="confirmRemoveAdmin(admin)"
            :disabled="admin.email === currentUserEmail"
            class="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 text-gray-500 space-y-2">
      <svg class="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..." />
      </svg>
      <p class="text-sm font-medium">No admins found</p>
      <p class="text-sm">Add your first admin to get started.</p>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeAddModal">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Admin</h3>
        <form @submit.prevent="handleAddAdmin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              v-model="newAdminEmail"
              type="email"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>
          <div v-if="addError" class="text-red-600 text-sm">{{ addError }}</div>
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="addingAdmin || !newAdminEmail.trim()"
              class="flex-1 bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ addingAdmin ? 'Adding...' : 'Add Admin' }}
            </button>
            <button
              type="button"
              @click="closeAddModal"
              class="flex-1 border border-gray-300 text-sm text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Remove Modal -->
    <div v-if="adminToRemove" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="cancelRemoveAdmin">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Remove Admin Access</h3>
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to remove admin access for
          <span class="font-semibold text-gray-900">{{ adminToRemove.email }}</span>?<br />
          This action cannot be undone.
        </p>
        <div v-if="removeError" class="text-red-600 text-sm mb-4">{{ removeError }}</div>
        <div class="flex gap-3">
          <button
            @click="handleRemoveAdmin"
            :disabled="removingAdmin"
            class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {{ removingAdmin ? 'Removing...' : 'Remove Admin' }}
          </button>
          <button
            @click="cancelRemoveAdmin"
            class="flex-1 border border-gray-300 text-sm text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
