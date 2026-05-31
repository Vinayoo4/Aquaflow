<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOfflineStore } from '../stores/offlineStore';
import ContentCard from '../components/cards/ContentCard.vue';

const guides = ref<any[]>([]);
const loading = ref(true);
const offlineStore = useOfflineStore();

onMounted(async () => {
  try {
    guides.value = await offlineStore.getSavedGuides();
  } catch (err) {
    console.error('Failed to load saved guides:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Saved Offline Guides</h1>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      Loading saved guides...
    </div>

    <div v-else-if="guides.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
      <p class="mb-4">You haven't saved any guides offline yet.</p>
      <router-link to="/guides" class="text-emerald-600 font-medium hover:underline">Browse the Library</router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ContentCard v-for="guide in guides" :key="guide.id" :guide="guide" />
    </div>
  </div>
</template>
