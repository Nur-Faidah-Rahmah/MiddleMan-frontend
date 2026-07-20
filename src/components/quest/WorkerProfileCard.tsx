import React from 'react';
import { Star, Shield, Briefcase, Award, MessageSquare, Flame, CheckCircle2, DollarSign } from 'lucide-react';
import { getWorkerProfile, WorkerProfileDetails } from '../../utils/profileLookup';
import { formatCurrency } from '../../utils/formatters';

interface WorkerProfileCardProps {
  username: string;
  avatarUrl?: string; // Optional override
  currentUserId?: string;
  onHireClick?: (worker: WorkerProfileDetails) => void;
  isModalView?: boolean;
}

export function WorkerProfileCard({
  username,
  avatarUrl,
  currentUserId,
  onHireClick,
  isModalView = false
}: WorkerProfileCardProps) {
  // Look up full details based on username
  const worker = getWorkerProfile(username);
  
  // Experience progress estimation
  const currentExp = (worker.level * 400) % 1000;
  const expNeeded = 1000;
  const expPercent = Math.min(100, Math.max(10, (currentExp / expNeeded) * 100));

  // Determine if viewing own profile
  // Note: we check both exact name matching and lowercased matching
  const isOwnProfile = currentUserId && (
    currentUserId === worker.id || 
    username.toLowerCase().trim() === 'reza k.' || // reza k is current user mock
    username.toLowerCase().trim() === 'reza kurniawan'
  );

  return (
    <div className={`bg-gradient-to-b from-[#2e3557] to-[#1e2342] text-white rounded-2xl border border-[#3e4875] overflow-hidden shadow-2xl transition-all duration-300 ${isModalView ? 'w-full' : 'max-w-md mx-auto hover:border-[#f0c040]/50'}`}>
      
      {/* ── PROFILE COVER HEADER ── */}
      <div className="relative h-28 bg-[#1e2342] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3a4475] via-[#252b4e] to-[#1e2342]">
        {/* Category Badge */}
        <span className="absolute top-4 right-4 bg-[#2bb5a0]/15 border border-[#2bb5a0]/40 text-[#2bb5a0] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
          {worker.category} Specialist
        </span>

        {/* Level badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1 bg-[#f0c040]/10 border border-[#f0c040]/30 text-[#f0c040] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
          <Award size={10} />
          <span>LVL {worker.level}</span>
        </div>
      </div>

      {/* ── PROFILE DETAILS CONTAINER ── */}
      <div className="px-6 pb-6 relative">
        
        {/* Avatar Placement (over cover border) */}
        <div className="absolute -top-12 left-6">
          <div className="relative">
            <img
              src={avatarUrl || worker.avatarUrl}
              alt={worker.fullName}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#2e3557] bg-[#1e2342] shadow-xl"
            />
            {/* Status Indicator */}
            <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-[#2e3557] flex items-center justify-center ${worker.isOnline ? 'bg-[#2bb5a0]' : 'bg-[#8b93b8]'}`} title={worker.isOnline ? 'Online' : 'Offline'}>
              <span className="sr-only">{worker.isOnline ? 'Online' : 'Offline'}</span>
            </span>
          </div>
        </div>

        {/* Identity & Headline Block */}
        <div className="pt-14">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h3 className="text-white text-xl font-bold font-serif tracking-tight flex items-center gap-1.5">
              {worker.fullName}
            </h3>
            <span className="text-[#8b93b8] text-xs font-mono">@{worker.username.toLowerCase().replace(/\s+/g, '')}</span>
          </div>
          <p className="text-[#2bb5a0] text-sm font-semibold tracking-wide mt-1">
            {worker.title}
          </p>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-3 gap-2 bg-[#1c213a] rounded-xl p-3.5 border border-[#3e4875]/60 my-5 text-center">
          <div>
            <span className="text-[#8b93b8] text-[9px] uppercase font-bold tracking-wider block mb-0.5">Rating</span>
            <div className="flex items-center justify-center gap-1 text-[#f0c040] font-extrabold text-sm">
              <Star size={13} fill="currentColor" />
              <span>{worker.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="border-x border-[#3e4875]/60">
            <span className="text-[#8b93b8] text-[9px] uppercase font-bold tracking-wider block mb-0.5">Selesai</span>
            <div className="text-white font-extrabold text-sm flex items-center justify-center gap-1">
              <CheckCircle2 size={13} className="text-[#2bb5a0]" />
              <span>{worker.completedJobsCount}</span>
            </div>
          </div>
          <div>
            <span className="text-[#8b93b8] text-[9px] uppercase font-bold tracking-wider block mb-0.5">Mulai Jasa</span>
            <div className="text-white font-extrabold text-sm">
              {formatCurrency(worker.price)}
              <span className="text-[#8b93b8] text-[9px] font-medium block">/ {worker.priceUnit}</span>
            </div>
          </div>
        </div>

        {/* ── LEVEL & EXPERIENCE PROGRESS ── */}
        <div className="mb-5 bg-[#1c213a]/50 border border-[#3e4875]/40 p-3 rounded-xl">
          <div className="flex justify-between text-[10px] font-bold text-[#8b93b8] mb-1.5">
            <span>PENGALAMAN (EXP)</span>
            <span className="text-white font-mono">{currentExp} / {expNeeded} EXP</span>
          </div>
          <div className="h-2 bg-[#252b4e] rounded-full overflow-hidden border border-[#3e4875]/50">
            <div 
              className="h-full bg-gradient-to-r from-[#2bb5a0] to-[#2cdbb9] rounded-full transition-all duration-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-[#8b93b8] mt-1.5 flex items-center gap-1">
            <Flame size={10} className="text-[#f0c040] animate-pulse" />
            <span>Selesaikan quest untuk terus melaju ke tingkat berikutnya!</span>
          </p>
        </div>

        {/* ── BIOGRAPHY ("TENTANG SAYA") ── */}
        <div className="space-y-2 mb-5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Shield size={12} className="text-[#2bb5a0]" /> Tentang Saya
          </h4>
          <p className="text-[#c8cee8] text-xs leading-relaxed font-medium whitespace-pre-wrap">
            {worker.description}
          </p>
        </div>

        {/* ── SKILLS ── */}
        <div className="space-y-2 mb-5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase size={12} className="text-[#f0c040]" /> Keahlian Utama (Skills)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.map((skill) => (
              <span
                key={skill}
                className="bg-[#3e4875]/50 border border-[#3e4875] hover:border-[#f0c040]/40 hover:bg-[#3e4875] text-[#c8cee8] text-[10px] font-extrabold px-3 py-1 rounded-md transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        {worker.reviews && worker.reviews.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={12} className="text-[#2bb5a0]" /> Ulasan & Feedback Pelanggan
            </h4>
            <div className="space-y-2.5">
              {worker.reviews.map((rev) => (
                <div key={rev.id} className="bg-[#1c213a]/40 border border-[#3e4875]/40 rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.avatarUrl}
                        alt={rev.reviewer}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-[#c8cee8] text-xs font-bold">{rev.reviewer}</span>
                    </div>
                    <span className="text-[#8b93b8] text-[10px]">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#f0c040] text-[10px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} fill={i < rev.rating ? 'currentColor' : 'none'} className={i < rev.rating ? 'text-[#f0c040]' : 'text-gray-600'} />
                    ))}
                    <span className="text-[#8b93b8] ml-1 font-bold">({rev.rating.toFixed(1)})</span>
                  </div>
                  <p className="text-[#8b93b8] text-[11px] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ACTION BUTTONS ── */}
        <div className="border-t border-[#3e4875]/60 pt-4 mt-2">
          {isOwnProfile ? (
            <div className="bg-[#2bb5a0]/15 border border-[#2bb5a0]/30 text-[#2bb5a0] text-xs font-bold rounded-xl py-3 px-4 text-center select-none flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Ini adalah Profil Profesional Anda</span>
            </div>
          ) : (
            <button
              onClick={() => onHireClick && onHireClick(worker)}
              className="w-full bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] font-extrabold text-sm py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#f0c040]/15 cursor-pointer"
            >
              <Briefcase size={15} />
              Hubungi Jasa / Beri Penawaran Kerja
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
