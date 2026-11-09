import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@wearyourbattles.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Authentication rejected. Verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#F3EFE7] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      <div className="w-full max-w-md border border-[#F3EFE7]/10 bg-[#222222] p-8 sm:p-10 shadow-2xl relative">
        {/* Top Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-full border border-[#B49A70]/40 bg-[#B49A70]/10 flex items-center justify-center mx-auto text-[#B49A70]">
            <Shield className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <span className="font-brand text-xs font-bold tracking-[0.3em] uppercase text-[#F3EFE7] block">
              QUIET BATTLES™
            </span>
            <span className="text-[10px] tracking-[0.35em] text-[#B49A70] uppercase block mt-1 font-semibold">
              CREATIVE DIRECTION CMS
            </span>
          </div>
          <p className="text-xs text-[#77736C] font-light pt-1">
            Sign in to manage Series, Chapters, and Atelier Artifacts.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.25em] text-[#77736C] flex items-center space-x-1.5 font-semibold">
              <Mail className="w-3 h-3 text-[#B49A70]" />
              <span>ADMINISTRATIVE EMAIL</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wearyourbattles.com"
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3.5 py-2.5 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none tracking-wider"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.25em] text-[#77736C] flex items-center space-x-1.5 font-semibold">
              <Lock className="w-3 h-3 text-[#B49A70]" />
              <span>PASSPHRASE</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#171717] border border-[#F3EFE7]/15 px-3.5 py-2.5 text-xs text-[#F3EFE7] focus:border-[#B49A70] focus:outline-none tracking-wider"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 bg-[#F3EFE7] text-[#171717] hover:bg-[#B49A70] text-xs uppercase tracking-[0.25em] font-semibold transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'ENTER CMS PORTAL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-8 pt-6 border-t border-[#F3EFE7]/10 text-[11px] font-mono text-[#77736C] space-y-1 bg-[#171717]/60 p-3">
          <p className="text-[#F3EFE7] uppercase font-sans text-[10px] tracking-widest font-semibold">
            PRELOADED DEMO CREDENTIALS:
          </p>
          <p>Email: <span className="text-[#B49A70]">admin@wearyourbattles.com</span></p>
          <p>Pass: <span className="text-[#B49A70]">admin123</span></p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-[10px] text-[#77736C] hover:text-[#B49A70] uppercase tracking-[0.25em] transition-colors"
          >
            ← RETURN TO PUBLIC MAISON
          </Link>
        </div>
      </div>
    </div>
  );
}
