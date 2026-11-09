import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  ShoppingBag,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children, title, subtitle }) {
  const { adminUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Series Management', path: '/admin/series', icon: Layers },
    { name: 'Chapter Management', path: '/admin/chapters', icon: BookOpen },
    { name: 'Product Management', path: '/admin/products', icon: ShoppingBag },
    { name: 'Image Management', path: '/admin/media', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#171717] text-[#F3EFE7] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#222222] border-r border-[#F3EFE7]/10 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand & Portal Header */}
          <div className="p-6 border-b border-[#F3EFE7]/10">
            <Link to="/" className="block">
              <span className="font-brand text-xs font-bold tracking-[0.25em] text-[#F3EFE7] block uppercase">
                QUIET BATTLES™
              </span>
              <span className="text-[10px] text-[#B49A70] tracking-widest uppercase mt-0.5 block font-mono font-medium">
                CREATIVE CMS // PORTAL
              </span>
            </Link>
          </div>

          {/* User badge */}
          <div className="px-6 py-4 border-b border-[#F3EFE7]/5 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#B49A70]/20 text-[#B49A70] border border-[#B49A70]/30 flex items-center justify-center text-xs font-mono font-bold">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-[#F3EFE7] truncate">{adminUser?.name || 'Director'}</p>
              <p className="text-[10px] text-[#77736C] font-mono truncate">{adminUser?.email || 'admin@quietbattles.com'}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#F3EFE7] text-[#171717] font-semibold'
                      : 'text-[#77736C] hover:text-[#F3EFE7] hover:bg-[#F3EFE7]/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions in sidebar */}
        <div className="p-4 border-t border-[#F3EFE7]/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#77736C] hover:text-[#F3EFE7] transition-colors uppercase tracking-wider"
          >
            <span>LIVE MAISON</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B49A70]" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-[#77736C] hover:text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#171717]">
        {/* Top bar */}
        <header className="px-8 py-6 border-b border-[#F3EFE7]/10 flex items-center justify-between bg-[#171717]">
          <div>
            <h1 className="font-brand text-xl sm:text-2xl text-[#F3EFE7] uppercase tracking-wider font-semibold">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-[#77736C] font-light mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-mono px-2.5 py-1 bg-[#B49A70]/10 text-[#B49A70] border border-[#B49A70]/30 uppercase tracking-widest font-semibold">
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Page Inner Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
