import { useAuthStore } from '../stores/auth';

const API_BASE = '/api';

class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const auth = useAuthStore();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (auth.token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      auth.logout();
      window.location.href = '/login';
    }
    throw new ApiError(response.status, data.error || 'Request failed', data);
  }

  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, firstName?: string, lastName?: string) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName }),
      }),

    me: () =>
      request<{ user: any }>('/auth/me'),
  },

  content: {
    getAll: () =>
      request<any[]>('/content'),

    getById: (id: string) =>
      request<any>(`/content/${id}`),

    create: (data: any) =>
      request<any>('/content', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request<any>(`/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/content/${id}`, {
        method: 'DELETE',
      }),
  },

  plans: {
    getMyPlans: () =>
      request<any[]>('/plans'),

    create: (data: any) =>
      request<any>('/plans', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      request<any>(`/plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ success: boolean }>(`/plans/${id}`, {
        method: 'DELETE',
      }),
  },

  memberships: {
    getAllTiers: () =>
      request<any[]>('/memberships'),

    createTier: (data: any) =>
      request<any>('/memberships', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateTier: (id: string, data: any) =>
      request<any>(`/memberships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  downloads: {
    getAll: () =>
      request<any[]>('/downloads'),

    create: (data: any) =>
      request<any>('/downloads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  community: {
    getPosts: () =>
      request<any[]>('/community'),

    createPost: (data: any) =>
      request<any>('/community', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  admin: {
    getStats: () =>
      request<{ usersCount: number; contentCount: number; plansCount: number }>('/admin/stats'),

    getAuditLogs: () =>
      request<any[]>('/admin/audit'),
  },
};

export { ApiError };