<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import InstallPrompt from './components/pwa/InstallPrompt.vue';
import UpdateBanner from './components/pwa/UpdateBanner.vue';

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push('/');
};

onMounted(() => {
  auth.restoreSession();
  // Service worker registration is handled by vite-plugin-pwa in main.ts
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UpdateBanner />
    <InstallPrompt />
    <header class="bg-emerald-800 text-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <router-link to="/" class="text-xl font-bold tracking-wider">SALTEDHASH</router-link>
      <nav class="space-x-4 hidden md:flex">
        <router-link to="/guides" class="hover:text-emerald-200">Guides</router-link>
        <router-link to="/plans" class="hover:text-emerald-200">Plans</router-link>
        <router-link to="/downloads" class="hover:text-emerald-200">Resources</router-link>
        <router-link to="/community" class="hover:text-emerald-200">Community</router-link>
      </nav>
      <div class="space-x-4 flex items-center">
        <template v-if="auth.isAuthenticated">
          <router-link v-if="auth.user?.role === 'admin'" to="/admin" class="hover:text-emerald-200 text-sm">Admin</router-link>
          <router-link v-else-if="!auth.isMember" to="/membership" class="hover:text-emerald-200 text-sm bg-amber-600 px-2 py-1 rounded">Upgrade</router-link>
          <span class="text-sm border-r border-emerald-600 pr-4">Hi, {{ auth.user?.firstName }}</span>
          <button @click="logout" class="text-sm hover:text-emerald-200">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-sm font-medium bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">Log In</router-link>
        </template>
      </div>
    </header>

    <!-- Mobile nav strip -->
    <nav class="md:hidden bg-emerald-900 text-emerald-100 flex justify-around p-2 text-sm shadow-inner overflow-x-auto">
      <router-link to="/guides" class="py-1 px-2 rounded whitespace-nowrap">Guides</router-link>
      <router-link to="/plans" class="py-1 px-2 rounded whitespace-nowrap">Plans</router-link>
      <router-link to="/downloads" class="py-1 px-2 rounded whitespace-nowrap">Resources</router-link>
      <router-link to="/community" class="py-1 px-2 rounded whitespace-nowrap">Community</router-link>
    </nav>

    <main class="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-100 p-6 text-center text-gray-500 text-sm border-t border-gray-200">
      <p>&copy; 2024 SALTEDHASH. Natural Living.</p>
    </footer>
  </div>
</template>
