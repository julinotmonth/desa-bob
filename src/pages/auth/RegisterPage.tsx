import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import Input, { Textarea } from '../../components/ui/Input';
import { APP_NAME } from '../../constants';
import { RegisterFormData } from '../../types';

const registerSchema = z
  .object({
    nama: z.string().min(3, 'Nama minimal 3 karakter'),
    nik: z.string().length(16, 'NIK harus 16 digit').regex(/^\d+$/, 'NIK harus berupa angka'),
    email: z.string().email('Email tidak valid'),
    noHp: z.string().min(10, 'Nomor HP minimal 10 digit').regex(/^[0-9+]+$/, 'Nomor HP tidak valid'),
    alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    konfirmasiPassword: z.string(),
    setuju: z.boolean().refine((val) => val === true, 'Anda harus menyetujui syarat dan ketentuan'),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: 'Password tidak cocok',
    path: ['konfirmasiPassword'],
  });

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Register data:', data);
      setIsSuccess(true);
      toast.success('Pendaftaran berhasil!');
    } catch (error) {
      toast.error('Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-strong text-center">
            <div className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
              <p className="text-gray-500 mb-6">
                Akun Anda telah berhasil dibuat. Silakan login untuk mulai menggunakan layanan.
              </p>
              <Link to="/login">
                <Button size="lg" className="w-full">
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun Baru</h1>
              <p className="text-gray-500">Daftar untuk mengakses layanan desa</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap sesuai KTP"
                error={errors.nama?.message}
                {...register('nama')}
              />

              <Input
                label="NIK"
                placeholder="Masukkan 16 digit NIK"
                maxLength={16}
                error={errors.nik?.message}
                helperText="NIK terdiri dari 16 digit angka"
                {...register('nik')}
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="nama@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Nomor HP"
                  placeholder="08xxxxxxxxxx"
                  error={errors.noHp?.message}
                  {...register('noHp')}
                />
              </div>

              <Textarea
                label="Alamat"
                placeholder="Masukkan alamat lengkap"
                rows={3}
                error={errors.alamat?.message}
                {...register('alamat')}
              />

              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
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
                <Input
                  label="Konfirmasi Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  error={errors.konfirmasiPassword?.message}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  {...register('konfirmasiPassword')}
                />
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    {...register('setuju')}
                  />
                  <span className="text-sm text-gray-600">
                    Saya menyetujui{' '}
                    <Link to="/syarat-ketentuan" className="text-primary-600 hover:underline">
                      Syarat dan Ketentuan
                    </Link>{' '}
                    serta{' '}
                    <Link to="/kebijakan-privasi" className="text-primary-600 hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </span>
                </label>
                {errors.setuju && (
                  <p className="text-sm text-red-600 mt-1">{errors.setuju.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                leftIcon={<UserPlus className="h-5 w-5" />}
                className="w-full"
              >
                Daftar Sekarang
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Masuk di sini
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

export default RegisterPage;
