import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  Users,
  Trash2,
  Eye,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button, Card, Modal, Badge } from '../../components/ui';
import { formatTanggal } from '../../utils';
import { adminUserApi } from '../../services/api';

interface UserData {
  id: string;
  nama: string;
  email: string;
  nik: string;
  noHp: string;
  alamat: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  avatar: string;
  createdAt: string;
  totalPermohonan: number;
}

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

const AdminPenggunaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admin: 0,
  });
  
  const [detailModal, setDetailModal] = useState<{ open: boolean; user: UserData | null }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: UserData | null }>({
    open: false,
    user: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminUserApi.getAll({
        role: filterRole || undefined,
        status: filterStatus || undefined,
        search: searchQuery || undefined,
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
        
        // Calculate stats from data
        const allUsers = response.data.data;
        setStats({
          total: allUsers.length,
          active: allUsers.filter((u: UserData) => u.status === 'active' || !u.status).length,
          inactive: allUsers.filter((u: UserData) => u.status === 'inactive').length,
          admin: allUsers.filter((u: UserData) => u.role === 'admin').length,
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminUserApi.getStats();
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          total: data.totalUsers,
          active: data.totalActive,
          inactive: data.totalInactive,
          admin: data.totalAdmin,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filterRole, filterStatus]);

  // Filter locally for search (real-time)
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nik.includes(searchQuery);
    return matchSearch;
  });

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setIsDeleting(true);
    
    try {
      await adminUserApi.delete(deleteModal.user.id);
      toast.success('Pengguna berhasil dihapus');
      fetchUsers();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus pengguna');
    } finally {
      setDeleteModal({ open: false, user: null });
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    setIsToggling(user.id);
    
    try {
      const response = await adminUserApi.toggleStatus(user.id);
      if (response.data.success) {
        toast.success(response.data.message);
        // Update local state
        setUsers(prev => prev.map(u => 
          u.id === user.id 
            ? { ...u, status: response.data.data.status }
            : u
        ));
        fetchStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah status pengguna');
    } finally {
      setIsToggling(null);
    }
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
                  {isLoading ? (
                    <div className="h-6 w-8 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  )}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
                      <p className="text-gray-500">Memuat data pengguna...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {user.nama.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
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
                        <Badge variant={user.status === 'inactive' ? 'error' : 'success'}>
                          {user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{user.totalPermohonan || 0}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-500">{formatTanggal(user.createdAt, 'dd MMM yyyy')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setDetailModal({ open: true, user })} title="Detail">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={user.status === 'inactive' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}
                            onClick={() => handleToggleStatus(user)}
                            disabled={isToggling === user.id}
                            title={user.status === 'inactive' ? 'Aktifkan' : 'Nonaktifkan'}
                          >
                            {isToggling === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : user.status === 'inactive' ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </Button>
                          {user.role !== 'admin' && (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteModal({ open: true, user })} title="Hapus">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Modal open={detailModal.open} onOpenChange={(open) => setDetailModal({ ...detailModal, open })} title="Detail Pengguna" size="md">
        {detailModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">
                  {detailModal.user.nama.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{detailModal.user.nama}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={detailModal.user.role === 'admin' ? 'purple' : 'gray'}>
                    {detailModal.user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  <Badge variant={detailModal.user.status === 'inactive' ? 'error' : 'success'}>
                    {detailModal.user.status === 'inactive' ? 'Nonaktif' : 'Aktif'}
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
                  <p className="text-sm font-medium text-gray-900">{detailModal.user.noHp || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Alamat</p>
                  <p className="text-sm font-medium text-gray-900">{detailModal.user.alamat || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Permohonan</p>
                  <p className="text-sm font-medium text-gray-900">{detailModal.user.totalPermohonan || 0} permohonan</p>
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
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">
              Apakah Anda yakin ingin menghapus pengguna "<strong>{deleteModal.user?.nama}</strong>"? 
              Semua data permohonan pengguna ini juga akan dihapus.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, user: null })} className="flex-1">
              Batal
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="flex-1">
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPenggunaPage;