import React, { useState } from 'react';
import { 
  Grid, Palette, PenTool, Code, Share2, Truck, 
  ShoppingCart, Sparkles, Bike, Camera, Send, 
  Star, Search, ArrowRight, Compass, CheckCircle, 
  Calendar, DollarSign, X, Briefcase, UserCheck
} from 'lucide-react';
import { Quest, Category } from '../../types';
import { QuestCard } from './QuestCard';
import { jobsApi } from '../../api/jobs';

import { getSimulatedUsersList } from '../../api/mockStorage';

interface QuestBoardProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  currentUserId: string;
  searchQuery?: string;
  onUserClick?: (username: string, avatarUrl?: string) => void;
}

const CATEGORIES = [
  { id: 'Semua', label: 'Semua', icon: Grid },
  { id: 'Design', label: 'Design', icon: Palette },
  { id: 'Writing', label: 'Writing', icon: PenTool },
  { id: 'Dev', label: 'Dev', icon: Code },
  { id: 'Social Media', label: 'Social Media', icon: Share2 },
  { id: 'Kurir', label: 'Kurir', icon: Truck },
  { id: 'Belanja', label: 'Belanja', icon: ShoppingCart },
  { id: 'Cleaning', label: 'Cleaning', icon: Sparkles },
  { id: 'Ojek', label: 'Ojek', icon: Bike },
  { id: 'Fotografi', label: 'Fotografi', icon: Camera },
];

export function QuestBoard({ quests, onQuestClick, currentUserId, searchQuery = '', onUserClick }: QuestBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'quests' | 'workers'>('quests');

  // Load dynamic worker services from simulated database
  const WORKER_SERVICES = getSimulatedUsersList()
    .filter(u => u.hasService === true && !u.isBanned)
    .map(u => ({
      id: `ws-${u.id}`,
      username: u.username,
      avatarUrl: u.avatarUrl,
      level: u.level,
      rating: u.rating,
      completedJobsCount: u.completedJobsCount || 0,
      category: u.serviceCategory || 'Dev',
      title: u.serviceTitle || 'Freelancer',
      description: u.serviceDescription || 'Menawarkan jasa profesional berkualitas tinggi.',
      price: u.servicePrice || 150000,
      priceUnit: u.servicePriceUnit || 'proyek',
      skills: u.serviceSkills || [],
      isOnline: true
    }));

  const popularWorkers = getSimulatedUsersList()
    .filter(u => !u.isBanned)
    .sort((a, b) => (b.completedJobsCount || 0) - (a.completedJobsCount || 0))
    .slice(0, 4);

  const [selectedWorkerForHire, setSelectedWorkerForHire] = useState<any | null>(null);
  
  // Hiring States
  const [hireTitle, setHireTitle] = useState('');
  const [hireDesc, setHireDesc] = useState('');
  const [hireBounty, setHireBounty] = useState('');
  const [hireDeadline, setHireDeadline] = useState('');
  const [isHiringSubmitting, setIsHiringSubmitting] = useState(false);
  const [hireError, setHireError] = useState('');
  const [hireSuccess, setHireSuccess] = useState(false);

  // Filtering quests
  const filteredQuests = quests.filter((quest) => {
    // 0. Hide completed and cancelled quests from the main home page
    if (quest.status === 'COMPLETED' || quest.status === 'CANCELLED') {
      return false;
    }

    // 1. Category Filter
    if (selectedCategory !== 'Semua' && quest.category !== selectedCategory) {
      return false;
    }

    // 2. Navbar Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = quest.title.toLowerCase().includes(query);
      const matchesDesc = quest.description.toLowerCase().includes(query);
      const matchesCategory = quest.category.toLowerCase().includes(query);
      const matchesUser = quest.requester.username.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesUser) {
        return false;
      }
    }

    // 3. User Search Filter (from Right Sidebar)
    if (userSearchQuery) {
      const userQuery = userSearchQuery.toLowerCase().replace('@', '').trim();
      const matchesUser = quest.requester.username.toLowerCase().includes(userQuery);
      if (!matchesUser) {
        return false;
      }
    }

    return true;
  });

  // Filtering workers
  const filteredWorkers = WORKER_SERVICES.filter((worker) => {
    // 1. Category Filter
    if (selectedCategory !== 'Semua' && worker.category !== selectedCategory) {
      return false;
    }

    // 2. Navbar Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = worker.username.toLowerCase().includes(query);
      const matchesTitle = worker.title.toLowerCase().includes(query);
      const matchesDesc = worker.description.toLowerCase().includes(query);
      const matchesCategory = worker.category.toLowerCase().includes(query);
      const matchesSkills = worker.skills.some(s => s.toLowerCase().includes(query));

      if (!matchesName && !matchesTitle && !matchesDesc && !matchesCategory && !matchesSkills) {
        return false;
      }
    }

    // 3. User Search Filter (from Right Sidebar)
    if (userSearchQuery) {
      const userQuery = userSearchQuery.toLowerCase().replace('@', '').trim();
      const matchesName = worker.username.toLowerCase().includes(userQuery);
      if (!matchesName) {
        return false;
      }
    }

    return true;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleUserSuggestClick = (username: string) => {
    setUserSearchQuery(username);
  };

  const handleOpenHireModal = (worker: typeof WORKER_SERVICES[0]) => {
    setSelectedWorkerForHire(worker);
    setHireTitle(`Pekerjaan Khusus — ${worker.category}`);
    setHireDesc(`Membutuhkan jasa ${worker.title} untuk membantu menyelesaikan proyek saya...`);
    setHireBounty(worker.price.toString());
    setHireDeadline(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setHireError('');
    setHireSuccess(false);
  };

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerForHire) return;

    if (!hireTitle.trim() || !hireDesc.trim() || !hireBounty.trim() || !hireDeadline.trim()) {
      setHireError('Semua field harus diisi.');
      return;
    }

    const bountyNum = parseFloat(hireBounty);
    if (isNaN(bountyNum) || bountyNum <= 0) {
      setHireError('Upah harus berupa angka yang valid.');
      return;
    }

    setIsHiringSubmitting(true);
    setHireError('');

    try {
      // Create a direct job with worker as assignee
      const newJob = await jobsApi.createJob({
        title: hireTitle,
        description: hireDesc,
        price: bountyNum,
        category: selectedWorkerForHire.category,
        deadline: new Date(hireDeadline).toISOString(),
        isOnline: selectedWorkerForHire.isOnline,
        priceUnit: selectedWorkerForHire.priceUnit,
        termsAndConditions: 'Pekerjaan langsung. Selesaikan pekerjaan sesuai requirement yang telah didiskusikan.',
        subTags: selectedWorkerForHire.skills
      });

      // Assign to worker immediately
      await jobsApi.approveApplicant(newJob.id, selectedWorkerForHire.id);

      setHireSuccess(true);
      setTimeout(() => {
        setSelectedWorkerForHire(null);
        window.location.reload(); // Refresh to see balance and list updates
      }, 2000);
    } catch (err: any) {
      setHireError(err.message || 'Gagal mengirim penawaran pekerjaan.');
    } finally {
      setIsHiringSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-10 py-6">
      
      {/* ── HERO BANNER & STATS HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 pb-6 border-b border-[#3e4875] bg-[#252b4e] -mx-10 px-10 -mt-8 pt-6">
        <div>
          <h1 className="text-white text-3xl font-bold flex flex-wrap items-center gap-2 tracking-tight">
            Temukan pekerjaan sampingan 
            <span className="text-[#f0c040] text-2xl font-bold">✦</span> 
            <span className="text-[#2bb5a0]">mulai hari ini</span>
          </h1>
          <p className="text-[#8b93b8] text-sm mt-1">
            Ratusan pekerjaan online & offline tersedia di sekitarmu
          </p>
        </div>

        {/* Counter Stats */}
        <div className="flex items-center gap-6 text-center select-none mt-4 md:mt-0">
          <div className="flex flex-col items-center">
            <div className="text-[#2bb5a0] text-2xl font-bold">1.2k+</div>
            <div className="text-[#8b93b8] text-xs mt-0.5">Pekerjaan Aktif</div>
          </div>
          <div className="w-px bg-[#3e4875] h-12"></div>
          <div className="flex flex-col items-center">
            <div className="text-[#2bb5a0] text-2xl font-bold">850+</div>
            <div className="text-[#8b93b8] text-xs mt-0.5">Pekerja Terdaftar</div>
          </div>
          <div className="w-px bg-[#3e4875] h-12"></div>
          <div className="flex flex-col items-center">
            <div className="text-[#f0c040] text-2xl font-bold flex items-center gap-1 justify-end">
              4.8★
            </div>
            <div className="text-[#8b93b8] text-xs mt-0.5">Rating Rata-rata</div>
          </div>
        </div>
      </div>

      {/* ── THREE-COLUMN LAYOUT ── */}
      <div className="flex gap-8">
        
        {/* ── LEFT COLUMN: DIRECTORY & FILTER SIDEBAR (STYLING ACCORDING TO SELECTOR) ── */}
        <div className="w-56 shrink-0 flex flex-col gap-4">
          <div 
            onClick={() => setViewMode('workers')}
            className="bg-[#3a4475] rounded-lg border-2 border-[#3e4875] p-4 sticky top-24 hover:border-[#f0c040] hover:bg-[#323961] hover:scale-[1.02] cursor-pointer transition-all duration-300 shadow-md hover:shadow-[#f0c040]/10 select-none group"
          >
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2 group-hover:text-[#f0c040] transition-colors">
              <Send size={14} className="text-[#2bb5a0] rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              Temukan Jasa Worker
            </h3>
            <p className="text-[#8b93b8] text-xs mb-4 leading-relaxed">
              Pilih kategori keahlian di bawah ini untuk mencari worker yang menawarkan jasanya secara langsung:
            </p>

            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect(cat.id);
                      setViewMode('workers');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-colors text-left cursor-pointer ${
                      isSelected && viewMode === 'workers'
                        ? 'bg-[#f0c040]/10 text-[#f0c040]' 
                        : 'text-[#c8cee8] hover:bg-[#3e4875] hover:text-[#f0c040]'
                    }`}
                  >
                    <IconComponent size={13} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <button 
              className="bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] text-xs font-extrabold py-2.5 rounded-lg w-full mt-4 transition-colors cursor-pointer block text-center"
              onClick={(e) => {
                e.stopPropagation();
                setViewMode('workers');
              }}
            >
              Lihat Direktori Worker
            </button>
          </div>
        </div>

        {/* ── MIDDLE COLUMN: FILTER TABS & QUESTS GRID ── */}
        <div className="flex-1">
          
          {/* View Mode Toggle Tabs */}
          <div className="flex border-b border-[#3e4875] mb-6 select-none bg-[#1e2342] rounded-t-xl overflow-hidden">
            <button
              onClick={() => setViewMode('quests')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === 'quests'
                  ? 'text-[#2bb5a0] border-[#2bb5a0] bg-[#2bb5a0]/5'
                  : 'text-[#8b93b8] hover:text-[#c8cee8] border-transparent hover:bg-[#3e4875]/20'
              }`}
            >
              <span>🛡️ Cari SideQuest (Daftar Lowongan)</span>
            </button>
            <button
              onClick={() => setViewMode('workers')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === 'workers'
                  ? 'text-[#f0c040] border-[#f0c040] bg-[#f0c040]/5'
                  : 'text-[#8b93b8] hover:text-[#c8cee8] border-transparent hover:bg-[#3e4875]/20'
              }`}
            >
              <span>👥 Jasa Worker (Hubungi Pekerja)</span>
            </button>
          </div>

          {/* Category Filter Pills (Horizontal) */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                    isSelected 
                      ? viewMode === 'workers' 
                        ? 'bg-[#f0c040] text-[#1b203e] border-[#f0c040]'
                        : 'bg-[#2bb5a0] text-white border-[#2bb5a0]' 
                      : 'bg-[#3a4475] text-[#c8cee8] border-[#3e4875] hover:bg-[#3e4875]'
                  }`}
                >
                  <IconComponent size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {viewMode === 'quests' ? (
            <>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg tracking-tight">Pekerjaan Tersedia ({filteredQuests.length})</h2>
                <button 
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setUserSearchQuery('');
                  }}
                  className="text-[#2bb5a0] hover:text-[#239987] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Reset Filter</span>
                </button>
              </div>

              {/* Quests Grid */}
              {filteredQuests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClick={onQuestClick}
                      onUserClick={onUserClick}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-[#3a4475] border border-dashed border-[#3e4875] rounded-lg p-12 text-center select-none">
                  <span className="text-3xl block mb-3">🔍</span>
                  <h3 className="text-white font-bold text-sm mb-1">Pekerjaan Tidak Ditemukan</h3>
                  <p className="text-[#c8cee8] text-xs">Coba gunakan filter lain atau ubah kata kunci pencarian Anda.</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg tracking-tight">Worker yang Menawarkan Jasa ({filteredWorkers.length})</h2>
                <button 
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setUserSearchQuery('');
                  }}
                  className="text-[#f0c040] hover:text-[#d4a82d] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Reset Filter</span>
                </button>
              </div>

              {/* Workers Grid */}
              {filteredWorkers.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredWorkers.map((worker) => (
                    <div 
                      key={worker.id}
                      className="bg-gradient-to-br from-[#3a4475] to-[#2e3557] rounded-xl border border-[#3e4875] p-6 flex flex-col justify-between hover:border-[#f0c040] transition-all duration-300 shadow-md group relative overflow-hidden"
                    >
                      {/* Worker Top Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div 
                          className="relative cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => onUserClick?.(worker.username, worker.avatarUrl)}
                        >
                          <img
                            src={worker.avatarUrl}
                            alt={worker.username}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-full object-cover border-2 border-[#f0c040] shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-[#f0c040] text-[#1b203e] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-[#2e3557]">
                            Lvl {worker.level}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 
                              className="text-white font-bold text-base group-hover:text-[#f0c040] transition-colors cursor-pointer"
                              onClick={() => onUserClick?.(worker.username, worker.avatarUrl)}
                            >
                              {worker.username}
                            </h4>
                            <span className="text-[#f0c040] font-bold text-sm flex items-center gap-1">
                              ★ {worker.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-[#2bb5a0] text-xs font-bold tracking-wide mt-0.5">{worker.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#8b93b8] text-[11px] bg-[#1e2342] px-2.5 py-0.5 rounded-full font-bold">
                              {worker.category}
                            </span>
                            <span className="text-[#8b93b8] text-[11px] bg-[#1e2342] px-2.5 py-0.5 rounded-full font-bold">
                              {worker.isOnline ? '🌐 Online' : '📍 Offline'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Service Description */}
                      <p className="text-[#c8cee8] text-xs leading-relaxed mb-4 line-clamp-3">
                        {worker.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {worker.skills.map((skill, i) => (
                          <span key={i} className="bg-[#2e3557] border border-[#3e4875] text-[#8b93b8] text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Card Bottom: Pricing & Action Button */}
                      <div className="flex items-center justify-between border-t border-[#3e4875]/60 pt-4 mt-auto">
                        <div>
                          <p className="text-[#8b93b8] text-[10px] uppercase font-bold tracking-wider">Mulai Jasa</p>
                          <p className="text-white font-extrabold text-base">
                            Rp {worker.price.toLocaleString('id-ID')}
                            <span className="text-[#8b93b8] text-xs font-semibold"> / {worker.priceUnit}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenHireModal(worker)}
                          className="bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] font-extrabold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-[#f0c040]/10"
                        >
                          <UserCheck size={13} />
                          Hubungi Jasa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#3a4475] border border-dashed border-[#3e4875] rounded-lg p-12 text-center select-none">
                  <span className="text-3xl block mb-3">👥</span>
                  <h3 className="text-white font-bold text-sm mb-1">Worker Tidak Ditemukan</h3>
                  <p className="text-[#c8cee8] text-xs">Coba pilih kategori keahlian lain atau ubah pencarian kata kunci Anda.</p>
                </div>
              )}
            </>
          )}

        </div>

        {/* ── RIGHT COLUMN: WORKERS & UTILITIES ── */}
        <div className="w-64 flex flex-col gap-6 shrink-0 sticky top-24">
          
          {/* Panel 1: Pekerja Terpopuler */}
          <div className="bg-[#3a4475] rounded-lg border border-[#3e4875] p-5">
            <h3 className="text-white text-sm font-bold mb-4">Pekerja Terpopuler</h3>
 
            <div className="flex flex-col gap-3">
              {popularWorkers.map((worker) => (
                <div key={worker.id} className="flex items-center gap-3">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.username}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover cursor-pointer hover:opacity-85 hover:scale-105 transition-all"
                    onClick={() => onUserClick?.(worker.username, worker.avatarUrl)}
                  />
                  <div className="flex-1">
                    <div 
                      className="text-white text-sm font-bold cursor-pointer hover:text-[#f0c040] transition-colors"
                      onClick={() => onUserClick?.(worker.username, worker.avatarUrl)}
                    >
                      {worker.username}
                    </div>
                    <div className="text-[#8b93b8] text-xs mt-0.5">
                      {worker.completedJobsCount || 0} pekerjaan selesai
                    </div>
                  </div>
                  
                  {/* Rating star tag */}
                  <div className="text-[#f0c040] text-xs font-bold whitespace-nowrap">
                    ★ {(worker.rating || 5.0).toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Punya Pekerjaan Banner */}
          <div className="bg-[#2bb5a0] rounded-lg p-5">
            <p className="text-white font-bold text-sm mb-1">
              Punya pekerjaan untuk orang lain?
            </p>
            <p className="text-white text-xs opacity-80 mb-3">
              Post request sekarang dan temukan pekerja terbaik.
            </p>
            <button 
              className="w-full bg-[#ffffff] hover:bg-gray-100 text-[#2e3557] text-xs font-bold py-2 rounded-md transition-colors cursor-pointer"
              onClick={() => alert("Silakan klik 'Send Request' di bagian atas untuk memposting pekerjaan baru!")}
            >
              Post Pekerjaan
            </button>
          </div>

          {/* Panel 3: Cari Pengguna */}
          <div className="bg-[#3a4475] rounded-lg border border-[#3e4875] p-5">
            <h3 className="text-white font-bold text-sm mb-3">Cari Pengguna</h3>
            
            {/* User search box */}
            <div className="flex items-center gap-2 bg-[#3a4068] border border-[#3e4875] rounded-md px-3 py-2 mb-3">
              <span className="text-[#8b93b8]">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="@username atau nama..."
                className="w-full bg-transparent text-[#c8cee8] text-sm outline-none placeholder-[#8b93b8]"
              />
            </div>

            {/* Suggestions list */}
            <div className="flex flex-col gap-2">
              {['Reza K.', 'Lita M.', 'Deni P.', 'Nina R.', 'Budi S.', 'Riana S.'].map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    handleUserSuggestClick(name);
                    onUserClick?.(name);
                  }}
                  className="flex items-center gap-2 text-[#c8cee8] hover:text-[#f0c040] text-sm font-semibold transition-all text-left cursor-pointer group"
                >
                  <span className="text-[#8b93b8] group-hover:text-[#f0c040]">@</span>
                  <span className="group-hover:underline">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── INTERACTIVE HIRE WORKER MODAL ── */}
      {selectedWorkerForHire && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#2e3557] to-[#1e2342] border border-[#3e4875] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#252b4e] border-b border-[#3e4875]">
              <div className="flex items-center gap-2">
                <Briefcase className="text-[#f0c040]" size={18} />
                <h3 className="text-white font-bold text-lg">Hubungi Jasa Worker</h3>
              </div>
              <button 
                onClick={() => setSelectedWorkerForHire(null)}
                className="text-[#8b93b8] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            {hireSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-[#2bb5a0]/15 rounded-full flex items-center justify-center text-4xl mb-4 text-[#2bb5a0] animate-bounce">
                  ✓
                </div>
                <h4 className="text-white font-extrabold text-xl mb-2">Penawaran Dikirim Berhasil!</h4>
                <p className="text-[#c8cee8] text-sm mb-4">
                  Dana penawaran Anda telah ditempatkan di <strong>Escrow Lock</strong>. Pekerjaan telah ditugaskan langsung ke <strong>{selectedWorkerForHire.username}</strong>.
                </p>
                <span className="text-[#8b93b8] text-xs">Halaman akan diperbarui dalam beberapa detik...</span>
              </div>
            ) : (
              <form onSubmit={handleHireSubmit} className="p-6 flex flex-col gap-4">
                
                {/* Worker Profile Card inside form */}
                <div className="bg-[#252b4e] rounded-xl p-4 border border-[#3e4875] flex items-center gap-3">
                  <img
                    src={selectedWorkerForHire.avatarUrl}
                    alt={selectedWorkerForHire.username}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-[#f0c040]"
                  />
                  <div>
                    <h4 className="text-white font-bold text-sm">{selectedWorkerForHire.username}</h4>
                    <p className="text-[#2bb5a0] text-xs font-medium">{selectedWorkerForHire.title}</p>
                    <p className="text-[#8b93b8] text-[10px] mt-0.5">Rating: {selectedWorkerForHire.rating}★ | Selesai: {selectedWorkerForHire.completedJobsCount} proyek</p>
                  </div>
                </div>

                {hireError && (
                  <div className="bg-[#ff5c5c]/10 border border-[#ff5c5c] text-[#ff7878] p-3 rounded-lg text-xs font-bold">
                    ⚠️ {hireError}
                  </div>
                )}

                {/* Form Fields */}
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-1.5">Judul Proyek / Quest</label>
                  <input
                    type="text"
                    value={hireTitle}
                    onChange={(e) => setHireTitle(e.target.value)}
                    placeholder="e.g. Desain Website Landing Page Baru"
                    className="w-full bg-[#1e2342] border border-[#3e4875] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f0c040] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold mb-1.5">Deskripsi Requirement</label>
                  <textarea
                    rows={3}
                    value={hireDesc}
                    onChange={(e) => setHireDesc(e.target.value)}
                    placeholder="Jelaskan kebutuhan Anda secara spesifik untuk worker ini..."
                    className="w-full bg-[#1e2342] border border-[#3e4875] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f0c040] transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold mb-1.5">Ditawarkan Upah (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-[#8b93b8] text-sm">Rp</span>
                      <input
                        type="text"
                        value={hireBounty}
                        onChange={(e) => setHireBounty(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-[#1e2342] border border-[#3e4875] rounded-lg pl-9 pr-3 py-2 text-white text-sm font-bold focus:outline-none focus:border-[#f0c040] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold mb-1.5">Deadline</label>
                    <input
                      type="date"
                      value={hireDeadline}
                      onChange={(e) => setHireDeadline(e.target.value)}
                      className="w-full bg-[#1e2342] border border-[#3e4875] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f0c040] transition-colors"
                    />
                  </div>
                </div>

                <p className="text-[#8b93b8] text-[10px] leading-relaxed mt-1">
                  🔒 Dana upah Anda sebesar Rp {parseFloat(hireBounty || '0').toLocaleString('id-ID')} akan di-depositkan sementara ke <strong>Escrow Lock</strong> dan baru akan dicairkan ke Worker setelah Anda mengonfirmasi hasil pekerjaan mereka.
                </p>

                {/* Form Buttons */}
                <div className="flex gap-3 mt-2 border-t border-[#3e4875]/60 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedWorkerForHire(null)}
                    className="flex-1 border border-[#3e4875] text-[#c8cee8] hover:bg-[#3e4875] text-xs font-bold py-2.5 rounded-full transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isHiringSubmitting}
                    className="flex-1 bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] text-xs font-extrabold py-2.5 rounded-full transition-all flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
                  >
                    {isHiringSubmitting ? 'Memproses...' : 'Kirim Penawaran & Deposit'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
