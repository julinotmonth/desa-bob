import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  FileText,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  Image,
  Calendar,
  User,
  Tag,
} from 'lucide-react';
import { Button, Card, Modal, Badge } from '../../components/ui';
import Input, { Textarea, Select } from '../../components/ui/Input';
import { mockBerita } from '../../services/mockData';
import { formatTanggal } from '../../utils';
import { Berita } from '../../types';

const beritaSchema = z.object({
  judul: z.string().min(10, 'Judul minimal 10 karakter'),
  kategori: z.string().min(1, 'Pilih kategori'),
  ringkasan: z.string().min(20, 'Ringkasan minimal 20 karakter'),
  konten: z.string().min(50, 'Konten minimal 50 karakter'),
  gambar: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type BeritaFormData = z.infer<typeof beritaSchema>;

const kategoriOptions = [
  { value: 'pengumuman', label: 'Pengumuman' },
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'informasi', label: 'Informasi' },
  { value: 'pembangunan', label: 'Pembangunan' },
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

// List Berita Admin
export const AdminBeritaPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; berita: Berita | null }>({
    open: false,
    berita: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredBerita = mockBerita.filter((b) => {
    const matchSearch = b.judul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = !filterKategori || b.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Berita berhasil dihapus');
    setDeleteModal({ open: false, berita: null });
    setIsDeleting(false);
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
          <input
            type="text"
            placeholder="Cari judul berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Semua Kategori</option>
          {kategoriOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
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
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate max-w-xs">{item.judul}</p>
                          <p className="text-xs text-gray-500">Oleh: {item.penulis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.kategori === 'pengumuman' ? 'warning' : item.kategori === 'kegiatan' ? 'info' : 'default'}>
                        {item.kategori}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-500">{formatTanggal(item.createdAt, 'dd MMM yyyy')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === 'published' ? 'success' : 'gray'}>
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => window.open(`/berita/${item.slug}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/berita/edit/${item.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteModal({ open: true, berita: item })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
      <Modal open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })} title="Hapus Berita" size="sm">
        <p className="text-gray-500 mb-4">Apakah Anda yakin ingin menghapus berita "<strong>{deleteModal.berita?.judul}</strong>"? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, berita: null })} className="flex-1">Batal</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="flex-1">Hapus</Button>
        </div>
      </Modal>
    </div>
  );
};

// Form Tambah/Edit Berita
export const AdminBeritaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const existingBerita = isEdit ? mockBerita.find((b) => b.id === id) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BeritaFormData>({
    resolver: zodResolver(beritaSchema),
    defaultValues: existingBerita
      ? {
          judul: existingBerita.judul,
          kategori: existingBerita.kategori,
          ringkasan: existingBerita.ringkasan,
          konten: existingBerita.konten,
          gambar: existingBerita.thumbnail,
          status: existingBerita.status as 'draft' | 'published',
        }
      : {
          status: 'draft',
        },
  });

  const onSubmit = async (data: BeritaFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Berita data:', data);
    toast.success(isEdit ? 'Berita berhasil diupdate' : 'Berita berhasil ditambahkan');
    navigate('/admin/berita');
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <Input
              label="Judul Berita"
              placeholder="Masukkan judul berita"
              error={errors.judul?.message}
              {...register('judul')}
            />

            <div className="grid sm:grid-cols-2 gap-6">
              <Select
                label="Kategori"
                options={kategoriOptions}
                error={errors.kategori?.message}
                {...register('kategori')}
              />
              <Select
                label="Status"
                options={statusOptions}
                error={errors.status?.message}
                {...register('status')}
              />
            </div>

            <Input
              label="URL Gambar"
              placeholder="https://example.com/gambar.jpg"
              error={errors.gambar?.message}
              helperText="Masukkan URL gambar untuk thumbnail berita"
              {...register('gambar')}
            />

            <Textarea
              label="Ringkasan"
              placeholder="Tulis ringkasan singkat berita..."
              rows={3}
              error={errors.ringkasan?.message}
              {...register('ringkasan')}
            />

            <Textarea
              label="Konten"
              placeholder="Tulis konten berita lengkap..."
              rows={10}
              error={errors.konten?.message}
              {...register('konten')}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/berita')}>
                Batal
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {isEdit ? 'Update Berita' : 'Simpan Berita'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminBeritaPage;