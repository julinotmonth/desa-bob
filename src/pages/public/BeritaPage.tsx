import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  User,
  ChevronLeft,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Copy,
  Check,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { KATEGORI_BERITA } from '../../constants';
import { mockBerita } from '../../services/mockData';
import { formatTanggal, formatTanggalRelatif } from '../../utils';

// Berita List Page
export const BeritaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  const filteredBerita = mockBerita.filter((berita) => {
    const matchSearch =
      berita.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      berita.ringkasan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori =
      selectedKategori === 'Semua' || berita.kategori === selectedKategori;
    return matchSearch && matchKategori && berita.status === 'published';
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-700 py-16 lg:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Berita & Informasi
            </h1>
            <p className="text-secondary-100 text-lg max-w-2xl mx-auto mb-8">
              Informasi terbaru seputar kegiatan, pengumuman, dan program Desa
              Legok.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          {/* Kategori Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {KATEGORI_BERITA.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setSelectedKategori(kategori)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedKategori === kategori
                    ? 'bg-secondary-600 text-white shadow-soft'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {kategori}
              </button>
            ))}
          </motion.div>

          {/* Results */}
          <p className="text-gray-500 mb-6">
            Menampilkan {filteredBerita.length} berita
          </p>

          {/* Berita Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBerita.map((berita, index) => (
              <motion.div
                key={berita.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/berita/${berita.slug}`}>
                  <Card variant="hover" padding="none" className="h-full group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={berita.thumbnail}
                        alt={berita.judul}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-lg">
                          {berita.kategori}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatTanggal(berita.createdAt, 'dd MMM yyyy')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary-600 transition-colors">
                        {berita.judul}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3">
                        {berita.ringkasan}
                      </p>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-500">
                          {berita.penulis}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredBerita.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Berita Tidak Ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau filter kategori.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Berita Detail Page
export const BeritaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const berita = mockBerita.find((b) => b.slug === slug);
  const relatedBerita = mockBerita
    .filter((b) => b.slug !== slug && b.kategori === berita?.kategori)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!berita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Berita Tidak Ditemukan
          </h1>
          <p className="text-gray-500 mb-4">
            Berita yang Anda cari tidak tersedia.
          </p>
          <Link to="/berita">
            <Button>Kembali ke Berita</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96">
        <img
          src={berita.thumbnail}
          alt={berita.judul}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom -mt-20 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft p-6 lg:p-8"
            >
              {/* Back Link */}
              <Link
                to="/berita"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali ke Berita
              </Link>

              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-lg">
                    {berita.kategori}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatTanggal(berita.createdAt)}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTanggalRelatif(berita.createdAt)}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {berita.judul}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{berita.penulis}</p>
                    <p className="text-sm text-gray-500">Penulis</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{ __html: berita.konten }}
              />

              {/* Share */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Bagikan Berita
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24"
            >
              {/* Related News */}
              {relatedBerita.length > 0 && (
                <div className="bg-white rounded-2xl shadow-soft p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Berita Terkait
                  </h3>
                  <div className="space-y-4">
                    {relatedBerita.map((item) => (
                      <Link
                        key={item.id}
                        to={`/berita/${item.slug}`}
                        className="flex gap-3 group"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.judul}
                          className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {item.judul}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTanggal(item.createdAt, 'dd MMM yyyy')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaPage;
