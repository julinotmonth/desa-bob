import React, { useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  Search, Plus, FileText, Edit, Trash2, Eye, ChevronLeft, Image,
  Calendar, User, Upload, X, ExternalLink,
} from 'lucide-react';
import { Button, Card, Modal, Badge } from '../../components/ui';
import Input, { Textarea, Select } from '../../components/ui/Input';
import { useBeritaStore } from '../../store';
import { formatTanggal } from '../../utils';
import { Berita } from '../../types';

const kategoriOptions = [
  { value: 'Pengumuman', label: 'Pengumuman' },
  { value: 'Kegiatan', label: 'Kegiatan' },
  { value: 'Kesehatan', label: 'Kesehatan' },
  { value: 'Pembangunan', label: 'Pembangunan' },
  { value: 'Pendidikan', label: 'Pendidikan' },
  { value: 'Sosial', label: 'Sosial' },
];

const generateSlug = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// ===================== LIST PAGE =====================
export const AdminBeritaPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; berita: Berita | null }>({ open: false, berita: null });
  const [previewModal, setPreviewModal] = useState<{ open: boolean; berita: Berita | null }>({ open: false, berita: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const { getAllBerita, deleteBerita } = useBeritaStore();
  const allBerita = getAllBerita();

  const filteredBerita = allBerita.filter((b) => {
    const matchSearch = b.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = !filterKategori || b.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const handleDelete = async () => {
    if (!deleteModal.berita) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    deleteBerita(deleteModal.berita.id);
    toast.success('Berita berhasil dihapus');
    setDeleteModal({ open: false, berita: null });
    setIsDeleting(false);
  };

  const handlePreview = (berita: Berita) => {
    setPreviewModal({ open: true, berita });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manajemen Berita</h1>
          <p className="text-gray-500">Kelola berita dan informasi desa</p>
        </div>
        <Button onClick={() => navigate('/admin/berita/tambah')} leftIcon={<Plus className="h-4 w-4" />}>
          Tambah Berita
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Cari judul berita..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Semua Kategori</option>
          {kategoriOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Berita</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBerita.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.judul} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Image className="h-5 w-5 text-gray-400" /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate max-w-xs">{item.judul}</p>
                          <p className="text-xs text-gray-500">Oleh: {item.penulis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="info">{item.kategori}</Badge></td>
                    <td className="px-4 py-3"><p className="text-sm text-gray-500">{formatTanggal(item.createdAt, 'dd MMM yyyy')}</p></td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === 'published' ? 'success' : 'gray'}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(item)} title="Preview"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/berita/edit/${item.id}`)} title="Edit"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteModal({ open: true, berita: item })} title="Hapus"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBerita.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Berita</h3>
              <p className="text-gray-500 mb-4">Belum ada berita yang ditambahkan</p>
              <Button onClick={() => navigate('/admin/berita/tambah')}>Tambah Berita Pertama</Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete Modal */}
      <Modal open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })} title="Hapus Berita" size="md">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          {deleteModal.berita && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                {deleteModal.berita.thumbnail ? (
                  <img src={deleteModal.berita.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image className="h-5 w-5 text-gray-400" /></div>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{deleteModal.berita.judul}</p>
                <p className="text-sm text-gray-500">{deleteModal.berita.kategori}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, berita: null })} className="flex-1">Batal</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="flex-1">Hapus</Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={previewModal.open} onOpenChange={(open) => setPreviewModal({ ...previewModal, open })} title="Preview Berita" size="full">
        {previewModal.berita && (
          <div className="space-y-4">
            {/* Thumbnail */}
            {previewModal.berita.thumbnail && (
              <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-xl overflow-hidden">
                <img src={previewModal.berita.thumbnail} alt={previewModal.berita.judul} className="w-full h-full object-cover" />
              </div>
            )}
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={previewModal.berita.status === 'published' ? 'success' : 'gray'}>
                {previewModal.berita.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="info">{previewModal.berita.kategori}</Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatTanggal(previewModal.berita.createdAt)}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <User className="h-4 w-4" /> {previewModal.berita.penulis}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900">{previewModal.berita.judul}</h2>
            
            {/* Ringkasan */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Ringkasan:</p>
              <p className="text-gray-700">{previewModal.berita.ringkasan}</p>
            </div>

            {/* Konten */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Konten:</p>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {previewModal.berita.konten}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate(`/admin/berita/edit/${previewModal.berita?.id}`)} leftIcon={<Edit className="h-4 w-4" />}>
                Edit Berita
              </Button>
              {previewModal.berita.status === 'published' && (
                <Link to={`/berita/${previewModal.berita.slug}`} target="_blank">
                  <Button variant="outline" leftIcon={<ExternalLink className="h-4 w-4" />}>
                    Lihat di Website
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ===================== FORM PAGE (Add/Edit) =====================
export const AdminBeritaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { getBeritaById, addBerita, updateBerita } = useBeritaStore();
  const existingBerita = isEdit && id ? getBeritaById(id) : null;

  const [formData, setFormData] = useState({
    judul: existingBerita?.judul || '',
    kategori: existingBerita?.kategori || '',
    ringkasan: existingBerita?.ringkasan || '',
    konten: existingBerita?.konten || '',
    thumbnail: existingBerita?.thumbnail || '',
    status: existingBerita?.status || 'draft',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const preview = URL.createObjectURL(file);
      setUploadedImage({ file, preview });
      setFormData(prev => ({ ...prev, thumbnail: preview }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  const removeImage = () => {
    if (uploadedImage) URL.revokeObjectURL(uploadedImage.preview);
    setUploadedImage(null);
    setFormData(prev => ({ ...prev, thumbnail: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.judul || formData.judul.length < 10) newErrors.judul = 'Judul minimal 10 karakter';
    if (!formData.kategori) newErrors.kategori = 'Pilih kategori';
    if (!formData.ringkasan || formData.ringkasan.length < 20) newErrors.ringkasan = 'Ringkasan minimal 20 karakter';
    if (!formData.konten || formData.konten.length < 50) newErrors.konten = 'Konten minimal 50 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const now = new Date().toISOString();
    const slug = generateSlug(formData.judul);

    if (isEdit && id) {
      updateBerita(id, {
        ...formData,
        slug,
        status: formData.status as 'draft' | 'published',
        publishedAt: formData.status === 'published' ? now : undefined,
      });
      toast.success('Berita berhasil diupdate');
    } else {
      const newBerita: Berita = {
        id: `berita-${Date.now()}`,
        judul: formData.judul,
        slug,
        ringkasan: formData.ringkasan,
        konten: formData.konten,
        thumbnail: formData.thumbnail,
        kategori: formData.kategori,
        status: formData.status as 'draft' | 'published',
        penulis: 'Admin Desa',
        createdAt: now,
        updatedAt: now,
        publishedAt: formData.status === 'published' ? now : undefined,
      };
      addBerita(newBerita);
      toast.success('Berita berhasil ditambahkan');
    }

    navigate('/admin/berita');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/admin/berita" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="h-4 w-4" />Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita *</label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Masukkan judul berita"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.judul ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
            </div>

            {/* Kategori & Status */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.kategori ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">Pilih Kategori</option>
                  {kategoriOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
                {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Thumbnail</label>
              {!formData.thumbnail ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">{isDragActive ? 'Lepaskan gambar...' : 'Drag & drop atau klik untuk upload'}</p>
                  <p className="text-sm text-gray-400">JPG, PNG, WebP (Maks. 5MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded-xl" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">Atau masukkan URL gambar:</p>
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/gambar.jpg"
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            {/* Ringkasan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan *</label>
              <textarea
                value={formData.ringkasan}
                onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                placeholder="Tulis ringkasan singkat berita..."
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.ringkasan ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.ringkasan && <p className="text-red-500 text-sm mt-1">{errors.ringkasan}</p>}
            </div>

            {/* Konten */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konten *</label>
              <textarea
                value={formData.konten}
                onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                placeholder="Tulis konten berita lengkap..."
                rows={10}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.konten ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {errors.konten && <p className="text-red-500 text-sm mt-1">{errors.konten}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/berita')}>Batal</Button>
              <Button type="submit" isLoading={isSubmitting}>{isEdit ? 'Update Berita' : 'Simpan Berita'}</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminBeritaPage;