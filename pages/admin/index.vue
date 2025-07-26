<template>
  <div class="min-h-screen bg-gray-50">
    <Suspense>
      <template #default>
        <AdminDashboard />
      </template>
      <template #fallback>
        <div class="flex items-center justify-center h-screen">
          <div class="text-gray-600 text-sm">Loading Admin Panel...</div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
})
</script>
