import { Layanan } from '../types';

export const APP_NAME = 'SIPEDES Legok';
export const APP_FULL_NAME = 'Sistem Pelayanan Kependudukan Desa Legok';
export const DESA_NAME = 'Desa Legok';
export const KECAMATAN = 'Kec. Gempol';
export const KABUPATEN = 'Kab. Pasuruan';
export const PROVINSI = 'Jawa Timur';
export const ALAMAT_LENGKAP = `${DESA_NAME}, ${KECAMATAN}, ${KABUPATEN}, ${PROVINSI}`;

export const CONTACT_INFO = {
  alamat: 'Jl. Raya Legok No. 1, Desa Legok, Kec. Gempol, Kab. Pasuruan, Jawa Timur 67155',
  telepon: '(0343) 123456',
  whatsapp: '081234567890',
  email: 'desalegok@pasuruan.go.id',
  jamPelayanan: {
    hariKerja: 'Senin - Jumat: 08.00 - 15.00 WIB',
    sabtu: 'Sabtu: 08.00 - 12.00 WIB',
    minggu: 'Minggu & Hari Libur: Tutup',
  },
  koordinat: {
    lat: -7.2853167859545716,
    lng: 112.7627805565462,
  },
};

export const LAYANAN_LIST: Layanan[] = [
  {
    id: 1,
    nama: 'Surat Keterangan Domisili',
    slug: 'surat-domisili',
    deskripsi: 'Surat keterangan tempat tinggal resmi yang menyatakan bahwa seseorang benar-benar berdomisili di wilayah Desa Legok.',
    icon: 'Home',
    persyaratan: [
      'Fotokopi KTP',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari RT/RW',
      'Pas foto 3x4 (2 lembar)',
    ],
    estimasiHari: 3,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 2,
    nama: 'Surat Keterangan Usaha',
    slug: 'surat-usaha',
    deskripsi: 'Surat keterangan untuk keperluan usaha/bisnis yang menyatakan bahwa pemohon menjalankan usaha di wilayah Desa Legok.',
    icon: 'Briefcase',
    persyaratan: [
      'Fotokopi KTP',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari RT/RW',
      'Foto tempat usaha',
      'Deskripsi jenis usaha',
    ],
    estimasiHari: 5,
    biaya: 'Gratis',
    kategori: 'Usaha',
  },
  {
    id: 3,
    nama: 'Surat Pengantar Akta Kelahiran',
    slug: 'pengantar-akta-lahir',
    deskripsi: 'Surat pengantar untuk pembuatan akta kelahiran di Dinas Kependudukan dan Catatan Sipil.',
    icon: 'Baby',
    persyaratan: [
      'Fotokopi KTP kedua orang tua',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Akta Nikah / Surat Nikah',
      'Surat Keterangan Lahir dari Bidan/RS',
      'Surat Pengantar dari RT/RW',
    ],
    estimasiHari: 2,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 4,
    nama: 'Surat Pengantar Akta Kematian',
    slug: 'pengantar-akta-mati',
    deskripsi: 'Surat pengantar untuk pembuatan akta kematian di Dinas Kependudukan dan Catatan Sipil.',
    icon: 'FileText',
    persyaratan: [
      'Fotokopi KTP almarhum/almarhumah',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Keterangan Kematian dari RT/RW',
      'Surat Keterangan dari Rumah Sakit/Puskesmas (jika ada)',
      'Fotokopi KTP pelapor',
    ],
    estimasiHari: 2,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 5,
    nama: 'Surat Pengantar Nikah (N1, N2, N4)',
    slug: 'pengantar-nikah',
    deskripsi: 'Surat pengantar untuk keperluan pernikahan yang akan diajukan ke KUA.',
    icon: 'Heart',
    persyaratan: [
      'Fotokopi KTP calon pengantin',
      'Fotokopi Kartu Keluarga (KK)',
      'Fotokopi Akta Kelahiran',
      'Pas foto 2x3 dan 4x6 (masing-masing 4 lembar)',
      'Surat Pengantar dari RT/RW',
      'Surat Persetujuan Orang Tua (jika belum 21 tahun)',
    ],
    estimasiHari: 3,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 6,
    nama: 'Surat Pengantar KTP',
    slug: 'pengantar-ktp',
    deskripsi: 'Surat pengantar untuk pembuatan atau perpanjangan KTP elektronik.',
    icon: 'CreditCard',
    persyaratan: [
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari RT/RW',
      'Pas foto 3x4 (2 lembar)',
      'KTP lama (untuk perpanjangan)',
    ],
    estimasiHari: 1,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 7,
    nama: 'Surat Pengantar Kartu Keluarga',
    slug: 'pengantar-kk',
    deskripsi: 'Surat pengantar untuk pembuatan atau perubahan Kartu Keluarga.',
    icon: 'Users',
    persyaratan: [
      'Fotokopi KTP semua anggota keluarga',
      'Kartu Keluarga lama (untuk perubahan)',
      'Surat Pengantar dari RT/RW',
      'Dokumen pendukung (Akta Nikah, Akta Lahir, dll)',
    ],
    estimasiHari: 3,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 8,
    nama: 'Surat Keterangan Pindah',
    slug: 'surat-pindah',
    deskripsi: 'Surat keterangan untuk keperluan pindah domisili ke desa/kelurahan lain.',
    icon: 'Truck',
    persyaratan: [
      'Fotokopi KTP semua anggota keluarga yang pindah',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari RT/RW',
      'Alasan pindah',
      'Alamat tujuan lengkap',
    ],
    estimasiHari: 5,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
  {
    id: 9,
    nama: 'Surat Keterangan Tidak Mampu',
    slug: 'sktm',
    deskripsi: 'Surat keterangan untuk keperluan bantuan sosial, keringanan biaya pendidikan, atau kesehatan.',
    icon: 'HandHeart',
    persyaratan: [
      'Fotokopi KTP',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari RT/RW',
      'Surat Pernyataan Tidak Mampu',
    ],
    estimasiHari: 2,
    biaya: 'Gratis',
    kategori: 'Sosial',
  },
  {
    id: 10,
    nama: 'Surat Keterangan Catatan Kepolisian (SKCK)',
    slug: 'pengantar-skck',
    deskripsi: 'Surat pengantar untuk pembuatan SKCK di kepolisian.',
    icon: 'Shield',
    persyaratan: [
      'Fotokopi KTP',
      'Fotokopi Kartu Keluarga (KK)',
      'Surat Pengantar dari RT/RW',
      'Pas foto 4x6 (6 lembar, background merah)',
    ],
    estimasiHari: 1,
    biaya: 'Gratis',
    kategori: 'Kependudukan',
  },
];

export const STATUS_CONFIG = {
  diajukan: {
    label: 'Diajukan',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    icon: 'Clock',
  },
  diverifikasi: {
    label: 'Diverifikasi',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    icon: 'Search',
  },
  diproses: {
    label: 'Diproses',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-300',
    icon: 'Settings',
  },
  selesai: {
    label: 'Selesai',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: 'CheckCircle',
  },
  ditolak: {
    label: 'Ditolak',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: 'XCircle',
  },
};

export const KATEGORI_BERITA = [
  'Semua',
  'Pengumuman',
  'Kegiatan',
  'Pembangunan',
  'Kesehatan',
  'Pendidikan',
  'Sosial',
];

export const ACCEPTED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  document: ['application/pdf'],
  all: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const NAV_LINKS = [
  { name: 'Beranda', href: '/' },
  { name: 'Layanan', href: '/layanan' },
  { name: 'Berita', href: '/berita' },
  { name: 'Cek Status', href: '/cek-status' },
  { name: 'Kontak', href: '/kontak' },
];

export const USER_NAV_LINKS = [
  { name: 'Dashboard', href: '/user/dashboard', icon: 'LayoutDashboard' },
  { name: 'Pengajuan Baru', href: '/user/pengajuan', icon: 'FilePlus' },
  { name: 'Riwayat', href: '/user/riwayat', icon: 'History' },
  { name: 'Profil', href: '/user/profil', icon: 'User' },
];

export const ADMIN_NAV_LINKS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Permohonan', href: '/admin/permohonan', icon: 'FileStack' },
  { name: 'Berita', href: '/admin/berita', icon: 'Newspaper' },
  { name: 'Pengguna', href: '/admin/pengguna', icon: 'Users' },
  { name: 'Laporan', href: '/admin/laporan', icon: 'BarChart3' },
];