import React, { useState, useCallback, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  Loader2,
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Input';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatTanggal, formatTanggalWaktu, formatFileSize } from '../../utils';
import { STATUS_CONFIG, MAX_FILE_SIZE } from '../../constants';
import { StatusPermohonan, Dokumen } from '../../types';
import { permohonanApi, getApiBaseUrl } from '../../services/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [permohonanList, setPermohonanList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Log when component mounts
  useEffect(() => {
    console.log('AdminPermohonanPage mounted');
  }, []);

  // Fetch all permohonan from API
  useEffect(() => {
    const fetchPermohonan = async () => {
      console.log('=== Starting fetch permohonan ===');
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        console.log('Calling API: /api/permohonan/all');
        
        const response = await permohonanApi.getAll({ status: filterStatus || undefined });
        console.log('API Response:', response);
        console.log('API Response Data:', response.data);
        
        if (response.data.success) {
          console.log('Data count:', response.data.data?.length);
          setPermohonanList(response.data.data || []);
        } else {
          console.log('API returned success: false');
          setError('Gagal memuat data');
          setPermohonanList([]);
        }
      } catch (err: any) {
        console.error('=== API Error ===');
        console.error('Error:', err);
        console.error('Error Response:', err.response);
        console.error('Error Message:', err.message);
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan');
        setPermohonanList([]);
      } finally {
        setIsLoading(false);
        console.log('=== Fetch complete ===');
      }
    };
    
    fetchPermohonan();
  }, [filterStatus]);

  // Export to CSV
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const now = new Date();
      const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      
      // Header
      let csvContent = 'LAPORAN DATA PERMOHONAN LAYANAN DESA LEGOK\n';
      csvContent += `Tanggal Export: ${formatTanggal(now.toISOString())}\n`;
      csvContent += `Filter Status: ${filterStatus || 'Semua'}\n`;
      csvContent += `Total Data: ${filteredPermohonan.length} permohonan\n\n`;
      
      // Column headers
      csvContent += 'No,No Registrasi,Nama Pemohon,NIK,Layanan,Keperluan,Status,Tanggal Pengajuan,Tanggal Update\n';
      
      // Data rows
      filteredPermohonan.forEach((p, index) => {
        const noReg = p.noRegistrasi || '-';
        const nama = p.pemohon?.nama || '-';
        const nik = p.pemohon?.nik || '-';
        const layanan = p.layanan?.nama || '-';
        const keperluan = (p.keperluan || '-').replace(/"/g, '""'); // Escape quotes
        const status = p.status || '-';
        const tanggalPengajuan = formatTanggal(p.createdAt);
        const tanggalUpdate = formatTanggal(p.updatedAt);
        
        csvContent += `${index + 1},"${noReg}","${nama}","${nik}","${layanan}","${keperluan}","${status}","${tanggalPengajuan}","${tanggalUpdate}"\n`;
      });
      
      // Create and download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Permohonan_${filterStatus || 'Semua'}_${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Berhasil export ${filteredPermohonan.length} data permohonan`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengexport data');
    } finally {
      setIsExporting(false);
    }
  };

  // Filter locally for search (API already handles status filter)
  const filteredPermohonan = permohonanList.filter((p) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      p.noRegistrasi?.toLowerCase().includes(search) ||
      (p.layanan?.nama || p.layananNama || '').toLowerCase().includes(search) ||
      (p.pemohon?.nama || p.userName || '').toLowerCase().includes(search)
    );
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
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setIsLoading(true); }} className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
        </select>
        <Button 
          variant="outline" 
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleExport}
          isLoading={isExporting}
          disabled={isLoading || filteredPermohonan.length === 0}
        >
          Export
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card padding="none">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500">Memuat data permohonan...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 font-medium mb-2">Error: {error}</p>
              <p className="text-gray-500 text-sm mb-4">Pastikan backend berjalan di http://localhost:5000</p>
              <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
          ) : (
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
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{item.pemohon?.nama || item.userName || item.namaPemohon}</p>
                      <p className="text-xs text-gray-500">{item.pemohon?.nik || item.userNik || item.nikPemohon}</p>
                    </td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-900">{item.layanan?.nama || item.layananNama}</p></td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-500">{formatTanggal(item.createdAt, 'dd MMM yyyy')}</p></td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-center"><Link to={`/admin/permohonan/${item.id}`}><Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>Detail</Button></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          {!isLoading && filteredPermohonan.length === 0 && (
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
  const navigate = useNavigate();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; preview: string } | null>(null);
  const [permohonan, setPermohonan] = useState<any>(null);

  const { user } = useAuthStore();
  const { getPermohonanById, updateStatus: updateStoreStatus, updatePermohonan } = usePermohonanStore();

  // Fetch permohonan detail from API
  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      
      console.log('=== Fetching permohonan detail ===');
      console.log('ID:', id);
      console.log('User role:', user?.role);
      
      try {
        const response = await permohonanApi.getById(id);
        console.log('Detail API Response:', response.data);
        if (response.data.success) {
          setPermohonan(response.data.data);
        } else {
          console.error('API returned success: false');
          toast.error(response.data.message || 'Gagal memuat detail');
        }
      } catch (error: any) {
        console.error('Detail API Error:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Gagal memuat detail permohonan');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDetail();
  }, [id, user]);

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
    try {
      const response = await permohonanApi.updateStatus(id, nextStatus, catatan || `Status diubah menjadi ${nextStatus}`);
      if (response.data.success) {
        setPermohonan({ ...permohonan, status: nextStatus });
        toast.success(`Permohonan berhasil di-${getApproveButtonText().toLowerCase()}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate status');
    } finally {
      setShowApproveModal(false);
      setIsLoading(false);
      setCatatan('');
    }
  };

  const handleComplete = async () => {
    if (!permohonan || !id) return;
    if (!uploadedFile) {
      toast.error('Upload dokumen surat hasil terlebih dahulu');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', 'selesai');
      formData.append('catatan', catatan || 'Surat telah selesai dan dapat diunduh oleh pemohon');
      formData.append('dokumenHasil', uploadedFile.file);
      
      const response = await permohonanApi.updateStatus(id, 'selesai', catatan || 'Surat telah selesai', uploadedFile.file);
      if (response.data.success) {
        setPermohonan({ ...permohonan, status: 'selesai', dokumenHasil: response.data.data.dokumenHasil });
        toast.success('Permohonan berhasil diselesaikan!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menyelesaikan permohonan');
    } finally {
      setShowCompleteModal(false);
      setIsLoading(false);
      setCatatan('');
      setUploadedFile(null);
    }
  };

  const handleReject = async () => {
    if (!permohonan || !id) return;
    if (!catatan.trim()) {
      toast.error('Catatan penolakan harus diisi');
      return;
    }
    setIsLoading(true);
    try {
      const response = await permohonanApi.updateStatus(id, 'ditolak', catatan);
      if (response.data.success) {
        setPermohonan({ ...permohonan, status: 'ditolak', catatan });
        toast.success('Permohonan ditolak');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menolak permohonan');
    } finally {
      setShowRejectModal(false);
      setIsLoading(false);
      setCatatan('');
    }
  };

  const handlePreviewDocument = (doc: any) => {
    console.log('Preview document:', doc);
    if (!doc || !doc.url) {
      toast.error('URL dokumen tidak tersedia');
      return;
    }
    const fullUrl = doc.url.startsWith('http') ? doc.url : `${getApiBaseUrl()}${doc.url}`;
    console.log('Full URL:', fullUrl);
    setPreviewDocument({ ...doc, url: fullUrl, type: doc.type || 'application/pdf' });
    setShowPreviewModal(true);
  };

  const handleDownloadDocument = async (doc: any) => {
    console.log('Download document:', doc);
    if (!doc || !doc.url) {
      toast.error('URL dokumen tidak tersedia');
      return;
    }
    
    try {
      const fullUrl = doc.url.startsWith('http') ? doc.url : `${getApiBaseUrl()}${doc.url}`;
      console.log('Full URL:', fullUrl);
      
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
      toast.success(`Berhasil mengunduh ${doc.nama || 'dokumen'}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Gagal mengunduh dokumen');
    }
  };

  if (isLoadingData) {
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
        <Link to="/admin/permohonan"><Button variant="outline">Kembali</Button></Link>
      </div>
    );
  }

  // Map data from API
  const layananNama = permohonan.layanan?.nama || permohonan.layananNama;
  const pemohonNama = permohonan.pemohon?.nama || permohonan.userName || permohonan.namaPemohon;
  const pemohonNik = permohonan.pemohon?.nik || permohonan.userNik || permohonan.nikPemohon;
  const dokumen = permohonan.dokumen || [];
  const timeline = permohonan.timeline || [];

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
              <h1 className="text-xl font-bold text-gray-900 mb-1">{layananNama}</h1>
              <p className="text-gray-500">{permohonan.noRegistrasi}</p>
            </div>
            <StatusBadge status={permohonan.status} size="lg" />
          </div>
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-gray-500" /></div>
              <div><p className="text-sm text-gray-500">Pemohon</p><p className="font-medium text-gray-900">{pemohonNama}</p><p className="text-xs text-gray-500">{pemohonNik}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"><FileText className="h-5 w-5 text-gray-500" /></div>
              <div><p className="text-sm text-gray-500">Layanan</p><p className="font-medium text-gray-900">{layananNama}</p></div>
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
              {timeline.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Belum ada timeline</div>
              ) : (
              timeline.map((item: any, index: number) => {
                const Icon = statusIcons[item.status as StatusPermohonan] || Clock;
                const config = STATUS_CONFIG[item.status as StatusPermohonan] || STATUS_CONFIG.diajukan;
                const isLast = index === timeline.length - 1;
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
              })
              )}
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
              {dokumen.length === 0 ? (
                <div className="text-center py-8"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">Tidak ada dokumen</p></div>
              ) : (
                dokumen.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200"><FileIcon type={doc.type || 'application/octet-stream'} className="h-6 w-6" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.nama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {doc.size && <><span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span><span className="text-xs text-gray-300">•</span></>}
                        <span className="text-xs text-gray-500">{doc.uploadedAt ? formatTanggal(doc.uploadedAt, 'dd MMM yyyy, HH:mm') : ''}</span>
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
                {(() => {
                  // Handle both string URL and object format
                  const dokHasil = typeof permohonan.dokumenHasil === 'string' 
                    ? { nama: 'Dokumen Hasil', url: permohonan.dokumenHasil, type: permohonan.dokumenHasil.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg' }
                    : permohonan.dokumenHasil;
                  
                  return (
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-green-200">
                        <FileIcon type={dokHasil.type || 'application/pdf'} className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{dokHasil.nama || 'Dokumen Hasil'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {dokHasil.size && <><span className="text-xs text-gray-500">{formatFileSize(dokHasil.size)}</span><span className="text-xs text-gray-300">•</span></>}
                          <span className="text-xs text-gray-500">{dokHasil.uploadedAt ? formatTanggal(dokHasil.uploadedAt, 'dd MMM yyyy, HH:mm') : ''}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handlePreviewDocument(dokHasil)} title="Lihat Dokumen"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(dokHasil)} title="Download Dokumen"><Download className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  );
                })()}
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