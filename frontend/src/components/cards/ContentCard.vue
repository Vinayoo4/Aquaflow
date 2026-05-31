<script setup lang="ts">
import { useOfflineStore } from '../../stores/offlineStore';

const props = defineProps<{
  guide: any;
}>();

const offlineStore = useOfflineStore();

const saveOffline = async (e: Event) => {
  e.preventDefault(); // Prevent navigating to detail page
  try {
    await offlineStore.saveGuide(props.guide);
    alert('Guide saved offline!');
  } catch (err) {
    console.error('Failed to save guide:', err);
    alert('Failed to save guide');
  }
};

const getCategoryEmoji = (categoryId: string) => {
  const map: Record<string, string> = {
    gardening: '🌱',
    herbal: '🌿',
    food: '🥗',
    'meal-prep': '🍱'
  };
  return map[categoryId] || '📖';
};
</script>

<template>
  <router-link :to="`/guides/${guide.id}`" class="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group flex flex-col h-full relative">
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl" :title="guide.categoryId">{{ getCategoryEmoji(guide.categoryId) }}</span>
        <h2 class="text-xl font-semibold text-emerald-900 group-hover:text-emerald-600">{{ guide.title }}</h2>
      </div>
      <button @click="saveOffline" class="text-gray-400 hover:text-emerald-600 p-1" title="Save Offline">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
      <span v-if="guide.readTime" class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ guide.readTime }} min read
      </span>
    </div>

    <p class="text-gray-600 line-clamp-2 mb-4 flex-grow">{{ guide.excerpt }}</p>

    <div class="flex flex-wrap gap-2 mt-auto">
      <span v-for="tag in guide.tags" :key="tag" class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{{ tag }}</span>
      <span v-if="guide.requiredTierId" class="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1">
        <span>🔒</span> Premium
      </span>
    </div>
  </router-link>
</template>
