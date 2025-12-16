import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { LAYANAN_LIST, MAX_FILE_SIZE } from '../../constants';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatFileSize, generateNoRegistrasi } from '../../utils';
import { Layanan, Permohonan } from '../../types';

const steps = [
  { id: 1, title: 'Pilih Layanan' },
  { id: 2, title: 'Data Diri' },
  { id: 3, title: 'Upload Dokumen' },
  { id: 4, title: 'Konfirmasi' },
];

interface UploadedFile {
  file: File;
  preview: string;
}

const PengajuanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPermohonan } = usePermohonanStore();

  const initialLayananId = searchParams.get('layanan');

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(
    initialLayananId ? LAYANAN_LIST.find((l) => l.id === Number(initialLayananId)) || null : null
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [keterangan, setKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [noRegistrasi, setNoRegistrasi] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.errors.some((e) => e.code === 'file-too-large')) {
          toast.error(`File ${file.file.name} terlalu besar. Maksimal 5MB.`);
        } else {
          toast.error(`File ${file.file.name} tidak didukung.`);
        }
      });
    },
  });

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedLayanan) {
      toast.error('Pilih layanan terlebih dahulu');
      return;
    }
    if (currentStep === 3 && uploadedFiles.length === 0) {
      toast.error('Upload minimal 1 dokumen');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user || !selectedLayanan) return;
    
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newNoRegistrasi = generateNoRegistrasi();
      const now = new Date().toISOString();
      const newId = `p-${Date.now()}`;
      
      // Buat objek permohonan baru
      const newPermohonan: Permohonan = {
        id: newId,
        noRegistrasi: newNoRegistrasi,
        userId: user.id,
        userName: user.nama,
        userNik: user.nik,
        layananId: selectedLayanan.id,
        layananNama: selectedLayanan.nama,
        status: 'diajukan',
        dokumen: uploadedFiles.map((f, index) => ({
          id: `doc-${newId}-${index}`,
          nama: f.file.name,
          url: f.preview,
          type: f.file.type,
          size: f.file.size,
          uploadedAt: now,
        })),
        timeline: [
          {
            status: 'diajukan',
            tanggal: now,
            catatan: keterangan || 'Permohonan berhasil diajukan',
          },
        ],
        catatan: keterangan,
        createdAt: now,
        updatedAt: now,
      };
      
      // Tambahkan ke global store (akan muncul di admin)
      addPermohonan(newPermohonan);
      
      setNoRegistrasi(newNoRegistrasi);
      setIsSuccess(true);
      toast.success('Permohonan berhasil diajukan!');
    } catch (error) {
      toast.error('Gagal mengajukan permohonan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="text-center">
            <div className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Permohonan Berhasil!</h2>
              <p className="text-gray-500 mb-6">
                Permohonan Anda telah berhasil diajukan dan akan segera diproses.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Nomor Registrasi</p>
                <p className="text-xl font-bold text-primary-600">{noRegistrasi}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Simpan nomor ini untuk mengecek status permohonan Anda
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate('/user/riwayat')}>
                  Lihat Riwayat
                </Button>
                <Button onClick={() => navigate('/user/dashboard')}>
                  Kembali ke Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span
                  className={`ml-3 text-sm font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded-full ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <div className="p-6">
            {/* Step 1: Pilih Layanan */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Pilih Jenis Layanan</h2>
                <p className="text-gray-500 mb-6">Pilih layanan yang ingin Anda ajukan</p>

                <div className="grid sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {LAYANAN_LIST.map((layanan) => (
                    <button
                      key={layanan.id}
                      onClick={() => setSelectedLayanan(layanan)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedLayanan?.id === layanan.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900 mb-1">{layanan.nama}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{layanan.deskripsi}</p>
                      <p className="text-xs text-primary-600 mt-2">Est. {layanan.estimasiHari} hari</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Data Diri */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Konfirmasi Data Diri</h2>
                <p className="text-gray-500 mb-6">Pastikan data berikut sudah benar</p>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="font-medium text-gray-900">{user?.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NIK</p>
                      <p className="font-medium text-gray-900">{user?.nik}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">No. HP</p>
                      <p className="font-medium text-gray-900">{user?.noHp}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="font-medium text-gray-900">{user?.alamat}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Tambahkan keterangan jika diperlukan..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Upload Dokumen */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Dokumen</h2>
                <p className="text-gray-500 mb-4">Upload dokumen persyaratan berikut:</p>

                {/* Persyaratan */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 mb-2">Persyaratan {selectedLayanan?.nama}:</p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {selectedLayanan?.persyaratan.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {isDragActive ? 'Lepaskan file di sini' : 'Drag & drop file atau klik untuk memilih'}
                  </p>
                  <p className="text-sm text-gray-400">PDF, JPG, PNG (Maks. 5MB per file)</p>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Konfirmasi */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Konfirmasi Pengajuan</h2>
                <p className="text-gray-500 mb-6">Periksa kembali data pengajuan Anda</p>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Jenis Layanan</p>
                    <p className="font-medium text-gray-900">{selectedLayanan?.nama}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Pemohon</p>
                    <p className="font-medium text-gray-900">{user?.nama}</p>
                    <p className="text-sm text-gray-500">{user?.nik}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-2">Dokumen ({uploadedFiles.length} file)</p>
                    <div className="space-y-1">
                      {uploadedFiles.map((item, index) => (
                        <p key={index} className="text-sm text-gray-700">• {item.file.name}</p>
                      ))}
                    </div>
                  </div>

                  {keterangan && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Keterangan</p>
                      <p className="text-gray-700">{keterangan}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      Estimasi waktu proses: <strong>{selectedLayanan?.estimasiHari} hari kerja</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              leftIcon={<ChevronLeft className="h-5 w-5" />}
            >
              Kembali
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext} rightIcon={<ChevronRight className="h-5 w-5" />}>
                Lanjut
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting}>
                Ajukan Permohonan
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PengajuanPage;