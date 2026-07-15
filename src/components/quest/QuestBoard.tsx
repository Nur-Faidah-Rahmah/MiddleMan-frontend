import React, { useState } from 'react';
import { 
  Grid, Palette, PenTool, Code, Share2, Truck, 
  ShoppingCart, Sparkles, Bike, Camera, Send, 
  Star, Search, ArrowRight, Compass 
} from 'lucide-react';
import { Quest } from '../../types';
import { QuestCard } from './QuestCard';
import { mockPopularWorkers } from '../../data/mockData';

interface QuestBoardProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  currentUserId: string;
  searchQuery?: string;
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

export function QuestBoard({ quests, onQuestClick, currentUserId, searchQuery = '' }: QuestBoardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');

  // Filtering quests
  const filteredQuests = quests.filter((quest) => {
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleUserSuggestClick = (username: string) => {
    setUserSearchQuery(username);
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
        
        {/* ── LEFT COLUMN: TAWARKAN JASA SIDEBAR ── */}
        <div className="w-56 shrink-0 flex flex-col gap-4">
          <div className="bg-[#3a4475] rounded-lg border border-[#3e4875] p-4 sticky top-24">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Send size={14} className="text-[#2bb5a0] rotate-45" />
              Tawarkan Jasa
            </h3>
            <p className="text-[#8b93b8] text-xs mb-4">
              Kategori keahlian untuk menerima pekerjaan:
            </p>

            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-colors ${
                      isSelected 
                        ? 'bg-[#3e4875] text-[#2bb5a0]' 
                        : 'text-[#c8cee8] hover:bg-[#3e4875] hover:text-[#2bb5a0]'
                    }`}
                  >
                    <IconComponent size={13} />
                    <span>{cat.label}</span>
                  </button>

                );
              })}
            </div>

            <button 
              className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-bold py-2.5 rounded-lg w-full mt-4 transition-colors cursor-pointer"
              onClick={() => alert("Anda sekarang terdaftar sebagai Service Provider!")}
            >
              Jadi Service Provider
            </button>
          </div>
        </div>

        {/* ── MIDDLE COLUMN: FILTER TABS & QUESTS GRID ── */}
        <div className="flex-1">
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
                      ? 'bg-[#2bb5a0] text-white border-[#2bb5a0]' 
                      : 'bg-[#3a4475] text-[#c8cee8] border-[#3e4875] hover:bg-[#3e4875]'
                  }`}
                >
                  <IconComponent size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-bold tracking-tight">Pekerjaan Tersedia</h2>
            <button 
              onClick={() => {
                setSelectedCategory('Semua');
                setUserSearchQuery('');
              }}
              className="text-[#14b8a6] hover:text-[#0d9488] text-xs font-bold flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Lihat semua</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Pekerjaan Tersedia</h2>
            <button className="text-[#2bb5a0] text-sm font-bold hover:underline cursor-pointer">
              Lihat semua →
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
        </div>

        {/* ── RIGHT COLUMN: WORKERS & UTILITIES ── */}
        <div className="w-64 flex flex-col gap-6 shrink-0 sticky top-24">
          
          {/* Panel 1: Pekerja Terpopuler */}
          <div className="bg-[#3a4475] rounded-lg border border-[#3e4875] p-5">
            <h3 className="text-white text-sm font-bold mb-4">Pekerja Terpopuler</h3>

            <div className="flex flex-col gap-3">
              {mockPopularWorkers.map((worker) => (
                <div key={worker.id} className="flex items-center gap-3">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.username}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-bold">{worker.username}</div>
                    <div className="text-[#8b93b8] text-xs mt-0.5">
                      {worker.completedJobsCount} pekerjaan selesai
                    </div>
                  </div>
                  
                  {/* Rating star tag */}
                  <div className="text-[#f0c040] text-xs font-bold whitespace-nowrap">
                    ★ {worker.rating.toFixed(1)}
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
              {['Reza K.', 'Lita M.', 'Deni P.'].map((name) => (
                <button
                  key={name}
                  onClick={() => handleUserSuggestClick(name)}
                  className="flex items-center gap-2 text-[#c8cee8] hover:text-white text-sm font-semibold transition-all text-left cursor-pointer"
                >
                  <span className="text-[#c8cee8]">@</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
