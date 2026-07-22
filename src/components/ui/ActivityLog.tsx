import React, { useState, useMemo } from 'react';
import { 
  Activity, CheckCircle2, Clock, DollarSign, UserCheck, 
  Search, Filter, RefreshCw, Trash2, ArrowUpRight, 
  Award, Shield, Zap, Sparkles, AlertCircle, FileText
} from 'lucide-react';
import { ActivityItem, getSimulatedActivityLogs, clearSimulatedActivityLogs } from '../../api/mockStorage';

interface ActivityLogProps {
  userId: string;
  userName?: string;
  onQuestSelect?: (questId: string) => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ 
  userId, 
  userName,
  onQuestSelect 
}) => {
  const [logs, setLogs] = useState<ActivityItem[]>(() => getSimulatedActivityLogs(userId));
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLogs(getSimulatedActivityLogs(userId));
      setIsRefreshing(false);
    }, 400);
  };

  const handleClear = () => {
    clearSimulatedActivityLogs(userId);
    setLogs([]);
    setShowClearConfirm(false);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
      const queryLower = searchQuery.toLowerCase();
      const matchesQuery = !searchQuery || 
        log.title.toLowerCase().includes(queryLower) ||
        log.description.toLowerCase().includes(queryLower) ||
        (log.amount && log.amount.toString().includes(queryLower));

      return matchesCategory && matchesQuery;
    });
  }, [logs, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = logs.length;
    const questCompletedCount = logs.filter(l => l.type === 'QUEST_COMPLETED').length;
    const totalPayouts = logs
      .filter(l => l.type === 'PAYOUT_SUCCESS' && l.amount)
      .reduce((sum, l) => sum + (l.amount || 0), 0);
    const profileUpdatesCount = logs.filter(l => l.category === 'PROFILE').length;

    return {
      totalCount,
      questCompletedCount,
      totalPayouts,
      profileUpdatesCount
    };
  }, [logs]);

  const getLogIcon = (type: ActivityItem['type'], category: ActivityItem['category']) => {
    switch (type) {
      case 'QUEST_COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'PAYOUT_SUCCESS':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'PROFILE_UPDATED':
        return <UserCheck className="w-5 h-5 text-purple-400" />;
      case 'SERVICE_UPDATED':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'QUEST_POSTED':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'QUEST_APPLIED':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'PASSWORD_CHANGED':
        return <Shield className="w-5 h-5 text-rose-400" />;
      default:
        return <Activity className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (category: ActivityItem['category']) => {
    switch (category) {
      case 'QUEST':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'PAYOUT':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'PROFILE':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'ACCOUNT':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c2340] via-[#1a1f3c] to-[#14182e] border border-[#2e3760] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-[#2bb5a0]/15 border border-[#2bb5a0]/30 rounded-lg text-[#2bb5a0]">
                <Activity className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-black tracking-tight text-white">Log Aktivitas & Riwayat Progress</h3>
            </div>
            <p className="text-[#8b93b8] text-xs leading-relaxed max-w-xl">
              Pantau seluruh aktivitas riil akun Anda secara kronologis — termasuk penyelesaian quest, pembaruan profil, hingga pencairan dana escrow (payout).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-[#2a3258] hover:bg-[#343e6c] border border-[#3e4875] text-[#c8cee8] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Perbarui log aktivitas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2bb5a0]' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Bersihkan riwayat log"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#2e3760]/60">
          <div className="bg-[#12162a]/80 border border-[#2a3258] rounded-xl p-3.5">
            <p className="text-[#8b93b8] text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
              Total Aktivitas
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
            </p>
            <p className="text-xl font-black text-white">{stats.totalCount}</p>
            <p className="text-[10px] text-[#8b93b8] mt-0.5">Catatan log tersimpan</p>
          </div>

          <div className="bg-[#12162a]/80 border border-[#2a3258] rounded-xl p-3.5">
            <p className="text-[#8b93b8] text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
              Quest Selesai
              <Award className="w-3.5 h-3.5 text-emerald-400" />
            </p>
            <p className="text-xl font-black text-emerald-400">{stats.questCompletedCount}</p>
            <p className="text-[10px] text-emerald-500/80 mt-0.5">Pekerjaan disetujui</p>
          </div>

          <div className="bg-[#12162a]/80 border border-[#2a3258] rounded-xl p-3.5">
            <p className="text-[#8b93b8] text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
              Pencairan Payout
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </p>
            <p className="text-xl font-black text-[#2bb5a0]">Rp {stats.totalPayouts.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-[#2bb5a0]/80 mt-0.5">Escrow dicairkan</p>
          </div>

          <div className="bg-[#12162a]/80 border border-[#2a3258] rounded-xl p-3.5">
            <p className="text-[#8b93b8] text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-between">
              Pembaruan Profil
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            </p>
            <p className="text-xl font-black text-purple-300">{stats.profileUpdatesCount}</p>
            <p className="text-[10px] text-purple-400/80 mt-0.5">Biodata & keahlian</p>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Apakah Anda yakin ingin menghapus seluruh catatan riwayat log aktivitas?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
            >
              Ya, Hapus
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1 bg-[#2a3258] text-[#c8cee8] hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="bg-[#1a1f3c] border border-[#2e3760] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'QUEST', label: 'Quest & Pekerjaan' },
            { id: 'PAYOUT', label: 'Payout & Escrow' },
            { id: 'PROFILE', label: 'Profil & Jasa' },
            { id: 'ACCOUNT', label: 'Keamanan' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2bb5a0] text-white shadow-md shadow-[#2bb5a0]/20'
                  : 'bg-[#12162a] text-[#8b93b8] hover:text-white hover:bg-[#20274c]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8b93b8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas..."
            className="w-full bg-[#12162a] border border-[#2e3760] focus:border-[#2bb5a0] text-xs text-white placeholder-[#8b93b8] rounded-lg pl-8 pr-3 py-1.5 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b93b8] hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Timeline Feed */}
      {filteredLogs.length > 0 ? (
        <div className="bg-[#1a1f3c] border border-[#2e3760] rounded-2xl p-5 md:p-6 relative">
          <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#2e3760]">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group animate-fadeIn">
                {/* Timeline Dot */}
                <div className="absolute -left-6 md:-left-8 top-0.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#12162a] border-2 border-[#3e4875] group-hover:border-[#2bb5a0] flex items-center justify-center transition-all shadow-md z-10">
                  {getLogIcon(log.type, log.category)}
                </div>

                {/* Content Box */}
                <div className="bg-[#12162a]/90 border border-[#2a3258] group-hover:border-[#3e4875] rounded-xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white group-hover:text-[#2bb5a0] transition-colors">
                          {log.title}
                        </h4>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${getCategoryBadgeClass(log.category)}`}>
                          {log.category}
                        </span>
                        {log.status === 'SUCCESS' && (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Berhasil
                          </span>
                        )}
                        {log.status === 'PENDING' && (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#c8cee8] leading-relaxed pt-0.5">
                        {log.description}
                      </p>
                    </div>

                    {log.amount && (
                      <div className="shrink-0 text-left sm:text-right">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg border inline-block ${
                          log.type === 'PAYOUT_SUCCESS' || log.type === 'QUEST_COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-[#2a3258] text-[#2bb5a0] border-[#3e4875]'
                        }`}>
                          {log.type === 'QUEST_POSTED' ? '-' : '+'} Rp {log.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#2a3258]/60 text-[10px] text-[#8b93b8]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-[#8b93b8]" /> {log.timestamp}
                    </span>

                    {log.questId && onQuestSelect && (
                      <button
                        onClick={() => onQuestSelect(log.questId!)}
                        className="text-[#2bb5a0] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Lihat Quest <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1f3c] border border-[#2e3760] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-[#2a3258] text-[#8b93b8] rounded-full flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Belum Ada Aktivitas Terdaftar</h4>
          <p className="text-xs text-[#8b93b8] max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'Tidak ditemukan catatan aktivitas yang sesuai dengan kata kunci atau filter pilihan Anda.'
              : 'Lakukan aktivitas pertama Anda seperti menyelesaikan quest, memperbarui profil, atau mendaftar penawaran jasa.'}
          </p>
          {(searchQuery || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-1.5 bg-[#2bb5a0] hover:bg-[#239987] text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-block"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};
