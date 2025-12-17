import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/ui';
import { useAuthStore } from '../../store';
import { formatTanggal } from '../../utils';

const ProfilPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    noHp: user?.noHp || '',
    alamat: user?.alamat || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!formData.nama.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    
    updateUser({
      nama: formData.nama,
      email: formData.email,
      noHp: formData.noHp,
      alamat: formData.alamat,
    });
    
    toast.success('Profil berhasil diperbarui');
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Masukkan password saat ini');
      return;
    }
    if (!passwordData.newPassword) {
      toast.error('Masukkan password baru');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    
    toast.success('Password berhasil diubah');
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      nama: user?.nama || '',
      email: user?.email || '',
      noHp: user?.noHp || '',
      alamat: user?.alamat || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">User tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profil Saya</h1>
        <p className="text-gray-500">Kelola informasi profil dan keamanan akun Anda</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          {/* Cover & Avatar */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-2xl" />
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                  <span className="text-4xl font-bold text-primary-600">
                    {user.nama.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit className="h-4 w-4" />}
                  className="bg-white/90 hover:bg-white"
                >
                  Edit Profil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancelEdit}
                    className="bg-white/90 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveProfile}
                    isLoading={isSaving}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Simpan
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{user.nama}</h2>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4" />
                {user.role === 'admin' ? 'Administrator' : 'Pengguna'}
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="h-3 w-3" /> Terverifikasi
                </span>
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="h-4 w-4 inline mr-2" />
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-900">{user.nama}</p>
                )}
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CreditCard className="h-4 w-4 inline mr-2" />
                  NIK
                </label>
                <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-900">{user.nik}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-900">{user.email}</p>
                )}
              </div>

              {/* Telepon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-2" />
                  No. Telepon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor telepon"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-900">
                    {user.noHp || <span className="text-gray-400">Belum diisi</span>}
                  </p>
                )}
              </div>

              {/* Alamat - Full Width */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Alamat
                </label>
                {isEditing ? (
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Masukkan alamat lengkap"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                ) : (
                  <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-900">
                    {user.alamat || <span className="text-gray-400">Belum diisi</span>}
                  </p>
                )}
              </div>

              {/* Tanggal Daftar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Tanggal Daftar
                </label>
                <p className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-900">
                  {user.createdAt ? formatTanggal(user.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Keamanan Akun
                </h3>
                <p className="text-sm text-gray-500 mt-1">Kelola password dan keamanan akun</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsChangingPassword(true)}
                leftIcon={<Lock className="h-4 w-4" />}
              >
                Ubah Password
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Email Terverifikasi</p>
                    <p className="text-sm text-green-600">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Akun Aktif</p>
                    <p className="text-sm text-blue-600">Status: Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Change Password Modal */}
      <Modal
        open={isChangingPassword}
        onOpenChange={setIsChangingPassword}
        title="Ubah Password"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              Pastikan password baru Anda minimal 6 karakter dan mudah diingat.
            </p>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Masukkan password saat ini"
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Masukkan password baru"
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Ulangi password baru"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsChangingPassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }} 
              className="flex-1"
            >
              Batal
            </Button>
            <Button 
              onClick={handleChangePassword} 
              isLoading={isSaving}
              className="flex-1"
            >
              Ubah Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilPage;