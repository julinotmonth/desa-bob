import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

// Base API URL - sesuaikan dengan backend SIPEDES
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const responseData = error.response?.data as { message?: string; code?: string };
    const message = responseData?.message || error.message || 'Terjadi kesalahan';

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden - check if account inactive
    if (error.response?.status === 403) {
      if (responseData?.code === 'ACCOUNT_INACTIVE') {
        useAuthStore.getState().logout();
        toast.error(message);
        window.location.href = '/login';
      } else {
        toast.error('Anda tidak memiliki akses ke halaman ini');
      }
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      toast.error('Terjadi kesalahan pada server');
    }

    // Handle network error
    if (!error.response) {
      toast.error('Tidak dapat terhubung ke server');
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;

// ==================== AUTH API ====================
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: {
    nama: string;
    email: string;
    noHp?: string;
    alamat?: string;
    password: string;
  }) => api.post('/auth/register', data),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: Partial<{
    nama: string;
    email: string;
    noHp: string;
    alamat: string;
  }>) => api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// ==================== LAYANAN API ====================
export const layananApi = {
  getAll: () => api.get('/layanan'),
  
  getBySlug: (slug: string) => api.get(`/layanan/${slug}`),
  
  // Admin
  create: (data: {
    nama: string;
    slug: string;
    deskripsi?: string;
    icon?: string;
    persyaratan?: string[];
    estimasiHari?: number;
    biaya?: string;
    kategori?: string;
  }) => api.post('/layanan', data),
  
  update: (id: number, data: Partial<{
    nama: string;
    deskripsi: string;
    icon: string;
    persyaratan: string[];
    estimasiHari: number;
    biaya: string;
    kategori: string;
  }>) => api.put(`/layanan/${id}`, data),
  
  delete: (id: number) => api.delete(`/layanan/${id}`),
};

// ==================== PERMOHONAN API ====================
export const permohonanApi = {
  // User - Create permohonan
  create: (data: FormData) =>
    api.post('/permohonan', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // User - Get user's permohonan
  getUserPermohonan: () => api.get('/permohonan/user'),
  
  // User - Get permohonan detail
  getById: (id: string) => api.get(`/permohonan/${id}`),
  
  // Public - Check status by registration number
  checkStatus: (noRegistrasi: string) => api.get(`/permohonan/check/${noRegistrasi}`),
  
  // Admin - Get all permohonan
  getAll: (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/permohonan/all', { params }),
  
  // Admin - Get statistics
  getStatistics: () => api.get('/permohonan/stats/summary'),
  
  // Admin - Update status
  updateStatus: (id: string, status: string, catatan?: string, dokumenHasil?: File) => {
    if (dokumenHasil) {
      const formData = new FormData();
      formData.append('status', status);
      if (catatan) formData.append('catatan', catatan);
      formData.append('dokumenHasil', dokumenHasil);
      return api.put(`/permohonan/${id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/permohonan/${id}/status`, { status, catatan });
  },
};

// ==================== BERITA API ====================
export const beritaApi = {
  // Public - Get published berita
  getPublished: (params?: {
    kategori?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/berita/published', { params }),
  
  // Public - Get berita by slug
  getBySlug: (slug: string) => api.get(`/berita/slug/${slug}`),
  
  // Admin - Get all berita (including drafts)
  getAll: (params?: {
    status?: string;
    kategori?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/berita', { params }),
  
  // Admin - Get berita by ID
  getById: (id: string) => api.get(`/berita/${id}`),
  
  // Admin - Create berita
  create: (data: {
    judul: string;
    ringkasan: string;
    konten: string;
    thumbnail?: string;
    kategori?: string;
    status?: 'draft' | 'published';
  }) => api.post('/berita', data),
  
  // Admin - Update berita
  update: (id: string, data: Partial<{
    judul: string;
    ringkasan: string;
    konten: string;
    thumbnail: string;
    kategori: string;
    status: 'draft' | 'published';
  }>) => api.put(`/berita/${id}`, data),
  
  // Admin - Delete berita
  delete: (id: string) => api.delete(`/berita/${id}`),
  
  // Admin - Upload thumbnail
  uploadThumbnail: (file: File) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return api.post('/berita/upload-thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ==================== USER API (Admin) ====================
export const adminUserApi = {
  getAll: (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/users', { params }),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  getStats: () => api.get('/users/stats'),
  
  create: (data: {
    nik: string;
    nama: string;
    email: string;
    password: string;
    noHp?: string;
    alamat?: string;
    role?: 'user' | 'admin';
  }) => api.post('/users', data),
  
  update: (id: string, data: Partial<{
    nama: string;
    email: string;
    noHp: string;
    alamat: string;
    role: 'user' | 'admin';
    password: string;
  }>) => api.put(`/users/${id}`, data),
  
  toggleStatus: (id: string) => api.patch(`/users/${id}/toggle-status`),
  
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ==================== STATISTICS API ====================
export const statisticsApi = {
  getDashboard: async () => {
    // Combine multiple API calls for dashboard stats
    const [permohonanStats, userStats] = await Promise.all([
      permohonanApi.getStatistics(),
      adminUserApi.getStats(),
    ]);
    
    return {
      data: {
        permohonan: permohonanStats.data.data,
        users: userStats.data.data,
      },
    };
  },
};

// ==================== NOTIFICATIONS API ====================
export const notificationsApi = {
  getAll: (params?: { limit?: number; unreadOnly?: boolean }) => 
    api.get('/notifications', { params }),
  
  markAsRead: (id: string) => 
    api.patch(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    api.patch('/notifications/read-all'),
  
  delete: (id: string) => 
    api.delete(`/notifications/${id}`),
  
  clearAll: () => 
    api.delete('/notifications'),
};

// Export API base URL for file uploads
export const getApiBaseUrl = () => API_BASE_URL.replace('/api', '');