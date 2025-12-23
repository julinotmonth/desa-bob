import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Users,
  FileCheck,
  Clock,
  Shield,
  ChevronRight,
  Star,
  Image,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { LAYANAN_LIST, APP_NAME, DESA_NAME } from '../../constants';
import { mockDashboardStats } from '../../services/mockData';
import { useBeritaStore } from '../../store';
import { formatTanggal } from '../../utils';

const HomePage: React.FC = () => {
  const featuredLayanan = LAYANAN_LIST.slice(0, 6);
  
  // Ambil berita dari store
  const { getPublishedBerita } = useBeritaStore();
  const latestBerita = getPublishedBerita().slice(0, 3);

  const stats = [
    { label: 'Warga Terlayani', value: '1,250+', icon: Users },
    { label: 'Permohonan Selesai', value: '500+', icon: FileCheck },
    { label: 'Waktu Proses', value: '1-5 Hari', icon: Clock },
    { label: 'Keamanan Data', value: '100%', icon: Shield },
  ];

  const features = [
    'Pengajuan surat secara online 24 jam',
    'Tracking status permohonan real-time',
    'Upload dokumen persyaratan digital',
    'Notifikasi otomatis via email',
    'Download dokumen yang sudah selesai',
    'Proses cepat dan transparan',
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary-200 rounded-full blur-3xl opacity-30" />

        <div className="container-custom relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                Layanan Online 24 Jam
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Pelayanan{' '}
                <span className="gradient-text">Kependudukan</span>{' '}
                Digital {DESA_NAME}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Urus dokumen kependudukan dengan mudah, cepat, dan transparan.
                Tidak perlu antri, ajukan permohonan kapan saja dan pantau
                statusnya secara real-time.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/layanan">
                  <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Ajukan Sekarang
                  </Button>
                </Link>
                <Link to="/cek-status">
                  <Button variant="outline" size="xl">
                    Cek Status Permohonan
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-500" />
                  <span>Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-500" />
                  <span>Mudah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary-500" />
                  <span>Terpercaya</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600"
                  alt="Digital Service"
                  className="rounded-3xl shadow-strong"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-medium p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">500+</p>
                    <p className="text-sm text-gray-500">Surat Selesai</p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-medium p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1,250+</p>
                    <p className="text-sm text-gray-500">Warga Terdaftar</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl mb-3">
                  <stat.icon className="h-7 w-7" />
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Layanan Kami</h2>
            <p className="section-subtitle mx-auto">
              Berbagai layanan administrasi kependudukan yang dapat Anda ajukan
              secara online dengan mudah dan cepat.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLayanan.map((layanan, index) => (
              <motion.div
                key={layanan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="hover" className="h-full">
                  <div className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-4">
                      <FileCheck className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {layanan.nama}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {layanan.deskripsi}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Est. {layanan.estimasiHari} hari
                      </span>
                      <span className="text-primary-600 font-medium">
                        {layanan.biaya}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/layanan">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<ChevronRight className="h-5 w-5" />}
              >
                Lihat Semua Layanan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">
                Mengapa Menggunakan{' '}
                <span className="gradient-text">{APP_NAME}</span>?
              </h2>
              <p className="text-gray-600 mb-8">
                Sistem pelayanan digital yang dirancang untuk memudahkan warga
                dalam mengurus administrasi kependudukan tanpa harus datang ke
                kantor desa.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
                alt="Features"
                className="rounded-3xl shadow-medium"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Struktur Organisasi Desa</h2>
            <p className="section-subtitle mx-auto">
              Pemerintahan {DESA_NAME} yang siap melayani masyarakat dengan sepenuh hati
            </p>
          </motion.div>

          {/* Bagan Struktur Organisasi */}
          <div className="max-w-6xl mx-auto">
            {/* Kepala Desa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center mb-4"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl mx-auto bg-white">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face"
                      alt="Kepala Desa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-3 bg-primary-600 text-white px-4 py-2 rounded-xl shadow-md">
                  <p className="text-xs font-medium opacity-90">Kepala Desa</p>
                  <h3 className="font-bold text-sm md:text-base">H. Ahmad Sudrajat, S.E.</h3>
                </div>
              </div>
            </motion.div>

            {/* Garis ke Sekretaris */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gray-300"></div>
            </div>

            {/* Sekretaris Desa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-secondary-500 shadow-lg mx-auto bg-white">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                      alt="Sekretaris Desa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-3 bg-secondary-600 text-white px-4 py-2 rounded-xl shadow-md">
                  <p className="text-xs font-medium opacity-90">Sekretaris Desa</p>
                  <h3 className="font-bold text-sm md:text-base">Drs. Bambang Sutrisno</h3>
                </div>
              </div>
            </motion.div>

            {/* Garis Penghubung ke Staff */}
            <div className="hidden md:flex justify-center mb-4">
              <div className="relative w-full max-w-4xl h-12">
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-300 top-0"></div>
                <div className="absolute top-4 left-[8%] right-[8%] h-0.5 bg-gray-300"></div>
                <div className="absolute top-4 left-[8%] w-0.5 h-8 bg-gray-300"></div>
                <div className="absolute top-4 left-[27%] w-0.5 h-8 bg-gray-300"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                <div className="absolute top-4 left-[73%] w-0.5 h-8 bg-gray-300"></div>
                <div className="absolute top-4 right-[8%] w-0.5 h-8 bg-gray-300"></div>
              </div>
            </div>

            {/* Kepala Urusan (Kaur) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-12"
            >
              {[
                { nama: 'Siti Aminah, S.Sos', jabatan: 'Kaur Tata Usaha & Umum', foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face', color: 'from-blue-500 to-blue-600' },
                { nama: 'Eko Prasetyo, S.E.', jabatan: 'Kaur Keuangan', foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', color: 'from-green-500 to-green-600' },
                { nama: 'Sri Wahyuni, A.Md', jabatan: 'Kaur Perencanaan', foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', color: 'from-purple-500 to-purple-600' },
                { nama: 'Agus Santoso', jabatan: 'Kasi Pemerintahan', foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', color: 'from-orange-500 to-orange-600' },
                { nama: 'Dewi Lestari, S.Sos', jabatan: 'Kasi Kesejahteraan', foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', color: 'from-pink-500 to-pink-600' },
              ].map((staff, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="relative inline-block">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-3 border-gray-200 shadow-md mx-auto bg-white hover:scale-105 transition-transform">
                      <img
                        src={staff.foto}
                        alt={staff.jabatan}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={`mt-2 bg-gradient-to-r ${staff.color} text-white px-2 py-1.5 rounded-lg shadow-sm`}>
                    <p className="text-[10px] md:text-xs font-medium opacity-90 leading-tight">{staff.jabatan}</p>
                    <h4 className="font-semibold text-xs md:text-sm truncate">{staff.nama}</h4>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Kepala Dusun */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-center text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary-600" />
                Kepala Dusun
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { nama: 'Suparman', dusun: 'Dusun Mekar Jaya', rt: '4 RT', rw: '2 RW' },
                  { nama: 'Wawan Kurniawan', dusun: 'Dusun Sumber Makmur', rt: '3 RT', rw: '1 RW' },
                  { nama: 'Tono Sugiarto', dusun: 'Dusun Harapan Baru', rt: '5 RT', rw: '2 RW' },
                  { nama: 'Dedi Mulyadi', dusun: 'Dusun Sejahtera', rt: '4 RT', rw: '2 RW' },
                ].map((kadus, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-4 text-center hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-200">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl md:text-2xl font-bold text-primary-600">{index + 1}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{kadus.nama}</h4>
                      <p className="text-primary-600 text-xs md:text-sm font-medium mt-1">{kadus.dusun}</p>
                      <div className="flex justify-center gap-2 mt-2">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{kadus.rt}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{kadus.rw}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* BPD Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <h3 className="text-center text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-secondary-600" />
                Badan Permusyawaratan Desa (BPD)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                {[
                  { nama: 'H. Usman Hakim', jabatan: 'Ketua BPD' },
                  { nama: 'Slamet Riyadi', jabatan: 'Wakil Ketua BPD' },
                  { nama: 'Hj. Nurhasanah', jabatan: 'Sekretaris BPD' },
                ].map((bpd, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center"
                  >
                    <Card className="p-4 bg-gradient-to-br from-secondary-50 to-white border border-secondary-100">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-6 w-6 text-secondary-600" />
                      </div>
                      <p className="text-secondary-600 text-xs font-medium">{bpd.jabatan}</p>
                      <h4 className="font-semibold text-gray-900 text-sm mt-1">{bpd.nama}</h4>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="section-title">Berita & Informasi</h2>
              <p className="text-gray-600 mt-2">
                Informasi terbaru seputar kegiatan dan program Desa Legok.
              </p>
            </div>
            <Link to="/berita">
              <Button
                variant="ghost"
                rightIcon={<ChevronRight className="h-5 w-5" />}
              >
                Lihat Semua
              </Button>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBerita.map((berita, index) => (
              <motion.div
                key={berita.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/berita/${berita.slug}`}>
                  <Card variant="hover" padding="none" className="h-full">
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      {berita.thumbnail ? (
                        <img
                          src={berita.thumbnail}
                          alt={berita.judul}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-md">
                          {berita.kategori}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatTanggal(berita.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                        {berita.judul}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {berita.ringkasan}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Mengurus Dokumen?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan nikmati kemudahan mengurus administrasi
              kependudukan secara online.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button
                  size="xl"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Daftar Gratis
                </Button>
              </Link>
              <Link to="/kontak">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white/10"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;