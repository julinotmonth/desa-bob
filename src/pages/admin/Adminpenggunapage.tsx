import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Users,
  Edit,
  Trash2,
  Eye,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button, Card, Modal, Badge } from '../../components/ui';
import Input, { Select } from '../../components/ui/Input';
import { formatTanggal } from '../../utils';

// Mock Users Data
interface MockUser {
  id: string;
  nama: string;
  email: string;
  nik: string;
  noHp: string;
  alamat: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
  status: 'active' | 'inactive';
  totalPermohonan: number;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    nama: 'Ahmad Sudrajat',
    email: 'ahmad@email.com',
    nik: '3507123456789012',
    noHp: '081234567890',
    alamat: 'Dusun Krajan RT 01 RW 02, Desa Legok',
    role: 'user',
    avatar: '',
    createdAt: '2024-01-15T08:00:00Z',
    status: 'active',
    totalPermohonan: 5,
  },
  {
    id: '2',
    nama: 'Siti Aminah',
    email: 'siti@email.com',
    nik: '3507123456789013',
    noHp: '081234567891',
    alamat: 'Dusun Krajan RT 02 RW 01, Desa Legok',
    role: 'user',
    avatar: '',
    createdAt: '2024-02-20T10:30:00Z',
    status: 'active',
    totalPermohonan: 3,
  },
  {
    id: '3',
    nama: 'Bambang Wijaya',
    email: 'bambang@email.com',
    nik: '3507123456789014',
    noHp: '081234567892',
    alamat: 'Dusun Sumber RT 03 RW 02, Desa Legok',
    role: 'user',
    avatar: '',
    createdAt: '2024-03-10T14:15:00Z',
    status: 'inactive',
    totalPermohonan: 1,
  },
  {
    id: '4',
    nama: 'Dewi Lestari',
    email: 'dewi@email.com',
    nik: '3507123456789015',
    noHp: '081234567893',
    alamat: 'Dusun Sumber RT 01 RW 03, Desa Legok',
    role: 'user',
    avatar: '',
    createdAt: '2024-03-25T09:00:00Z',
    status: 'active',
    totalPermohonan: 8,
  },
  {
    id: '5',
    nama: 'Eko Prasetyo',
    email: 'eko@email.com',
    nik: '3507123456789016',
    noHp: '081234567894',
    alamat: 'Dusun Krajan RT 04 RW 01, Desa Legok',
    role: 'user',
    avatar: '',
    createdAt: '2024-04-05T11:30:00Z',
    status: 'active',
    totalPermohonan: 2,
  },
  {
    id: 'admin1',
    nama: 'Budi Santoso',
    email: 'admin@desalegok.go.id',
    nik: '3507123456789000',
    noHp: '081234567800',
    alamat: 'Kantor Desa Legok',
    role: 'admin',
    avatar: '',
    createdAt: '2023-01-01T00:00:00Z',
    status: 'active',
    totalPermohonan: 0,
  },
];

const roleOptions = [
  { value: '', label: 'Semua Role' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
];

type UserWithStatus = MockUser;

const AdminPenggunaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [detailModal, setDetailModal] = useState<{ open: boolean; user: UserWithStatus | null }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: UserWithStatus | null }>({
    open: false,
    user: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = mockUsers.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nik.includes(searchQuery);
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === 'active').length,
    inactive: mockUsers.filter((u) => u.status === 'inactive').length,
    admin: mockUsers.filter((u) => u.role === 'admin').length,
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Pengguna berhasil dihapus');
    setDeleteModal({ open: false, user: null });
    setIsDeleting(false);
  };

  const handleToggleStatus = async (user: UserWithStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success(`Status pengguna ${user.status === 'active' ? 'dinonaktifkan' : 'diaktifkan'}`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manajemen Pengguna</h1>
        <p className="text-gray-500">Kelola pengguna sistem SIPEDES</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pengguna', value: stats.total, icon: Users, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
          { label: 'Pengguna Aktif', value: stats.active, icon: UserCheck, bgColor: 'bg-green-100', textColor: 'text-green-600' },
          { label: 'Pengguna Nonaktif', value: stats.inactive, icon: UserX, bgColor: 'bg-red-100', textColor: 'text-red-600' },
          { label: 'Administrator', value: stats.admin, icon: Shield, bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau NIK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pengguna</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIK</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Permohonan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Terdaftar</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {user.nama.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.nama}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 font-mono">{user.nik}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'admin' ? 'purple' : 'gray'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                        {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{user.totalPermohonan}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-500">{formatTanggal(user.createdAt, 'dd MMM yyyy')}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setDetailModal({ open: true, user })}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={user.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        {user.role !== 'admin' && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteModal({ open: true, user })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Pengguna</h3>
              <p className="text-gray-500">Tidak ditemukan pengguna yang sesuai dengan filter</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Modal open={detailModal.open} onOpenChange={(open) => setDetailModal({ ...detailModal, open })} title="Detail Pengguna" size="md">
        {detailModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {detailModal.user.nama.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{detailModal.user.nama}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={detailModal.user.role === 'admin' ? 'purple' : 'gray'}>
                    {detailModal.user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  <Badge variant={detailModal.user.status === 'active' ? 'success' : 'error'}>
                    {detailModal.user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">NIK</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">{detailModal.user.nik}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{detailModal.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">No. HP</p>
                  <p className="text-sm font-medium text-gray-900">{detailModal.user.noHp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Alamat</p>
                  <p className="text-sm font-medium text-gray-900">{detailModal.user.alamat}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Terdaftar Sejak</p>
                  <p className="text-sm font-medium text-gray-900">{formatTanggal(detailModal.user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setDetailModal({ open: false, user: null })} className="w-full">
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })} title="Hapus Pengguna" size="sm">
        <p className="text-gray-500 mb-4">Apakah Anda yakin ingin menghapus pengguna "<strong>{deleteModal.user?.nama}</strong>"? Semua data permohonan pengguna ini juga akan dihapus.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal({ open: false, user: null })} className="flex-1">Batal</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="flex-1">Hapus</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPenggunaPage;