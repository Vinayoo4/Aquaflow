<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const auth = useAuthStore();
const router = useRouter();

const login = async () => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    auth.setAuth(data.token, data.user);
    router.push('/');
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>
<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Welcome Back</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-50 text-red-600 rounded text-sm">{{ error }}</div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="email" type="email" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2 border" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password" type="password" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2 border" required />
      </div>
      <button type="submit" class="w-full bg-emerald-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-emerald-700 transition">Log In</button>
    </form>
    <div class="mt-6 text-center text-sm text-gray-500">
      <p>Demo Admin: admin@saltedhash.com / admin123</p>
      <p>Demo Member: member@example.com / member123</p>
    </div>
  </div>
</template>
