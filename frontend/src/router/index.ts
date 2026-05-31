import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
    { path: '/login', name: 'Login', component: () => import('../pages/Login.vue') },
    { path: '/guides', name: 'Guides', component: () => import('../pages/Guides.vue') },
    { path: '/guides/:id', name: 'GuideDetail', component: () => import('../pages/GuideDetail.vue') },
    { path: '/plans', name: 'Plans', component: () => import('../pages/Plans.vue'), meta: { requiresAuth: true } },
    { path: '/downloads', name: 'Downloads', component: () => import('../pages/Downloads.vue') },
    { path: '/admin', name: 'Admin', component: () => import('../pages/Admin.vue'), meta: { requiresAdmin: true } },
    { path: '/saved', name: 'Saved', component: () => import('../pages/Saved.vue'), meta: { requiresAuth: true } },
    { path: '/community', name: 'Community', component: () => import('../pages/Community.vue') },
    { path: '/membership', name: 'Membership', component: () => import('../pages/Membership.vue'), meta: { requiresAuth: true } },
    { path: '/403', name: 'Forbidden', component: { template: '<div class="text-center py-12"><h1 class="text-4xl mb-4">403</h1><p class="mb-4">Access Denied.</p><router-link to="/" class="text-emerald-600 underline">Go Home</router-link></div>' } },
    { path: '/offline', name: 'Offline', component: { template: '<div class="text-center py-12"><h1 class="text-4xl mb-4">You are offline.</h1><p class="mb-4">Check your connection.</p><router-link to="/saved" class="text-emerald-600 underline">View Saved Content</router-link></div>' } }
  ],
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  const requiresAuth = to.meta.requiresAuth || to.meta.requiresAdmin || to.meta.requiresMember;

  if (requiresAuth && !auth.isLoggedIn) {
    next('/login');
  } else if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/403');
  } else if (to.meta.requiresMember && !auth.isMember) {
    next('/403');
  } else {
    next();
  }
});

export default router;
