<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const posts = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const currentPost = ref<any>(null);

// Form state
const showNewPostForm = ref(false);
const newPostTitle = ref('');
const newPostBody = ref('');
const newReplyBody = ref('');
const submitting = ref(false);

const loadPosts = async () => {
  try {
    loading.value = true;
    posts.value = await apiFetch('/community');
  } catch (err: any) {
    error.value = err.message || 'Failed to load community posts';
  } finally {
    loading.value = false;
  }
};

const viewPost = async (id: string) => {
  try {
    const data = await apiFetch(`/community/${id}`);
    currentPost.value = data;
    // ensure replies is an array
    if (!currentPost.value.replies) currentPost.value.replies = [];
  } catch (err: any) {
    alert(err.message || 'Failed to load post');
  }
};

const closePost = () => {
  currentPost.value = null;
  loadPosts(); // refresh list to show correct reply counts
};

const createPost = async () => {
  if (!newPostTitle.value.trim() || !newPostBody.value.trim()) return;

  submitting.value = true;
  try {
    await apiFetch('/community', {
      method: 'POST',
      body: JSON.stringify({
        title: newPostTitle.value,
        body: newPostBody.value
      })
    });
    showNewPostForm.value = false;
    newPostTitle.value = '';
    newPostBody.value = '';
    await loadPosts();
  } catch (err: any) {
    alert(err.message || 'Failed to create post');
  } finally {
    submitting.value = false;
  }
};

const submitReply = async () => {
  if (!newReplyBody.value.trim() || !currentPost.value) return;

  submitting.value = true;
  try {
    const newReply = await apiFetch(`/community/${currentPost.value.id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ body: newReplyBody.value })
    });

    // Add to current post view
    currentPost.value.replies.push(newReply);
    newReplyBody.value = '';
  } catch (err: any) {
    alert(err.message || 'Failed to submit reply');
  } finally {
    submitting.value = false;
  }
};

const formatDate = (timestamp: number) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

onMounted(() => {
  loadPosts();
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- List View -->
    <div v-if="!currentPost">
      <div class="flex justify-between items-end mb-6">
        <div>
          <h1 class="text-3xl font-bold">Community Board</h1>
          <p class="text-gray-600 mt-2">Connect, share, and ask questions.</p>
        </div>
        <button
          v-if="auth.isLoggedIn"
          @click="showNewPostForm = !showNewPostForm"
          class="bg-emerald-600 text-white px-4 py-2 rounded font-semibold hover:bg-emerald-700 transition">
          {{ showNewPostForm ? 'Cancel' : 'New Post' }}
        </button>
      </div>

      <!-- New Post Form -->
      <div v-if="showNewPostForm" class="bg-emerald-50 p-6 rounded-xl border border-emerald-100 mb-8 shadow-sm">
        <h2 class="font-bold text-emerald-900 mb-4">Create a New Post</h2>
        <input
          v-model="newPostTitle"
          type="text"
          placeholder="Title"
          class="w-full mb-4 p-3 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        />
        <textarea
          v-model="newPostBody"
          rows="4"
          placeholder="What's on your mind?"
          class="w-full mb-4 p-3 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        ></textarea>
        <div class="flex justify-end">
          <button
            @click="createPost"
            :disabled="submitting || !newPostTitle || !newPostBody"
            class="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
            {{ submitting ? 'Posting...' : 'Post' }}
          </button>
        </div>
      </div>

      <div v-if="!auth.isLoggedIn" class="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-8 text-amber-800 flex justify-between items-center">
        <span>Log in to join the conversation.</span>
        <router-link to="/login" class="bg-amber-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-amber-700">Log In</router-link>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500">Loading posts...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="posts.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
        <h2 class="text-xl font-bold text-emerald-900 mb-2">No posts yet</h2>
        <p>Be the first to start a discussion!</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="post in posts" :key="post.id" @click="viewPost(post.id)" class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
          <h2 class="text-xl font-bold text-emerald-900 mb-2">{{ post.title }}</h2>
          <p class="text-gray-600 line-clamp-2 mb-4">{{ post.body }}</p>
          <div class="flex justify-between items-center text-xs text-gray-500">
            <div class="flex items-center gap-2">
              <span class="font-medium bg-gray-100 px-2 py-1 rounded">By {{ post.authorId }}</span>
              <span>{{ formatDate(post.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
              </svg>
              {{ post.replyCount || 0 }} replies
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail View -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 md:p-8 border-b border-gray-100">
        <button @click="closePost" class="text-emerald-600 text-sm hover:underline mb-6 flex items-center gap-1">
          &larr; Back to Board
        </button>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ currentPost.title }}</h1>
        <div class="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">
          <span class="font-medium text-emerald-800">Author: {{ currentPost.authorId }}</span>
          <span>&bull;</span>
          <span>{{ formatDate(currentPost.createdAt) }}</span>
        </div>

        <div class="prose prose-emerald max-w-none text-gray-800 whitespace-pre-wrap">
          {{ currentPost.body }}
        </div>
      </div>

      <!-- Replies Section -->
      <div class="bg-gray-50 p-6 md:p-8">
        <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          Replies ({{ currentPost.replies?.length || 0 }})
        </h3>

        <div v-if="!currentPost.replies || currentPost.replies.length === 0" class="text-gray-500 text-sm italic mb-8">
          No replies yet.
        </div>

        <div v-else class="space-y-6 mb-8">
          <div v-for="reply in currentPost.replies" :key="reply.id" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
              <span class="font-bold text-gray-700">{{ reply.authorId }}</span>
              <span>&bull;</span>
              <span>{{ formatDate(reply.createdAt) }}</span>
            </div>
            <div class="text-gray-700 whitespace-pre-wrap text-sm">{{ reply.body }}</div>
          </div>
        </div>

        <!-- Add Reply -->
        <div v-if="auth.isLoggedIn" class="mt-8">
          <textarea
            v-model="newReplyBody"
            rows="3"
            placeholder="Write a reply..."
            class="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white"
          ></textarea>
          <div class="flex justify-end">
            <button
              @click="submitReply"
              :disabled="submitting || !newReplyBody.trim()"
              class="bg-emerald-600 text-white px-5 py-2 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
              {{ submitting ? 'Replying...' : 'Reply' }}
            </button>
          </div>
        </div>
        <div v-else class="bg-amber-50 p-4 rounded text-amber-800 text-sm border border-amber-200 text-center">
          <router-link to="/login" class="font-bold underline">Log in</router-link> to reply.
        </div>
      </div>
    </div>
  </div>
</template>
