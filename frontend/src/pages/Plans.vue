<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOfflineStore } from '../stores/offlineStore';
import { v4 as uuidv4 } from 'uuid';
import { apiFetch } from '../services/api';

const offlineStore = useOfflineStore();
const drafts = ref<any[]>([]);
const onlinePlans = ref<any[]>([]);
const newDraftTitle = ref('');
const loadingOnline = ref(true);
const errorOnline = ref('');

const loadDrafts = async () => {
  drafts.value = await offlineStore.getDrafts();
};

const loadOnlinePlans = async () => {
  try {
    loadingOnline.value = true;
    onlinePlans.value = await apiFetch('/plans');
  } catch (err: any) {
    errorOnline.value = err.message || 'Failed to load online plans';
  } finally {
    loadingOnline.value = false;
  }
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

const deleteOnlinePlan = async (id: string) => {
  try {
    await apiFetch(`/plans/${id}`, { method: 'DELETE' });
    await loadOnlinePlans();
  } catch (err: any) {
    alert(err.message || 'Failed to delete online plan');
  }
};

onMounted(() => {
  loadDrafts();
  loadOnlinePlans();
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

    <div class="mb-8">
      <h2 class="font-semibold text-lg mb-4">Local Drafts (Saved Offline)</h2>
      <div v-if="drafts.length === 0" class="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
        No local drafts found. Create one above to get started.
      </div>
      <ul class="space-y-3">
        <li v-for="draft in drafts" :key="draft.id" class="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <span class="font-medium text-emerald-900">{{ draft.title }}</span>
          <button @click="deleteDraft(draft.id)" class="text-red-600 text-sm hover:underline">Delete</button>
        </li>
      </ul>
    </div>

    <div>
      <h2 class="font-semibold text-lg mb-4">Synced Plans (Online)</h2>
      <div v-if="loadingOnline" class="text-gray-500 text-sm">Loading online plans...</div>
      <div v-else-if="errorOnline" class="text-red-500 text-sm">{{ errorOnline }}</div>
      <div v-else-if="onlinePlans.length === 0" class="text-center py-8 bg-emerald-50 rounded-lg border border-emerald-100 text-gray-500 text-sm">
        No synced plans found.
      </div>
      <ul v-else class="space-y-3">
        <li v-for="plan in onlinePlans" :key="plan.id" class="flex justify-between items-center bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
          <div class="flex flex-col">
            <span class="font-medium text-emerald-900">{{ plan.title }}</span>
            <span class="text-xs text-gray-500 capitalize">{{ plan.type }} Plan &bull; {{ plan.items?.length || 0 }} items</span>
          </div>
          <button @click="deleteOnlinePlan(plan.id)" class="text-red-600 text-sm hover:underline">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>
