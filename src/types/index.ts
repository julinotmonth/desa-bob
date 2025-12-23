// User Types
export interface User {
  id: string;
  nik?: string;
  nama: string;
  email: string;
  noHp: string;
  alamat: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Layanan Types
export interface Layanan {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string;
  icon: string;
  persyaratan: string[];
  estimasiHari: number;
  biaya: string;
  kategori: string;
}

// Permohonan Types
export type StatusPermohonan = 'diajukan' | 'diverifikasi' | 'diproses' | 'selesai' | 'ditolak';

export interface TimelineItem {
  status: StatusPermohonan;
  tanggal: string;
  catatan?: string;
  petugas?: string;
}

export interface Dokumen {
  id: string;
  nama: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Permohonan {
  id: string;
  noRegistrasi: string;
  userId: string;
  userName: string;
  userNik: string;
  layananId: number;
  layananNama: string;
  status: StatusPermohonan;
  dokumen: Dokumen[];
  dokumenHasil?: Dokumen;
  timeline: TimelineItem[];
  catatan?: string;
  createdAt: string;
  updatedAt: string;
}

// Berita Types
export interface Berita {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  konten: string;
  thumbnail: string;
  kategori: string;
  status: 'draft' | 'published';
  penulis: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

// Kontak/Pengaduan Types
export interface Kontak {
  id: string;
  nama: string;
  email: string;
  jenis: 'pertanyaan' | 'saran' | 'pengaduan';
  pesan: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

// Statistics Types
export interface DashboardStats {
  totalPermohonan: number;
  permohonanHariIni: number;
  permohonanDiproses: number;
  permohonanSelesai: number;
  permohonanDitolak: number;
  totalPengguna: number;
  wargaTerlayani: number;
}

export interface ChartData {
  name: string;
  value: number;
}

// Form Types
export interface LoginFormData {
  nikOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  nama: string;
  email: string;
  noHp: string;
  alamat: string;
  password: string;
  konfirmasiPassword: string;
  setuju: boolean;
}

export interface KontakFormData {
  nama: string;
  email: string;
  jenis: 'pertanyaan' | 'saran' | 'pengaduan';
  pesan: string;
}

export interface PermohonanFormData {
  layananId: number;
  keterangan?: string;
  dokumen: File[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface PermohonanFilter {
  status?: StatusPermohonan;
  layananId?: number;
  tanggalMulai?: string;
  tanggalAkhir?: string;
  search?: string;
}

export interface BeritaFilter {
  kategori?: string;
  status?: 'draft' | 'published';
  search?: string;
}