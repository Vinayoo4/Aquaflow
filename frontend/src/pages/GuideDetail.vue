<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const guide = ref<any>(null);
const error = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    guide.value = await api.content.getById(route.params.id as string);
  } catch (err: any) {
    error.value = err.message || 'Guide not found';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <!-- Loading -->
    <div v-if="loading" class="max-w-3xl mx-auto">
      <div class="skeleton h-4 w-24 mb-8" />
      <div class="skeleton h-10 w-3/4 mb-4" />
      <div class="flex gap-2 mb-8">
        <div class="skeleton h-6 w-16 rounded-full" />
        <div class="skeleton h-6 w-20 rounded-full" />
      </div>
      <div class="skeleton h-4 w-full mb-2" />
      <div class="skeleton h-4 w-full mb-2" />
      <div class="skeleton h-4 w-3/4 mb-2" />
      <div class="skeleton h-4 w-full mb-2" />
      <div class="skeleton h-4 w-2/3" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-3xl mx-auto">
      <div class="card p-8 text-center">
        <div v-if="error.includes('Membership')">
          <svg class="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="text-2xl font-bold text-surface-900 mb-2">Membership Required</h2>
          <p class="text-surface-500 mb-6">This guide is exclusive to members. Upgrade your account to access premium content.</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link to="/login" class="btn-primary">Sign In</router-link>
            <router-link to="/plans" class="btn-secondary">View Plans</router-link>
          </div>
        </div>
        <div v-else>
          <svg class="w-16 h-16 text-surface-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-2xl font-bold text-surface-900 mb-2">Guide Not Found</h2>
          <p class="text-surface-500 mb-6">{{ error }}</p>
          <router-link to="/guides" class="btn-primary">Back to Library</router-link>
        </div>
      </div>
    </div>

    <!-- Guide Content -->
    <article v-else-if="guide" class="max-w-3xl mx-auto">
      <!-- Back Link -->
      <router-link to="/guides" class="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-8 group">
        <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Back to Library
      </router-link>

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div class="badge-primary">{{ guide.type }}</div>
          <span v-if="guide.requiredTierId" class="badge-warning">Members Only</span>
          <span v-if="guide.publishedAt" class="text-xs text-surface-400">{{ new Date(guide.publishedAt).toLocaleDateString() }}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-surface-900 leading-tight mb-4">{{ guide.title }}</h1>
        <p class="text-lg text-surface-500 leading-relaxed">{{ guide.excerpt }}</p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-10 pb-8 border-b border-surface-200">
        <span v-for="tag in guide.tags" :key="tag" class="badge-primary">{{ tag }}</span>
      </div>

      <!-- Body -->
      <div class="prose prose-emerald max-w-none">
        <div class="text-surface-700 leading-relaxed text-base md:text-lg space-y-4 whitespace-pre-line">
          {{ guide.body }}
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-12 pt-8 border-t border-surface-200 flex justify-between">
        <router-link to="/guides" class="btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          All Guides
        </router-link>
        <router-link to="/plans" class="btn-primary">
          Start Planning
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
      </div>
    </article>
  </div>
</template>