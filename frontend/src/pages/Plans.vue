<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';
import { useToastStore } from '../stores/toast';
import { useAuthStore } from '../stores/auth';
import { useOfflineStore } from '../stores/offlineStore';

const toast = useToastStore();
const auth = useAuthStore();
const offlineStore = useOfflineStore();

const plans = ref<any[]>([]);
const localDrafts = ref<any[]>([]);
const loading = ref(true);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingPlan = ref<any>(null);

const form = ref({
  title: '',
  type: 'garden',
  description: '',
  items: [] as string[],
  isDraft: false,
});

const planTypes = [
  { value: 'garden', label: 'Garden Plan', icon: '🌱' },
  { value: 'meal', label: 'Meal Plan', icon: '🥗' },
  { value: 'seasonal', label: 'Seasonal Calendar', icon: '📅' },
];

const loadPlans = async () => {
  try {
    const [plansData, draftsData] = await Promise.all([
      api.plans.getMyPlans(),
      offlineStore.getDrafts(),
    ]);
    plans.value = plansData;
    localDrafts.value = draftsData;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreate = () => {
  form.value = { title: '', type: 'garden', description: '', items: [], isDraft: false };
  showCreateModal.value = true;
};

const openEdit = (plan: any) => {
  editingPlan.value = plan;
  form.value = {
    title: plan.title,
    type: plan.type || 'garden',
    description: plan.description || '',
    items: plan.items || [],
    isDraft: plan.isDraft || false,
  };
  showEditModal.value = true;
};

const createPlan = async () => {
  if (!form.value.title) return;
  try {
    const newPlan = await api.plans.create({
      title: form.value.title,
      type: form.value.type,
      description: form.value.description,
      items: form.value.items,
    });
    plans.value.unshift(newPlan);
    toast.success('Plan created', 'Your new plan is ready');
    showCreateModal.value = false;
  } catch (e: any) {
    toast.error('Failed to create plan', e.message);
  }
};

const updatePlan = async () => {
  if (!editingPlan.value || !form.value.title) return;
  try {
    const updated = await api.plans.update(editingPlan.value.id, {
      title: form.value.title,
      type: form.value.type,
      description: form.value.description,
      items: form.value.items,
    });
    const idx = plans.value.findIndex((p: any) => p.id === editingPlan.value.id);
    if (idx !== -1) plans.value[idx] = updated;
    toast.success('Plan updated');
    showEditModal.value = false;
    editingPlan.value = null;
  } catch (e: any) {
    toast.error('Failed to update plan', e.message);
  }
};

const deletePlan = async (id: string) => {
  try {
    await api.plans.delete(id);
    plans.value = plans.value.filter((p: any) => p.id !== id);
    toast.success('Plan deleted');
  } catch (e: any) {
    toast.error('Failed to delete plan', e.message);
  }
};

const addItem = () => {
  form.value.items.push('');
};

const removeItem = (idx: number) => {
  form.value.items.splice(idx, 1);
};

const getTypeIcon = (type: string) => {
  return planTypes.find(t => t.value === type)?.icon || '📝';
};

const totalPlans = computed(() => plans.value.length + localDrafts.value.length);

onMounted(() => {
  loadPlans();
});
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <div class="mb-8">
      <div class="badge-primary mb-3 inline-flex">Workspace</div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-surface-900 mb-2">My Plans</h1>
          <p class="text-surface-500">Plan your garden, meals, and seasonal activities.</p>
        </div>
        <button @click="openCreate" class="btn-primary whitespace-nowrap">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Plan
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="card p-6">
        <div class="skeleton h-6 w-1/3 mb-3" />
        <div class="skeleton h-4 w-2/3 mb-3" />
        <div class="flex gap-2">
          <div class="skeleton h-6 w-20 rounded-full" />
          <div class="skeleton h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="totalPlans === 0" class="card p-12 text-center">
      <svg class="w-20 h-20 text-surface-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <h2 class="text-2xl font-bold text-surface-900 mb-3">No Plans Yet</h2>
      <p class="text-surface-500 mb-6 max-w-md mx-auto">Create your first garden plan to start organizing your planting schedule, tasks, and goals.</p>
      <button @click="openCreate" class="btn-primary">Create Your First Plan</button>
    </div>

    <!-- Plans Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Server Plans -->
      <div
        v-for="(plan, i) in plans"
        :key="plan.id"
        class="card-interactive p-6 animate-slide-up"
        :style="{ animationDelay: `${i * 0.05}s` }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-lg">
              {{ getTypeIcon(plan.type) }}
            </div>
            <div>
              <h3 class="font-semibold text-surface-900 line-clamp-1">{{ plan.title }}</h3>
              <p class="text-xs text-surface-400 capitalize">{{ plan.type }} plan</p>
            </div>
          </div>
          <div class="flex gap-1">
            <button @click="openEdit(plan)" class="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="deletePlan(plan.id)" class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="plan.description" class="text-sm text-surface-500 line-clamp-2 mb-4">{{ plan.description }}</p>

        <div v-if="plan.items?.length" class="mb-4">
          <div v-for="(item, idx) in plan.items.slice(0, 3)" :key="idx" class="flex items-center gap-2 text-sm text-surface-600 mb-1.5">
            <svg class="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="truncate">{{ item }}</span>
          </div>
          <p v-if="plan.items.length > 3" class="text-xs text-surface-400 mt-1">+{{ plan.items.length - 3 }} more items</p>
        </div>

        <div class="flex items-center gap-3 text-xs text-surface-400 mt-auto pt-4 border-t border-surface-100">
          <span class="badge-primary">{{ plan.type }}</span>
          <span>{{ plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'Just now' }}</span>
        </div>
      </div>

      <!-- Local Drafts -->
      <div
        v-for="(draft, i) in localDrafts"
        :key="draft.id"
        class="card-interactive p-6 border-dashed border-2 border-primary-200 bg-primary-50/30 animate-slide-up"
        :style="{ animationDelay: `${(plans.length + i) * 0.05}s` }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center text-lg">
              📝
            </div>
            <div>
              <h3 class="font-semibold text-surface-900 line-clamp-1">{{ draft.title }}</h3>
              <p class="text-xs text-surface-400">Offline Draft</p>
            </div>
          </div>
          <button @click="offlineStore.deleteDraft(draft.id); localDrafts = localDrafts.filter(d => d.id !== draft.id)" class="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p class="text-sm text-surface-500">Saved locally on this device</p>
        <div class="mt-4 pt-4 border-t border-primary-200/50">
          <span class="badge-secondary text-xs">Offline</span>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showCreateModal = false; showEditModal = false">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-surface-900">{{ showCreateModal ? 'Create New Plan' : 'Edit Plan' }}</h2>
              <button @click="showCreateModal = false; showEditModal = false" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="showCreateModal ? createPlan() : updatePlan()" class="space-y-5">
              <div>
                <label class="label">Plan Title</label>
                <input v-model="form.title" type="text" class="input" placeholder="e.g. Spring Balcony Garden" required />
              </div>

              <div>
                <label class="label">Plan Type</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="pt in planTypes"
                    :key="pt.value"
                    type="button"
                    @click="form.type = pt.value"
                    :class="[
                      'p-3 rounded-xl text-sm font-medium transition-all border-2 text-center',
                      form.type === pt.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300'
                    ]"
                  >
                    <span class="block text-lg mb-1">{{ pt.icon }}</span>
                    {{ pt.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="label">Description (optional)</label>
                <textarea v-model="form.description" class="input min-h-[80px] resize-none" placeholder="Describe your plan..." />
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="label mb-0">Tasks / Items</label>
                  <button type="button" @click="addItem" class="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add Item</button>
                </div>
                <div v-if="form.items.length === 0" class="text-sm text-surface-400 p-3 bg-surface-50 rounded-lg text-center">
                  No items yet. Add tasks to your plan.
                </div>
                <div v-for="(item, idx) in form.items" :key="idx" class="flex items-center gap-2 mb-2">
                  <input v-model="form.items[idx]" type="text" class="input flex-1" :placeholder="`Task ${idx + 1}`" />
                  <button type="button" @click="removeItem(idx)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex gap-3 pt-2">
                <button type="button" @click="showCreateModal = false; showEditModal = false" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">
                  {{ showCreateModal ? 'Create Plan' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>