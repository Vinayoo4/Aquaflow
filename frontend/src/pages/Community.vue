<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';
import { useToastStore } from '../stores/toast';

const auth = useAuthStore();
const toast = useToastStore();
const posts = ref<any[]>([]);
const loading = ref(true);
const showCreateModal = ref(false);
const newPost = ref({ title: '', content: '' });

onMounted(async () => {
  try {
    posts.value = await api.community.getPosts();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const createPost = async () => {
  if (!newPost.value.title || !newPost.value.content) return;
  try {
    const post = await api.community.createPost({
      title: newPost.value.title,
      content: newPost.value.content,
    });
    posts.value.unshift(post);
    toast.success('Post created', 'Your post is now visible to the community');
    showCreateModal.value = false;
    newPost.value = { title: '', content: '' };
  } catch (e: any) {
    toast.error('Failed to create post', e.message);
  }
};
</script>

<template>
  <div class="container-app py-8 md:py-12">
    <div class="mb-8">
      <div class="badge-primary mb-3 inline-flex">Community</div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-surface-900 mb-2">Community</h1>
          <p class="text-surface-500 max-w-2xl">Connect with fellow urban gardeners. Share tips, ask questions, and grow together.</p>
        </div>
        <button v-if="auth.isAuthenticated" @click="showCreateModal = true" class="btn-primary whitespace-nowrap">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="card p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="skeleton w-10 h-10 rounded-full" />
          <div><div class="skeleton h-5 w-32 mb-1" /><div class="skeleton h-3 w-20" /></div>
        </div>
        <div class="skeleton h-5 w-3/4 mb-2" />
        <div class="skeleton h-4 w-full" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="posts.length === 0" class="card p-12 text-center">
      <svg class="w-20 h-20 text-surface-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 class="text-2xl font-bold text-surface-900 mb-3">Welcome to the Community!</h2>
      <p class="text-surface-500 mb-6 max-w-md mx-auto">Be the first to start a conversation. Share your gardening experiences, ask for advice, or connect with fellow growers.</p>
      <button v-if="auth.isAuthenticated" @click="showCreateModal = true" class="btn-primary">Start a Discussion</button>
      <router-link v-else to="/login" class="btn-primary">Sign In to Post</router-link>
    </div>

    <!-- Posts -->
    <div v-else class="space-y-4">
      <div v-for="post in posts" :key="post.id" class="card p-6 animate-slide-up">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {{ post.authorName?.[0]?.toUpperCase() || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-surface-900">{{ post.title }}</h3>
            <div class="flex items-center gap-3 text-xs text-surface-400 mt-1">
              <span>{{ post.authorName || 'Member' }}</span>
              <span>{{ post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '' }}</span>
            </div>
          </div>
        </div>
        <p class="text-surface-600 leading-relaxed whitespace-pre-line">{{ post.content }}</p>
      </div>
    </div>

    <!-- Create Post Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showCreateModal = false">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div class="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg p-6 md:p-8 animate-scale-in">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-surface-900">New Discussion</h2>
              <button @click="showCreateModal = false" class="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form @submit.prevent="createPost" class="space-y-4">
              <div>
                <label class="label">Title</label>
                <input v-model="newPost.title" class="input" placeholder="What's on your mind?" required />
              </div>
              <div>
                <label class="label">Content</label>
                <textarea v-model="newPost.content" class="input min-h-[120px] resize-none" placeholder="Share your thoughts..." required />
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showCreateModal = false" class="btn-secondary flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">Post</button>
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
.modal-leave-to { opacity: 0; }
.modal-enter-from .relative,
.modal-leave-to .relative { transform: scale(0.95); }
</style>