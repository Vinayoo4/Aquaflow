<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useToastStore } from '../stores/toast';
import { api } from '../services/api';

const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const error = ref('');
const isRegistering = ref(false);
const loading = ref(false);
const authStore = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const toggleMode = () => {
  isRegistering.value = !isRegistering.value;
  error.value = '';
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    let data;
    if (isRegistering.value) {
      data = await api.auth.register(email.value, password.value, firstName.value, lastName.value);
      toast.success('Account created!', 'Welcome to the SaltedHash community');
    } else {
      data = await api.auth.login(email.value, password.value);
      toast.success('Welcome back!', `Signed in as ${data.user.firstName || data.user.email}`);
    }
    authStore.setAuth(data.token, data.user);
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Authentication failed';
    toast.error('Authentication failed', error.value);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-surface-900">{{ isRegistering ? 'Create Account' : 'Welcome Back' }}</h1>
        <p class="text-surface-500 mt-2">{{ isRegistering ? 'Join our gardening community' : 'Sign in to your account' }}</p>
      </div>

      <!-- Form -->
      <div class="card p-8 animate-slide-up">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div v-if="error" class="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <template v-if="isRegistering">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="label">First Name</label>
                <input v-model="firstName" type="text" class="input" placeholder="Jane" />
              </div>
              <div>
                <label class="label">Last Name</label>
                <input v-model="lastName" type="text" class="input" placeholder="Doe" />
              </div>
            </div>
          </template>

          <div>
            <label class="label">Email Address</label>
            <input
              v-model="email"
              type="email"
              class="input"
              placeholder="you@example.com"
              :class="{ 'input-error': error }"
              required
              autocomplete="email"
            />
          </div>

          <div>
            <label class="label">Password</label>
            <input
              v-model="password"
              type="password"
              class="input"
              placeholder="Enter your password"
              :class="{ 'input-error': error }"
              required
              autocomplete="current-password"
              minlength="6"
            />
          </div>

          <button
            type="submit"
            class="btn-primary w-full py-3.5"
            :disabled="loading"
          >
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{{ loading ? 'Please wait...' : isRegistering ? 'Create Account' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-surface-500">
            {{ isRegistering ? 'Already have an account?' : "Don't have an account?" }}
            <button @click="toggleMode" class="link font-medium ml-1">{{ isRegistering ? 'Sign In' : 'Create one' }}</button>
          </p>
        </div>
      </div>

      <!-- Demo Credentials -->
      <div class="mt-6 p-5 card bg-gradient-to-r from-primary-50/50 to-primary-50/30">
        <p class="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-3">Demo Credentials</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="bg-white/50 rounded-lg p-3 border border-primary-100/50">
            <p class="font-medium text-primary-800 mb-1">Admin</p>
            <p class="text-primary-600">admin@saltedhash.com</p>
            <p class="text-primary-500 font-mono">admin123</p>
          </div>
          <div class="bg-white/50 rounded-lg p-3 border border-primary-100/50">
            <p class="font-medium text-primary-800 mb-1">Member</p>
            <p class="text-primary-600">member@example.com</p>
            <p class="text-primary-500 font-mono">member123</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>