import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Image,
  File,
} from 'lucide-react';
import { Button, Card } from '../../components/ui';
import { LAYANAN_LIST, MAX_FILE_SIZE } from '../../constants';
import { useAuthStore, usePermohonanStore } from '../../store';
import { formatFileSize, generateNoRegistrasi } from '../../utils';
import { Layanan, Permohonan } from '../../types';
import { permohonanApi, layananApi } from '../../services/api';

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

// Interface untuk menyimpan file per persyaratan
interface DocumentFiles {
  [key: string]: UploadedFile | null;
}

// Komponen untuk single file upload per persyaratan
interface SingleFileUploadProps {
  label: string;
  file: UploadedFile | null;
  onFileChange: (file: UploadedFile | null) => void;
  required?: boolean;
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({ label, file, onFileChange, required = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(`File ${selectedFile.name} terlalu besar. Maksimal 5MB.`);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.');
      return;
    }

    onFileChange({
      file: selectedFile,
      preview: URL.createObjectURL(selectedFile),
    });
  };

  const handleRemove = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-8 w-8 text-gray-400" />;
    if (file.file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-500" />;
    }
    return <FileText className="h-8 w-8 text-red-500" />;
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
        {file && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Check className="h-3 w-3 mr-1" />
            Terupload
          </span>
        )}
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              <span className="font-medium text-primary-600">Klik untuk upload</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Maks. 5MB)</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-2"
            title="Hapus file"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

const PengajuanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addPermohonan } = usePermohonanStore();

  const initialLayananId = searchParams.get('layanan');

  const [currentStep, setCurrentStep] = useState(1);
  const [layananList, setLayananList] = useState<Layanan[]>(LAYANAN_LIST);
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(
    initialLayananId ? LAYANAN_LIST.find((l) => l.id === Number(initialLayananId)) || null : null
  );
  // State untuk menyimpan file per persyaratan
  const [documentFiles, setDocumentFiles] = useState<DocumentFiles>({});
  const [keterangan, setKeterangan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [noRegistrasi, setNoRegistrasi] = useState('');

  // Fetch layanan from API
  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const response = await layananApi.getAll();
        if (response.data.success && response.data.data.length > 0) {
          setLayananList(response.data.data);
        }
      } catch (error) {
        console.log('Using fallback layanan data');
      }
    };
    fetchLayanan();
  }, []);

  // Reset document files when layanan changes
  useEffect(() => {
    setDocumentFiles({});
  }, [selectedLayanan?.id]);

  // Handler untuk update file per persyaratan
  const handleFileChange = (persyaratan: string, file: UploadedFile | null) => {
    setDocumentFiles((prev) => ({
      ...prev,
      [persyaratan]: file,
    }));
  };

  // Cek apakah semua persyaratan sudah diupload
  const isAllDocumentsUploaded = () => {
    if (!selectedLayanan) return false;
    return selectedLayanan.persyaratan.every((p) => documentFiles[p] !== null && documentFiles[p] !== undefined);
  };

  // Hitung jumlah dokumen yang sudah diupload
  const getUploadedCount = () => {
    return Object.values(documentFiles).filter((f) => f !== null).length;
  };

  // Get all uploaded files as array
  const getAllUploadedFiles = () => {
    return Object.entries(documentFiles)
      .filter(([_, file]) => file !== null)
      .map(([persyaratan, file]) => ({ persyaratan, ...file! }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedLayanan) {
      toast.error('Pilih layanan terlebih dahulu');
      return;
    }
    if (currentStep === 3) {
      if (!isAllDocumentsUploaded()) {
        const missing = selectedLayanan?.persyaratan.filter((p) => !documentFiles[p]) || [];
        toast.error(`Lengkapi dokumen: ${missing.join(', ')}`);
        return;
      }
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
      // Create FormData for API request
      const formData = new FormData();
      formData.append('layananId', selectedLayanan.id.toString());
      formData.append('keperluan', keterangan);
      formData.append('namaPemohon', user.nama);
      formData.append('nikPemohon', user.nik);
      formData.append('emailPemohon', user.email);
      formData.append('noHpPemohon', user.noHp || '');
      formData.append('alamatPemohon', user.alamat || '');
      
      // Add files dengan nama persyaratan
      const uploadedFiles = getAllUploadedFiles();
      uploadedFiles.forEach((item) => {
        formData.append('dokumen', item.file);
        formData.append('dokumenLabel', item.persyaratan);
      });

      const response = await permohonanApi.create(formData);
      
      if (response.data.success) {
        const { noRegistrasi: newNoRegistrasi } = response.data.data;
        setNoRegistrasi(newNoRegistrasi);
        setIsSuccess(true);
        toast.success('Permohonan berhasil diajukan!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengajukan permohonan';
      toast.error(message);
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
                  {layananList.map((layanan) => (
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
                <p className="text-gray-500 mb-4">
                  Upload dokumen persyaratan berikut ({getUploadedCount()}/{selectedLayanan?.persyaratan.length || 0} dokumen)
                </p>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Progress Upload</span>
                    <span className="font-medium text-primary-600">
                      {getUploadedCount()}/{selectedLayanan?.persyaratan.length || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((getUploadedCount() / (selectedLayanan?.persyaratan.length || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Petunjuk Upload:</p>
                      <ul className="space-y-1">
                        <li>• Format yang didukung: PDF, JPG, PNG</li>
                        <li>• Ukuran maksimal: 5MB per file</li>
                        <li>• Pastikan dokumen terlihat jelas dan tidak terpotong</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Individual Upload Fields */}
                <div className="space-y-4">
                  {selectedLayanan?.persyaratan.map((persyaratan, index) => (
                    <SingleFileUpload
                      key={index}
                      label={persyaratan}
                      file={documentFiles[persyaratan] || null}
                      onFileChange={(file) => handleFileChange(persyaratan, file)}
                      required={true}
                    />
                  ))}
                </div>

                {/* Status Summary */}
                {selectedLayanan && selectedLayanan.persyaratan.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-3">Status Dokumen:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLayanan.persyaratan.map((p, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            documentFiles[p]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {documentFiles[p] ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <span className="w-3 h-3 mr-1 rounded-full border border-gray-400" />
                          )}
                          {p}
                        </span>
                      ))}
                    </div>
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
                    <p className="text-sm text-gray-500 mb-2">Dokumen ({getUploadedCount()} file)</p>
                    <div className="space-y-2">
                      {selectedLayanan?.persyaratan.map((persyaratan, index) => {
                        const file = documentFiles[persyaratan];
                        return (
                          <div key={index} className="flex items-center gap-2">
                            {file ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-700">
                              {persyaratan}: {file ? file.file.name : 'Belum diupload'}
                            </span>
                          </div>
                        );
                      })}
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