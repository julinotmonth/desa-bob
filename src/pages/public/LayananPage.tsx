import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  FileText,
  ChevronRight,
  Home,
  Briefcase,
  Baby,
  Heart,
  CreditCard,
  Users,
  Truck,
  HandHeart,
  Shield,
  Filter,
} from 'lucide-react';
import { Button, Card, Input } from '../../components/ui';
import { LAYANAN_LIST } from '../../constants';
import { useAuthStore } from '../../store';
import { Layanan } from '../../types';

const iconMap: Record<string, React.ElementType> = {
  Home,
  Briefcase,
  Baby,
  FileText,
  Heart,
  CreditCard,
  Users,
  Truck,
  HandHeart,
  Shield,
};

const LayananPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const kategoris = ['Semua', ...new Set(LAYANAN_LIST.map((l) => l.kategori))];

  const filteredLayanan = LAYANAN_LIST.filter((layanan) => {
    const matchSearch =
      layanan.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori =
      selectedKategori === 'Semua' || layanan.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  const handleAjukan = (layanan: Layanan) => {
    if (isAuthenticated) {
      navigate('/user/pengajuan', { state: { layananId: layanan.id } });
    } else {
      navigate('/login', { state: { from: `/layanan/${layanan.slug}` } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16 lg:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Layanan Administrasi Desa
            </h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              Pilih layanan yang Anda butuhkan dan ajukan permohonan secara
              online dengan mudah.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Content */}
      <section className="py-12">
        <div className="container-custom">
          {/* Kategori Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {kategoris.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setSelectedKategori(kategori)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedKategori === kategori
                    ? 'bg-primary-600 text-white shadow-soft'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {kategori}
              </button>
            ))}
          </motion.div>

          {/* Results Count */}
          <p className="text-gray-500 mb-6">
            Menampilkan {filteredLayanan.length} layanan
          </p>

          {/* Layanan Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLayanan.map((layanan, index) => {
              const Icon = iconMap[layanan.icon] || FileText;
              return (
                <motion.div
                  key={layanan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="hover" className="h-full flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white">
                          <Icon className="h-7 w-7" />
                        </div>
                        <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg">
                          {layanan.kategori}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {layanan.nama}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {layanan.deskripsi}
                      </p>

                      {/* Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{layanan.estimasiHari} hari</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-primary-600">
                            {layanan.biaya}
                          </span>
                        </div>
                      </div>

                      {/* Persyaratan Preview */}
                      <div className="space-y-1.5 mb-4">
                        <p className="text-xs font-medium text-gray-700">
                          Persyaratan:
                        </p>
                        {layanan.persyaratan.slice(0, 3).map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-gray-500"
                          >
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span className="line-clamp-1">{p}</span>
                          </div>
                        ))}
                        {layanan.persyaratan.length > 3 && (
                          <p className="text-xs text-primary-600">
                            +{layanan.persyaratan.length - 3} lainnya
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="px-6 pb-6 pt-0">
                      <Button
                        onClick={() => handleAjukan(layanan)}
                        className="w-full"
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Ajukan Layanan
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredLayanan.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Layanan Tidak Ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau filter kategori.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Cara Mengajukan Layanan
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: 'Daftar atau Masuk',
                      desc: 'Buat akun atau masuk ke akun Anda',
                    },
                    {
                      step: 2,
                      title: 'Pilih Layanan',
                      desc: 'Pilih layanan yang Anda butuhkan',
                    },
                    {
                      step: 3,
                      title: 'Upload Dokumen',
                      desc: 'Lengkapi data dan upload dokumen persyaratan',
                    },
                    {
                      step: 4,
                      title: 'Pantau Status',
                      desc: 'Pantau status permohonan secara real-time',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center lg:text-right">
                <p className="text-gray-600 mb-4">
                  Butuh bantuan atau ada pertanyaan?
                </p>
                <Link to="/kontak">
                  <Button variant="outline" size="lg">
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LayananPage;
