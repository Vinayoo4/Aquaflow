<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import Toast from './components/common/Toast.vue';

const auth = useAuthStore();
const router = useRouter();
const mobileMenuOpen = ref(false);
const scrolled = ref(false);

const logout = () => {
  auth.logout();
  mobileMenuOpen.value = false;
  router.push('/');
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10;
  });
});

watch(mobileMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-surface-50 via-white to-surface-50">
    <Toast />

    <!-- Header -->
    <header
      :class="[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-soft border-b border-surface-200/50'
          : 'bg-white border-b border-transparent'
      ]"
    >
      <div class="container-app">
        <div class="flex items-center justify-between h-16 md:h-20">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2 group">
            <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-300 group-hover:scale-105">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">SaltedHash</span>
          </router-link>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-1">
            <router-link to="/guides" class="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-xl transition-all duration-200" active-class="text-primary-600 bg-primary-50 font-semibold">Guides</router-link>
            <router-link to="/plans" class="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-xl transition-all duration-200" active-class="text-primary-600 bg-primary-50 font-semibold">Plans</router-link>
            <router-link to="/downloads" class="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-xl transition-all duration-200" active-class="text-primary-600 bg-primary-50 font-semibold">Resources</router-link>
            <router-link to="/community" class="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-xl transition-all duration-200" active-class="text-primary-600 bg-primary-50 font-semibold">Community</router-link>
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center gap-3">
            <template v-if="auth.isAuthenticated">
              <router-link v-if="auth.user?.role === 'admin'" to="/admin" class="btn-ghost text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </router-link>
              <div class="flex items-center gap-3 pl-3 border-l border-surface-200">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-soft">
                    {{ auth.user?.firstName?.[0]?.toUpperCase() || 'U' }}
                  </div>
                  <span class="text-sm font-medium text-surface-700">{{ auth.user?.firstName }}</span>
                </div>
                <button @click="logout" class="btn-ghost text-sm text-surface-500 hover:text-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="btn-primary text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign In
              </router-link>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-colors" aria-label="Toggle menu">
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden" @click="mobileMenuOpen = false" />
      </Transition>

      <!-- Mobile Menu Panel -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-surface-200 shadow-elevated z-50">
          <div class="container-app py-4 space-y-1">
            <router-link to="/guides" class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 hover:bg-surface-50 transition-colors" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Guides
            </router-link>
            <router-link to="/plans" class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 hover:bg-surface-50 transition-colors" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Plans
            </router-link>
            <router-link to="/downloads" class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 hover:bg-surface-50 transition-colors" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resources
            </router-link>
            <router-link to="/community" class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 hover:bg-surface-50 transition-colors" @click="mobileMenuOpen = false">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Community
            </router-link>

            <hr class="my-2 border-surface-200">

            <template v-if="auth.isAuthenticated">
              <div class="flex items-center gap-3 px-4 py-3">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ auth.user?.firstName?.[0]?.toUpperCase() || 'U' }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-surface-900">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
                  <p class="text-xs text-surface-500">{{ auth.user?.email }}</p>
                </div>
              </div>
              <router-link v-if="auth.user?.role === 'admin'" to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 hover:bg-surface-50 transition-colors" @click="mobileMenuOpen = false">
                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Panel
              </router-link>
              <button @click="logout" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-semibold" @click="mobileMenuOpen = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign In
              </router-link>
            </template>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-surface-900 text-surface-300 border-t border-surface-800">
      <div class="container-app py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <span class="text-lg font-bold text-white">SaltedHash</span>
            </div>
            <p class="text-sm text-surface-400 max-w-md leading-relaxed">
              Cultivate your life with urban gardening guides, meal planning tools, and a community of natural living enthusiasts.
            </p>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul class="space-y-3">
              <li><router-link to="/guides" class="text-sm text-surface-400 hover:text-white transition-colors">Guides</router-link></li>
              <li><router-link to="/plans" class="text-sm text-surface-400 hover:text-white transition-colors">Plans</router-link></li>
              <li><router-link to="/downloads" class="text-sm text-surface-400 hover:text-white transition-colors">Resources</router-link></li>
              <li><router-link to="/community" class="text-sm text-surface-400 hover:text-white transition-colors">Community</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h3>
            <ul class="space-y-3">
              <li v-if="!auth.isAuthenticated"><router-link to="/login" class="text-sm text-surface-400 hover:text-white transition-colors">Sign In</router-link></li>
              <li v-if="auth.isAuthenticated && auth.user?.role === 'admin'"><router-link to="/admin" class="text-sm text-surface-400 hover:text-white transition-colors">Admin</router-link></li>
              <li><a href="#" class="text-sm text-surface-400 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" class="text-sm text-surface-400 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-10 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-surface-500">&copy; {{ new Date().getFullYear() }} SaltedHash. All rights reserved.</p>
          <div class="flex items-center gap-4 text-surface-500">
            <span class="text-xs">Crafted with care for urban growers</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>