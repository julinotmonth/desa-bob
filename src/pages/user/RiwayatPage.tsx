import React, { useState, useEffect } from 'react';
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
  Loader2,
  ExternalLink,
  X,
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatTanggal, formatTanggalWaktu, formatFileSize } from '../../utils';
import { STATUS_CONFIG } from '../../constants';
import { StatusPermohonan, Permohonan } from '../../types';
import { permohonanApi, getApiBaseUrl } from '../../services/api';
import toast from 'react-hot-toast';

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
  const [permohonanList, setPermohonanList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuthStore();
  const { getPermohonanByUser } = usePermohonanStore();
  const storePermohonan = user ? getPermohonanByUser(user.id) : [];

  // Fetch user permohonan from API
  useEffect(() => {
    const fetchPermohonan = async () => {
      try {
        const response = await permohonanApi.getUserPermohonan();
        if (response.data.success) {
          setPermohonanList(response.data.data);
        }
      } catch (error) {
        console.log('Using fallback permohonan data');
        setPermohonanList(storePermohonan);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermohonan();
  }, []);

  const filteredPermohonan = permohonanList.filter((p) => {
    const matchSearch =
      p.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.layanan?.nama || p.layananNama || '').toLowerCase().includes(searchQuery.toLowerCase());
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
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : (
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
                    <p className="font-medium text-gray-900">{item.layanan?.nama || item.layananNama}</p>
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
          )}
        </Card>
      </motion.div>
    </div>
  );
};

// Detail Riwayat
export const RiwayatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [permohonan, setPermohonan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<any>(null); // For modal preview
  
  const { getPermohonanById } = usePermohonanStore();
  const storePermohonan = id ? getPermohonanById(id) : undefined;

  // Fetch permohonan detail from API
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      
      try {
        const response = await permohonanApi.getById(id);
        if (response.data.success) {
          setPermohonan(response.data.data);
        }
      } catch (error) {
        console.log('Using fallback data');
        if (storePermohonan) {
          setPermohonan(storePermohonan);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDownload = async (doc: { nama: string; url: string }) => {
    try {
      const fullUrl = doc.url.startsWith('http') ? doc.url : `${getApiBaseUrl()}${doc.url}`;
      
      // Fetch file as blob
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.nama || 'dokumen';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
      toast.success(`Berhasil mengunduh ${doc.nama}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Gagal mengunduh dokumen');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

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

  // Map data from API response
  const layananNama = permohonan.layanan?.nama || permohonan.layananNama;
  const dokumen = permohonan.dokumen || [];
  const timeline = permohonan.timeline || [];
  const dokumenHasil = permohonan.dokumenHasil;

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
                <h1 className="text-xl font-bold text-gray-900 mb-1">{layananNama}</h1>
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
          {permohonan.status === 'selesai' && dokumenHasil && (
            <div className="px-6 pb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Dokumen Siap Diunduh</p>
                    <p className="text-sm text-green-600">{dokumenHasil.nama}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleDownload(dokumenHasil)}
                  leftIcon={<Download className="h-4 w-4" />} 
                  className="bg-green-600 hover:bg-green-700"
                >
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
              {timeline.map((item: any, index: number) => {
                const Icon = statusIcons[item.status as StatusPermohonan];
                const config = STATUS_CONFIG[item.status as StatusPermohonan];
                const isLast = index === timeline.length - 1;

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {dokumen.map((doc: any) => {
                const fullUrl = doc.url.startsWith('http') ? doc.url : `${getApiBaseUrl()}${doc.url}`;
                const isImage = doc.type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.nama);
                const isPdf = doc.type === 'application/pdf' || /\.pdf$/i.test(doc.nama);
                
                return (
                  <div 
                    key={doc.id} 
                    className="group relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setPreviewDoc({ ...doc, fullUrl, isImage, isPdf })}
                  >
                    {/* Preview Area */}
                    <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                      {isImage ? (
                        <img 
                          src={fullUrl} 
                          alt={doc.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback icon for non-images or failed loads */}
                      <div className={`flex flex-col items-center justify-center ${isImage ? 'hidden' : ''}`}>
                        {isPdf ? (
                          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-8 w-8 text-red-500" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                        )}
                        <span className="text-xs text-gray-500 mt-2 uppercase">
                          {doc.nama.split('.').pop()}
                        </span>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white rounded-full p-2">
                          <Eye className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    
                    {/* File name */}
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-700 truncate" title={doc.nama}>
                        {doc.nama}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {dokumen.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Tidak ada dokumen</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 truncate pr-4">{previewDoc.nama}</h3>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${previewDoc.isPdf ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <FileText className={`h-5 w-5 ${previewDoc.isPdf ? 'text-red-500' : 'text-blue-500'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{previewDoc.nama}</p>
                  <p className="text-xs text-gray-500">{previewDoc.size ? formatFileSize(previewDoc.size) : ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = previewDoc.fullUrl;
                    a.download = previewDoc.nama;
                    a.click();
                  }}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewDoc.fullUrl, '_blank')}
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Buka Tab Baru
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-4 bg-gray-100 max-h-[60vh] overflow-auto flex items-center justify-center">
              {previewDoc.isImage ? (
                <img 
                  src={previewDoc.fullUrl} 
                  alt={previewDoc.nama}
                  className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : previewDoc.isPdf ? (
                <iframe
                  src={previewDoc.fullUrl}
                  className="w-full h-[55vh] rounded-lg bg-white"
                  title={previewDoc.nama}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">Preview tidak tersedia untuk tipe file ini</p>
                  <p className="text-sm text-gray-500">Silakan download untuk melihat file</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RiwayatPage;