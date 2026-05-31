<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisterError(error: any) {
    console.error('Service worker registration error', error);
  },
});

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <div v-if="offlineReady || needRefresh" class="fixed top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-lg shadow-xl border border-emerald-200 z-50 text-center text-sm w-11/12 max-w-md">
    <div v-if="offlineReady">
      <p class="text-emerald-800 font-medium mb-2">App ready to work offline</p>
      <button @click="close" class="text-gray-500 hover:text-gray-700 underline text-xs">Close</button>
    </div>
    <div v-if="needRefresh">
      <p class="text-emerald-800 font-medium mb-3">New content available, click on reload button to update.</p>
      <div class="flex justify-center gap-3">
        <button @click="updateServiceWorker()" class="bg-emerald-600 text-white px-4 py-1.5 rounded hover:bg-emerald-700">Reload</button>
        <button @click="close" class="bg-gray-200 text-gray-800 px-4 py-1.5 rounded hover:bg-gray-300">Close</button>
      </div>
    </div>
  </div>
</template>
