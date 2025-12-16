import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format tanggal ke format Indonesia
export function formatTanggal(tanggal: string | Date, formatStr: string = 'dd MMMM yyyy'): string {
  const date = typeof tanggal === 'string' ? parseISO(tanggal) : tanggal;
  return format(date, formatStr, { locale: id });
}

// Format tanggal relatif (contoh: "2 jam yang lalu")
export function formatTanggalRelatif(tanggal: string | Date): string {
  const date = typeof tanggal === 'string' ? parseISO(tanggal) : tanggal;
  return formatDistanceToNow(date, { addSuffix: true, locale: id });
}

// Format tanggal dan waktu
export function formatTanggalWaktu(tanggal: string | Date): string {
  const date = typeof tanggal === 'string' ? parseISO(tanggal) : tanggal;
  return format(date, 'dd MMM yyyy, HH:mm', { locale: id });
}

// Generate nomor registrasi
export function generateNoRegistrasi(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REG-${year}${month}${day}-${random}`;
}

// Validasi NIK (16 digit)
export function isValidNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik);
}

// Validasi email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validasi nomor HP Indonesia
export function isValidPhoneNumber(phone: string): boolean {
  return /^(08|628|\+628)\d{8,11}$/.test(phone.replace(/[\s-]/g, ''));
}

// Format ukuran file
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Capitalize first letter
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Slug to title
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

// Title to slug
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Sleep function for async/await
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get status color class
export function getStatusColorClass(status: string): string {
  const colors: Record<string, string> = {
    diajukan: 'bg-yellow-100 text-yellow-800',
    diverifikasi: 'bg-blue-100 text-blue-800',
    diproses: 'bg-purple-100 text-purple-800',
    selesai: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    replied: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}


