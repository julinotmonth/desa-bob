import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  FileText,
  Download,
  ChevronLeft,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Settings,
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Input';
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

// List Permohonan Admin
export const AdminPermohonanPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const { getAllPermohonan } = usePermohonanStore();
  
  // Ambil semua permohonan dari store
  const allPermohonan = getAllPermohonan();

  const filteredPermohonan = allPermohonan.filter((p) => {
    const matchSearch =
      p.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.layananNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Permohonan</h1>
        <p className="text-gray-500">Kelola semua permohonan layanan dari warga</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari no. registrasi, layanan, atau nama..."
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
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Export
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. Registrasi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pemohon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Layanan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPermohonan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{item.noRegistrasi}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{item.userName}</p>
                      <p className="text-xs text-gray-500">{item.userNik}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{item.layananNama}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-500">{formatTanggal(item.createdAt, 'dd MMM yyyy')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link to={`/admin/permohonan/${item.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPermohonan.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Permohonan</h3>
              <p className="text-gray-500">Tidak ditemukan permohonan yang sesuai dengan filter</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

// Detail Permohonan Admin
export const AdminPermohonanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthStore();
  const { getPermohonanById, updateStatus } = usePermohonanStore();
  
  const permohonan = id ? getPermohonanById(id) : undefined;

  const getNextStatus = (): StatusPermohonan | null => {
    if (!permohonan) return null;
    switch (permohonan.status) {
      case 'diajukan': return 'diverifikasi';
      case 'diverifikasi': return 'diproses';
      case 'diproses': return 'selesai';
      default: return null;
    }
  };

  const getApproveButtonText = () => {
    if (!permohonan) return 'Setujui';
    switch (permohonan.status) {
      case 'diajukan': return 'Verifikasi';
      case 'diverifikasi': return 'Proses';
      case 'diproses': return 'Selesaikan';
      default: return 'Setujui';
    }
  };

  const handleApprove = async () => {
    if (!permohonan || !id) return;
    
    const nextStatus = getNextStatus();
    if (!nextStatus) return;
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update status di store
    updateStatus(id, nextStatus, catatan || `Status diubah menjadi ${nextStatus}`, user?.nama || 'Admin');
    
    toast.success(`Permohonan berhasil di-${getApproveButtonText().toLowerCase()}`);
    setShowApproveModal(false);
    setIsLoading(false);
    setCatatan('');
  };

  const handleReject = async () => {
    if (!permohonan || !id) return;
    
    if (!catatan.trim()) {
      toast.error('Catatan penolakan harus diisi');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update status di store
    updateStatus(id, 'ditolak', catatan, user?.nama || 'Admin');
    
    toast.success('Permohonan ditolak');
    setShowRejectModal(false);
    setIsLoading(false);
    setCatatan('');
  };

  if (!permohonan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Permohonan Tidak Ditemukan</h2>
        <Link to="/admin/permohonan"><Button variant="outline">Kembali</Button></Link>
      </div>
    );
  }

  const canProcess = ['diajukan', 'diverifikasi', 'diproses'].includes(permohonan.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/admin/permohonan" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" />Kembali
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{permohonan.layananNama}</h1>
              <p className="text-gray-500">{permohonan.noRegistrasi}</p>
            </div>
            <StatusBadge status={permohonan.status} size="lg" />
          </div>

          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pemohon</p>
                <p className="font-medium text-gray-900">{permohonan.userName}</p>
                <p className="text-xs text-gray-500">{permohonan.userNik}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Layanan</p>
                <p className="font-medium text-gray-900">{permohonan.layananNama}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
                <p className="font-medium text-gray-900">{formatTanggal(permohonan.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Update Terakhir</p>
                <p className="font-medium text-gray-900">{formatTanggalWaktu(permohonan.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {canProcess && (
            <div className="px-6 pb-6 flex gap-3">
              <Button onClick={() => setShowApproveModal(true)} leftIcon={<CheckCircle className="h-4 w-4" />}>
                {getApproveButtonText()}
              </Button>
              <Button variant="danger" onClick={() => setShowRejectModal(true)} leftIcon={<XCircle className="h-4 w-4" />}>
                Tolak
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Timeline & Documents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Timeline</h2>
            </div>
            <div className="p-6">
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
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-sm text-gray-500">{formatTanggalWaktu(item.tanggal)}</p>
                      {item.catatan && <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{item.catatan}</p>}
                      {item.petugas && <p className="text-xs text-gray-400 mt-1">Oleh: {item.petugas}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Documents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Dokumen</h2>
            </div>
            <div className="p-6 space-y-3">
              {permohonan.dokumen.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.nama}</p>
                    <p className="text-xs text-gray-500">{formatTanggal(doc.uploadedAt, 'dd MMM yyyy')}</p>
                  </div>
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Approve Modal */}
      <Modal open={showApproveModal} onOpenChange={setShowApproveModal} title="Konfirmasi" size="sm">
        <p className="text-gray-500 mb-4">Apakah Anda yakin ingin menyetujui permohonan ini?</p>
        <Textarea label="Catatan (Opsional)" placeholder="Tambahkan catatan..." rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
        <div className="flex gap-3 mt-4">
          <Button variant="ghost" onClick={() => setShowApproveModal(false)} className="flex-1">Batal</Button>
          <Button onClick={handleApprove} isLoading={isLoading} className="flex-1">Setujui</Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={showRejectModal} onOpenChange={setShowRejectModal} title="Tolak Permohonan" size="sm">
        <p className="text-gray-500 mb-4">Berikan alasan penolakan permohonan ini.</p>
        <Textarea label="Alasan Penolakan *" placeholder="Tuliskan alasan penolakan..." rows={4} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
        <div className="flex gap-3 mt-4">
          <Button variant="ghost" onClick={() => setShowRejectModal(false)} className="flex-1">Batal</Button>
          <Button variant="danger" onClick={handleReject} isLoading={isLoading} className="flex-1">Tolak</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPermohonanPage;