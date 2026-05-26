<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOfflineStore } from '../stores/offlineStore';
import { v4 as uuidv4 } from 'uuid';

const offlineStore = useOfflineStore();
const drafts = ref<any[]>([]);
const newDraftTitle = ref('');

const loadDrafts = async () => {
  drafts.value = await offlineStore.getDrafts();
};

const createDraft = async () => {
  if (!newDraftTitle.value) return;
  const draft = {
    id: uuidv4(),
    title: newDraftTitle.value,
    type: 'garden',
    items: [],
    isDraft: true
  };
  await offlineStore.saveDraft(draft);
  newDraftTitle.value = '';
  await loadDrafts();
};

const deleteDraft = async (id: string) => {
  await offlineStore.deleteDraft(id);
  await loadDrafts();
};

onMounted(() => {
  loadDrafts();
});
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">My Planning Workspace</h1>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 class="font-semibold mb-4 text-gray-800">Create Local Draft</h2>
      <div class="flex gap-2">
        <input v-model="newDraftTitle" placeholder="e.g. Spring Balcony Garden" class="flex-1 border-gray-300 rounded-lg border px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500" @keyup.enter="createDraft"/>
        <button @click="createDraft" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Create</button>
      </div>
    </div>

    <div>
      <h2 class="font-semibold text-lg mb-4">Local Drafts (Saved Offline)</h2>
      <div v-if="drafts.length === 0" class="text-gray-500 text-sm">No local drafts found.</div>
      <ul class="space-y-3">
        <li v-for="draft in drafts" :key="draft.id" class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
          <span class="font-medium text-emerald-900">{{ draft.title }}</span>
          <button @click="deleteDraft(draft.id)" class="text-red-600 text-sm hover:underline">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>
