import { User, Permohonan, Berita, Notification, DashboardStats } from '../types';
import { LAYANAN_LIST } from '../constants';

// Mock User
export const mockUser: User = {
  id: '1',
  nik: '3514012345678901',
  nama: 'Ahmad Fauzi',
  email: 'ahmad.fauzi@email.com',
  noHp: '081234567890',
  alamat: 'Dusun Krajan RT 01 RW 02, Desa Legok',
  role: 'user',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-03-20T10:30:00Z',
};

export const mockAdmin: User = {
  id: '2',
  nik: '3514019876543210',
  nama: 'Budi Santoso',
  email: 'admin@desalegok.go.id',
  noHp: '081298765432',
  alamat: 'Kantor Desa Legok',
  role: 'admin',
  createdAt: '2023-06-01T08:00:00Z',
  updatedAt: '2024-03-20T10:30:00Z',
};

// Mock Permohonan
export const mockPermohonan: Permohonan[] = [
  {
    id: '1',
    noRegistrasi: 'REG-20240315-0001',
    userId: '1',
    userName: 'Ahmad Fauzi',
    userNik: '3514012345678901',
    layananId: 1,
    layananNama: 'Surat Keterangan Domisili',
    status: 'selesai',
    dokumen: [
      { id: 'd1', nama: 'KTP.pdf', url: '/uploads/ktp.pdf', type: 'application/pdf', size: 524288, uploadedAt: '2024-03-15T09:00:00Z' },
      { id: 'd2', nama: 'KK.pdf', url: '/uploads/kk.pdf', type: 'application/pdf', size: 624288, uploadedAt: '2024-03-15T09:00:00Z' },
    ],
    dokumenHasil: { id: 'dh1', nama: 'Surat_Domisili_Ahmad_Fauzi.pdf', url: '/uploads/hasil/domisili_001.pdf', type: 'application/pdf', size: 124288, uploadedAt: '2024-03-18T14:00:00Z' },
    timeline: [
      { status: 'diajukan', tanggal: '2024-03-15T09:00:00Z', catatan: 'Permohonan berhasil diajukan' },
      { status: 'diverifikasi', tanggal: '2024-03-15T10:30:00Z', catatan: 'Dokumen lengkap dan valid', petugas: 'Budi Santoso' },
      { status: 'diproses', tanggal: '2024-03-16T08:00:00Z', catatan: 'Surat sedang diproses', petugas: 'Budi Santoso' },
      { status: 'selesai', tanggal: '2024-03-18T14:00:00Z', catatan: 'Surat telah selesai dan dapat diunduh', petugas: 'Budi Santoso' },
    ],
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-18T14:00:00Z',
  },
  {
    id: '2',
    noRegistrasi: 'REG-20240320-0015',
    userId: '1',
    userName: 'Ahmad Fauzi',
    userNik: '3514012345678901',
    layananId: 2,
    layananNama: 'Surat Keterangan Usaha',
    status: 'diproses',
    dokumen: [
      { id: 'd3', nama: 'KTP.pdf', url: '/uploads/ktp.pdf', type: 'application/pdf', size: 524288, uploadedAt: '2024-03-20T08:00:00Z' },
      { id: 'd4', nama: 'Foto_Usaha.jpg', url: '/uploads/foto_usaha.jpg', type: 'image/jpeg', size: 1048576, uploadedAt: '2024-03-20T08:00:00Z' },
    ],
    timeline: [
      { status: 'diajukan', tanggal: '2024-03-20T08:00:00Z', catatan: 'Permohonan berhasil diajukan' },
      { status: 'diverifikasi', tanggal: '2024-03-20T09:30:00Z', catatan: 'Dokumen lengkap, menunggu verifikasi lapangan', petugas: 'Budi Santoso' },
      { status: 'diproses', tanggal: '2024-03-21T10:00:00Z', catatan: 'Verifikasi lapangan sedang dilakukan', petugas: 'Budi Santoso' },
    ],
    createdAt: '2024-03-20T08:00:00Z',
    updatedAt: '2024-03-21T10:00:00Z',
  },
  {
    id: '3',
    noRegistrasi: 'REG-20240322-0008',
    userId: '1',
    userName: 'Ahmad Fauzi',
    userNik: '3514012345678901',
    layananId: 6,
    layananNama: 'Surat Pengantar KTP',
    status: 'diajukan',
    dokumen: [
      { id: 'd5', nama: 'KK.pdf', url: '/uploads/kk.pdf', type: 'application/pdf', size: 524288, uploadedAt: '2024-03-22T14:00:00Z' },
    ],
    timeline: [
      { status: 'diajukan', tanggal: '2024-03-22T14:00:00Z', catatan: 'Permohonan berhasil diajukan' },
    ],
    createdAt: '2024-03-22T14:00:00Z',
    updatedAt: '2024-03-22T14:00:00Z',
  },
  {
    id: '4',
    noRegistrasi: 'REG-20240310-0003',
    userId: '3',
    userName: 'Siti Rahayu',
    userNik: '3514015678901234',
    layananId: 9,
    layananNama: 'Surat Keterangan Tidak Mampu',
    status: 'ditolak',
    dokumen: [
      { id: 'd6', nama: 'KTP.pdf', url: '/uploads/ktp.pdf', type: 'application/pdf', size: 524288, uploadedAt: '2024-03-10T10:00:00Z' },
    ],
    timeline: [
      { status: 'diajukan', tanggal: '2024-03-10T10:00:00Z', catatan: 'Permohonan berhasil diajukan' },
      { status: 'diverifikasi', tanggal: '2024-03-10T11:00:00Z', catatan: 'Dokumen tidak lengkap', petugas: 'Budi Santoso' },
      { status: 'ditolak', tanggal: '2024-03-10T11:30:00Z', catatan: 'Dokumen persyaratan tidak lengkap. Mohon lampirkan Surat Pengantar RT/RW dan Kartu Keluarga.', petugas: 'Budi Santoso' },
    ],
    catatan: 'Dokumen persyaratan tidak lengkap. Mohon lampirkan Surat Pengantar RT/RW dan Kartu Keluarga.',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T11:30:00Z',
  },
];

// Mock Berita
export const mockBerita: Berita[] = [
  {
    id: '1',
    judul: 'Peluncuran Sistem Pelayanan Online Desa Legok',
    slug: 'peluncuran-sistem-pelayanan-online-desa-legok',
    ringkasan: 'Desa Legok meluncurkan sistem pelayanan administrasi kependudukan secara online untuk memudahkan warga dalam mengurus dokumen.',
    konten: '<p>Desa Legok dengan bangga mengumumkan peluncuran Sistem Pelayanan Kependudukan Online (SIPEDES) yang bertujuan untuk meningkatkan kualitas pelayanan kepada masyarakat.</p><h3>Latar Belakang</h3><p>Dengan semakin berkembangnya teknologi digital, Pemerintah Desa Legok berkomitmen untuk memberikan pelayanan yang lebih cepat, transparan, dan efisien kepada seluruh warga.</p><h3>Fitur Utama</h3><ul><li>Pengajuan surat secara online 24 jam</li><li>Tracking status permohonan real-time</li><li>Upload dokumen persyaratan digital</li><li>Notifikasi otomatis via email</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    kategori: 'Pengumuman',
    status: 'published',
    penulis: 'Admin Desa',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
    publishedAt: '2024-03-01T08:00:00Z',
  },
  {
    id: '2',
    judul: 'Jadwal Posyandu Bulan April 2024',
    slug: 'jadwal-posyandu-bulan-april-2024',
    ringkasan: 'Informasi jadwal pelaksanaan Posyandu di setiap dusun Desa Legok untuk bulan April 2024.',
    konten: '<p>Berikut adalah jadwal pelaksanaan Posyandu di Desa Legok untuk bulan April 2024.</p><h3>Dusun Krajan</h3><p>Tanggal: 5 April 2024, Waktu: 08.00 - 11.00 WIB</p><h3>Dusun Sidodadi</h3><p>Tanggal: 12 April 2024, Waktu: 08.00 - 11.00 WIB</p>',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    kategori: 'Kesehatan',
    status: 'published',
    penulis: 'Admin Desa',
    createdAt: '2024-03-25T10:00:00Z',
    updatedAt: '2024-03-25T10:00:00Z',
    publishedAt: '2024-03-25T10:00:00Z',
  },
  {
    id: '3',
    judul: 'Pembangunan Jalan Dusun Sidodadi Selesai',
    slug: 'pembangunan-jalan-dusun-sidodadi-selesai',
    ringkasan: 'Proyek pembangunan jalan sepanjang 500 meter di Dusun Sidodadi telah selesai dan diresmikan oleh Kepala Desa.',
    konten: '<p>Pemerintah Desa Legok dengan bangga mengumumkan selesainya proyek pembangunan jalan di Dusun Sidodadi.</p><h3>Detail Proyek</h3><ul><li>Panjang jalan: 500 meter</li><li>Lebar jalan: 4 meter</li><li>Jenis: Pengaspalan (hotmix)</li></ul>',
    thumbnail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
    kategori: 'Pembangunan',
    status: 'published',
    penulis: 'Admin Desa',
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-03-20T14:00:00Z',
    publishedAt: '2024-03-20T14:00:00Z',
  },
  {
    id: '4',
    judul: 'Pelatihan UMKM Digital untuk Warga Desa',
    slug: 'pelatihan-umkm-digital-untuk-warga-desa',
    ringkasan: 'Desa Legok bekerja sama dengan Dinas Koperasi mengadakan pelatihan pemasaran digital untuk pelaku UMKM.',
    konten: '<p>Dalam rangka meningkatkan kapasitas pelaku UMKM di Desa Legok, akan diadakan pelatihan pemasaran digital.</p><h3>Detail Kegiatan</h3><p>Tanggal: 15-16 April 2024, Waktu: 09.00 - 15.00 WIB, Tempat: Balai Desa Legok</p>',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
    kategori: 'Kegiatan',
    status: 'published',
    penulis: 'Admin Desa',
    createdAt: '2024-03-28T09:00:00Z',
    updatedAt: '2024-03-28T09:00:00Z',
    publishedAt: '2024-03-28T09:00:00Z',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: '1', userId: '1', title: 'Permohonan Selesai', message: 'Surat Keterangan Domisili Anda telah selesai.', type: 'success', read: false, link: '/user/riwayat/1', createdAt: '2024-03-18T14:00:00Z' },
  { id: '2', userId: '1', title: 'Permohonan Diproses', message: 'Surat Keterangan Usaha sedang diproses.', type: 'info', read: false, link: '/user/riwayat/2', createdAt: '2024-03-21T10:00:00Z' },
  { id: '3', userId: '1', title: 'Pengajuan Berhasil', message: 'Pengajuan Surat Pengantar KTP berhasil.', type: 'success', read: true, link: '/user/riwayat/3', createdAt: '2024-03-22T14:00:00Z' },
];

export const mockAdminNotifications: Notification[] = [
  { id: 'a1', userId: '2', title: 'Permohonan Baru', message: 'Ada pengajuan baru dari Ahmad Fauzi.', type: 'info', read: false, link: '/admin/permohonan/3', createdAt: '2024-03-22T14:00:00Z' },
  { id: 'a2', userId: '2', title: 'Permohonan Baru', message: 'Ada pengajuan Surat Usaha baru.', type: 'info', read: false, link: '/admin/permohonan/2', createdAt: '2024-03-20T08:00:00Z' },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalPermohonan: 156,
  permohonanHariIni: 5,
  permohonanDiproses: 12,
  permohonanSelesai: 138,
  permohonanDitolak: 6,
  totalPengguna: 342,
  wargaTerlayani: 1250,
};

// Mock Chart Data
export const mockChartData = {
  permohonanPerBulan: [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 61 },
    { name: 'Apr', value: 48 },
    { name: 'Mei', value: 55 },
    { name: 'Jun', value: 67 },
  ],
  permohonanPerLayanan: LAYANAN_LIST.slice(0, 6).map((layanan) => ({
    name: layanan.nama.split(' ').slice(0, 2).join(' '),
    value: Math.floor(Math.random() * 50) + 10,
  })),
  statusDistribusi: [
    { name: 'Selesai', value: 138, color: '#22c55e' },
    { name: 'Diproses', value: 12, color: '#8b5cf6' },
    { name: 'Diverifikasi', value: 8, color: '#3b82f6' },
    { name: 'Diajukan', value: 5, color: '#f59e0b' },
    { name: 'Ditolak', value: 6, color: '#ef4444' },
  ],
};

// Mock Users List
export const mockUsers: User[] = [
  mockUser,
  { id: '3', nik: '3514015678901234', nama: 'Siti Rahayu', email: 'siti.rahayu@email.com', noHp: '081345678901', alamat: 'Dusun Sidodadi RT 03 RW 01', role: 'user', createdAt: '2024-02-10T09:00:00Z', updatedAt: '2024-03-15T11:00:00Z' },
  { id: '4', nik: '3514016789012345', nama: 'Dedi Kurniawan', email: 'dedi.k@email.com', noHp: '081456789012', alamat: 'Dusun Sukamaju RT 02 RW 03', role: 'user', createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-03-18T08:00:00Z' },
  { id: '5', nik: '3514017890123456', nama: 'Rina Wati', email: 'rina.wati@email.com', noHp: '081567890123', alamat: 'Dusun Krajan RT 04 RW 02', role: 'user', createdAt: '2024-03-05T14:00:00Z', updatedAt: '2024-03-20T09:00:00Z' },
];