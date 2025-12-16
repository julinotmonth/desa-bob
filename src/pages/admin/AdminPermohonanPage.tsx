import React, { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
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
  Upload,
  X,
  FileImage,
  File,
  ExternalLink,
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Input';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatTanggal, formatTanggalWaktu, formatFileSize } from '../../utils';
import { STATUS_CONFIG, MAX_FILE_SIZE } from '../../constants';
import { StatusPermohonan, Dokumen } from '../../types';

const statusIcons: Record<StatusPermohonan, React.ElementType> = {
  diajukan: Clock,
  diverifikasi: Search,
  diproses: Settings,
  selesai: CheckCircle,
  ditolak: XCircle,
};

const getFileType = (type: string): 'image' | 'pdf' | 'other' => {
  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf') return 'pdf';
  return 'other';
};

const FileIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "h-5 w-5" }) => {
  const fileType = getFileType(type);
  if (fileType === 'image') return <FileImage className={`${className} text-blue-500`} />;
  if (fileType === 'pdf') return <FileText className={`${className} text-red-500`} />;
  return <File className={`${className} text-gray-500`} />;
};

export const AdminPermohonanPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const { getAllPermohonan } = usePermohonanStore();
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Cari no. registrasi, layanan, atau nama..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
        </select>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
      </motion.div>

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
                    <td className="px-4 py-3"><p className="font-medium text-gray-900 text-sm">{item.noRegistrasi}</p></td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-900">{item.userName}</p><p className="text-xs text-gray-500">{item.userNik}</p></td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-900">{item.layananNama}</p></td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-500">{formatTanggal(item.createdAt, 'dd MMM yyyy')}</p></td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-center"><Link to={`/admin/permohonan/${item.id}`}><Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>Detail</Button></Link></td>
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

export const AdminPermohonanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Dokumen | null>(null);
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; preview: string } | null>(null);

  const { user } = useAuthStore();
  const { getPermohonanById, updateStatus, updatePermohonan } = usePermohonanStore();
  const permohonan = id ? getPermohonanById(id) : undefined;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile({ file, preview: URL.createObjectURL(file) });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.errors.some((e) => e.code === 'file-too-large')) {
          toast.error(`File ${file.file.name} terlalu besar. Maksimal 5MB.`);
        } else {
          toast.error(`File ${file.file.name} tidak didukung.`);
        }
      });
    },
  });

  const removeUploadedFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview);
      setUploadedFile(null);
    }
  };

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
    if (permohonan.status === 'diproses') {
      setShowApproveModal(false);
      setShowCompleteModal(true);
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStatus(id, nextStatus, catatan || `Status diubah menjadi ${nextStatus}`, user?.nama || 'Admin');
    toast.success(`Permohonan berhasil di-${getApproveButtonText().toLowerCase()}`);
    setShowApproveModal(false);
    setIsLoading(false);
    setCatatan('');
  };

  const handleComplete = async () => {
    if (!permohonan || !id) return;
    if (!uploadedFile) {
      toast.error('Upload dokumen surat hasil terlebih dahulu');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const now = new Date().toISOString();
    const dokumenHasil: Dokumen = {
      id: `hasil-${id}`,
      nama: uploadedFile.file.name,
      url: uploadedFile.preview,
      type: uploadedFile.file.type,
      size: uploadedFile.file.size,
      uploadedAt: now,
    };
    updatePermohonan(id, { dokumenHasil });
    updateStatus(id, 'selesai', catatan || 'Surat telah selesai dan dapat diunduh oleh pemohon', user?.nama || 'Admin');
    toast.success('Permohonan berhasil diselesaikan! Dokumen surat telah diunggah.');
    setShowCompleteModal(false);
    setIsLoading(false);
    setCatatan('');
    setUploadedFile(null);
  };

  const handleReject = async () => {
    if (!permohonan || !id) return;
    if (!catatan.trim()) {
      toast.error('Catatan penolakan harus diisi');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateStatus(id, 'ditolak', catatan, user?.nama || 'Admin');
    toast.success('Permohonan ditolak');
    setShowRejectModal(false);
    setIsLoading(false);
    setCatatan('');
  };

  const handlePreviewDocument = (doc: Dokumen) => {
    setPreviewDocument(doc);
    setShowPreviewModal(true);
  };

  const handleDownloadDocument = (doc: Dokumen) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.nama;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Mengunduh ${doc.nama}`);
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/admin/permohonan" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-4 w-4" />Kembali
        </Link>
      </motion.div>

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
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-gray-500" /></div>
              <div><p className="text-sm text-gray-500">Pemohon</p><p className="font-medium text-gray-900">{permohonan.userName}</p><p className="text-xs text-gray-500">{permohonan.userNik}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="h-5 w-5 text-gray-500" /></div>
              <div><p className="text-sm text-gray-500">Layanan</p><p className="font-medium text-gray-900">{permohonan.layananNama}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><Calendar className="h-5 w-5 text-gray-500" /></div>
              <div><p className="text-sm text-gray-500">Tanggal Pengajuan</p><p className="font-medium text-gray-900">{formatTanggal(permohonan.createdAt)}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="h-5 w-5 text-gray-500" /></div>
              <div><p className="text-sm text-gray-500">Update Terakhir</p><p className="font-medium text-gray-900">{formatTanggalWaktu(permohonan.updatedAt)}</p></div>
            </div>
          </div>
          {canProcess && (
            <div className="px-6 pb-6 flex gap-3">
              <Button onClick={() => setShowApproveModal(true)} leftIcon={<CheckCircle className="h-4 w-4" />}>{getApproveButtonText()}</Button>
              <Button variant="danger" onClick={() => setShowRejectModal(true)} leftIcon={<XCircle className="h-4 w-4" />}>Tolak</Button>
            </div>
          )}
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="p-6 border-b border-gray-100"><h2 className="font-semibold text-gray-900">Timeline</h2></div>
            <div className="p-6">
              {permohonan.timeline.map((item, index) => {
                const Icon = statusIcons[item.status];
                const config = STATUS_CONFIG[item.status];
                const isLast = index === permohonan.timeline.length - 1;
                return (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}><Icon className={`h-5 w-5 ${config.textColor}`} /></div>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Dokumen Persyaratan</h2>
              <p className="text-sm text-gray-500 mt-1">Dokumen yang diunggah oleh pemohon</p>
            </div>
            <div className="p-6 space-y-3">
              {permohonan.dokumen.length === 0 ? (
                <div className="text-center py-8"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Tidak ada dokumen</p></div>
              ) : (
                permohonan.dokumen.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200"><FileIcon type={doc.type} className="h-6 w-6" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.nama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{formatTanggal(doc.uploadedAt, 'dd MMM yyyy, HH:mm')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(doc)} title="Lihat Dokumen"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)} title="Download Dokumen"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {permohonan.status === 'selesai' && permohonan.dokumenHasil && (
            <Card className="mt-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Dokumen Surat Hasil</h2>
                <p className="text-sm text-gray-500 mt-1">Surat yang telah diterbitkan</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-green-200"><FileIcon type={permohonan.dokumenHasil.type} className="h-6 w-6" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{permohonan.dokumenHasil.nama}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{formatFileSize(permohonan.dokumenHasil.size)}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{formatTanggal(permohonan.dokumenHasil.uploadedAt, 'dd MMM yyyy, HH:mm')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(permohonan.dokumenHasil!)} title="Lihat Dokumen"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(permohonan.dokumenHasil!)} title="Download Dokumen"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      <Modal open={showApproveModal} onOpenChange={setShowApproveModal} title="Konfirmasi" size="sm">
        <p className="text-gray-500 mb-4">{permohonan.status === 'diproses' ? 'Untuk menyelesaikan permohonan, Anda perlu mengupload dokumen surat hasil. Lanjutkan?' : 'Apakah Anda yakin ingin menyetujui permohonan ini?'}</p>
        {permohonan.status !== 'diproses' && (<Textarea label="Catatan (Opsional)" placeholder="Tambahkan catatan..." rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} />)}
        <div className="flex gap-3 mt-4">
          <Button variant="ghost" onClick={() => setShowApproveModal(false)} className="flex-1">Batal</Button>
          <Button onClick={handleApprove} isLoading={isLoading} className="flex-1">{permohonan.status === 'diproses' ? 'Lanjutkan' : 'Setujui'}</Button>
        </div>
      </Modal>

      <Modal open={showCompleteModal} onOpenChange={setShowCompleteModal} title="Selesaikan Permohonan" size="lg">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800"><strong>Upload Dokumen Surat Hasil</strong><br />Unggah dokumen surat yang telah selesai diproses untuk dikirim ke pemohon.</p>
          </div>
          {!uploadedFile ? (
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">{isDragActive ? 'Lepaskan file di sini' : 'Drag & drop file atau klik untuk memilih'}</p>
              <p className="text-sm text-gray-400">PDF, JPG, PNG (Maks. 5MB)</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-green-200"><FileIcon type={uploadedFile.file.type} className="h-6 w-6" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={removeUploadedFile} className="text-red-500 hover:text-red-700 hover:bg-red-50"><X className="h-4 w-4" /></Button>
            </div>
          )}
          <Textarea label="Catatan (Opsional)" placeholder="Tambahkan catatan untuk pemohon..." rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
          <div className="flex gap-3 mt-4">
            <Button variant="ghost" onClick={() => { setShowCompleteModal(false); removeUploadedFile(); setCatatan(''); }} className="flex-1">Batal</Button>
            <Button onClick={handleComplete} isLoading={isLoading} className="flex-1" disabled={!uploadedFile} leftIcon={<CheckCircle className="h-4 w-4" />}>Selesaikan Permohonan</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showRejectModal} onOpenChange={setShowRejectModal} title="Tolak Permohonan" size="sm">
        <p className="text-gray-500 mb-4">Berikan alasan penolakan permohonan ini.</p>
        <Textarea label="Alasan Penolakan *" placeholder="Tuliskan alasan penolakan..." rows={4} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
        <div className="flex gap-3 mt-4">
          <Button variant="ghost" onClick={() => setShowRejectModal(false)} className="flex-1">Batal</Button>
          <Button variant="danger" onClick={handleReject} isLoading={isLoading} className="flex-1">Tolak</Button>
        </div>
      </Modal>

      <Modal open={showPreviewModal} onOpenChange={setShowPreviewModal} title={previewDocument?.nama || 'Preview Dokumen'} size="full">
        {previewDocument && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <FileIcon type={previewDocument.type} className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{previewDocument.nama}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(previewDocument.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(previewDocument)} leftIcon={<Download className="h-4 w-4" />}>Download</Button>
                <a href={previewDocument.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>Buka Tab Baru</Button>
                </a>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
              {getFileType(previewDocument.type) === 'image' ? (
                <div className="flex items-center justify-center p-4">
                  <img src={previewDocument.url} alt={previewDocument.nama} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md" />
                </div>
              ) : getFileType(previewDocument.type) === 'pdf' ? (
                <iframe src={previewDocument.url} title={previewDocument.nama} className="w-full h-[60vh] border-0" />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Preview tidak tersedia untuk tipe file ini</p>
                  <p className="text-sm text-gray-500 mb-4">Silakan download untuk melihat dokumen</p>
                  <Button onClick={() => handleDownloadDocument(previewDocument)} leftIcon={<Download className="h-4 w-4" />}>Download Dokumen</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPermohonanPage;