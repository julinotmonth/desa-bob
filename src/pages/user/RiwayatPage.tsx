import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  FileText,
  Download,
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatTanggal, formatTanggalWaktu } from '../../utils';
import { STATUS_CONFIG } from '../../constants';
import { StatusPermohonan } from '../../types';

const statusIcons: Record<StatusPermohonan, React.ElementType> = {
  diajukan: Clock,
  diverifikasi: Search,
  diproses: Settings,
  selesai: CheckCircle,
  ditolak: XCircle,
};

// List Riwayat
export const RiwayatPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const { user } = useAuthStore();
  const { getPermohonanByUser } = usePermohonanStore();

  const userPermohonan = user ? getPermohonanByUser(user.id) : [];

  const filteredPermohonan = userPermohonan.filter((p) => {
    const matchSearch =
      p.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.layananNama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Permohonan</h1>
        <p className="text-gray-500">Lihat dan kelola semua permohonan Anda</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari no. registrasi atau layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </motion.div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {filteredPermohonan.map((item) => (
              <Link
                key={item.id}
                to={`/user/riwayat/${item.id}`}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hidden sm:flex">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.layananNama}</p>
                    <p className="text-sm text-gray-500">{item.noRegistrasi}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTanggal(item.createdAt, 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  {item.status === 'selesai' && (
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Link>
            ))}

            {filteredPermohonan.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Permohonan</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || filterStatus
                    ? 'Tidak ditemukan permohonan yang sesuai'
                    : 'Anda belum memiliki riwayat permohonan'}
                </p>
                <Link to="/user/pengajuan">
                  <Button>Buat Permohonan Baru</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// Detail Riwayat
export const RiwayatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPermohonanById } = usePermohonanStore();
  
  const permohonan = id ? getPermohonanById(id) : undefined;

  if (!permohonan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Permohonan Tidak Ditemukan</h2>
        <Link to="/user/riwayat">
          <Button variant="outline">Kembali ke Riwayat</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/user/riwayat"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Riwayat
        </Link>
      </motion.div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">{permohonan.layananNama}</h1>
                <p className="text-gray-500">{permohonan.noRegistrasi}</p>
              </div>
              <StatusBadge status={permohonan.status} size="lg" />
            </div>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tanggal Pengajuan</p>
              <p className="font-medium text-gray-900">{formatTanggal(permohonan.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Update Terakhir</p>
              <p className="font-medium text-gray-900">{formatTanggalWaktu(permohonan.updatedAt)}</p>
            </div>
          </div>

          {/* Download Button */}
          {permohonan.status === 'selesai' && permohonan.dokumenHasil && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Dokumen Siap Diunduh</p>
                    <p className="text-sm text-green-600">{permohonan.dokumenHasil.nama}</p>
                  </div>
                </div>
                <Button leftIcon={<Download className="h-4 w-4" />} className="bg-green-600 hover:bg-green-700">
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Catatan Penolakan */}
          {permohonan.status === 'ditolak' && permohonan.catatan && (
            <div className="px-6 pb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="font-medium text-red-800 mb-1">Alasan Penolakan</p>
                <p className="text-sm text-red-600">{permohonan.catatan}</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Timeline Permohonan</h2>
          </div>
          <div className="p-6">
            <div className="relative">
              {permohonan.timeline.map((item, index) => {
                const Icon = statusIcons[item.status];
                const config = STATUS_CONFIG[item.status];
                const isLast = index === permohonan.timeline.length - 1;

                return (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.textColor}`} />
                      </div>
                      {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{config.label}</p>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{formatTanggalWaktu(item.tanggal)}</p>
                      {item.catatan && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{item.catatan}</p>
                      )}
                      {item.petugas && <p className="text-xs text-gray-400 mt-1">Oleh: {item.petugas}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Dokumen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Dokumen yang Diupload</h2>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {permohonan.dokumen.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.nama}</p>
                    <p className="text-xs text-gray-500">{formatTanggal(doc.uploadedAt, 'dd MMM yyyy')}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RiwayatPage;