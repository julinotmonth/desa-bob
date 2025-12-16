import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, Notification, Permohonan, StatusPermohonan } from '../types';
import { mockPermohonan as initialPermohonan } from '../services/mockData';

// Auth Store
interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Permohonan Store - Global state untuk permohonan (shared antara user dan admin)
interface PermohonanStore {
  permohonan: Permohonan[];
  addPermohonan: (data: Permohonan) => void;
  updatePermohonan: (id: string, data: Partial<Permohonan>) => void;
  updateStatus: (id: string, status: StatusPermohonan, catatan?: string, petugas?: string) => void;
  getPermohonanByUser: (userId: string) => Permohonan[];
  getPermohonanById: (id: string) => Permohonan | undefined;
  getPermohonanByNoReg: (noReg: string) => Permohonan | undefined;
  getAllPermohonan: () => Permohonan[];
  getStats: () => {
    total: number;
    diajukan: number;
    diverifikasi: number;
    diproses: number;
    selesai: number;
    ditolak: number;
  };
}

export const usePermohonanStore = create<PermohonanStore>()(
  persist(
    (set, get) => ({
      permohonan: initialPermohonan,
      
      addPermohonan: (data) =>
        set((state) => ({
          permohonan: [data, ...state.permohonan],
        })),
      
      updatePermohonan: (id, data) =>
        set((state) => ({
          permohonan: state.permohonan.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        })),
      
      updateStatus: (id, status, catatan, petugas) =>
        set((state) => ({
          permohonan: state.permohonan.map((p) => {
            if (p.id === id) {
              const now = new Date().toISOString();
              return {
                ...p,
                status,
                catatan: status === 'ditolak' ? catatan : p.catatan,
                updatedAt: now,
                timeline: [
                  ...p.timeline,
                  {
                    status,
                    tanggal: now,
                    catatan,
                    petugas,
                  },
                ],
              };
            }
            return p;
          }),
        })),
      
      getPermohonanByUser: (userId) =>
        get().permohonan.filter((p) => p.userId === userId),
      
      getPermohonanById: (id) =>
        get().permohonan.find((p) => p.id === id),
      
      getPermohonanByNoReg: (noReg) =>
        get().permohonan.find((p) => 
          p.noRegistrasi.toLowerCase() === noReg.toLowerCase()
        ),
      
      getAllPermohonan: () => get().permohonan,
      
      getStats: () => {
        const all = get().permohonan;
        return {
          total: all.length,
          diajukan: all.filter((p) => p.status === 'diajukan').length,
          diverifikasi: all.filter((p) => p.status === 'diverifikasi').length,
          diproses: all.filter((p) => p.status === 'diproses').length,
          selesai: all.filter((p) => p.status === 'selesai').length,
          ditolak: all.filter((p) => p.status === 'ditolak').length,
        };
      },
    }),
    {
      name: 'permohonan-storage',
    }
  )
);

// Notification Store
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? state.unreadCount - 1
        : state.unreadCount,
    })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
}));

// UI Store
interface UIStore {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));