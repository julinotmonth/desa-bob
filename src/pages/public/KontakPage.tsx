import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import Input, { Textarea, Select } from '../../components/ui/Input';
import { CONTACT_INFO } from '../../constants';
import { KontakFormData } from '../../types';

const kontakSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  jenis: z.enum(['pertanyaan', 'saran', 'pengaduan']),
  pesan: z.string().min(10, 'Pesan minimal 10 karakter'),
});

const KontakPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<KontakFormData>({
    resolver: zodResolver(kontakSchema),
  });

  const onSubmit = async (data: KontakFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Kontak data:', data);
      setIsSubmitted(true);
      reset();
      toast.success('Pesan berhasil dikirim!');
    } catch (error) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    }
  };

  const jenisOptions = [
    { value: 'pertanyaan', label: 'Pertanyaan' },
    { value: 'saran', label: 'Saran' },
    { value: 'pengaduan', label: 'Pengaduan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16 lg:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Punya pertanyaan, saran, atau pengaduan? Jangan ragu untuk menghubungi kami.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card>
                <div className="p-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Alamat Kantor</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{CONTACT_INFO.alamat}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                      <p className="text-gray-500 text-sm">{CONTACT_INFO.telepon}</p>
                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm mt-1"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp: {CONTACT_INFO.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-600 hover:text-primary-700 text-sm">
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Jam Pelayanan</h3>
                      <div className="text-gray-500 text-sm space-y-0.5">
                        <p>{CONTACT_INFO.jamPelayanan.hariKerja}</p>
                        <p>{CONTACT_INFO.jamPelayanan.sabtu}</p>
                        <p>{CONTACT_INFO.jamPelayanan.minggu}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="none" className="overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15819.27!2d${CONTACT_INFO.koordinat.lng}!3d${CONTACT_INFO.koordinat.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzcnMTAuMiJTIDExMsKwMzknMDQuNyJF!5e0!3m2!1sen!2sid!4v1234567890`}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Lokasi Desa Legok"
                  className="w-full"
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <div className="p-6 lg:p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Pesan Terkirim!</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Terima kasih telah menghubungi kami. Tim kami akan segera memberikan tanggapan.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Kirim Pesan Lain</Button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kirim Pesan</h2>
                        <p className="text-gray-500 text-sm">Isi formulir di bawah ini dan kami akan merespons secepat mungkin.</p>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <Input
                            label="Nama Lengkap"
                            placeholder="Masukkan nama lengkap"
                            error={errors.nama?.message}
                            {...register('nama')}
                          />
                          <Input
                            label="Email"
                            type="email"
                            placeholder="Masukkan email"
                            error={errors.email?.message}
                            {...register('email')}
                          />
                        </div>

                        <Select
                          label="Jenis Pesan"
                          placeholder="Pilih jenis pesan"
                          options={jenisOptions}
                          error={errors.jenis?.message}
                          {...register('jenis')}
                        />

                        <Textarea
                          label="Pesan"
                          placeholder="Tulis pesan Anda di sini..."
                          rows={6}
                          error={errors.pesan?.message}
                          {...register('pesan')}
                        />

                        <Button
                          type="submit"
                          size="lg"
                          isLoading={isSubmitting}
                          leftIcon={<Send className="h-5 w-5" />}
                          className="w-full sm:w-auto"
                        >
                          Kirim Pesan
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pertanyaan Umum</h2>
            <p className="text-gray-500">Beberapa pertanyaan yang sering diajukan</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'Bagaimana cara mendaftar akun?', a: 'Klik tombol "Daftar" di halaman utama, isi data diri Anda termasuk NIK, dan ikuti langkah selanjutnya.' },
              { q: 'Berapa lama proses pengajuan surat?', a: 'Proses pengajuan biasanya memakan waktu 1-5 hari kerja tergantung jenis layanan yang diajukan.' },
              { q: 'Apakah ada biaya untuk layanan ini?', a: 'Semua layanan administrasi kependudukan di Desa Legok gratis, tidak dipungut biaya.' },
              { q: 'Bagaimana cara mengecek status permohonan?', a: 'Anda dapat mengecek status di halaman "Cek Status" dengan memasukkan nomor registrasi permohonan.' },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KontakPage;
