import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import Input from '../../components/ui/Input';
import { APP_NAME } from '../../constants';
import { useAuthStore } from '../../store';
import { mockUser, mockAdmin } from '../../services/mockData';
import { LoginFormData } from '../../types';

const loginSchema = z.object({
  nikOrEmail: z.string().min(1, 'NIK atau Email harus diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().optional(),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from = (location.state as { from?: string })?.from || '/user/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo login - check for admin or user
      if (data.nikOrEmail === 'admin@desalegok.go.id' || data.nikOrEmail === 'admin') {
        login(mockAdmin, 'mock-admin-token');
        toast.success('Login berhasil sebagai Admin!');
        navigate('/admin/dashboard');
      } else {
        login(mockUser, 'mock-user-token');
        toast.success('Login berhasil!');
        navigate(from);
      }
    } catch (error) {
      toast.error('Login gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-strong">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="font-display font-bold text-gray-900 text-xl">{APP_NAME}</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
              <p className="text-gray-500">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {/* Demo Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium mb-2">Demo Login:</p>
              <p className="text-xs text-blue-600">User: <strong>user@email.com</strong> / <strong>123456</strong></p>
              <p className="text-xs text-blue-600">Admin: <strong>admin</strong> / <strong>123456</strong></p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="NIK atau Email"
                placeholder="Masukkan NIK atau Email"
                error={errors.nikOrEmail?.message}
                {...register('nikOrEmail')}
              />

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  error={errors.password?.message}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  {...register('password')}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-gray-600">Ingat saya</span>
                </label>
                <Link to="/lupa-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                leftIcon={<LogIn className="h-5 w-5" />}
                className="w-full"
              >
                Masuk
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Daftar sekarang
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
