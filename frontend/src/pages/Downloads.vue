<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';
import { useToastStore } from '../stores/toast';

const auth = useAuthStore();
const toast = useToastStore();
const downloads = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    downloads.value = await api.downloads.getAll();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const resourceCategories = [
  { key: 'all', label: 'All Resources' },
  { key: 'checklist', label: 'Checklists' },
  { key: 'template', label: 'Templates' },
  { key: 'guide', label: 'Quick Guides' },
  { key: 'calendar', label: 'Calendars' },
];

const activeCategory = ref('all');

const filteredDownloads = computed(() => {
  if (activeCategory.value === 'all') return downloads.value;
  return downloads.value.filter((d: any) => d.category === activeCategory.value);
});

const getFileIcon = (url: string) => {
  if (url?.endsWith('.pdf')) return '📄';
  if (url?.endsWith('.xlsx') || url?.endsWith('.csv')) return '📊';
  if (url?.endsWith('.doc') || url?.endsWith('.docx')) return '📝';
  return '📎';
};

const handleDownload = (item: any) => {
  toast.success('Download started', `${item.title} is being downloaded`);
  if (item.downloadUrl) {
    window.open(item.downloadUrl, '_blank');
  }
};
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <div class="mb-8 md:mb-12">
      <div class="badge-primary mb-3 inline-flex">Resources</div>
      <h1 class="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Downloads & Resources</h1>
      <p class="text-lg text-surface-500 max-w-2xl">Downloadable checklists, templates, and quick-reference guides for your gardening journey.</p>
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="cat in resourceCategories"
        :key="cat.key"
        @click="activeCategory = cat.key"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
          activeCategory === cat.key
            ? 'bg-primary-600 text-white shadow-soft'
            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="card p-6">
        <div class="skeleton h-24 w-full mb-4" />
        <div class="skeleton h-5 w-2/3 mb-2" />
        <div class="skeleton h-4 w-full mb-4" />
        <div class="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="downloads.length === 0" class="card p-12 text-center">
      <svg class="w-20 h-20 text-surface-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h2 class="text-2xl font-bold text-surface-900 mb-3">No Resources Yet</h2>
      <p class="text-surface-500 mb-6">Resources will be added by the admin. Check back soon for checklists, templates, and more.</p>
    </div>

    <!-- Resources Grid -->
    <div v-else-if="filteredDownloads.length === 0" class="text-center py-12">
      <p class="text-surface-500">No resources in this category yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(item, i) in filteredDownloads"
        :key="item.id"
        class="card-interactive p-6 animate-slide-up"
        :style="{ animationDelay: `${i * 0.05}s` }"
      >
        <div class="w-full h-32 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">
          {{ getFileIcon(item.downloadUrl) }}
        </div>
        <h3 class="font-semibold text-surface-900 mb-2">{{ item.title }}</h3>
        <p v-if="item.description" class="text-sm text-surface-500 line-clamp-2 mb-4">{{ item.description }}</p>
        <div class="flex items-center gap-2 mb-4">
          <span class="badge-primary text-xs">{{ item.category || 'Resource' }}</span>
          <span v-if="item.requiredTierId" class="badge-warning text-xs">Members Only</span>
          <span v-else class="badge-success text-xs">Free</span>
        </div>
        <button
          @click="handleDownload(item)"
          :disabled="!!item.requiredTierId && !auth.user?.tierId && !auth.user?.role"
          class="btn-primary w-full"
          :class="{ 'opacity-50 cursor-not-allowed': !!item.requiredTierId && !auth.user?.tierId && auth.user?.role !== 'admin' }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
      </div>
    </div>
  </div>
</template>