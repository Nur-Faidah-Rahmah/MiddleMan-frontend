import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Profil & Bio');
  const [activePage, setActivePage] = useState('Profil & Pengaturan');


  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex bg-[#2e3557] min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#252b4e] border-r border-[#3e4875] flex flex-col shrink-0">
        {/* User Summary Section */}
        <div className="p-6 flex flex-col items-center border-b border-[#3e4875]">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2bb5a0] mb-4 bg-[#3a4475]">
            <img 
              src={user.avatarUrl} 
              alt={user.username} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-white font-bold text-lg mb-1">{user.username}</h2>
          <p className="text-[#2bb5a0] text-sm mb-1">@{user.username.toLowerCase()}</p>
          <p className="text-[#8b93b8] text-xs mb-4">Bandung, Indonesia</p>
          
          <div className="flex w-full justify-between px-2 text-center">
            <div>
              <p className="text-[#f0c040] font-bold">{user.rating.toFixed(1)}★</p>
              <p className="text-[#8b93b8] text-xs">Rating</p>
            </div>
            <div>
              <p className="text-[#2bb5a0] font-bold">48</p>
              <p className="text-[#8b93b8] text-xs">Selesai</p>
            </div>
            <div>
              <p className="text-white font-bold">Rp 2.1jt</p>
              <p className="text-[#8b93b8] text-xs">Penghasilan</p>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-6 border-b border-[#3e4875]">
          <p className="text-[#8b93b8] text-xs mb-1">Saldo SideQuest</p>
          <p className="text-[#2bb5a0] text-2xl font-bold mb-4">
            Rp {(user.walletBalance || 0).toLocaleString('id-ID')}
          </p>
          <div className="flex gap-2">
            <button className="flex-1 bg-[#2bb5a0] text-white text-xs font-bold py-2 rounded-full hover:bg-[#239987] transition-colors">
              Tarik
            </button>
            <button className="flex-1 bg-transparent border border-[#3e4875] text-[#c8cee8] text-xs font-bold py-2 rounded-full hover:bg-[#3e4875] transition-colors">
              Top Up
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 flex flex-col gap-1">
          {[
            { id: 'Profil & Pengaturan', icon: '⚙️' },
            { id: 'Posting Pekerjaan', icon: '⊕' },
            { id: 'Riwayat Aktivitas', icon: '⏱' },
            { id: 'Statistik', icon: '📊' },
            { id: 'Notifikasi', icon: '🔔' }
          ].map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`flex items-center px-6 py-3 font-bold text-sm transition-colors border-l-4 ${
                activePage === page.id
                  ? 'bg-[#3e4875]/40 text-[#2bb5a0] border-[#2bb5a0]'
                  : 'text-[#c8cee8] hover:bg-[#3a4475] border-transparent'
              }`}
            >
              <span className="mr-3">{page.icon}</span> {page.id}
            </button>
          ))}
          <button onClick={logout} className="flex items-center px-6 py-3 text-[#ff5c5c] hover:bg-[#3a4475] transition-colors font-bold text-sm border-l-4 border-transparent mt-auto">
            <span className="mr-3">↪</span> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activePage === 'Profil & Pengaturan' && (
          <>
            {/* Top Tabs */}
            <div className="flex gap-6 border-b border-[#3e4875] mb-8">
              {['Profil & Bio', 'Hard Skills', 'Soft Skills', 'Keamanan', 'Pembayaran'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-bold text-sm transition-colors ${
                    activeTab === tab 
                      ? 'text-[#2bb5a0] border-b-2 border-[#2bb5a0]' 
                      : 'text-[#8b93b8] hover:text-[#c8cee8]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

        {/* Content Area */}
        {activeTab === 'Profil & Bio' && (
          <div className="max-w-4xl flex flex-col gap-6">
            {/* Foto Profil */}
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875]">
              <h3 className="text-white font-bold mb-4">Foto Profil</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-2 border-[#2bb5a0] overflow-hidden bg-[#2e3557]">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-[#8b93b8] text-sm mb-3">
                    Gunakan foto yang jelas dan profesional. Format: JPG, PNG, maksimal 5MB
                  </p>
                  <button className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
                    Upload Foto Baru
                  </button>
                </div>
              </div>
            </div>

            {/* Informasi Profil */}
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875]">
              <h3 className="text-white font-bold mb-6">Informasi Profil</h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    defaultValue={user.username}
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Username</label>
                  <input 
                    type="text" 
                    defaultValue={`@${user.username.toLowerCase()}`}
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-[#8b93b8] focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={`${user.username.toLowerCase().replace(/\s/g, '')}@sidequest.com`}
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-[#8b93b8] focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    defaultValue="+62 812 3456 7890"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-[#8b93b8] focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[#8b93b8] text-xs font-bold mb-2">Lokasi</label>
                <input 
                  type="text" 
                  defaultValue="Bandung, Indonesia"
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                />
              </div>

              <div className="mb-8">
                <label className="block text-[#8b93b8] text-xs font-bold mb-2">Bio / Deskripsi Singkat</label>
                <textarea 
                  rows={3}
                  defaultValue="Pekerja paruh waktu yang fokus di bidang desain UI/UX dan video editing. Berpengalaman menangani proyek untuk brand lokal."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
                  Simpan Perubahan
                </button>
                <button className="bg-transparent hover:bg-[#3e4875] border border-transparent text-[#c8cee8] text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Hard Skills' && (
          <div className="max-w-4xl flex flex-col gap-6">
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold text-lg">Hard Skills (Keahlian Teknis)</h3>
                <button className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                  <span className="text-base leading-none">+</span> Tambah Skill
                </button>
              </div>
              <p className="text-[#8b93b8] text-sm mb-6">
                Upload bukti keahlian mu (portfolio, sertifikat, project samples, dll). Admin akan melakukan verifikasi.
              </p>

              <div className="flex flex-col gap-4">
                {/* Approved Skill 1 */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#2bb5a0] text-white text-xs font-bold px-2 py-1 rounded-full">Approved</span>
                      <span className="text-[#8b93b8] text-xs">Hard Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">UI Design</h4>
                    <p className="text-[#8b93b8] text-xs">Disetujui: 10 Jul 2025</p>
                  </div>
                  <div>
                    <span className="text-[#2bb5a0]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </span>
                  </div>
                </div>

                {/* Approved Skill 2 */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#2bb5a0] text-white text-xs font-bold px-2 py-1 rounded-full">Approved</span>
                      <span className="text-[#8b93b8] text-xs">Hard Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">React Development</h4>
                    <p className="text-[#8b93b8] text-xs">Disetujui: 5 Jul 2025</p>
                  </div>
                  <div>
                    <span className="text-[#2bb5a0]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </span>
                  </div>
                </div>

                {/* Pending Skill */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#f0c040] text-[#2e3557] text-xs font-bold px-2 py-1 rounded-full">Pending</span>
                      <span className="text-[#8b93b8] text-xs">Hard Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">Video Editing</h4>
                    <p className="text-[#8b93b8] text-xs">File: editing_samples.zip</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-white text-sm font-bold hover:underline">Lihat</button>
                    <button className="text-[#8b93b8] hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>

                {/* Approved Skill 3 */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#2bb5a0] text-white text-xs font-bold px-2 py-1 rounded-full">Approved</span>
                      <span className="text-[#8b93b8] text-xs">Hard Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">Content Writing SEO</h4>
                    <p className="text-[#8b93b8] text-xs">Disetujui: 12 Jul 2025</p>
                  </div>
                  <div>
                    <span className="text-[#2bb5a0]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Soft Skills' && (
          <div className="max-w-4xl flex flex-col gap-6">
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold text-lg">Soft Skills (Keahlian Lunak)</h3>
                <button className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                  <span className="text-base leading-none">+</span> Tambah Skill
                </button>
              </div>
              <p className="text-[#8b93b8] text-sm mb-6">
                Soft skills seperti komunikasi, time management, dll.
              </p>

              <div className="flex flex-col gap-4">
                {/* Approved Skill 1 */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#2bb5a0] text-white text-xs font-bold px-2 py-1 rounded-full">Approved</span>
                      <span className="text-[#8b93b8] text-xs">Soft Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">Komunikasi Efektif</h4>
                    <p className="text-[#8b93b8] text-xs">Disetujui: 1 Jul 2025</p>
                  </div>
                  <div>
                    <span className="text-[#2bb5a0]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </span>
                  </div>
                </div>

                {/* Approved Skill 2 */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#2bb5a0] text-white text-xs font-bold px-2 py-1 rounded-full">Approved</span>
                      <span className="text-[#8b93b8] text-xs">Soft Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">Time Management</h4>
                    <p className="text-[#8b93b8] text-xs">Disetujui: 1 Jul 2025</p>
                  </div>
                  <div>
                    <span className="text-[#2bb5a0]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </span>
                  </div>
                </div>

                {/* Pending Skill */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#f0c040] text-[#2e3557] text-xs font-bold px-2 py-1 rounded-full">Pending</span>
                      <span className="text-[#8b93b8] text-xs">Soft Skill</span>
                    </div>
                    <h4 className="text-white font-bold mb-1">Problem Solving</h4>
                    <p className="text-[#8b93b8] text-xs">File: cv_ref.pdf</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-white text-sm font-bold hover:underline">Lihat</button>
                    <button className="text-[#8b93b8] hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Keamanan' && (
          <div className="max-w-4xl flex flex-col gap-6">
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875]">
              <h3 className="text-white font-bold text-lg mb-6">Keamanan Akun</h3>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Password Saat Ini</label>
                  <input 
                    type="password" 
                    defaultValue="********"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Password Baru</label>
                  <input 
                    type="password" 
                    placeholder="Masukkan password baru"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-[#8b93b8] focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-2">Konfirmasi Password</label>
                  <input 
                    type="password" 
                    placeholder="Konfirmasi password baru"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-[#8b93b8] focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <button className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors mt-2">
                    Ubah Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Pembayaran' && (
          <div className="max-w-4xl flex flex-col gap-6">
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold text-lg">Metode Pembayaran & Penarikan</h3>
                <button className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                  <span className="text-base leading-none">+</span> Tambah Metode
                </button>
              </div>
              <p className="text-[#8b93b8] text-sm mb-6">
                Metode pembayaran yang terdaftar untuk penarikan saldo.
              </p>

              <div className="flex flex-col gap-4">
                {/* Bank Mandiri */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#3a4475] border border-[#3e4875] flex items-center justify-center text-[#8b93b8]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Bank Mandiri</h4>
                      <p className="text-[#8b93b8] text-xs mb-0.5">1234567890</p>
                      <p className="text-[#8b93b8] text-xs mb-1">Reza Kurniawan</p>
                      <div className="flex items-center gap-1">
                        <svg className="text-[#2bb5a0]" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span className="text-[#2bb5a0] text-xs font-bold">Terverifikasi</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="bg-[#2bb5a0] text-white text-xs font-bold px-3 py-1 rounded-full">Default</span>
                    <div className="flex items-center gap-3">
                      <button className="text-white text-xs font-bold hover:underline">Ubah</button>
                      <button className="text-[#8b93b8] text-xs hover:text-white transition-colors">Hapus</button>
                    </div>
                  </div>
                </div>

                {/* Bank BRI */}
                <div className="border border-[#3e4875] rounded-lg p-5 bg-[#2e3557] flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#3a4475] border border-[#3e4875] flex items-center justify-center text-[#8b93b8]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Bank BRI</h4>
                      <p className="text-[#8b93b8] text-xs mb-0.5">0987654321</p>
                      <p className="text-[#8b93b8] text-xs mb-1">Reza Kurniawan</p>
                      <div className="flex items-center gap-1">
                        <svg className="text-[#2bb5a0]" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span className="text-[#2bb5a0] text-xs font-bold">Terverifikasi</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <button className="text-white text-xs font-bold hover:underline">Ubah</button>
                      <button className="text-[#8b93b8] text-xs hover:text-white transition-colors">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Penarikan Dana */}
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] flex items-start gap-4">
              <div className="text-[#8b93b8] mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Info Penarikan Dana</h4>
                <ul className="text-[#c8cee8] text-xs space-y-1.5">
                  <li>• Minimal penarikan: Rp 100.000</li>
                  <li>• Proses: 1-3 hari kerja</li>
                  <li>• Biaya admin: Gratis untuk 5x penarikan per bulan</li>
                  <li>• Saldo tidak akan expired</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        </>
      )}

      {activePage === 'Posting Pekerjaan' && (
          <div className="max-w-4xl">
            <h2 className="text-white font-bold text-2xl mb-1">Post Pekerjaan Baru</h2>
            <p className="text-[#8b93b8] text-sm mb-8">Lengkapi detail pekerjaan untuk menemukan pekerja yang tepat</p>
            
            <div className="bg-[#3a4475] rounded-xl p-8 border border-[#3e4875] flex flex-col gap-8">
              
              {/* Kategori Pekerjaan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Kategori Pekerjaan</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'design', label: 'Design', type: 'Online' },
                    { id: 'writing', label: 'Writing', type: 'Online' },
                    { id: 'dev', label: 'Dev', type: 'Online' },
                    { id: 'social_media', label: 'Social Media', type: 'Online' },
                    { id: 'fotografi', label: 'Fotografi', type: 'Online' },
                    { id: 'kurir', label: 'Kurir', type: 'Offline' },
                    { id: 'belanja', label: 'Belanja', type: 'Offline' },
                    { id: 'cleaning', label: 'Cleaning', type: 'Offline' },
                    { id: 'ojek', label: 'Ojek', type: 'Offline' },
                    { id: 'lainnya', label: 'Lainnya', type: '' }
                  ].map(cat => (
                    <button 
                      key={cat.id}
                      className="border border-[#3e4875] rounded-xl py-3 flex flex-col items-center justify-center hover:bg-[#3e4875] hover:border-[#2bb5a0] transition-colors"
                    >
                      <span className="text-white font-bold text-sm">{cat.label}</span>
                      {cat.type && <span className="text-[#8b93b8] text-xs">{cat.type}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul Pekerjaan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Judul Pekerjaan</h3>
                <input 
                  type="text" 
                  placeholder="e.g. Edit 5 Video Reels untuk Instagram..."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
                />
              </div>

              {/* Deskripsi Pekerjaan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Deskripsi Pekerjaan</h3>
                <textarea 
                  rows={4}
                  placeholder="Jelaskan detail pekerjaan, kebutuhan, deadline, dan requirement khusus..."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8] resize-none mb-2"
                />
                <p className="text-[#8b93b8] text-xs">Min 20 karakter</p>
              </div>

              {/* Foto/Referensi */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Foto/Referensi (Opsional)</h3>
                <div className="border-2 border-dashed border-[#3e4875] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#3e4875]/50 transition-colors">
                  <svg className="text-[#8b93b8] mb-3" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <p className="text-white font-bold text-sm mb-1">Drag foto di sini atau klik untuk browse</p>
                  <p className="text-[#8b93b8] text-xs">JPG, PNG hingga 5MB</p>
                </div>
              </div>

              {/* Upah yang Ditawarkan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Upah yang Ditawarkan</h3>
                <div className="mb-4">
                  <p className="text-white text-xs mb-3">Rekomendasi Harga — Design</p>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-left">
                      <p className="text-[#8b93b8] text-xs">Minimum</p>
                      <p className="text-white font-bold">Rp 150.000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[#8b93b8] text-xs">Rata-rata</p>
                      <p className="text-[#2bb5a0] font-bold">Rp 200.000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#8b93b8] text-xs">Maksimal</p>
                      <p className="text-[#f0c040] font-bold">Rp 300.000</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-white font-bold">Rp</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Masukkan jumlah upah (disesuaikan dengan kemampuanmu)"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
                  />
                </div>
              </div>

              {/* Tipe Pembayaran */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Tipe Pembayaran</h3>
                <div className="grid grid-cols-4 gap-4">
                  <button className="bg-[#2bb5a0] text-white border border-[#2bb5a0] rounded-full py-2.5 font-bold text-sm flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    Per Proyek
                  </button>
                  <button className="border border-[#3e4875] text-[#c8cee8] hover:bg-[#3e4875] rounded-full py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Per Jam
                  </button>
                  <button className="border border-[#3e4875] text-[#c8cee8] hover:bg-[#3e4875] rounded-full py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Per Hari
                  </button>
                  <button className="border border-[#3e4875] text-[#c8cee8] hover:bg-[#3e4875] rounded-full py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    Per Bulan
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button className="flex-1 bg-[#2bb5a0] hover:bg-[#239987] text-white font-bold py-3.5 rounded-full transition-colors">
                  Post Pekerjaan
                </button>
                <button className="flex-1 border border-[#3e4875] text-[#c8cee8] hover:bg-[#3e4875] font-bold py-3.5 rounded-full transition-colors">
                  Simpan Draft
                </button>
              </div>

            </div>

            {/* Tips Section */}
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] mt-6">
              <h4 className="text-white font-bold mb-3">Tips untuk Menarik Pekerja Terbaik:</h4>
              <ul className="text-[#c8cee8] text-xs space-y-2">
                <li>• Jelaskan kebutuhan dengan rinci dan spesifik</li>
                <li>• Berikan deadline yang jelas dan realistis</li>
                <li>• Gunakan foto/referensi jika memungkinkan</li>
                <li>• Harga yang kompetitif menarik pekerja berkualitas</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
