import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FilePlus,
  History,
  User,
  FileStack,
  Newspaper,
  Users,
  BarChart3,
  LogOut,
  ChevronLeft,
  X,
  Home,
} from 'lucide-react';
import { cn } from '../../utils';
import { APP_NAME } from '../../constants';
import { useAuthStore, useUIStore } from '../../store';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  FilePlus,
  History,
  User,
  FileStack,
  Newspaper,
  Users,
  BarChart3,
};

interface SidebarProps {
  role: 'user' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const userLinks = [
    { name: 'Dashboard', href: '/user/dashboard', icon: 'LayoutDashboard' },
    { name: 'Pengajuan Baru', href: '/user/pengajuan', icon: 'FilePlus' },
    { name: 'Riwayat', href: '/user/riwayat', icon: 'History' },
    { name: 'Profil', href: '/user/profil', icon: 'User' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
    { name: 'Permohonan', href: '/admin/permohonan', icon: 'FileStack' },
    { name: 'Berita', href: '/admin/berita', icon: 'Newspaper' },
    { name: 'Pengguna', href: '/admin/pengguna', icon: 'Users' },
    { name: 'Laporan', href: '/admin/laporan', icon: 'BarChart3' },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Desktop Sidebar
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <span className="font-display font-bold text-gray-900">
                  {APP_NAME}
                </span>
                <p className="text-xs text-gray-500 capitalize">
                  Panel {role === 'admin' ? 'Admin' : 'Pengguna'}
                </p>
              </motion.div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform',
                !sidebarOpen && 'rotate-180'
              )}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              isActive
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )
          }
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium">Beranda</span>}
        </NavLink>

        <div className="pt-4 pb-2">
          {sidebarOpen && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu {role === 'admin' ? 'Admin' : 'Utama'}
            </p>
          )}
        </div>

        {links.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{link.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {user && sidebarOpen && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gray-50">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {user.nama.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-gray-900 text-sm truncate">
                {user.nama}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors',
            !sidebarOpen && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium">Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;