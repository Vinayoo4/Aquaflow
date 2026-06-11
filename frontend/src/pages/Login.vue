<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { apiFetch } from '../services/api';

const email = ref('');
const password = ref('');
const error = ref('');
const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);

const login = async () => {
  try {
    loading.value = true;
    error.value = '';
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    auth.setAuth(res.token, res.user);
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Invalid credentials';
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded text-sm">{{ error }}</div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2 border" required />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2 border" required />
      </div>
      <button type="submit" :disabled="loading" class="w-full bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
        {{ loading ? 'Logging in...' : 'Log In' }}
      </button>
    </form>
    <div class="mt-6 text-center text-sm text-gray-500">
      <p>Demo Admin: admin@saltedhash.com / Admin@1234</p>
      <p>Demo Member: member@saltedhash.com / Member@1234</p>
    </div>
  </div>
</template>
