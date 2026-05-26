<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const guides = ref<any[]>([]);
const auth = useAuthStore();
const loading = ref(true);

onMounted(async () => {
  try {
    const headers: any = {};
    if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`;
    const res = await fetch('/api/content', { headers });
    guides.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Library</h1>
    <div v-if="loading" class="text-gray-500">Loading guides...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link v-for="guide in guides" :key="guide.id" :to="`/guides/${guide.id}`" class="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
        <h2 class="text-xl font-semibold text-emerald-900 group-hover:text-emerald-600 mb-2">{{ guide.title }}</h2>
        <p class="text-gray-600 line-clamp-2 mb-4">{{ guide.excerpt }}</p>
        <div class="flex flex-wrap gap-2 mt-auto">
          <span v-for="tag in guide.tags" :key="tag" class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{{ tag }}</span>
          <span v-if="guide.requiredTierId" class="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">Members Only</span>
        </div>
      </router-link>
    </div>
  </div>
</template>
