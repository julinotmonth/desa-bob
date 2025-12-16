import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  FileText,
  Download,
  User,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { usePermohonanStore } from '../../store';
import { formatTanggal, formatTanggalWaktu } from '../../utils';
import { Permohonan, StatusPermohonan } from '../../types';
import { STATUS_CONFIG } from '../../constants';

const statusIcons: Record<StatusPermohonan, React.ElementType> = {
  diajukan: Clock,
  diverifikasi: Search,
  diproses: Settings,
  selesai: CheckCircle,
  ditolak: XCircle,
};

const CekStatusPage: React.FC = () => {
  const [noRegistrasi, setNoRegistrasi] = useState('');
  const [result, setResult] = useState<Permohonan | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { getPermohonanByNoReg } = usePermohonanStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noRegistrasi.trim()) return;

    setIsSearching(true);
    setResult(null);
    setNotFound(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Cari dari store (termasuk permohonan baru)
    const found = getPermohonanByNoReg(noRegistrasi);

    if (found) {
      setResult(found);
    } else {
      setNotFound(true);
    }
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-accent-500 to-accent-600 py-16 lg:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Cek Status Permohonan
            </h1>
            <p className="text-accent-100 text-lg max-w-2xl mx-auto mb-8">
              Masukkan nomor registrasi untuk melacak status permohonan layanan
              Anda.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contoh: REG-20240315-0001"
                    value={noRegistrasi}
                    onChange={(e) => setNoRegistrasi(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSearching}
                  className="bg-white text-accent-600 hover:bg-gray-100 px-8"
                >
                  Cari
                </Button>
              </div>
            </form>

            {/* Demo Info */}
            <p className="text-accent-200 text-sm mt-4">
              Demo: Coba masukkan <strong>REG-20240315-0001</strong> atau{' '}
              <strong>REG-20240320-0015</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          {/* Not Found */}
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Permohonan Tidak Ditemukan
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Nomor registrasi <strong>{noRegistrasi}</strong> tidak
                  ditemukan. Pastikan Anda memasukkan nomor registrasi dengan
                  benar.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Nomor Registrasi
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.noRegistrasi}
                      </p>
                    </div>
                    <StatusBadge status={result.status} size="lg" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Layanan</p>
                      <p className="font-medium text-gray-900">
                        {result.layananNama}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nama Pemohon</p>
                      <p className="font-medium text-gray-900">
                        {result.userName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                      <p className="font-medium text-gray-900">
                        {formatTanggal(result.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Update Terakhir</p>
                      <p className="font-medium text-gray-900">
                        {formatTanggalWaktu(result.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button if Selesai */}
                {result.status === 'selesai' && result.dokumenHasil && (
                  <div className="px-6 pb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <FileCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">
                            Dokumen Siap Diunduh
                          </p>
                          <p className="text-sm text-green-600">
                            {result.dokumenHasil.nama}
                          </p>
                        </div>
                      </div>
                      <Button
                        leftIcon={<Download className="h-4 w-4" />}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                )}

                {/* Catatan if Ditolak */}
                {result.status === 'ditolak' && result.catatan && (
                  <div className="px-6 pb-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-medium text-red-800 mb-1">
                        Alasan Penolakan
                      </p>
                      <p className="text-sm text-red-600">{result.catatan}</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Timeline */}
              <Card>
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">
                    Timeline Permohonan
                  </h3>
                </div>
                <div className="p-6">
                  <div className="relative">
                    {result.timeline.map((item, index) => {
                      const Icon = statusIcons[item.status];
                      const config = STATUS_CONFIG[item.status];
                      const isLast = index === result.timeline.length - 1;

                      return (
                        <div key={index} className="flex gap-4 pb-6 last:pb-0">
                          {/* Line */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
                            >
                              <Icon
                                className={`h-5 w-5 ${config.textColor}`}
                              />
                            </div>
                            {!isLast && (
                              <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-4">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {config.label}
                              </p>
                              <StatusBadge status={item.status} size="sm" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">
                              {formatTanggalWaktu(item.tanggal)}
                            </p>
                            {item.catatan && (
                              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">
                                {item.catatan}
                              </p>
                            )}
                            {item.petugas && (
                              <p className="text-xs text-gray-400 mt-1">
                                Oleh: {item.petugas}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Info Section */}
          {!result && !notFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lacak Permohonan Anda
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Masukkan nomor registrasi yang Anda terima saat mengajukan
                  permohonan untuk melihat status terkini.
                </p>
              </Card>

              {/* Status Info */}
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(Object.keys(STATUS_CONFIG) as StatusPermohonan[]).map(
                  (status) => {
                    const config = STATUS_CONFIG[status];
                    const Icon = statusIcons[status];
                    return (
                      <div
                        key={status}
                        className="bg-white rounded-xl p-4 border border-gray-100"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgColor} mb-3`}
                        >
                          <Icon className={`h-5 w-5 ${config.textColor}`} />
                        </div>
                        <p className="font-medium text-gray-900 text-sm">
                          {config.label}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CekStatusPage;