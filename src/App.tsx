import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import { PublicLayout, AuthLayout, UserLayout, AdminLayout } from './components/layout';

// Protected Route
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';

// Loading
import { PageLoading } from './components/ui';

// Public Pages
const HomePage = lazy(() => import('./pages/public/HomePage'));
const LayananPage = lazy(() => import('./pages/public/LayananPage'));
const BeritaPage = lazy(() => import('./pages/public/BeritaPage').then(m => ({ default: m.BeritaPage })));
const BeritaDetailPage = lazy(() => import('./pages/public/BeritaPage').then(m => ({ default: m.BeritaDetailPage })));
const CekStatusPage = lazy(() => import('./pages/public/CekStatusPage'));
const KontakPage = lazy(() => import('./pages/public/KontakPage'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// User Pages
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const PengajuanPage = lazy(() => import('./pages/user/PengajuanPage'));
const RiwayatPage = lazy(() => import('./pages/user/RiwayatPage').then(m => ({ default: m.RiwayatPage })));
const RiwayatDetailPage = lazy(() => import('./pages/user/RiwayatPage').then(m => ({ default: m.RiwayatDetailPage })));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPermohonanPage = lazy(() => import('./pages/admin/AdminPermohonanPage').then(m => ({ default: m.AdminPermohonanPage })));
const AdminPermohonanDetailPage = lazy(() => import('./pages/admin/AdminPermohonanPage').then(m => ({ default: m.AdminPermohonanDetailPage })));
const AdminBeritaPage = lazy(() => import('./pages/admin/Adminberitapage').then(m => ({ default: m.AdminBeritaPage })));
const AdminBeritaFormPage = lazy(() => import('./pages/admin/Adminberitapage').then(m => ({ default: m.AdminBeritaFormPage })));
const AdminPenggunaPage = lazy(() => import('./pages/admin/Adminpenggunapage'));
const AdminLaporanPage = lazy(() => import('./pages/admin/Adminlaporanpage'));

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/layanan" element={<LayananPage />} />
              <Route path="/berita" element={<BeritaPage />} />
              <Route path="/berita/:slug" element={<BeritaDetailPage />} />
              <Route path="/cek-status" element={<CekStatusPage />} />
              <Route path="/kontak" element={<KontakPage />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />
            </Route>

            {/* User Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/pengajuan" element={<PengajuanPage />} />
              <Route path="/user/riwayat" element={<RiwayatPage />} />
              <Route path="/user/riwayat/:id" element={<RiwayatDetailPage />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/permohonan" element={<AdminPermohonanPage />} />
              <Route path="/admin/permohonan/:id" element={<AdminPermohonanDetailPage />} />
              <Route path="/admin/berita" element={<AdminBeritaPage />} />
              <Route path="/admin/berita/tambah" element={<AdminBeritaFormPage />} />
              <Route path="/admin/berita/edit/:id" element={<AdminBeritaFormPage />} />
              <Route path="/admin/pengguna" element={<AdminPenggunaPage />} />
              <Route path="/admin/laporan" element={<AdminLaporanPage />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              borderRadius: '12px',
              boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;