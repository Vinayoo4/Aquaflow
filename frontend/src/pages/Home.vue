<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

const auth = useAuthStore();
const guides = ref<any[]>([]);
const tiers = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [guidesData, tiersData] = await Promise.all([
      api.content.getAll(),
      api.memberships.getAllTiers(),
    ]);
    guides.value = guidesData.slice(0, 4);
    tiers.value = tiersData;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const stats = [
  { value: '50+', label: 'Guides & Resources' },
  { value: '2K+', label: 'Community Members' },
  { value: '100%', label: 'Organic & Natural' },
  { value: '4.9', label: 'Member Rating' },
];
</script>

<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[85vh] flex items-center bg-gradient-to-br from-primary-950 via-primary-900 to-surface-900 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(5, 150, 105, 0.4) 0%, transparent 50%)"></div>
        <div class="absolute inset-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
      </div>

      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl animate-float" style="animation-delay: 0s"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-float" style="animation-delay: -2s"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container-app relative z-10 py-20 md:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-200 text-sm font-medium mb-8 animate-fade-in">
            <span class="w-2 h-2 bg-primary-400 rounded-full animate-pulse-soft"></span>
            Urban Gardening Community
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight animate-slide-up">
            Cultivate Your
            <span class="bg-gradient-to-r from-primary-300 via-primary-400 to-emerald-300 bg-clip-text text-transparent">Natural Life</span>
          </h1>

          <p class="mt-6 text-lg sm:text-xl text-primary-100/80 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-2">
            Join the urban gardening revolution. Access premium guides, organize your garden plans, and connect with a community of natural living enthusiasts.
          </p>

          <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <router-link to="/guides" class="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-2xl font-semibold text-base hover:bg-primary-50 transition-all duration-300 shadow-elevated hover:shadow-2xl hover:-translate-y-0.5">
              Explore Guides
              <svg class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </router-link>
            <router-link to="/plans" class="group inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-base hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5">
              Start Planning
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </router-link>
          </div>

          <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-slide-up stagger-5">
            <div v-for="stat in stats" :key="stat.label" class="text-center p-4">
              <div class="text-3xl md:text-4xl font-bold text-white mb-1">{{ stat.value }}</div>
              <div class="text-sm text-primary-200/70">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-50 to-transparent"></div>
    </section>

    <!-- Features Section -->
    <section class="section bg-surface-50">
      <div class="container-app">
        <div class="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div class="badge-primary mb-4 inline-flex">Everything You Need</div>
          <h2 class="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Grow Smarter, Live Greener</h2>
          <p class="text-lg text-surface-500">Tools and resources designed for urban gardeners and natural living enthusiasts.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div class="card-interactive p-6 md:p-8 group animate-slide-up stagger-1">
            <div class="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-surface-900 mb-3">Premium Guides</h3>
            <p class="text-surface-500 leading-relaxed">Expert-written guides on urban gardening, herbal remedies, sustainable living, and seasonal growing tips.</p>
          </div>

          <div class="card-interactive p-6 md:p-8 group animate-slide-up stagger-2">
            <div class="w-14 h-14 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-surface-900 mb-3">Garden Planner</h3>
            <p class="text-surface-500 leading-relaxed">Plan your garden with our interactive workspace. Create planting schedules, track progress, and organize tasks.</p>
          </div>

          <div class="card-interactive p-6 md:p-8 group animate-slide-up stagger-3">
            <div class="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-surface-900 mb-3">Community</h3>
            <p class="text-surface-500 leading-relaxed">Connect with fellow urban growers. Share tips, ask questions, and celebrate your harvests together.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Membership Section -->
    <section v-if="tiers.length" class="section bg-white">
      <div class="container-app">
        <div class="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div class="badge-secondary mb-4 inline-flex">Membership</div>
          <h2 class="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Unlock Premium Content</h2>
          <p class="text-lg text-surface-500">Get access to exclusive guides, resources, and community features.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div class="card p-6 md:p-8 flex flex-col animate-slide-up stagger-1">
            <div class="mb-6">
              <h3 class="text-xl font-bold text-surface-900 mb-2">Free</h3>
              <p class="text-sm text-surface-500">Get started with basics</p>
            </div>
            <div class="mb-8">
              <span class="text-4xl font-bold text-surface-900">$0</span>
              <span class="text-surface-500">/month</span>
            </div>
            <ul class="space-y-4 mb-8 flex-1">
              <li class="flex items-start gap-3 text-sm text-surface-600">
                <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Basic gardening guides</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-surface-600">
                <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Garden planning tools</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-surface-500">
                <svg class="w-5 h-5 text-surface-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="line-through">Premium guides</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-surface-500">
                <svg class="w-5 h-5 text-surface-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="line-through">Community access</span>
              </li>
            </ul>
            <router-link to="/guides" class="btn-outline w-full text-center">Browse Free Content</router-link>
          </div>

          <div v-for="(tier, i) in tiers" :key="tier.id" class="card p-6 md:p-8 flex flex-col relative animate-slide-up" :class="i === 0 ? 'md:scale-105 border-primary-200 ring-2 ring-primary-500/20' : ''">
            <div v-if="i === 0" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-4 py-1 rounded-full">Most Popular</div>
            <div class="mb-6">
              <h3 class="text-xl font-bold text-surface-900 mb-2">{{ tier.name }}</h3>
              <p class="text-sm text-surface-500">{{ tier.description }}</p>
            </div>
            <div class="mb-8">
              <span class="text-4xl font-bold text-surface-900">${{ tier.price }}</span>
              <span class="text-surface-500">/month</span>
            </div>
            <ul class="space-y-4 mb-8 flex-1">
              <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-3 text-sm text-surface-600">
                <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{{ feature }}</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-surface-600">
                <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All premium content</span>
              </li>
              <li class="flex items-start gap-3 text-sm text-surface-600">
                <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Community forum access</span>
              </li>
            </ul>
            <router-link to="/login" class="btn-primary w-full text-center">Get Started</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section bg-gradient-to-br from-primary-900 to-primary-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)"></div>
      </div>
      <div class="container-app relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Growing?</h2>
          <p class="text-lg text-primary-100/80 mb-8">Join our community and transform your urban space into a thriving garden.</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link to="/guides" class="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3.5 rounded-2xl font-semibold shadow-elevated">Browse Free Guides</router-link>
            <router-link to="/login" class="btn bg-primary-600 text-white hover:bg-primary-500 px-8 py-3.5 rounded-2xl font-semibold border-2 border-primary-400/30">Create Account</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>