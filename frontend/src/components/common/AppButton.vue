<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger';
}>();
</script>

<template>
  <button
    class="px-4 py-2 rounded-lg font-semibold transition"
    :class="{
      'bg-emerald-600 text-white hover:bg-emerald-700': variant === 'primary' || !variant,
      'bg-gray-100 text-gray-700 hover:bg-gray-200': variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700': variant === 'danger'
    }"
  >
    <slot></slot>
  </button>
</template>
