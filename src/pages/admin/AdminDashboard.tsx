import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Bell,
  RefreshCw,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Button, Card } from '../../components/ui';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store';
import { permohonanApi, notificationsApi } from '../../services/api';
import { mockChartData } from '../../services/mockData';
import { formatTanggalRelatif } from '../../utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [permohonanList, setPermohonanList] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    diajukan: 0,
    diverifikasi: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await permohonanApi.getAll({});
        if (response.data.success) {
          const data = response.data.data || [];
          setPermohonanList(data);
          
          // Calculate stats from data
          const calculatedStats = {
            total: data.length,
            diajukan: data.filter((p: any) => p.status === 'diajukan').length,
            diverifikasi: data.filter((p: any) => p.status === 'diverifikasi').length,
            diproses: data.filter((p: any) => p.status === 'diproses').length,
            selesai: data.filter((p: any) => p.status === 'selesai').length,
            ditolak: data.filter((p: any) => p.status === 'ditolak').length,
          };
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getAll({ limit: 10 });
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const dashboardStats = [
    { label: 'Permohonan Baru', value: stats.diajukan, icon: FileText, bgColor: 'bg-blue-100', textColor: 'text-blue-600', change: '+12%' },
    { label: 'Sedang Diproses', value: stats.diproses + stats.diverifikasi, icon: Clock, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600', change: '+5%' },
    { label: 'Selesai', value: stats.selesai, icon: CheckCircle, bgColor: 'bg-green-100', textColor: 'text-green-600', change: '+23%' },
    { label: 'Total Permohonan', value: stats.total, icon: Users, bgColor: 'bg-purple-100', textColor: 'text-purple-600', change: '+8%' },
  ];

  // Sort by newest first and take 5
  const recentPermohonan = [...permohonanList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Dynamic chart data based on actual permohonan
  const statusDistribusi = [
    { name: 'Selesai', value: stats.selesai, color: '#22c55e' },
    { name: 'Diproses', value: stats.diproses, color: '#8b5cf6' },
    { name: 'Diverifikasi', value: stats.diverifikasi, color: '#3b82f6' },
    { name: 'Diajukan', value: stats.diajukan, color: '#f59e0b' },
    { name: 'Ditolak', value: stats.ditolak, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Admin</h1>
        <p className="text-gray-500">Selamat datang kembali, {user?.nama?.split(' ')[0]}!</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />{stat.change}
                  </span>
                </div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                )}
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Tren Permohonan</h2>
              <p className="text-sm text-gray-500">6 bulan terakhir</p>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockChartData.permohonanPerBulan}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Distribusi Status</h2>
            </div>
            <div className="p-5">
              {isLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : statusDistribusi.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={statusDistribusi} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {statusDistribusi.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {statusDistribusi.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  Belum ada data permohonan
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent & Notifications */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
          <Card>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Permohonan Terbaru</h2>
                <p className="text-sm text-gray-500">Permohonan yang perlu ditindak</p>
              </div>
              <Link to="/admin/permohonan">
                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>Lihat Semua</Button>
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
                </div>
              ) : recentPermohonan.length > 0 ? (
                recentPermohonan.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.layanan?.nama || item.layananNama}</p>
                        <p className="text-xs text-gray-500">{item.pemohon?.nama || item.userName || item.namaPemohon} • {item.noRegistrasi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} size="sm" />
                      <Link to={`/admin/permohonan/${item.id}`}>
                        <Button variant="outline" size="sm">Detail</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p>Belum ada permohonan</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Notifikasi</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    {unreadCount} baru
                  </span>
                )}
                <button 
                  onClick={fetchNotifications}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    to={notif.link || '#'}
                    className={`block p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-primary-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notif.type === 'success' ? 'bg-green-500' : 
                        notif.type === 'info' ? 'bg-blue-500' : 
                        notif.type === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTanggalRelatif(notif.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p>Belum ada notifikasi</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;