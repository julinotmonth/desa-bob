import React from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '../../utils';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { useUIStore } from '../../store';

// Public Layout - untuk halaman yang bisa diakses semua orang
export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Auth Layout - untuk halaman login/register
export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
};

// User Dashboard Layout
export const UserLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="user" />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <DashboardHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Admin Dashboard Layout
export const AdminLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        <DashboardHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
