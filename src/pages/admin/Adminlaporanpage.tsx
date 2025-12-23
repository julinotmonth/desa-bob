import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Button, Card, Badge } from '../../components/ui';
import { permohonanApi, adminUserApi } from '../../services/api';
import { formatTanggal } from '../../utils';

interface PermohonanData {
  id: string;
  noRegistrasi: string;
  layanan: { id: number; nama: string; slug?: string } | null;
  pemohon: {
    userId: string;
    nama: string;
    nik: string;
    email: string;
    noHp: string;
    alamat: string;
  } | null;
  keperluan: string;
  status: string;
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

interface StatsData {
  total: number;
  diajukan: number;
  diverifikasi: number;
  diproses: number;
  selesai: number;
  ditolak: number;
}

interface UserStats {
  totalUsers: number;
  totalAdmin: number;
  totalActive: number;
  totalInactive: number;
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];
const STATUS_COLORS: Record<string, string> = {
  diajukan: '#3b82f6',
  diverifikasi: '#8b5cf6',
  diproses: '#f59e0b',
  selesai: '#22c55e',
  ditolak: '#ef4444',
};

const AdminLaporanPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [permohonanList, setPermohonanList] = useState<PermohonanData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    diajukan: 0,
    diverifikasi: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  });
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    totalAdmin: 0,
    totalActive: 0,
    totalInactive: 0,
  });

  // Fetch data from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all permohonan
      const permohonanRes = await permohonanApi.getAll({ limit: 1000 });
      if (permohonanRes.data.success) {
        setPermohonanList(permohonanRes.data.data);
        
        // Calculate stats
        const data = permohonanRes.data.data;
        setStats({
          total: data.length,
          diajukan: data.filter((p: PermohonanData) => p.status === 'diajukan').length,
          diverifikasi: data.filter((p: PermohonanData) => p.status === 'diverifikasi').length,
          diproses: data.filter((p: PermohonanData) => p.status === 'diproses').length,
          selesai: data.filter((p: PermohonanData) => p.status === 'selesai').length,
          ditolak: data.filter((p: PermohonanData) => p.status === 'ditolak').length,
        });
      }

      // Fetch user stats
      const userRes = await adminUserApi.getStats();
      if (userRes.data.success) {
        setUserStats(userRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data laporan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate derived data
  const completionRate = stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;
  const rejectionRate = stats.total > 0 ? Math.round((stats.ditolak / stats.total) * 100) : 0;
  const inProgressCount = stats.diajukan + stats.diverifikasi + stats.diproses;

  // Pie chart data for status distribution
  const statusDistribution = [
    { name: 'Diajukan', value: stats.diajukan, color: STATUS_COLORS.diajukan },
    { name: 'Diverifikasi', value: stats.diverifikasi, color: STATUS_COLORS.diverifikasi },
    { name: 'Diproses', value: stats.diproses, color: STATUS_COLORS.diproses },
    { name: 'Selesai', value: stats.selesai, color: STATUS_COLORS.selesai },
    { name: 'Ditolak', value: stats.ditolak, color: STATUS_COLORS.ditolak },
  ].filter(item => item.value > 0);

  // Group permohonan by layanan
  const layananStats = permohonanList.reduce((acc, p) => {
    const layananName = p.layanan?.nama || 'Lainnya';
    if (!acc[layananName]) {
      acc[layananName] = { total: 0, selesai: 0, ditolak: 0, proses: 0 };
    }
    acc[layananName].total++;
    if (p.status === 'selesai') acc[layananName].selesai++;
    else if (p.status === 'ditolak') acc[layananName].ditolak++;
    else acc[layananName].proses++;
    return acc;
  }, {} as Record<string, { total: number; selesai: number; ditolak: number; proses: number }>);

  const layananChartData = Object.entries(layananStats)
    .map(([name, data]) => ({
      name: name.replace('Surat Keterangan ', 'SK ').replace('Surat Pengantar ', 'SP '),
      fullName: name,
      ...data,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Group permohonan by month
  const monthlyStats = permohonanList.reduce((acc, p) => {
    const date = new Date(p.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = { name: monthName, diajukan: 0, selesai: 0, ditolak: 0 };
    }
    acc[monthKey].diajukan++;
    if (p.status === 'selesai') acc[monthKey].selesai++;
    if (p.status === 'ditolak') acc[monthKey].ditolak++;
    return acc;
  }, {} as Record<string, { name: string; diajukan: number; selesai: number; ditolak: number }>);

  const monthlyChartData = Object.entries(monthlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, data]) => data);

  // Group by day of week
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const weeklyStats = permohonanList.reduce((acc, p) => {
    const day = new Date(p.createdAt).getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const weeklyChartData = dayNames.map((name, index) => ({
    name,
    value: weeklyStats[index] || 0,
  }));
  // Reorder to start from Monday
  const reorderedWeekly = [...weeklyChartData.slice(1), weeklyChartData[0]];

  // Export to CSV
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const now = new Date();
      const dateStr = formatTanggal(now.toISOString(), 'dd-MM-yyyy');
      
      let csvContent = 'LAPORAN STATISTIK PERMOHONAN LAYANAN DESA LEGOK\n';
      csvContent += `Tanggal Export: ${formatTanggal(now.toISOString())}\n\n`;
      
      // Summary
      csvContent += 'RINGKASAN STATISTIK\n';
      csvContent += `Total Permohonan,${stats.total}\n`;
      csvContent += `Tingkat Penyelesaian,${completionRate}%\n`;
      csvContent += `Tingkat Penolakan,${rejectionRate}%\n`;
      csvContent += `Total Pengguna,${userStats.totalUsers}\n\n`;
      
      // Status breakdown
      csvContent += 'DISTRIBUSI STATUS\n';
      csvContent += `Diajukan,${stats.diajukan}\n`;
      csvContent += `Diverifikasi,${stats.diverifikasi}\n`;
      csvContent += `Diproses,${stats.diproses}\n`;
      csvContent += `Selesai,${stats.selesai}\n`;
      csvContent += `Ditolak,${stats.ditolak}\n\n`;
      
      // Per layanan
      csvContent += 'DETAIL PER LAYANAN\n';
      csvContent += 'Layanan,Total,Selesai,Dalam Proses,Ditolak,Tingkat Selesai\n';
      
      Object.entries(layananStats).forEach(([name, data]) => {
        const rate = data.total > 0 ? Math.round((data.selesai / data.total) * 100) : 0;
        csvContent += `"${name}",${data.total},${data.selesai},${data.proses},${data.ditolak},${rate}%\n`;
      });
      
      csvContent += '\nDETAIL PERMOHONAN\n';
      csvContent += 'No Registrasi,Layanan,Pemohon,Status,Tanggal Pengajuan\n';
      
      permohonanList.forEach(p => {
        const layananName = p.layanan?.nama || '-';
        const pemohonName = p.pemohon?.nama || '-';
        csvContent += `${p.noRegistrasi || '-'},"${layananName}","${pemohonName}",${p.status},${formatTanggal(p.createdAt)}\n`;
      });
      
      // Download
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_SIPEDES_${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Laporan berhasil diexport');
    } catch (error) {
      toast.error('Gagal mengexport laporan');
    } finally {
      setIsExporting(false);
    }
  };

  // Stats cards data
  const statsCards = [
    {
      label: 'Total Permohonan',
      value: stats.total,
      icon: FileText,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Tingkat Penyelesaian',
      value: `${completionRate}%`,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Dalam Proses',
      value: inProgressCount,
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Total Pengguna',
      value: userStats.totalUsers,
      icon: Users,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-500">Memuat data laporan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Laporan & Statistik</h1>
          <p className="text-gray-500">Analisis data permohonan layanan desa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={fetchData} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button onClick={handleExportCSV} isLoading={isExporting} leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Tren Permohonan Bulanan</h2>
              <p className="text-sm text-gray-500">Perbandingan diajukan, selesai, dan ditolak</p>
            </div>
            <div className="p-5">
              {monthlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="diajukan" stroke="#3b82f6" fill="#93c5fd" name="Diajukan" />
                    <Area type="monotone" dataKey="selesai" stroke="#22c55e" fill="#86efac" name="Selesai" />
                    <Area type="monotone" dataKey="ditolak" stroke="#ef4444" fill="#fca5a5" name="Ditolak" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Belum ada data
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Distribusi Status Permohonan</h2>
              <p className="text-sm text-gray-500">Berdasarkan status saat ini</p>
            </div>
            <div className="p-5">
              {statusDistribution.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {statusDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Belum ada data
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Per Layanan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Performa per Layanan</h2>
              <p className="text-sm text-gray-500">Total permohonan dan tingkat penyelesaian</p>
            </div>
            <div className="p-5">
              {layananChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={layananChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#93c5fd" name="Total" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="selesai" fill="#22c55e" name="Selesai" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Belum ada data
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Aktivitas per Hari</h2>
              <p className="text-sm text-gray-500">Distribusi permohonan berdasarkan hari</p>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reorderedWeekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} name="Permohonan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Summary Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Ringkasan per Layanan</h2>
            <p className="text-sm text-gray-500">Detail performa setiap jenis layanan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Layanan</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Selesai</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Dalam Proses</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Ditolak</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Tingkat Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {layananChartData.length > 0 ? (
                  layananChartData.map((item) => {
                    const rate = item.total > 0 ? Math.round((item.selesai / item.total) * 100) : 0;
                    return (
                      <tr key={item.fullName} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{item.fullName}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="text-sm font-semibold text-gray-900">{item.total}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="text-sm text-green-600 font-medium">{item.selesai}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="text-sm text-yellow-600 font-medium">{item.proses}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="text-sm text-red-600 font-medium">{item.ditolak}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      Belum ada data permohonan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Recent Permohonan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Permohonan Terbaru</h2>
            <p className="text-sm text-gray-500">10 permohonan terakhir</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No. Registrasi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Layanan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pemohon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permohonanList.slice(0, 10).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-medium text-primary-600">{item.noRegistrasi || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{item.layanan?.nama || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{item.pemohon?.nama || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          item.status === 'selesai' ? 'success' :
                          item.status === 'ditolak' ? 'error' :
                          item.status === 'diproses' ? 'warning' :
                          'info'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-500">{formatTanggal(item.createdAt, 'dd MMM yyyy')}</p>
                    </td>
                  </tr>
                ))}
                {permohonanList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      Belum ada data permohonan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLaporanPage;