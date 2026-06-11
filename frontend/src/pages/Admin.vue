<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiFetch } from '../services/api';

const stats = ref<any>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    stats.value = await apiFetch('/admin/stats');
  } catch (err: any) {
    error.value = err.message || 'Failed to load stats';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>
    <p class="text-gray-600 mb-8">Manage content, members, and resources.</p>

    <div v-if="loading" class="text-gray-500">Loading stats...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <h2 class="text-xl font-semibold text-emerald-900 mb-2">Users</h2>
        <div class="text-4xl font-extrabold text-emerald-600 mb-6">{{ stats.usersCount }}</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <h2 class="text-xl font-semibold text-emerald-900 mb-2">Content</h2>
        <div class="text-4xl font-extrabold text-emerald-600 mb-6">{{ stats.contentCount }}</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <h2 class="text-xl font-semibold text-emerald-900 mb-2">Plans</h2>
        <div class="text-4xl font-extrabold text-emerald-600 mb-6">{{ stats.plansCount }}</div>
      </div>
    </div>
  </div>
</template>
