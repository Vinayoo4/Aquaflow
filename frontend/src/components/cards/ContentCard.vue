<script setup lang="ts">
defineProps<{
  title: string;
  excerpt: string;
  tags?: string[];
  requiresMembership?: boolean;
}>();
</script>

<template>
  <div class="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
    <h2 class="text-xl font-semibold text-emerald-900 group-hover:text-emerald-600 mb-2">{{ title }}</h2>
    <p class="text-gray-600 line-clamp-2 mb-4">{{ excerpt }}</p>
    <div class="flex flex-wrap gap-2 mt-auto">
      <span v-for="tag in tags" :key="tag" class="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{{ tag }}</span>
      <span v-if="requiresMembership" class="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">Members Only</span>
    </div>
  </div>
</template>
