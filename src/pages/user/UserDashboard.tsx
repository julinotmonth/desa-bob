import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  FilePlus,
  Download,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatTanggal, formatTanggalRelatif } from '../../utils';
import { mockNotifications } from '../../services/mockData';

const UserDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getPermohonanByUser } = usePermohonanStore();

  // Get permohonan untuk user ini dari global store
  const userPermohonan = user ? getPermohonanByUser(user.id) : [];
  const permohonanAktif = userPermohonan.filter((p) => !['selesai', 'ditolak'].includes(p.status));
  const permohonanSelesai = userPermohonan.filter((p) => p.status === 'selesai');

  const stats = [
    {
      label: 'Total Permohonan',
      value: userPermohonan.length,
      icon: FileText,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Sedang Diproses',
      value: permohonanAktif.length,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Selesai',
      value: permohonanSelesai.length,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
  ];

  const quickLinks = [
    { label: 'Surat Domisili', href: '/user/pengajuan?layanan=1', icon: '🏠' },
    { label: 'Surat Usaha', href: '/user/pengajuan?layanan=2', icon: '💼' },
    { label: 'Pengantar KTP', href: '/user/pengajuan?layanan=6', icon: '🪪' },
    { label: 'Pengantar KK', href: '/user/pengajuan?layanan=7', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Selamat Datang, {user?.nama?.split(' ')[0]}! 👋
                </h1>
                <p className="text-primary-100">
                  Kelola permohonan layanan kependudukan Anda dengan mudah.
                </p>
              </div>
              <Link to="/user/pengajuan">
                <Button
                  className="bg-white text-primary-600 hover:bg-gray-100"
                  leftIcon={<FilePlus className="h-5 w-5" />}
                >
                  Pengajuan Baru
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Links & Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Akses Cepat</h2>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="text-xs text-gray-600 text-center">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Permohonan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Permohonan Terbaru</h2>
              <Link to="/user/riwayat" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {userPermohonan.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to={`/user/riwayat/${item.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.layananNama}</p>
                      <p className="text-xs text-gray-500">{item.noRegistrasi}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={item.status} size="sm" />
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTanggalRelatif(item.updatedAt)}
                    </p>
                  </div>
                </Link>
              ))}
              {userPermohonan.length === 0 && (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada permohonan</p>
                  <Link to="/user/pengajuan">
                    <Button variant="outline" size="sm" className="mt-3">
                      Buat Permohonan
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Notifications & Documents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Notifikasi</h2>
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                {mockNotifications.filter((n) => !n.read).length} baru
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {mockNotifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 ${!notif.read ? 'bg-primary-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notif.type === 'success'
                          ? 'bg-green-500'
                          : notif.type === 'info'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      <p className="text-xs text-gray-500">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTanggalRelatif(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Documents Ready */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Dokumen Siap Diunduh</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {permohonanSelesai.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.layananNama}</p>
                      <p className="text-xs text-gray-500">
                        Selesai {formatTanggal(item.updatedAt, 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                    Download
                  </Button>
                </div>
              ))}
              {permohonanSelesai.length === 0 && (
                <div className="p-8 text-center">
                  <Download className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Belum ada dokumen yang siap diunduh</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;