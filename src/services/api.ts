import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

// Base API URL - sesuaikan dengan backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'Terjadi kesalahan';

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('Anda tidak memiliki akses ke halaman ini');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Data tidak ditemukan');
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

// Auth API
export const authApi = {
  login: (data: { nikOrEmail: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: {
    nama: string;
    nik: string;
    email: string;
    noHp: string;
    alamat: string;
    password: string;
  }) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
};

// User API
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: Partial<{
    nama: string;
    email: string;
    noHp: string;
    alamat: string;
  }>) => api.put('/user/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/user/password', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Layanan API
export const layananApi = {
  getAll: () => api.get('/layanan'),
  getById: (id: number) => api.get(`/layanan/${id}`),
  getBySlug: (slug: string) => api.get(`/layanan/slug/${slug}`),
};

// Permohonan API
export const permohonanApi = {
  // User
  create: (data: FormData) =>
    api.post('/permohonan', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUserPermohonan: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => api.get('/permohonan/user', { params }),
  getById: (id: string) => api.get(`/permohonan/${id}`),
  getByNoRegistrasi: (noRegistrasi: string) =>
    api.get(`/permohonan/registrasi/${noRegistrasi}`),
  downloadDokumen: (id: string) =>
    api.get(`/permohonan/${id}/download`, { responseType: 'blob' }),

  // Admin
  getAll: (params?: {
    status?: string;
    layananId?: number;
    search?: string;
    page?: number;
    limit?: number;
    tanggalMulai?: string;
    tanggalAkhir?: string;
  }) => api.get('/admin/permohonan', { params }),
  verify: (id: string, data: { status: string; catatan?: string }) =>
    api.put(`/admin/permohonan/${id}/verify`, data),
  process: (id: string, data: { status: string; catatan?: string }) =>
    api.put(`/admin/permohonan/${id}/process`, data),
  complete: (id: string, data: FormData) =>
    api.put(`/admin/permohonan/${id}/complete`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  reject: (id: string, data: { catatan: string }) =>
    api.put(`/admin/permohonan/${id}/reject`, data),
};

// Berita API
export const beritaApi = {
  getAll: (params?: {
    kategori?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/berita', { params }),
  getPublished: (params?: {
    kategori?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/berita/published', { params }),
  getById: (id: string) => api.get(`/berita/${id}`),
  getBySlug: (slug: string) => api.get(`/berita/slug/${slug}`),
  create: (data: FormData) =>
    api.post('/admin/berita', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    api.put(`/admin/berita/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/admin/berita/${id}`),
  publish: (id: string) => api.put(`/admin/berita/${id}/publish`),
  unpublish: (id: string) => api.put(`/admin/berita/${id}/unpublish`),
};

// Kontak API
export const kontakApi = {
  create: (data: {
    nama: string;
    email: string;
    jenis: string;
    pesan: string;
  }) => api.post('/kontak', data),
  getAll: (params?: {
    status?: string;
    jenis?: string;
    page?: number;
    limit?: number;
  }) => api.get('/admin/kontak', { params }),
  reply: (id: string, data: { balasan: string }) =>
    api.put(`/admin/kontak/${id}/reply`, data),
  close: (id: string) => api.put(`/admin/kontak/${id}/close`),
};

// Admin User API
export const adminUserApi = {
  getAll: (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/admin/users', { params }),
  getById: (id: string) => api.get(`/admin/users/${id}`),
  update: (id: string, data: Partial<{ nama: string; email: string; role: string }>) =>
    api.put(`/admin/users/${id}`, data),
  activate: (id: string) => api.put(`/admin/users/${id}/activate`),
  deactivate: (id: string) => api.put(`/admin/users/${id}/deactivate`),
  delete: (id: string) => api.delete(`/admin/users/${id}`),
};

// Statistics API
export const statisticsApi = {
  getDashboard: () => api.get('/admin/statistics/dashboard'),
  getPermohonanStats: (params?: {
    periode?: string;
    tanggalMulai?: string;
    tanggalAkhir?: string;
  }) => api.get('/admin/statistics/permohonan', { params }),
  getLayananStats: () => api.get('/admin/statistics/layanan'),
  exportReport: (params: {
    type: string;
    format: 'pdf' | 'excel';
    tanggalMulai?: string;
    tanggalAkhir?: string;
  }) =>
    api.get('/admin/statistics/export', {
      params,
      responseType: 'blob',
    }),
};

// Notification API
export const notificationApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};
