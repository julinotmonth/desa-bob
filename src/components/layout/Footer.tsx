import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from 'lucide-react';
import { APP_NAME, CONTACT_INFO, DESA_NAME, ALAMAT_LENGKAP } from '../../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-display font-bold text-white text-lg">
                {APP_NAME}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Sistem Pelayanan Kependudukan {DESA_NAME} untuk memudahkan warga dalam
              mengurus administrasi kependudukan secara online, cepat, dan transparan.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Menu Cepat</h3>
            <ul className="space-y-2">
              {[
                { name: 'Beranda', href: '/' },
                { name: 'Layanan Desa', href: '/layanan' },
                { name: 'Berita & Informasi', href: '/berita' },
                { name: 'Cek Status', href: '/cek-status' },
                { name: 'Hubungi Kami', href: '/kontak' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Layanan Populer</h3>
            <ul className="space-y-2">
              {[
                'Surat Keterangan Domisili',
                'Surat Keterangan Usaha',
                'Surat Pengantar KTP',
                'Surat Pengantar KK',
                'Surat Keterangan Pindah',
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/layanan"
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  {CONTACT_INFO.alamat}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  {CONTACT_INFO.telepon}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{CONTACT_INFO.email}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400 text-sm">
                  <p>{CONTACT_INFO.jamPelayanan.hariKerja}</p>
                  <p>{CONTACT_INFO.jamPelayanan.sabtu}</p>
                  <p>{CONTACT_INFO.jamPelayanan.minggu}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} {APP_NAME} - {ALAMAT_LENGKAP}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/kebijakan-privasi"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              to="/syarat-ketentuan"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
