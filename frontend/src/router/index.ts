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
    { path: '/community', name: 'Community', component: () => import('../pages/Community.vue'), meta: { requiresAuth: true } },
    { path: '/admin', name: 'Admin', component: () => import('../pages/Admin.vue'), meta: { requiresAdmin: true } },
  ],
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && (!auth.isAuthenticated || auth.user?.role !== 'admin')) {
    next('/');
  } else {
    next();
  }
});

export default router;