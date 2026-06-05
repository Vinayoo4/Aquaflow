<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';
import { useToastStore } from '../stores/toast';

const toast = useToastStore();
const stats = ref<any>(null);
const content = ref<any[]>([]);
const tiers = ref<any[]>([]);
const users = ref<any[]>([]);
const auditLogs = ref<any[]>([]);
const loading = ref(true);

const activeTab = ref<'overview' | 'content' | 'memberships' | 'users' | 'audit'>('overview');

const showContentModal = ref(false);
const showTierModal = ref(false);
const editingContent = ref<any>(null);
const editingTier = ref<any>(null);

const contentForm = ref({
  title: '',
  excerpt: '',
  body: '',
  type: 'guide',
  tags: [] as string[],
  isPublished: true,
  requiredTierId: null as string | null,
  slug: '',
});

const tierForm = ref({
  name: '',
  description: '',
  price: 0,
  features: [] as string[],
});

const tagInput = ref('');
const featureInput = ref('');

const loadData = async () => {
  try {
    const [statsData, contentData, tiersData, auditData] = await Promise.all([
      api.admin.getStats(),
      api.content.getAll(),
      api.memberships.getAllTiers(),
      api.admin.getAuditLogs(),
    ]);
    stats.value = statsData;
    content.value = contentData;
    tiers.value = tiersData;
    auditLogs.value = auditData;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const openCreateContent = () => {
  editingContent.value = null;
  contentForm.value = { title: '', excerpt: '', body: '', type: 'guide', tags: [], isPublished: true, requiredTierId: null, slug: '' };
  showContentModal.value = true;
};

const openEditContent = (item: any) => {
  editingContent.value = item;
  contentForm.value = {
    title: item.title,
    excerpt: item.excerpt || '',
    body: item.body || '',
    type: item.type || 'guide',
    tags: item.tags || [],
    isPublished: item.isPublished !== false,
    requiredTierId: item.requiredTierId || null,
    slug: item.slug || '',
  };
  showContentModal.value = true;
};

const saveContent = async () => {
  try {
    if (editingContent.value) {
      const updated = await api.content.update(editingContent.value.id, contentForm.value);
      const idx = content.value.findIndex((c: any) => c.id === editingContent.value.id);
      if (idx !== -1) content.value[idx] = updated;
      toast.success('Content updated');
    } else {
      const created = await api.content.create(contentForm.value);
      content.value.unshift(created);
      toast.success('Content created');
    }
    showContentModal.value = false;
    loadData();
  } catch (e: any) {
    toast.error('Failed to save content', e.message);
  }
};

const deleteContent = async (id: string) => {
  try {
    await api.content.delete(id);
    content.value = content.value.filter((c: any) => c.id !== id);
    toast.success('Content deleted');
  } catch (e: any) {
    toast.error('Failed to delete content', e.message);
  }
};

const openCreateTier = () => {
  editingTier.value = null;
  tierForm.value = { name: '', description: '', price: 0, features: [] };
  showTierModal.value = true;
};

const openEditTier = (tier: any) => {
  editingTier.value = tier;
  tierForm.value = { name: tier.name, description: tier.description, price: tier.price, features: tier.features || [] };
  showTierModal.value = true;
};

const saveTier = async () => {
  try {
    if (editingTier.value) {
      const updated = await api.memberships.updateTier(editingTier.value.id, tierForm.value);
      const idx = tiers.value.findIndex((t: any) => t.id === editingTier.value.id);
      if (idx !== -1) tiers.value[idx] = updated;
      toast.success('Membership tier updated');
    } else {
      const created = await api.memberships.createTier(tierForm.value);
      tiers.value.push(created);
      toast.success('Membership tier created');
    }
    showTierModal.value = false;
    loadData();
  } catch (e: any) {
    toast.error('Failed to save tier', e.message);
  }
};

const addTag = () => {
  if (tagInput.value && !contentForm.value.tags.includes(tagInput.value)) {
    contentForm.value.tags.push(tagInput.value);
    tagInput.value = '';
  }
};

const removeTag = (tag: string) => {
  contentForm.value.tags = contentForm.value.tags.filter(t => t !== tag);
};

const addFeature = () => {
  if (featureInput.value && !tierForm.value.features.includes(featureInput.value)) {
    tierForm.value.features.push(featureInput.value);
    featureInput.value = '';
  }
};

const removeFeature = (feature: string) => {
  tierForm.value.features = tierForm.value.features.filter(f => f !== feature);
};

const totalPublished = computed(() => content.value.filter((c: any) => c.isPublished).length);

onMounted(() => { loadData(); });
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <div class="mb-8">
      <div class="badge-danger mb-3 inline-flex">Admin</div>
      <h1 class="text-3xl md:text-4xl font-bold text-surface-900">Dashboard</h1>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex flex-wrap gap-2 mb-8 border-b border-surface-200 pb-0">
      <button
        v-for="tab in ([
          { key: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
          { key: 'content', label: 'Content', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
          { key: 'memberships', label: 'Memberships', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { key: 'audit', label: 'Audit Log', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        ])"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
          activeTab === tab.key
            ? 'text-primary-600 border-primary-600'
            : 'text-surface-500 border-transparent hover:text-surface-700 hover:border-surface-300'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" :d="tab.icon" />
        </svg>
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="grid grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="card p-6"><div class="skeleton h-12 w-full" /></div>
      </div>
    </div>

    <template v-else>
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-surface-500">Total Users</p>
              <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-surface-900">{{ stats?.usersCount || 0 }}</p>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-surface-500">Total Content</p>
              <div class="w-10 h-10 bg-secondary-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-surface-900">{{ stats?.contentCount || 0 }}</p>
            <p class="text-xs text-surface-400 mt-1">{{ totalPublished }} published</p>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-surface-500">User Plans</p>
              <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-surface-900">{{ stats?.plansCount || 0 }}</p>
          </div>
          <div class="card p-6">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-surface-500">Membership Tiers</p>
              <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-surface-900">{{ tiers.length }}</p>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="font-semibold text-surface-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button @click="activeTab = 'content'; openCreateContent()" class="btn-secondary justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Content
            </button>
            <button @click="activeTab = 'memberships'; openCreateTier()" class="btn-secondary justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Tier
            </button>
            <button @click="activeTab = 'audit'" class="btn-secondary justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Audit Logs
            </button>
          </div>
        </div>
      </div>

      <!-- Content Tab -->
      <div v-if="activeTab === 'content'">
        <div class="flex items-center justify-between mb-6">
          <p class="text-surface-500 text-sm">{{ content.length }} items</p>
          <button @click="openCreateContent" class="btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Content
          </button>
        </div>

        <div v-if="content.length === 0" class="card p-8 text-center text-surface-500">
          No content items yet.
        </div>

        <div v-else class="space-y-4">
          <div v-for="item in content" :key="item.id" class="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-surface-900 truncate">{{ item.title }}</h3>
                <span v-if="item.isPublished" class="badge-success text-xs">Published</span>
                <span v-else class="badge-warning text-xs">Draft</span>
              </div>
              <p class="text-sm text-surface-500 truncate">{{ item.excerpt }}</p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openEditContent(item)" class="btn-ghost text-sm">Edit</button>
              <button @click="deleteContent(item.id)" class="btn-ghost text-sm text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Memberships Tab -->
      <div v-if="activeTab === 'memberships'">
        <div class="flex items-center justify-between mb-6">
          <p class="text-surface-500 text-sm">{{ tiers.length }} tiers</p>
          <button @click="openCreateTier" class="btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Tier
          </button>
        </div>

        <div v-if="tiers.length === 0" class="card p-8 text-center text-surface-500">
          No membership tiers yet.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tier in tiers" :key="tier.id" class="card p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-surface-900">{{ tier.name }}</h3>
                <p class="text-sm text-surface-500">{{ tier.description }}</p>
              </div>
              <p class="text-2xl font-bold text-primary-600">${{ tier.price }}</p>
            </div>
            <ul class="space-y-2 mb-4">
              <li v-for="feature in tier.features" :key="feature" class="flex items-center gap-2 text-sm text-surface-600">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ feature }}
              </li>
            </ul>
            <button @click="openEditTier(tier)" class="btn-secondary w-full">Edit Tier</button>
          </div>
        </div>
      </div>

      <!-- Audit Tab -->
      <div v-if="activeTab === 'audit'">
        <div class="card p-6">
          <h3 class="font-semibold text-surface-900 mb-4">Recent Activity</h3>
          <div v-if="auditLogs.length === 0" class="text-center text-surface-500 py-8">
            No audit logs recorded yet.
          </div>
          <div v-else class="space-y-3">
            <div v-for="log in auditLogs" :key="log.id" class="flex items-start gap-3 p-3 bg-surface-50 rounded-xl text-sm">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-surface-700"><span class="font-medium">{{ log.adminEmail || 'Admin' }}</span> {{ log.action }}</p>
                <p v-if="log.details" class="text-surface-500 text-xs mt-0.5">{{ typeof log.details === 'string' ? log.details : JSON.stringify(log.details) }}</p>
                <p class="text-surface-400 text-xs mt-1">{{ log.timestamp ? new Date(log.timestamp).toLocaleString() : '' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Content Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showContentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showContentModal = false">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-2xl p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-surface-900">{{ editingContent ? 'Edit Content' : 'New Content' }}</h2>
              <button @click="showContentModal = false" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form @submit.prevent="saveContent" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 sm:col-span-1">
                  <label class="label">Title</label>
                  <input v-model="contentForm.title" class="input" required />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="label">Slug</label>
                  <input v-model="contentForm.slug" class="input" placeholder="my-guide-slug" />
                </div>
              </div>
              <div>
                <label class="label">Excerpt</label>
                <input v-model="contentForm.excerpt" class="input" placeholder="Brief description" />
              </div>
              <div>
                <label class="label">Body (Content)</label>
                <textarea v-model="contentForm.body" class="input min-h-[150px] resize-y" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">Type</label>
                  <select v-model="contentForm.type" class="input">
                    <option value="guide">Guide</option>
                    <option value="article">Article</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>
                <div>
                  <label class="label">Required Tier</label>
                  <select v-model="contentForm.requiredTierId" class="input">
                    <option :value="null">Free (Everyone)</option>
                    <option v-for="tier in tiers" :key="tier.id" :value="tier.id">{{ tier.name }}</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="label">Tags</label>
                <div class="flex gap-2 mb-2">
                  <input v-model="tagInput" class="input flex-1" placeholder="Add tag" @keyup.enter.prevent="addTag" />
                  <button type="button" @click="addTag" class="btn-secondary">Add</button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in contentForm.tags" :key="tag" class="badge-primary flex items-center gap-1">
                    {{ tag }}
                    <button type="button" @click="removeTag(tag)" class="hover:text-red-600">&times;</button>
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="contentForm.isPublished" class="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                  <span class="text-sm font-medium text-surface-700">Published</span>
                </label>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showContentModal = false" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">{{ editingContent ? 'Update' : 'Create' }}</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Tier Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTierModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showTierModal = false">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-surface-900">{{ editingTier ? 'Edit Tier' : 'New Membership Tier' }}</h2>
              <button @click="showTierModal = false" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form @submit.prevent="saveTier" class="space-y-4">
              <div>
                <label class="label">Tier Name</label>
                <input v-model="tierForm.name" class="input" required />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea v-model="tierForm.description" class="input min-h-[80px] resize-none" />
              </div>
              <div>
                <label class="label">Price ($/month)</label>
                <input v-model.number="tierForm.price" type="number" class="input" min="0" step="0.01" />
              </div>
              <div>
                <label class="label">Features</label>
                <div class="flex gap-2 mb-2">
                  <input v-model="featureInput" class="input flex-1" placeholder="Add feature" @keyup.enter.prevent="addFeature" />
                  <button type="button" @click="addFeature" class="btn-secondary">Add</button>
                </div>
                <div class="space-y-2">
                  <div v-for="(feature, idx) in tierForm.features" :key="idx" class="flex items-center gap-2 text-sm text-surface-600 bg-surface-50 rounded-lg p-2">
                    <span class="flex-1">{{ feature }}</span>
                    <button type="button" @click="removeFeature(feature)" class="text-red-500 hover:text-red-600">&times;</button>
                  </div>
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showTierModal = false" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">{{ editingTier ? 'Update' : 'Create' }}</button>
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