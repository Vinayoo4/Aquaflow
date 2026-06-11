<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { apiFetch } from '../services/api';

const route = useRoute();
const auth = useAuthStore();
const guide = ref<any>(null);
const error = ref('');

onMounted(async () => {
  try {
    const headers: any = {};
    if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`;
    const res = await apiFetch(`/content/${route.params.id}`, { headers });
    guide.value = res;
  } catch (err: any) {
    if (err.status === 403) {
      error.value = 'Membership required to view this guide.';
    } else {
      error.value = err.message || 'Guide not found';
    }
  }
});
</script>
<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
    <router-link to="/guides" class="text-emerald-600 text-sm hover:underline mb-6 inline-block">&larr; Back to Library</router-link>
    <div v-if="error" class="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg">
      <p class="font-semibold">{{ error }}</p>
      <router-link to="/login" class="mt-2 inline-block bg-amber-600 text-white px-4 py-2 rounded text-sm">Log in or Upgrade</router-link>
    </div>
    <article v-else-if="guide">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ guide.title }}</h1>
      <div class="flex gap-2 mb-8 border-b border-gray-100 pb-4">
        <span v-for="tag in guide.tags" :key="tag" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{{ tag }}</span>
      </div>
      <div class="prose prose-emerald max-w-none text-gray-700 whitespace-pre-wrap">
        {{ guide.body }}
      </div>
    </article>
    <div v-else class="text-gray-500">Loading...</div>
  </div>
</template>
