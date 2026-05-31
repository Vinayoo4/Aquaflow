<script setup lang="ts">
import { ref, onMounted } from 'vue';

const deferredPrompt = ref<any>(null);
const showPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showPrompt.value = true;
  });
});

const installApp = async () => {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === 'accepted') {
    showPrompt.value = false;
  }
  deferredPrompt.value = null;
};
</script>

<template>
  <div v-if="showPrompt" class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-lg shadow-lg border border-emerald-200 z-50 flex items-center justify-between">
    <div class="text-sm text-gray-700">
      <p class="font-bold">Install Green Thumb Club</p>
      <p>Add to your home screen for offline access.</p>
    </div>
    <button @click="installApp" class="bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 text-sm font-medium ml-4">
      Install
    </button>
  </div>
</template>
