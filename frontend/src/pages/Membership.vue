<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { apiFetch } from '../services/api';

const auth = useAuthStore();
const loading = ref(false);
const error = ref('');
const success = ref('');

const activateMembership = async (tierId: string) => {
  if (!auth.isLoggedIn) {
    error.value = 'Please log in to upgrade your membership.';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const data = await apiFetch('/memberships/activate', {
      method: 'PATCH',
      body: JSON.stringify({ tierId })
    });

    // Update user in store
    auth.setAuth(auth.token as string, data.user);
    success.value = 'Membership upgraded successfully! Welcome to the club.';
  } catch (err: any) {
    error.value = err.message || 'Failed to upgrade membership';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-emerald-900 mb-4">Green Thumb Club</h1>
      <p class="text-xl text-gray-600">Join our community and get exclusive access to premium guides, meal plans, and downloads.</p>
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center font-medium">{{ error }}</div>
    <div v-if="success" class="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-center font-medium">{{ success }}</div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Basic Tier -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Basic Member</h2>
        <div class="text-4xl font-extrabold text-gray-900 mb-6">Free</div>

        <ul class="space-y-4 mb-8 flex-grow">
          <li class="flex items-start gap-3">
            <span class="text-emerald-500">✓</span>
            <span class="text-gray-600">Access to standard gardening guides</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-emerald-500">✓</span>
            <span class="text-gray-600">Basic planning tools</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-emerald-500">✓</span>
            <span class="text-gray-600">Read community posts</span>
          </li>
        </ul>

        <div v-if="auth.isLoggedIn && !auth.isMember" class="text-center p-3 bg-gray-50 text-gray-500 rounded font-medium border border-gray-100">
          Your Current Plan
        </div>
        <router-link v-else-if="!auth.isLoggedIn" to="/login" class="block w-full text-center bg-gray-100 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
          Sign Up for Free
        </router-link>
      </div>

      <!-- Premium Tier -->
      <div class="bg-emerald-900 rounded-2xl shadow-xl border border-emerald-800 p-8 flex flex-col transform md:-translate-y-4 relative">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">
          Most Popular
        </div>

        <h2 class="text-2xl font-bold text-white mb-2">Premium Member</h2>
        <div class="text-4xl font-extrabold text-white mb-2">$5 <span class="text-lg font-normal text-emerald-200">/ month</span></div>
        <p class="text-emerald-200 mb-6 text-sm">Billed annually ($60/year)</p>

        <ul class="space-y-4 mb-8 flex-grow">
          <li class="flex items-start gap-3">
            <span class="text-amber-400">✓</span>
            <span class="text-emerald-50">Everything in Basic</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-amber-400">✓</span>
            <span class="text-emerald-50">Access to all premium guides & recipes</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-amber-400">✓</span>
            <span class="text-emerald-50">Unlock all downloadable templates & PDFs</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-amber-400">✓</span>
            <span class="text-emerald-50">Post and reply in the Community</span>
          </li>
        </ul>

        <div v-if="auth.isLoggedIn && auth.isMember" class="text-center p-3 bg-emerald-800 text-emerald-100 rounded font-medium border border-emerald-700">
          Your Current Plan
        </div>
        <button
          v-else
          @click="activateMembership('premium-tier-id')"
          :disabled="loading"
          class="w-full bg-amber-500 text-emerald-900 py-3 rounded-lg font-bold hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Upgrading...' : 'Upgrade to Premium' }}
        </button>
      </div>
    </div>
  </div>
</template>
