import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiFetch } from '../services/api';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<any>(null);
  const router = useRouter();

  const isLoggedIn = computed(() => !!token.value);
  const isAuthenticated = isLoggedIn; // alias for backwards compatibility
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isMember = computed(() => user.value?.role === 'member' || user.value?.role === 'admin');

  const setAuth = (newToken: string, newUser: any) => {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (router) router.push('/login');
  };

  const login = async (credentials: any) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setAuth(data.token, data.user);
  };

  const register = async (credentials: any) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setAuth(data.token, data.user);
  };

  const restoreSession = () => {
    const savedToken = localStorage.getItem('token');
    const savedUserStr = localStorage.getItem('user');

    if (savedToken && savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        token.value = savedToken;
        user.value = savedUser;
      } catch {
        // Handle invalid JSON
        logout();
      }
    }
  };

  return {
    token,
    user,
    isLoggedIn,
    isAuthenticated,
    isAdmin,
    isMember,
    setAuth,
    login,
    logout,
    register,
    restoreSession
  };
});
