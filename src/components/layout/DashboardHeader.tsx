import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { cn, formatTanggalRelatif } from '../../utils';
import { useAuthStore, useUIStore, useNotificationStore } from '../../store';
import { mockNotifications, mockAdminNotifications } from '../../services/mockData';

interface DashboardHeaderProps {
  title?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { toggleMobileMenu, sidebarOpen } = useUIStore();
  const { markAsRead, markAllAsRead } = useNotificationStore();

  const displayNotifications =
    user?.role === 'admin' ? mockAdminNotifications : mockNotifications;
  const displayUnreadCount = displayNotifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200 transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            {title && (
              <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {displayUnreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {displayUnreadCount > 9 ? '9+' : displayUnreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-strong border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div>
                        <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                        {displayUnreadCount > 0 && (
                          <p className="text-xs text-gray-500">
                            {displayUnreadCount} belum dibaca
                          </p>
                        )}
                      </div>
                      {displayUnreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Tandai dibaca
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {displayNotifications.length > 0 ? (
                        displayNotifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={notification.link || '#'}
                            onClick={() => {
                              markAsRead(notification.id);
                              setShowNotifications(false);
                            }}
                            className={cn(
                              'flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0',
                              !notification.read && 'bg-primary-50/50'
                            )}
                          >
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                                notification.type === 'success' && 'bg-green-500',
                                notification.type === 'info' && 'bg-blue-500',
                                notification.type === 'warning' && 'bg-yellow-500',
                                notification.type === 'error' && 'bg-red-500'
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTanggalRelatif(notification.createdAt)}
                              </p>
                            </div>
                            {notification.link && (
                              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            )}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
                        </div>
                      )}
                    </div>

                    {displayNotifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <Link
                          to={user?.role === 'admin' ? '/admin/notifikasi' : '/user/notifikasi'}
                          onClick={() => setShowNotifications(false)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Lihat semua notifikasi
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user && (
              <Link
                to={user.role === 'admin' ? '/admin/profil' : '/user/profil'}
                className="lg:hidden w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm"
              >
                {user.nama.charAt(0).toUpperCase()}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
