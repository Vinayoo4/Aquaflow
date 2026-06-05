import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? 4000;
    const newToast = { ...toast, id } as Toast;
    toasts.value.push(newToast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    toasts.value = [];
  };

  const success = (title: string, message?: string, duration?: number) =>
    addToast({ type: 'success', title, message, duration });

  const error = (title: string, message?: string, duration?: number) =>
    addToast({ type: 'error', title, message, duration });

  const warning = (title: string, message?: string, duration?: number) =>
    addToast({ type: 'warning', title, message, duration });

  const info = (title: string, message?: string, duration?: number) =>
    addToast({ type: 'info', title, message, duration });

  return {
    toasts: computed(() => toasts.value),
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };
});