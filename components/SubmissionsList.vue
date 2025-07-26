<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">All Submissions</h2>
      <button
        @click="refreshSubmissions"
        :disabled="loading"
        class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- Table or Loader -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin h-8 w-8 rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="submissions.length > 0" class="overflow-x-auto">
      <table class="min-w-full table-auto divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Question</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Language</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Submitted</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr
            v-for="submission in paginatedSubmissions"
            :key="submission.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
              <div>{{ submission.userName }}</div>
              <div class="text-xs text-gray-500">{{ submission.userEmail }}</div>
            </td>
            <td class="px-4 py-4 text-sm text-gray-700">{{ submission.questionTitle }}</td>
            <td class="px-4 py-4 text-sm">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {{ submission.language }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-gray-500">{{ formatDate(submission.submittedAt) }}</td>
            <td class="px-4 py-4 text-sm">
              <button
                @click="viewSubmission(submission)"
                class="text-blue-600 hover:underline"
              >
                View Code
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, submissions.length) }} of
          {{ submissions.length }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 text-gray-500">
      <p>No submissions found yet.</p>
    </div>

    <!-- Code Modal -->
    <div
      v-if="selectedSubmission"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="p-6 border-b flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedSubmission.userName }}'s Solution
            </h3>
            <p class="text-sm text-gray-500">
              {{ selectedSubmission.questionTitle }} • {{ selectedSubmission.language }} •
              {{ formatDate(selectedSubmission.submittedAt) }}
            </p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <pre class="bg-gray-100 text-sm font-mono p-4 rounded-lg whitespace-pre-wrap">{{ selectedSubmission.code }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
