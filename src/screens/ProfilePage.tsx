import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { jobsApi } from '../api/jobs';
import { Quest, Category } from '../types';
import { QuestDetailModal } from '../components/modals/QuestDetailModal';
import { 
  getSimulatedUsersList, 
  saveSimulatedUsersList, 
  getSimulatedCurrentUser, 
  setSimulatedCurrentUser 
} from '../api/mockStorage';
import { 
  Settings, Briefcase, PlusCircle, History, Bell, LogOut, 
  ShieldAlert, Sparkles, Check, CheckCircle, AlertTriangle, 
  DollarSign, MapPin, Star, Laptop, Shield
} from 'lucide-react';

const categoryStats: Record<string, { min: number; avg: number; max: number }> = {
  'Design': { min: 150000, avg: 200000, max: 300000 },
  'Writing': { min: 50000, avg: 80000, max: 120000 },
  'Dev': { min: 300000, avg: 500000, max: 1000000 },
  'Social Media': { min: 100000, avg: 250000, max: 450000 },
  'Fotografi': { min: 200000, avg: 350000, max: 600000 },
  'Kurir': { min: 30000, avg: 50000, max: 80000 },
  'Belanja': { min: 20000, avg: 40000, max: 70000 },
  'Cleaning': { min: 40000, avg: 80000, max: 150000 },
  'Ojek': { min: 15000, avg: 25000, max: 45000 },
  'Lainnya': { min: 50000, avg: 100000, max: 200000 },
};

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profil & Bio');
  const [activePage, setActivePage] = useState('Profil & Pengaturan');

  // Quests & History States
  const [userQuests, setUserQuests] = useState<Quest[]>([]);
  const [activityFilter, setActivityFilter] = useState<'all' | 'posted' | 'accepted'>('all');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const selectedQuest = userQuests.find(q => q.id === selectedQuestId);

  // Profile Information States
  const [fullname, setFullname] = useState(user?.username || '');
  const [location, setLocation] = useState('Bandung, Indonesia');
  const [bio, setBio] = useState(user?.serviceDescription || 'Anggota guild SideQuest yang berdedikasi.');

  // Job Posting States
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postCategory, setPostCategory] = useState<Category>('Design');
  const [postBounty, setPostBounty] = useState('');
  const [postPriceUnit, setPostPriceUnit] = useState('proyek');
  const [postIsOnline, setPostIsOnline] = useState(true);
  const [postTags, setPostTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');

  // Service Offering (Buka Jasa) States
  const [hasService, setHasService] = useState(user?.hasService || false);
  const [serviceTitle, setServiceTitle] = useState(user?.serviceTitle || '');
  const [serviceCategory, setServiceCategory] = useState<Category>(user?.serviceCategory || 'Dev');
  const [servicePrice, setServicePrice] = useState(user?.servicePrice?.toString() || '150000');
  const [servicePriceUnit, setServicePriceUnit] = useState(user?.servicePriceUnit || 'proyek');
  const [serviceDescription, setServiceDescription] = useState(user?.serviceDescription || '');
  const [serviceSkills, setServiceSkills] = useState(user?.serviceSkills?.join(', ') || '');

  // Notifications States
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Selamat datang di SideQuest!',
      body: 'Lengkapi profil, hard skills, dan tawarkan jasa kamu untuk menarik minat requester.',
      date: 'Baru saja',
      read: false,
      icon: '🎉'
    },
    {
      id: 'n-2',
      title: 'Sistem Escrow Aktif',
      body: 'Gunakan fitur Buka Jasa dan Posting Pekerjaan dengan keamanan pembayaran terjamin.',
      date: '1 jam yang lalu',
      read: false,
      icon: '🛡️'
    }
  ]);

  useEffect(() => {
    if (user) {
      setFullname(user.username);
      setHasService(user.hasService || false);
      setServiceTitle(user.serviceTitle || '');
      setServiceCategory(user.serviceCategory || 'Dev');
      setServicePrice(user.servicePrice?.toString() || '150000');
      setServicePriceUnit(user.servicePriceUnit || 'proyek');
      setServiceDescription(user.serviceDescription || '');
      setServiceSkills(user.serviceSkills?.join(', ') || '');
    }
    fetchUserQuests();
  }, [user]);

  const fetchUserQuests = async () => {
    try {
      const data = await jobsApi.getAvailableJobs();
      setUserQuests(data);
    } catch (err) {
      console.error('Failed to fetch user quests', err);
    }
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  // Save General Profile Info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim()) {
      alert('Nama tidak boleh kosong!');
      return;
    }

    try {
      const usersList = getSimulatedUsersList();
      const updated = usersList.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            username: fullname,
            serviceDescription: bio // Sync bio to service description
          };
        }
        return u;
      });

      saveSimulatedUsersList(updated);
      const updatedCur = updated.find(u => u.id === user.id);
      if (updatedCur) {
        setSimulatedCurrentUser(updatedCur);
        refreshUser();
      }
      alert('Profil Anda berhasil diperbarui di database lokal!');
    } catch (err) {
      alert('Gagal memperbarui profil.');
    }
  };

  // Save Service Offering (Buka Jasa)
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasService && (!serviceTitle.trim() || !serviceDescription.trim())) {
      alert('Judul jasa dan Deskripsi wajib diisi jika layanan aktif!');
      return;
    }

    const priceNum = parseFloat(servicePrice.replace(/[^0-9]/g, ''));
    if (hasService && (isNaN(priceNum) || priceNum <= 0)) {
      alert('Masukkan harga jasa yang valid!');
      return;
    }

    try {
      const usersList = getSimulatedUsersList();
      const updated = usersList.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            hasService,
            serviceTitle: serviceTitle.trim(),
            serviceCategory,
            servicePrice: isNaN(priceNum) ? 150000 : priceNum,
            servicePriceUnit,
            serviceDescription: serviceDescription.trim(),
            serviceSkills: serviceSkills ? serviceSkills.split(',').map(s => s.trim()).filter(Boolean) : []
          };
        }
        return u;
      });

      saveSimulatedUsersList(updated);
      const updatedCur = updated.find(u => u.id === user.id);
      if (updatedCur) {
        setSimulatedCurrentUser(updatedCur);
        refreshUser();
      }
      alert(hasService ? 'Layanan jasa Anda sekarang AKTIF dan terlihat di Quest Board!' : 'Layanan jasa Anda berhasil dinonaktifkan.');
    } catch (err) {
      alert('Gagal memperbarui layanan jasa.');
    }
  };

  // Job Posting Submission
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDesc.trim() || !postBounty.trim()) {
      setPostError('Harap lengkapi semua field yang diperlukan (Kategori, Judul, Deskripsi, dan Upah).');
      return;
    }
    if (postDesc.length < 20) {
      setPostError('Deskripsi pekerjaan harus minimal 20 karakter agar jelas bagi pekerja.');
      return;
    }
    const bountyNum = parseFloat(postBounty.replace(/[^0-9]/g, ''));
    if (isNaN(bountyNum) || bountyNum <= 0) {
      setPostError('Upah yang ditawarkan harus berupa angka yang valid dan lebih dari 0.');
      return;
    }

    if (user.walletBalance < bountyNum) {
      setPostError(`Saldo dompet Anda tidak cukup! Dibutuhkan Rp ${bountyNum.toLocaleString('id-ID')} untuk diletakkan di escrow.`);
      return;
    }

    setIsSubmitting(true);
    setPostError('');
    setPostSuccess('');

    try {
      await jobsApi.createJob({
        title: postTitle,
        description: postDesc,
        price: bountyNum,
        category: postCategory,
        isOnline: postIsOnline,
        priceUnit: postPriceUnit,
        subTags: postTags ? postTags.split(',').map(t => t.trim()).filter(Boolean) : [postCategory]
      });

      setPostSuccess('Pekerjaan berhasil diposting ke SideQuest Board dengan saldo Escrow terkunci!');
      
      // Reset form fields
      setPostTitle('');
      setPostDesc('');
      setPostBounty('');
      setPostTags('');

      // Refresh data
      await fetchUserQuests();
      refreshUser();

      // Automatically switch to 'Riwayat Aktivitas' to view the posting
      setTimeout(() => {
        setActivePage('Riwayat Aktivitas');
        setActivityFilter('posted');
        setPostSuccess('');
      }, 1500);

    } catch (err: any) {
      setPostError(err.message || 'Gagal memposting pekerjaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Callback Handlers for QuestDetailModal
  const handleApplyQuest = async (questId: string) => {
    try {
      await jobsApi.applyJob(questId);
      await fetchUserQuests();
    } catch (error: any) {
      alert(error.message || "Gagal mendaftar");
    }
  };

  const handleApproveApplicant = async (questId: string, applicantId: string) => {
    try {
      await jobsApi.approveApplicant(questId, applicantId);
      await fetchUserQuests();
    } catch (error) {
      alert("Gagal menyetujui pekerja");
    }
  };

  const handleSubmitProof = async (questId: string, notes: string, link?: string) => {
    try {
      await jobsApi.submitProof(questId, notes, link);
      await fetchUserQuests();
    } catch (error) {
      alert("Gagal menyerahkan bukti pekerjaan");
    }
  };

  const handleApproveWork = async (questId: string) => {
    try {
      await jobsApi.approveWork(questId);
      await fetchUserQuests();
      refreshUser();
    } catch (error) {
      alert("Gagal menyetujui pekerjaan");
    }
  };

  const handleFileDispute = async (questId: string, reason: string) => {
    try {
      await jobsApi.fileDispute(questId, reason);
      await fetchUserQuests();
    } catch (error) {
      alert("Gagal mengajukan dispute");
    }
  };

  const handleResolveDispute = async (questId: string, decision: 'WORKER_WON' | 'REQUESTER_WON') => {
    try {
      await jobsApi.resolveDispute(questId, decision);
      await fetchUserQuests();
      refreshUser();
    } catch (error) {
      alert("Gagal menyelesaikan dispute");
    }
  };

  const handleClaimToken = async (questId: string) => {
    try {
      await jobsApi.claimToken(questId);
      await fetchUserQuests();
      refreshUser();
    } catch (error) {
      alert("Gagal mengklaim token");
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Filter lists
  const filteredQuests = userQuests.filter(q => {
    if (activityFilter === 'posted') return q.requester.id === user.id;
    if (activityFilter === 'accepted') return q.assigneeId === user.id;
    return q.requester.id === user.id || q.assigneeId === user.id;
  });

  return (
    <div className="flex bg-[#2e3557] min-h-[calc(100vh-80px)] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#252b4e] border-r border-[#3e4875] flex flex-col shrink-0">
        
        {/* User Summary Section */}
        <div className="p-6 flex flex-col items-center border-b border-[#3e4875]">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#f0c040] mb-4 bg-[#3a4475]">
            <img 
              src={user.avatarUrl} 
              alt={fullname} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-white font-bold text-base mb-1 text-center">{fullname}</h2>
          <span className="bg-[#f0c040]/10 text-[#f0c040] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#f0c040]/20 uppercase">
            ROLE: {user.role || 'USER'}
          </span>
          <p className="text-[#8b93b8] text-[11px] mt-1">Level {user.level} Guild</p>
          
          <div className="flex w-full justify-between px-2 text-center mt-4 pt-4 border-t border-[#3e4875]/40">
            <div>
              <p className="text-[#f0c040] font-bold text-xs">{user.rating.toFixed(1)}★</p>
              <p className="text-[#8b93b8] text-[9px]">Rating</p>
            </div>
            <div>
              <p className="text-[#2bb5a0] font-bold text-xs">{user.completedJobsCount || 0}</p>
              <p className="text-[#8b93b8] text-[9px]">Selesai</p>
            </div>
            <div>
              <p className="text-white font-bold text-xs">Aktif</p>
              <p className="text-[#8b93b8] text-[9px]">Status</p>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-6 border-b border-[#3e4875]">
          <p className="text-[#8b93b8] text-xs mb-1">Saldo Dompet Escrow</p>
          <p className="text-[#2bb5a0] text-xl font-black mb-4">
            Rp {(user.walletBalance || 0).toLocaleString('id-ID')}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => alert('Fitur Penarikan Saldo sesungguhnya dinonaktifkan dalam sandbox demo.')}
              className="flex-1 bg-[#2bb5a0]/10 border border-[#2bb5a0]/30 hover:bg-[#2bb5a0] text-white text-[11px] font-bold py-2 rounded-lg transition-colors"
            >
              Tarik
            </button>
            <button 
              onClick={() => {
                const usersList = getSimulatedUsersList();
                const updated = usersList.map(u => {
                  if (u.id === user.id) {
                    return { ...u, walletBalance: u.walletBalance + 1000000 };
                  }
                  return u;
                });
                saveSimulatedUsersList(updated);
                const updatedCur = updated.find(u => u.id === user.id);
                if (updatedCur) {
                  setSimulatedCurrentUser(updatedCur);
                  refreshUser();
                }
                alert('Tambah Saldo Demo Berhasil! Rp 1.000.000 telah ditambahkan.');
              }}
              className="flex-1 bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] text-[11px] font-bold py-2 rounded-lg transition-colors"
            >
              +1 Juta
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 flex flex-col gap-1">
          {[
            { id: 'Profil & Pengaturan', icon: <Settings size={16} /> },
            { id: 'Buka Layanan Jasa', icon: <Laptop size={16} /> },
            { id: 'Posting Pekerjaan', icon: <PlusCircle size={16} /> },
            { id: 'Riwayat Aktivitas', icon: <History size={16} />, count: filteredQuests.length },
            { id: 'Notifikasi', icon: <Bell size={16} />, count: notifications.length }
          ].map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`flex items-center justify-between px-6 py-3 font-bold text-sm transition-colors border-l-4 ${
                activePage === page.id
                  ? 'bg-[#3e4875]/40 text-[#2bb5a0] border-[#2bb5a0]'
                  : 'text-[#c8cee8] hover:bg-[#3a4475] border-transparent'
              }`}
            >
              <span className="flex items-center gap-3">
                {page.icon}
                <span>{page.id}</span>
              </span>
              {page.count !== undefined && page.count > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#3e4875] text-[#2bb5a0]">
                  {page.count}
                </span>
              )}
            </button>
          ))}
          <button onClick={logout} className="flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-[#3a4475] transition-colors font-bold text-sm border-l-4 border-transparent mt-auto cursor-pointer">
            <LogOut size={16} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* PAGE 1: PROFILE SETTINGS */}
        {activePage === 'Profil & Pengaturan' && (
          <div className="max-w-4xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#3e4875] pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">Profil & Pengaturan</h1>
                <p className="text-[#8b93b8] text-xs">Ubah detail avatar, nama lengkap, dan biografi Anda.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-[#3e4875]/50">
                <div className="w-16 h-16 rounded-full border-2 border-[#2bb5a0] overflow-hidden bg-[#2e3557]">
                  <img 
                    src={user.avatarUrl} 
                    alt={fullname}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Foto Avatar Guild</h3>
                  <p className="text-[#8b93b8] text-xs mt-1">Avatar di-generate otomatis berdasarkan username unik Anda.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Nama Pengguna (Username)</label>
                  <input 
                    type="text" 
                    required
                    value={fullname}
                    onChange={e => setFullname(e.target.value)}
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Email Akun</label>
                  <input 
                    type="email" 
                    disabled
                    value={user.email || 'user@sidequest.com'}
                    className="w-full bg-[#2e3557]/40 border border-[#3e4875] rounded-xl px-4 py-3 text-[#8b93b8] cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Lokasi Utama</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Biografi / Deskripsi</label>
                <textarea 
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Ceritakan tentang keahlian atau bisnis jasa Anda..."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-extrabold px-6 py-3 rounded-xl transition-colors cursor-pointer">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PAGE 2: BUKA LAYANAN JASA (NEW DYNAMIC OFFER SERVICE) */}
        {activePage === 'Buka Layanan Jasa' && (
          <div className="max-w-4xl flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-[#3e4875] pb-4">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Laptop size={24} className="text-[#f0c040]" />
                Buka Layanan Jasa (Worker Marketplace)
              </h1>
              <p className="text-[#8b93b8] text-xs mt-1">
                Aktifkan dan isi form di bawah ini agar profil jasa Anda dapat dilihat oleh pencari jasa (requester) di pasar SideQuest.
              </p>
            </div>

            <form onSubmit={handleSaveService} className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] space-y-6">
              {/* Toggle Switch */}
              <div className="p-4 bg-[#1e2342] border border-[#3e4875] rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-white">Status Layanan Jasa</h4>
                  <p className="text-xs text-[#8b93b8] mt-0.5">Apakah Anda ingin profil jasa Anda aktif di papan penawaran?</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasService(!hasService)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    hasService 
                      ? 'bg-[#2bb5a0]/15 text-[#2bb5a0] border-[#2bb5a0]' 
                      : 'bg-[#2e3557] text-[#8b93b8] border-[#3e4875]'
                  }`}
                >
                  {hasService ? '🟢 AKTIF DI PASAR' : '⚫ NONAKTIF'}
                </button>
              </div>

              {hasService && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Judul Penawaran Jasa</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Jasa Desain UI/UX Figma Premium & Cepat"
                      value={serviceTitle}
                      onChange={e => setServiceTitle(e.target.value)}
                      className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Kategori Utama</label>
                      <select
                        value={serviceCategory}
                        onChange={e => setServiceCategory(e.target.value as Category)}
                        className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                      >
                        <option value="Design">Design</option>
                        <option value="Writing">Writing</option>
                        <option value="Dev">Dev</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Fotografi">Fotografi</option>
                        <option value="Kurir">Kurir</option>
                        <option value="Belanja">Belanja</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Ojek">Ojek</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Harga Jasa Dasar (Rp)</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          required
                          value={servicePrice}
                          onChange={e => setServicePrice(e.target.value)}
                          className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                        />
                        <select
                          value={servicePriceUnit}
                          onChange={e => setServicePriceUnit(e.target.value)}
                          className="bg-[#2e3557] border border-[#3e4875] rounded-xl px-3 py-3 text-white focus:outline-none text-xs"
                        >
                          <option value="proyek">/ proyek</option>
                          <option value="jam">/ jam</option>
                          <option value="halaman">/ halaman</option>
                          <option value="hari">/ hari</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Keahlian Tambahan / Tag (Pisahkan dengan koma)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Figma, Photoshop, WordPress, React, SEO"
                      value={serviceSkills}
                      onChange={e => setServiceSkills(e.target.value)}
                      className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Deskripsi Detail Jasa</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Jelaskan secara detail keahlian, alur pengerjaan, format berkas yang akan dikirim, dan portofolio Anda..."
                      value={serviceDescription}
                      onChange={e => setServiceDescription(e.target.value)}
                      className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors resize-none placeholder:text-[#8b93b8]"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-[#2bb5a0] hover:bg-[#239987] text-white font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#2bb5a0]/10 cursor-pointer">
                Simpan Penawaran Jasa
              </button>
            </form>
          </div>
        )}

        {/* PAGE 3: POST QUEST */}
        {activePage === 'Posting Pekerjaan' && (
          <div className="max-w-4xl">
            <h2 className="text-white font-black text-2xl mb-1">Post Pekerjaan Baru</h2>
            <p className="text-[#8b93b8] text-xs mb-8">Lengkapi detail pekerjaan untuk diletakkan di rekening Escrow SideQuest</p>
            
            <form onSubmit={handlePostSubmit} className="bg-[#3a4475] rounded-xl p-8 border border-[#3e4875] flex flex-col gap-8">
              
              {postError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{postError}</span>
                </div>
              )}

              {postSuccess && (
                <div className="bg-[#2bb5a0]/10 border border-[#2bb5a0]/30 text-[#2bb5a0] p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{postSuccess}</span>
                </div>
              )}

              {/* Kategori Pekerjaan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Kategori Pekerjaan</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'Design', label: 'Design', type: 'Online' },
                    { id: 'Writing', label: 'Writing', type: 'Online' },
                    { id: 'Dev', label: 'Dev', type: 'Online' },
                    { id: 'Social Media', label: 'Social Media', type: 'Online' },
                    { id: 'Fotografi', label: 'Fotografi', type: 'Online' },
                    { id: 'Kurir', label: 'Kurir', type: 'Offline' },
                    { id: 'Belanja', label: 'Belanja', type: 'Offline' },
                    { id: 'Cleaning', label: 'Cleaning', type: 'Offline' },
                    { id: 'Ojek', label: 'Ojek', type: 'Offline' },
                    { id: 'Lainnya', label: 'Lainnya', type: '' }
                  ].map(cat => (
                    <button 
                      type="button"
                      key={cat.id}
                      onClick={() => setPostCategory(cat.id as Category)}
                      className={`border rounded-xl py-3 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                        postCategory === cat.id
                          ? 'bg-[#2bb5a0]/20 border-[#2bb5a0]'
                          : 'border-[#3e4875] hover:bg-[#3e4875] hover:border-[#8b93b8]'
                      }`}
                    >
                      <span className="text-white font-bold text-sm">{cat.label}</span>
                      {cat.type && <span className="text-[#8b93b8] text-xs">{cat.type}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul Pekerjaan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-2">Judul Pekerjaan</h3>
                <input 
                  type="text" 
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="e.g. Edit 5 Video Reels untuk Instagram..."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
                />
              </div>

              {/* Deskripsi Pekerjaan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-2">Deskripsi Pekerjaan</h3>
                <textarea 
                  rows={4}
                  value={postDesc}
                  onChange={e => setPostDesc(e.target.value)}
                  placeholder="Jelaskan kebutuhan Anda, format output, dan deadline pengerjaan..."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8] resize-none"
                />
                <p className="text-[#8b93b8] text-[10px] mt-1">Min 20 karakter ({postDesc.length} saat ini)</p>
              </div>

              {/* Tipe Lokasi */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Metode Pelaksanaan</h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPostIsOnline(true)}
                    className={`flex-1 py-3 px-4 border rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      postIsOnline 
                        ? 'bg-[#2bb5a0]/15 border-[#2bb5a0] text-[#2bb5a0]' 
                        : 'border-[#3e4875] text-[#8b93b8] hover:bg-[#3e4875]'
                    }`}
                  >
                    🌐 Online / Remote
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostIsOnline(false)}
                    className={`flex-1 py-3 px-4 border rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      !postIsOnline 
                        ? 'bg-[#2bb5a0]/15 border-[#2bb5a0] text-[#2bb5a0]' 
                        : 'border-[#3e4875] text-[#8b93b8] hover:bg-[#3e4875]'
                    }`}
                  >
                    📍 Offline / Di Tempat
                  </button>
                </div>
              </div>

              {/* Tags/Keywords */}
              <div>
                <h3 className="text-white font-bold text-sm mb-2">Tagar Keahlian (Opsional)</h3>
                <input 
                  type="text" 
                  value={postTags}
                  onChange={e => setPostTags(e.target.value)}
                  placeholder="e.g. Photoshop, Reels, Editing, UI, React"
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
                />
              </div>

              {/* Upah yang Ditawarkan */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4">Upah / Bounty yang Ditawarkan</h3>
                
                {/* Recommendation Panel */}
                <div className="mb-4 bg-[#2e3557]/60 rounded-xl p-4 border border-[#3e4875] text-xs">
                  <p className="text-[#2bb5a0] font-bold flex items-center gap-1.5">
                    💡 Rekomendasi Harga Kategori — {postCategory}: Rp {categoryStats[postCategory]?.min.toLocaleString('id-ID')} s/d Rp {categoryStats[postCategory]?.max.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[#8b93b8] text-xs font-bold mb-2">Upah Bounty (Rp)</label>
                    <input 
                      type="number" 
                      required
                      value={postBounty}
                      onChange={e => setPostBounty(e.target.value)}
                      placeholder="e.g. 500000"
                      className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold mb-2">Satuan</label>
                    <select
                      value={postPriceUnit}
                      onChange={e => setPostPriceUnit(e.target.value)}
                      className="bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors h-11"
                    >
                      <option value="proyek">per proyek</option>
                      <option value="jam">per jam</option>
                      <option value="halaman">per halaman</option>
                      <option value="hari">per hari</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              <div className="bg-[#1e2342] border border-[#3e4875] rounded-xl p-4 text-xs leading-normal">
                <p className="text-[#f0c040] font-bold flex items-center gap-1.5 mb-2">
                  <Shield size={14} /> Aturan Dana Escrow SideQuest:
                </p>
                <p className="text-[#c8cee8]">
                  Dengan memposting quest, dana sebesar upah yang ditawarkan akan ditarik dari dompet Anda dan dikunci di rekening penampungan bersama (Escrow). Dana hanya akan dilepas ke Worker setelah pekerjaan diselesaikan dan Anda setujui.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2bb5a0] hover:bg-[#239987] text-white font-extrabold text-sm py-4 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#2bb5a0]/10"
              >
                {isSubmitting ? 'Memproses Escrow...' : 'Kunci Escrow & Posting Quest'}
              </button>

            </form>
          </div>
        )}

        {/* PAGE 4: ACTIVITY HISTORY */}
        {activePage === 'Riwayat Aktivitas' && (
          <div className="max-w-5xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3e4875] pb-4 mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">Riwayat Aktivitas</h1>
                <p className="text-[#8b93b8] text-xs">Pantau seluruh quest yang Anda buat atau yang Anda kerjakan.</p>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex bg-[#1e2342] p-1 rounded-xl border border-[#3e4875] self-start sm:self-auto text-xs">
                <button
                  onClick={() => setActivityFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activityFilter === 'all' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActivityFilter('posted')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activityFilter === 'posted' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  Sebagai Requester
                </button>
                <button
                  onClick={() => setActivityFilter('accepted')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activityFilter === 'accepted' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  Sebagai Worker
                </button>
              </div>
            </div>

            {filteredQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuests.map(quest => {
                  const isMyPost = quest.requester.id === user.id;
                  return (
                    <div 
                      key={quest.id}
                      onClick={() => setSelectedQuestId(quest.id)}
                      className="bg-[#252b4e] border border-[#3e4875]/80 hover:border-[#f0c040] rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isMyPost 
                              ? 'bg-[#f0c040]/10 border-[#f0c040]/20 text-[#f0c040]' 
                              : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                          }`}>
                            {isMyPost ? 'Requester' : 'Worker'}
                          </span>
                          
                          <span className="text-[10px] text-[#8b93b8]">ID: {quest.id}</span>
                        </div>

                        <h3 className="text-white font-extrabold text-sm mb-1">{quest.title}</h3>
                        <p className="text-[#8b93b8] text-xs line-clamp-2 mb-4">{quest.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#3e4875]/40 mt-auto text-xs">
                        <div>
                          <p className="text-[#8b93b8] text-[9px] uppercase font-bold">Bounty Escrow</p>
                          <p className="text-[#2bb5a0] font-black">Rp {quest.bounty.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#8b93b8] text-[9px] uppercase font-bold">Status</p>
                          <p className="text-white font-bold">{quest.status}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#252b4e] border border-dashed border-[#3e4875]/80 rounded-xl p-12 text-center">
                <span className="text-3xl block mb-3">⏱</span>
                <h3 className="text-white font-bold mb-1">Belum Ada Aktivitas</h3>
                <p className="text-[#8b93b8] text-xs">Posting pekerjaan atau daftarkan diri sebagai worker untuk beraktivitas.</p>
              </div>
            )}
          </div>
        )}

        {/* PAGE 5: NOTIFICATIONS */}
        {activePage === 'Notifikasi' && (
          <div className="max-w-4xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#3e4875] pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-white">Notifikasi Papan</h1>
                <p className="text-[#8b93b8] text-xs">Pembaruan terbaru seputar transaksi escrow dan pendaftaran quest Anda.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="bg-transparent border border-[#3e4875] hover:border-[#8b93b8] text-[#c8cee8] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Tandai Semua Dibaca
                </button>
                <button 
                  onClick={clearAllNotifications}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Bersihkan
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="bg-[#252b4e] border border-[#3e4875]/60 rounded-xl p-4 flex items-start gap-4">
                  <div className="text-2xl bg-[#1e2342] w-10 h-10 rounded-lg flex items-center justify-center border border-[#3e4875]/40 shrink-0">
                    {n.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
                      {n.title}
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-red-400 block shrink-0" />}
                    </h3>
                    <p className="text-xs text-[#c8cee8] mt-1 leading-relaxed">{n.body}</p>
                    <p className="text-[10px] text-[#8b93b8] mt-2 font-semibold">{n.date}</p>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="bg-[#252b4e] border border-dashed border-[#3e4875]/80 rounded-xl p-12 text-center">
                  <span className="text-3xl block mb-3">🔔</span>
                  <h3 className="text-white font-bold mb-1">Notifikasi Bersih</h3>
                  <p className="text-[#8b93b8] text-xs">Belum ada pembaruan baru dari guild.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Quest Detail Modal */}
      {selectedQuestId && (
        <QuestDetailModal
          questId={selectedQuestId}
          onClose={() => setSelectedQuestId(null)}
          onApply={handleApplyQuest}
          onApproveApplicant={handleApproveApplicant}
          onSubmitProof={handleSubmitProof}
          onApproveWork={handleApproveWork}
          onFileDispute={handleFileDispute}
          onResolveDispute={handleResolveDispute}
          onClaimToken={handleClaimToken}
        />
      )}
    </div>
  );
}
