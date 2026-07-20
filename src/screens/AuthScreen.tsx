import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Lock, Mail, Sparkles, HelpCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function AuthScreen() {
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        if (!email || !password) {
          throw new Error('Semua kolom wajib diisi!');
        }
        await login({ email, password });
        setSuccess('Login Berhasil! Mengalihkan...');
      } else {
        if (!username || !email || !password) {
          throw new Error('Semua kolom wajib diisi!');
        }
        await register({ username, email, password, role });
        setSuccess('Registrasi Berhasil! Selamat bergabung di Guild.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (type: 'admin' | 'client' | 'worker') => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      if (type === 'admin') {
        await login({ email: 'admin@sidequest.com', password: 'admin' });
      } else if (type === 'client') {
        await login({ email: 'client@sidequest.com', password: 'client' });
      } else {
        await login({ email: 'worker@sidequest.com', password: 'worker' });
      }
      setSuccess('Login Demo Berhasil!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f3c] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#242b55] via-[#1a1f3c] to-[#0f1124] flex flex-col items-center justify-center p-6 text-white select-none">
      
      {/* Decorative Title & Icon */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2bb5a0]/20 to-[#f0c040]/20 border border-[#2bb5a0]/30 shadow-lg shadow-[#2bb5a0]/5 mb-4">
          <span className="text-[#f0c040] text-4xl font-bold animate-pulse">✦</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          SideQuest <span className="text-[#f0c040]">Guild</span>
        </h1>
        <p className="text-[#8b93b8] text-sm mt-2 max-w-sm mx-auto">
          Gerbang penghubung para Pencari Jasa (Requester) & Ksatria Pekerja (Freelancer) berbasis Escrow Aman.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#252b4e]/60 rounded-2xl border border-[#3e4875]/60 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        
        {/* Left Side: Auth Form */}
        <div className="md:col-span-7 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex border-b border-[#3e4875] mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                isLogin ? 'text-[#f0c040]' : 'text-[#8b93b8] hover:text-white'
              }`}
            >
              Log In
              {isLogin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0c040]" />}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
                !isLogin ? 'text-[#f0c040]' : 'text-[#8b93b8] hover:text-white'
              }`}
            >
              Register
              {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0c040]" />}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex items-center gap-2 animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-[#2bb5a0]/15 border border-[#2bb5a0]/30 text-[#2bb5a0] rounded-lg text-xs flex items-center gap-2">
                <Check size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase mb-1.5 tracking-wider">Username</label>
                <div className="relative flex items-center bg-[#1e2342] border border-[#3e4875] rounded-xl focus-within:border-[#2bb5a0] transition-colors">
                  <div className="pl-4 text-[#8b93b8]"><User size={16} /></div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: ksatria_kode"
                    className="w-full bg-transparent text-[#c8cee8] text-sm px-3 py-3 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#8b93b8] text-xs font-bold uppercase mb-1.5 tracking-wider">
                {isLogin ? 'Username atau Email' : 'Alamat Email'}
              </label>
              <div className="relative flex items-center bg-[#1e2342] border border-[#3e4875] rounded-xl focus-within:border-[#2bb5a0] transition-colors">
                <div className="pl-4 text-[#8b93b8]"><Mail size={16} /></div>
                <input
                  type={isLogin ? "text" : "email"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isLogin ? "Masukkan username atau email demo..." : "Contoh: user@example.com"}
                  className="w-full bg-transparent text-[#c8cee8] text-sm px-3 py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8b93b8] text-xs font-bold uppercase mb-1.5 tracking-wider">Password</label>
              <div className="relative flex items-center bg-[#1e2342] border border-[#3e4875] rounded-xl focus-within:border-[#2bb5a0] transition-colors">
                <div className="pl-4 text-[#8b93b8]"><Lock size={16} /></div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-[#c8cee8] text-sm px-3 py-3 outline-none"
                />
              </div>
            </div>

            {/* Role Selector during registration */}
            {!isLogin && (
              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase mb-1.5 tracking-wider">Pilih Peran Utama</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                      role === 'user'
                        ? 'bg-[#2bb5a0]/10 border-[#2bb5a0] text-white'
                        : 'bg-[#1e2342] border-[#3e4875] text-[#8b93b8] hover:text-white'
                    }`}
                  >
                    <User size={18} />
                    <span>User / Client / Worker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1.5 transition-all ${
                      role === 'admin'
                        ? 'bg-[#f0c040]/10 border-[#f0c040] text-white'
                        : 'bg-[#1e2342] border-[#3e4875] text-[#8b93b8] hover:text-white'
                    }`}
                  >
                    <Shield size={18} />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#2bb5a0] to-[#249c89] hover:from-[#35c9b3] hover:to-[#2bb5a0] text-white font-extrabold text-sm py-3 px-6 rounded-xl transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-[#2bb5a0]/20 mt-6 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Masuk ke Guild' : 'Daftar Akun Baru'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Demo Accounts Info */}
        <div className="md:col-span-5 flex flex-col justify-between bg-[#1e2342]/70 border border-[#3e4875]/50 rounded-xl p-5 sm:p-6">
          <div>
            <h2 className="text-[#f0c040] font-black tracking-wide text-sm uppercase flex items-center gap-2 mb-3">
              <Sparkles size={16} />
              Sistem Database Lokal & Akun Demo
            </h2>
            <p className="text-xs text-[#8b93b8] leading-relaxed mb-5">
              Data pekerjaan, tawaran jasa, dan pengguna disimpan secara aman di <b>database lokal browser Anda</b> (Local Storage).
            </p>
            
            <p className="text-xs text-white font-semibold mb-3">Pilih salah satu Akun Demo untuk masuk secara instan:</p>
            
            {/* Quick Login Buttons */}
            <div className="space-y-3">
              {/* ADMIN ACCOUNT CARD */}
              <button
                onClick={() => handleQuickLogin('admin')}
                className="w-full bg-[#2a3059] hover:bg-[#32396b] border border-[#f0c040]/30 hover:border-[#f0c040] p-3.5 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f0c040]/10 flex items-center justify-center text-[#f0c040] border border-[#f0c040]/20">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#f0c040]">ROLE: ADMINISTRATOR</h4>
                    <p className="text-[11px] text-[#8b93b8] mt-0.5">Username: <b>admin</b> | Pass: <b>admin</b></p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#f0c040]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check size={12} className="text-[#f0c040]" />
                </div>
              </button>

              {/* CLIENT DEMO ACCOUNT CARD */}
              <button
                onClick={() => handleQuickLogin('client')}
                className="w-full bg-[#2a3059] hover:bg-[#32396b] border border-[#2bb5a0]/30 hover:border-[#2bb5a0] p-3.5 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#2bb5a0]/10 flex items-center justify-center text-[#2bb5a0] border border-[#2bb5a0]/20">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#2bb5a0]">ROLE: USER (CLIENT)</h4>
                    <p className="text-[11px] text-[#8b93b8] mt-0.5">Username: <b>client</b> | Pass: <b>client</b></p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#2bb5a0]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check size={12} className="text-[#2bb5a0]" />
                </div>
              </button>

              {/* WORKER DEMO ACCOUNT CARD */}
              <button
                onClick={() => handleQuickLogin('worker')}
                className="w-full bg-[#2a3059] hover:bg-[#32396b] border border-[#3e4875] hover:border-[#8b93b8] p-3.5 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8b93b8]/10 flex items-center justify-center text-[#c8cee8] border border-[#3e4875]">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">ROLE: USER (WORKER)</h4>
                    <p className="text-[11px] text-[#8b93b8] mt-0.5">Username: <b>worker</b> | Pass: <b>worker</b></p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check size={12} className="text-[#c8cee8]" />
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3e4875]/40 text-[10px] text-[#8b93b8] leading-normal flex items-start gap-2">
            <HelpCircle size={14} className="shrink-0 text-[#f0c040]" />
            <span>
              Anda bisa mendaftarkan akun baru, saldo awal otomatis ditambahkan untuk mempermudah uji coba seluruh fitur escrow.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
