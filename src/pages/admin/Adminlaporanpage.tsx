import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  FileSpreadsheet,
  FileDown,
  Printer,
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
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Button, Card } from '../../components/ui';
import { Select } from '../../components/ui/Input';
import { mockChartData, mockDashboardStats } from '../../services/mockData';
import { LAYANAN_LIST } from '../../constants';

const periodeOptions = [
  { value: '7d', label: '7 Hari Terakhir' },
  { value: '30d', label: '30 Hari Terakhir' },
  { value: '3m', label: '3 Bulan Terakhir' },
  { value: '6m', label: '6 Bulan Terakhir' },
  { value: '1y', label: '1 Tahun Terakhir' },
  { value: 'custom', label: 'Kustom' },
];

const laporanTypes = [
  { id: 'permohonan', label: 'Laporan Permohonan', icon: FileText },
  { id: 'layanan', label: 'Laporan per Layanan', icon: FileSpreadsheet },
  { id: 'pengguna', label: 'Laporan Pengguna', icon: Users },
];

// Extended mock data for reports
const monthlyTrendData = [
  { name: 'Jan', diajukan: 45, selesai: 38, ditolak: 5 },
  { name: 'Feb', diajukan: 52, selesai: 45, ditolak: 4 },
  { name: 'Mar', diajukan: 61, selesai: 55, ditolak: 3 },
  { name: 'Apr', diajukan: 58, selesai: 50, ditolak: 6 },
  { name: 'Mei', diajukan: 72, selesai: 65, ditolak: 4 },
  { name: 'Jun', diajukan: 68, selesai: 60, ditolak: 5 },
];

const layananPerformanceData = LAYANAN_LIST.slice(0, 6).map((l, i) => ({
  name: l.nama.replace('Surat Keterangan ', 'SK ').replace('Surat Pengantar ', 'SP '),
  total: Math.floor(Math.random() * 100) + 20,
  selesai: Math.floor(Math.random() * 80) + 15,
  avgDays: Math.floor(Math.random() * 3) + 1,
}));

const weeklyData = [
  { name: 'Sen', value: 12 },
  { name: 'Sel', value: 19 },
  { name: 'Rab', value: 15 },
  { name: 'Kam', value: 22 },
  { name: 'Jum', value: 18 },
  { name: 'Sab', value: 8 },
  { name: 'Min', value: 0 },
];

const AdminLaporanPage: React.FC = () => {
  const [periode, setPeriode] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('permohonan');
  const [isExporting, setIsExporting] = useState(false);

  const stats = [
    {
      label: 'Total Permohonan',
      value: 356,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Tingkat Penyelesaian',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'Rata-rata Waktu Proses',
      value: '2.3 hari',
      change: '-0.5',
      trend: 'down',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Tingkat Penolakan',
      value: '3%',
      change: '-1%',
      trend: 'down',
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
  ];

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(`Laporan berhasil diexport ke ${format.toUpperCase()}`);
    setIsExporting(false);
  };

  const handlePrint = () => {
    window.print();
    toast.success('Mencetak laporan...');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Laporan & Statistik</h1>
          <p className="text-gray-500">Analisis performa layanan desa</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {periodeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button variant="outline" leftIcon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
            Print
          </Button>
          <Button variant="outline" leftIcon={<FileSpreadsheet className="h-4 w-4" />} onClick={() => handleExport('excel')} isLoading={isExporting}>
            Excel
          </Button>
          <Button leftIcon={<FileDown className="h-4 w-4" />} onClick={() => handleExport('pdf')} isLoading={isExporting}>
            PDF
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                    stat.trend === 'up' 
                      ? (stat.label.includes('Penolakan') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')
                      : (stat.label.includes('Penolakan') || stat.label.includes('Waktu') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trend Permohonan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Tren Permohonan Bulanan</h2>
              <p className="text-sm text-gray-500">Perbandingan diajukan, selesai, dan ditolak</p>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="diajukan" stackId="1" stroke="#3b82f6" fill="#93c5fd" name="Diajukan" />
                  <Area type="monotone" dataKey="selesai" stackId="2" stroke="#22c55e" fill="#86efac" name="Selesai" />
                  <Area type="monotone" dataKey="ditolak" stackId="3" stroke="#ef4444" fill="#fca5a5" name="Ditolak" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Distribusi Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Distribusi Status Permohonan</h2>
              <p className="text-sm text-gray-500">Berdasarkan status saat ini</p>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockChartData.statusDistribusi}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mockChartData.statusDistribusi.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {mockChartData.statusDistribusi.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performa per Layanan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Performa per Layanan</h2>
              <p className="text-sm text-gray-500">Total permohonan dan tingkat penyelesaian</p>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={layananPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={10} width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#93c5fd" name="Total" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="selesai" fill="#22c55e" name="Selesai" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Aktivitas Mingguan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Aktivitas Mingguan</h2>
              <p className="text-sm text-gray-500">Distribusi permohonan per hari</p>
            </div>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
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
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Rata-rata Proses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {LAYANAN_LIST.slice(0, 8).map((layanan) => {
                  const total = Math.floor(Math.random() * 50) + 10;
                  const selesai = Math.floor(total * 0.7);
                  const proses = Math.floor(total * 0.2);
                  const ditolak = total - selesai - proses;
                  const rate = ((selesai / total) * 100).toFixed(0);
                  const avgDays = (Math.random() * 2 + 1).toFixed(1);

                  return (
                    <tr key={layanan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{layanan.nama}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm font-semibold text-gray-900">{total}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm text-green-600 font-medium">{selesai}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm text-yellow-600 font-medium">{proses}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm text-red-600 font-medium">{ditolak}</p>
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
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm text-gray-600">{avgDays} hari</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLaporanPage;