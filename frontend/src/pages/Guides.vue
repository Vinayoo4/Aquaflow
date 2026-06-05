<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';

const guides = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedTag = ref('');
const auth = useAuthStore();

onMounted(async () => {
  try {
    guides.value = await api.content.getAll();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const allTags = computed(() => {
  const tags = new Set<string>();
  guides.value.forEach((g: any) => g.tags?.forEach((t: string) => tags.add(t)));
  return Array.from(tags).sort();
});

const filteredGuides = computed(() => {
  let result = guides.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((g: any) =>
      g.title.toLowerCase().includes(q) ||
      g.excerpt?.toLowerCase().includes(q) ||
      g.tags?.some((t: string) => t.toLowerCase().includes(q))
    );
  }
  if (selectedTag.value) {
    result = result.filter((g: any) => g.tags?.includes(selectedTag.value));
  }
  return result;
});

const clearFilters = () => {
  searchQuery.value = '';
  selectedTag.value = '';
};
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <!-- Header -->
    <div class="mb-8 md:mb-12">
      <div class="badge-primary mb-3 inline-flex">Library</div>
      <h1 class="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Gardening Guides</h1>
      <p class="text-lg text-surface-500 max-w-2xl">Expert advice on urban gardening, herbal remedies, and sustainable living.</p>
    </div>

    <!-- Search & Filters -->
    <div class="card p-4 md:p-6 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search guides..."
            class="input pl-12"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedTag = selectedTag === tag ? '' : tag"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              selectedTag === tag
                ? 'bg-primary-600 text-white shadow-soft'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            ]"
          >
            {{ tag }}
          </button>
          <button
            v-if="searchQuery || selectedTag"
            @click="clearFilters"
            class="px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="n in 4" :key="n" class="card p-6">
        <div class="skeleton h-6 w-3/4 mb-3" />
        <div class="skeleton h-4 w-full mb-2" />
        <div class="skeleton h-4 w-2/3 mb-4" />
        <div class="flex gap-2">
          <div class="skeleton h-6 w-16 rounded-full" />
          <div class="skeleton h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredGuides.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 text-surface-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p class="text-lg font-medium text-surface-600 mb-2">No guides found</p>
      <p class="text-surface-500 mb-4">Try adjusting your search or filters</p>
      <button @click="clearFilters" class="btn-secondary">Clear Filters</button>
    </div>

    <!-- Guides Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <router-link
        v-for="(guide, i) in filteredGuides"
        :key="guide.id"
        :to="`/guides/${guide.id}`"
        class="card-interactive p-6 group"
        :style="{ animationDelay: `${i * 0.05}s` }"
      >
        <div class="flex items-start gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1">{{ guide.title }}</h2>
            <p class="text-sm text-surface-400 mt-0.5">{{ guide.type }}</p>
          </div>
          <svg class="w-5 h-5 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <p class="text-sm text-surface-500 leading-relaxed line-clamp-2 mb-4">{{ guide.excerpt }}</p>

        <div class="flex flex-wrap items-center gap-2">
          <span v-for="tag in guide.tags" :key="tag" class="badge-primary text-xs">{{ tag }}</span>
          <span v-if="guide.requiredTierId" class="badge-warning text-xs flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Members Only
          </span>
        </div>
      </router-link>
    </div>
  </div>
</template>