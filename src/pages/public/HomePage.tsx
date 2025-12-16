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
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { LAYANAN_LIST, APP_NAME, DESA_NAME } from '../../constants';
import { mockBerita, mockDashboardStats } from '../../services/mockData';
import { formatTanggal } from '../../utils';

const HomePage: React.FC = () => {
  const featuredLayanan = LAYANAN_LIST.slice(0, 6);
  const latestBerita = mockBerita.slice(0, 3);

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
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={berita.thumbnail}
                        alt={berita.judul}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
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
