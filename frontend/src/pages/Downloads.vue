<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../stores/auth';

const downloads = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    downloads.value = await apiFetch('/downloads');
  } catch (err: any) {
    error.value = err.message || 'Failed to load downloads';
  } finally {
    loading.value = false;
  }
});

const downloadFile = async (id: string) => {
  try {
    const authStore = useAuthStore();
    const headers = new Headers();
    if (authStore.token) {
      headers.set('Authorization', `Bearer ${authStore.token}`);
    }
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/downloads/${id}/file`, { headers });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'download.pdf'; // Or get filename from Content-Disposition header
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err: any) {
    alert(err.message || 'Error downloading file');
  }
};
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Resources</h1>
    <p class="text-gray-600 mb-8">Downloadable checklists and templates to cultivate your life.</p>

    <div v-if="loading" class="text-gray-500">Loading resources...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="downloads.length === 0" class="text-gray-500">No resources available yet.</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="dl in downloads" :key="dl.id" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
        <h2 class="text-xl font-semibold text-emerald-900 mb-2">{{ dl.title }}</h2>
        <p class="text-gray-600 mb-4 flex-grow">{{ dl.description }}</p>
        <div class="flex justify-between items-center mt-auto">
          <div class="text-xs text-gray-500 font-medium">
             {{ (dl.fileSize / 1024).toFixed(0) }} KB &bull; {{ dl.fileType.toUpperCase() }}
          </div>
          <a href="#" @click.prevent="downloadFile(dl.id)" class="bg-emerald-600 text-white px-4 py-2 rounded font-semibold hover:bg-emerald-700 transition text-sm">
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
