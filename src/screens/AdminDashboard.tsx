import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Briefcase, AlertOctagon, Wallet, Coins, 
  Trash2, Ban, Check, X, Star, ArrowUpRight, Search, 
  CheckCircle, ShieldAlert, Award, UserCheck, RotateCcw, Undo2, XCircle
} from 'lucide-react';
import { Quest, UserProfile } from '../types';
import { 
  getSimulatedQuests, 
  saveSimulatedQuests, 
  getSimulatedUsersList, 
  saveSimulatedUsersList,
  getSimulatedCurrentUser,
  setSimulatedCurrentUser,
  addSimulatedNotification,
  addSimulatedActivityLog
} from '../api/mockStorage';

interface AdminDashboardProps {
  onRefreshQuests?: () => void;
}

export default function AdminDashboard({ onRefreshQuests }: AdminDashboardProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'disputes' | 'users' | 'quests'>('disputes');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Edit States
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [editRating, setEditRating] = useState('');
  const [editLevel, setEditLevel] = useState('');

  // Modal & Toast States for iframe compatibility
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'CANCEL_REFUND' | 'DELETE_QUEST' | 'DELETE_USER';
    targetId: string;
    title: string;
    message: string;
    confirmText: string;
    isDanger?: boolean;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuests(getSimulatedQuests());
    setUsers(getSimulatedUsersList());
  };

  const handleRefresh = () => {
    loadData();
    if (onRefreshQuests) onRefreshQuests();
  };

  // Stats Calculations
  const totalEscrow = quests
    .filter(q => q.escrowStatus === 'DEPOSITED' || q.status === 'ESCROW_LOCKED' || q.status === 'DISPUTED')
    .reduce((sum, q) => sum + q.bounty, 0);

  const activeDisputesCount = quests.filter(q => q.status === 'DISPUTED').length;

  // Resolve Dispute Action
  const handleResolveDispute = (questId: string, decision: 'WORKER_WON' | 'REQUESTER_WON') => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const bounty = quest.bounty;
    let updatedUsers = [...users];

    if (decision === 'WORKER_WON') {
      // Award bounty to worker (assignee)
      if (quest.assigneeId) {
        updatedUsers = updatedUsers.map(u => {
          if (u.id === quest.assigneeId) {
            return {
              ...u,
              walletBalance: u.walletBalance + bounty,
              completedJobsCount: (u.completedJobsCount || 0) + 1,
              exp: u.exp + 250
            };
          }
          return u;
        });
      }
    } else {
      // Refund bounty to requester
      updatedUsers = updatedUsers.map(u => {
        if (u.id === quest.requester.id) {
          return {
            ...u,
            walletBalance: u.walletBalance + bounty
          };
        }
        return u;
      });
    }

    // Save updated users database
    saveSimulatedUsersList(updatedUsers);

    // If current logged-in user is affected, refresh their state
    const curUser = getSimulatedCurrentUser();
    if (curUser) {
      const updatedCur = updatedUsers.find(u => u.id === curUser.id);
      if (updatedCur) {
        setSimulatedCurrentUser(updatedCur);
      }
    }

    // Update Quest status
    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: decision === 'WORKER_WON' ? ('COMPLETED' as const) : ('CANCELLED' as const),
          escrowStatus: decision === 'WORKER_WON' ? ('RELEASED' as const) : ('REFUNDED' as const),
          dispute: {
            filedBy: q.dispute?.filedBy || 'Worker',
            reason: q.dispute?.reason || 'Dispute diajukan.',
            filedAt: q.dispute?.filedAt || new Date().toISOString(),
            decision,
            decisionAt: new Date().toISOString(),
            adminNotes: decision === 'WORKER_WON'
              ? 'Arbitrase Admin: Setelah peninjauan, hasil kerja dinilai memenuhi syarat. Saldo escrow dirilis ke Worker.'
              : 'Arbitrase Admin: Setelah peninjauan, hasil kerja tidak sesuai kesepakatan. Saldo escrow dikembalikan ke Requester.'
          }
        };
      }
      return q;
    });

    saveSimulatedQuests(updatedQuests);
    
    // Refresh local lists & app lists
    handleRefresh();
    showToast(`Dispute berhasil diselesaikan! Keputusan: ${decision === 'WORKER_WON' ? 'Dana dilepaskan ke Worker' : 'Dana direfund ke Requester'}.`);
  };

  // Open Confirmation Modal for Cancelling & Refunding Quest
  const handleCancelAndRefundQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    if (quest.status === 'COMPLETED') {
      showToast("Quest ini sudah selesai dan tidak dapat dibatalkan.");
      return;
    }

    if (quest.status === 'CANCELLED' || quest.escrowStatus === 'REFUNDED') {
      showToast("Quest ini sudah dibatalkan atau depositnya telah dikembalikan.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: 'CANCEL_REFUND',
      targetId: questId,
      title: 'Batalkan Quest & Refund Deposit',
      message: `Batalkan quest "${quest.title}" dan kembalikan dana deposit Rp ${quest.bounty.toLocaleString('id-ID')} ke dompet ${quest.requester.username}?`,
      confirmText: 'Ya, Batalkan & Refund',
      isDanger: false
    });
  };

  // Execute Cancel & Refund Quest
  const executeCancelAndRefundQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    let updatedUsers = [...users];
    const requesterId = quest.requester.id;
    const cleanReqId = requesterId.replace(/^ws-/, '');

    // Refund deposit to requester balance
    updatedUsers = updatedUsers.map(u => {
      if (u.id === requesterId || u.id === cleanReqId || `ws-${u.id}` === requesterId) {
        return {
          ...u,
          walletBalance: u.walletBalance + quest.bounty
        };
      }
      return u;
    });

    saveSimulatedUsersList(updatedUsers);

    // Sync logged-in user if affected
    const curUser = getSimulatedCurrentUser();
    if (curUser && (curUser.id === requesterId || curUser.id === cleanReqId || `ws-${curUser.id}` === requesterId)) {
      const updatedCur = updatedUsers.find(u => u.id === curUser.id);
      if (updatedCur) setSimulatedCurrentUser(updatedCur);
    }

    // Add activity log & notification for the requester
    addSimulatedActivityLog({
      userId: requesterId,
      type: 'PAYOUT_SUCCESS',
      title: 'Pengembalian Deposit Escrow',
      description: `Dana deposit Rp ${quest.bounty.toLocaleString('id-ID')} untuk quest "${quest.title}" telah dikembalikan ke dompet Anda oleh Administrator.`,
      amount: quest.bounty,
      questId: quest.id,
      category: 'PAYOUT',
      status: 'SUCCESS',
      icon: '💰'
    });

    addSimulatedNotification({
      userId: requesterId,
      title: 'Refund Escrow Diproses Admin',
      body: `Quest "${quest.title}" telah dibatalkan oleh Admin dan saldo deposit Rp ${quest.bounty.toLocaleString('id-ID')} telah dikembalikan ke dompet Anda.`,
      icon: '💰',
      type: 'SYSTEM',
      questId: quest.id
    });

    // Update quest status
    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'CANCELLED' as const,
          escrowStatus: 'REFUNDED' as const
        };
      }
      return q;
    });

    saveSimulatedQuests(updatedQuests);
    handleRefresh();
    showToast(`Berhasil membatalkan quest! Saldo deposit Rp ${quest.bounty.toLocaleString('id-ID')} dikembalikan ke ${quest.requester.username}.`);
  };

  // Open Confirmation Modal for Deleting Quest
  const handleDeleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const isEscrowed = quest.escrowStatus === 'DEPOSITED' || quest.escrowStatus === 'LOCKED' || quest.status === 'OPEN' || quest.status === 'IN_PROGRESS';
    const message = isEscrowed
      ? `Hapus quest "${quest.title}" secara permanen? Dana deposit Rp ${quest.bounty.toLocaleString('id-ID')} akan otomatis dikembalikan ke dompet ${quest.requester.username}.`
      : `Apakah Anda yakin ingin menghapus quest "${quest.title}" secara permanen dari database?`;

    setConfirmModal({
      isOpen: true,
      type: 'DELETE_QUEST',
      targetId: questId,
      title: 'Hapus Quest Permanen',
      message,
      confirmText: 'Ya, Hapus Permanen',
      isDanger: true
    });
  };

  // Execute Delete Quest
  const executeDeleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const isEscrowed = quest.escrowStatus === 'DEPOSITED' || quest.escrowStatus === 'LOCKED' || quest.status === 'OPEN' || quest.status === 'IN_PROGRESS';

    if (isEscrowed) {
      const requesterId = quest.requester.id;
      const cleanReqId = requesterId.replace(/^ws-/, '');

      const updatedUsers = users.map(u => {
        if (u.id === requesterId || u.id === cleanReqId || `ws-${u.id}` === requesterId) {
          return { ...u, walletBalance: u.walletBalance + quest.bounty };
        }
        return u;
      });
      saveSimulatedUsersList(updatedUsers);

      const curUser = getSimulatedCurrentUser();
      if (curUser && (curUser.id === requesterId || curUser.id === cleanReqId || `ws-${curUser.id}` === requesterId)) {
        const updatedCur = updatedUsers.find(u => u.id === curUser.id);
        if (updatedCur) setSimulatedCurrentUser(updatedCur);
      }

      addSimulatedActivityLog({
        userId: requesterId,
        type: 'PAYOUT_SUCCESS',
        title: 'Pengembalian Deposit Escrow (Hapus Quest)',
        description: `Pengembalian dana deposit Rp ${quest.bounty.toLocaleString('id-ID')} karena quest "${quest.title}" dihapus oleh Admin.`,
        amount: quest.bounty,
        category: 'PAYOUT',
        status: 'SUCCESS',
        icon: '💰'
      });
    }

    const filtered = quests.filter(q => q.id !== questId);
    saveSimulatedQuests(filtered);
    handleRefresh();
    showToast("Quest berhasil dihapus & dana deposit escrow (bila ada) telah dikembalikan!");
  };

  // Users Manager Actions
  const handleBanToggle = (userId: string) => {
    if (userId === 'demo-admin') {
      alert("Anda tidak bisa menonaktifkan akun Super Admin!");
      return;
    }

    const updated = users.map(u => {
      if (u.id === userId) {
        const newBan = !u.isBanned;
        return { ...u, isBanned: newBan };
      }
      return u;
    });

    saveSimulatedUsersList(updated);
    handleRefresh();
  };

  const handleRoleToggle = (userId: string) => {
    if (userId === 'demo-admin') {
      alert("Anda tidak bisa mengubah role Super Admin!");
      return;
    }

    const updated = users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        return { ...u, role: newRole as 'admin' | 'user' };
      }
      return u;
    });

    saveSimulatedUsersList(updated);
    handleRefresh();
  };

  const handleTopUpSubmit = (userId: string) => {
    const amount = parseInt(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Masukkan nominal angka top-up yang valid!");
      return;
    }

    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, walletBalance: u.walletBalance + amount };
      }
      return u;
    });

    saveSimulatedUsersList(updated);
    
    // Sync current user balance if they are the one topped up
    const curUser = getSimulatedCurrentUser();
    if (curUser && curUser.id === userId) {
      const updatedCur = updated.find(u => u.id === userId);
      if (updatedCur) setSimulatedCurrentUser(updatedCur);
    }

    setEditingUserId(null);
    setTopUpAmount('');
    handleRefresh();
    alert("Saldo berhasil ditambahkan ke dompet user!");
  };

  const handleSaveLevelRating = (userId: string) => {
    const lvl = parseInt(editLevel);
    const rat = parseFloat(editRating);

    const updated = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          level: isNaN(lvl) ? u.level : lvl,
          rating: isNaN(rat) ? u.rating : Math.min(5, Math.max(1, rat))
        };
      }
      return u;
    });

    saveSimulatedUsersList(updated);
    setEditingUserId(null);
    setEditLevel('');
    setEditRating('');
    handleRefresh();
    alert("Level & Rating pengguna berhasil diupdate.");
  };

  // Filters
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredQuestsList = quests.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.requester.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const disputedQuests = quests.filter(q => q.status === 'DISPUTED');

  return (
    <div className="bg-[#1e2342] min-h-[calc(100vh-80px)] p-6 sm:p-8 text-white">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#f0c040] flex items-center gap-2">
            <Shield size={28} />
            Administrator Guild Control Panel
          </h1>
          <p className="text-[#8b93b8] text-xs sm:text-sm mt-1">
            Pantau statistik guild, audit escrow, selesaikan sengketa (disputes), dan kelola kredensial pengguna.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          🔄 Refresh Database
        </button>
      </div>

      {/* Summary Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-[#252b4e] border border-[#3e4875]/60 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <p className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Total Escrow Terkunci</p>
            <h3 className="text-2xl font-black text-[#f0c040] mt-1">Rp {totalEscrow.toLocaleString('id-ID')}</h3>
            <p className="text-[10px] text-[#2bb5a0] mt-1 font-semibold flex items-center gap-1">
              <CheckCircle size={10} /> 100% Bergaransi Aman
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#f0c040]/10 flex items-center justify-center text-[#f0c040]">
            <Wallet size={22} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#252b4e] border border-[#3e4875]/60 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <p className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Sengketa (Disputes) Aktif</p>
            <h3 className="text-2xl font-black text-red-400 mt-1">{activeDisputesCount} Kasus</h3>
            <p className="text-[10px] text-[#8b93b8] mt-1">Membutuhkan arbitrase Admin</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertOctagon size={22} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#252b4e] border border-[#3e4875]/60 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <p className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Total Pengguna Terdaftar</p>
            <h3 className="text-2xl font-black text-white mt-1">{users.length} Akun</h3>
            <p className="text-[10px] text-[#2bb5a0] mt-1 font-semibold">Simulated Local DB</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#2bb5a0]/10 flex items-center justify-center text-[#2bb5a0]">
            <Users size={22} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#252b4e] border border-[#3e4875]/60 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <p className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Total Quest/Pekerjaan</p>
            <h3 className="text-2xl font-black text-white mt-1">{quests.length} Quest</h3>
            <p className="text-[10px] text-[#8b93b8] mt-1">Open, In Progress, Selesai</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Briefcase size={22} />
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-[#252b4e] border border-[#3e4875]/60 rounded-2xl p-6 shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-[#3e4875] mb-6 gap-2">
          <button
            onClick={() => { setActiveSubTab('disputes'); setSearchQuery(''); }}
            className={`px-5 py-3 text-sm font-extrabold tracking-wider uppercase transition-colors relative flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'disputes' ? 'text-[#f0c040]' : 'text-[#8b93b8] hover:text-white'
            }`}
          >
            <ShieldAlert size={16} />
            Sengketa Escrow ({disputedQuests.length})
            {activeSubTab === 'disputes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0c040]" />}
          </button>
          <button
            onClick={() => { setActiveSubTab('users'); setSearchQuery(''); }}
            className={`px-5 py-3 text-sm font-extrabold tracking-wider uppercase transition-colors relative flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'users' ? 'text-[#f0c040]' : 'text-[#8b93b8] hover:text-white'
            }`}
          >
            <Users size={16} />
            Kelola Pengguna ({users.length})
            {activeSubTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0c040]" />}
          </button>
          <button
            onClick={() => { setActiveSubTab('quests'); setSearchQuery(''); }}
            className={`px-5 py-3 text-sm font-extrabold tracking-wider uppercase transition-colors relative flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'quests' ? 'text-[#f0c040]' : 'text-[#8b93b8] hover:text-white'
            }`}
          >
            <Briefcase size={16} />
            Kelola Quest ({quests.length})
            {activeSubTab === 'quests' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0c040]" />}
          </button>
        </div>

        {/* Searching Field */}
        {activeSubTab !== 'disputes' && (
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={activeSubTab === 'users' ? "Cari nama atau email pengguna..." : "Cari judul pekerjaan atau pembuat..."}
              className="w-full bg-[#1e2342] border border-[#3e4875] rounded-xl pl-11 pr-4 py-3 text-sm text-[#c8cee8] outline-none focus:border-[#2bb5a0] transition-colors placeholder:text-[#8b93b8]"
            />
            <div className="absolute left-4 top-3.5 text-[#8b93b8]">
              <Search size={16} />
            </div>
          </div>
        )}

        {/* Dynamic Inner Tab Content */}
        
        {/* 1. DISPUTES ARBITRATION SUBTAB */}
        {activeSubTab === 'disputes' && (
          <div className="space-y-6">
            {disputedQuests.length > 0 ? (
              disputedQuests.map(quest => (
                <div 
                  key={quest.id} 
                  className="bg-[#1a1f3c] border border-red-500/20 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-red-500/10 text-red-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-500/20">
                        ⚠️ DISPUTED
                      </span>
                      <span className="bg-[#f0c040]/10 text-[#f0c040] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#f0c040]/20">
                        ESCROW: Rp {quest.bounty.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-[#8b93b8]">ID: {quest.id}</span>
                    </div>

                    <h3 className="text-white font-extrabold text-lg">{quest.title}</h3>
                    <p className="text-xs text-[#8b93b8] line-clamp-2">{quest.description}</p>
                    
                    {/* Parties Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#3e4875]/40 text-xs">
                      <div>
                        <p className="text-[#8b93b8] font-bold">Requester (Pembuat):</p>
                        <p className="text-white mt-0.5 font-semibold">{quest.requester.username}</p>
                      </div>
                      <div>
                        <p className="text-[#8b93b8] font-bold">Assignee (Worker):</p>
                        <p className="text-white mt-0.5 font-semibold">{quest.assigneeName || 'Belum ditugaskan'}</p>
                      </div>
                    </div>

                    {/* Dispute details box */}
                    {quest.dispute && (
                      <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-xs leading-relaxed">
                        <p className="text-red-400 font-bold mb-1">Alasan Banding / Sengketa:</p>
                        <p className="text-[#c8cee8]">"{quest.dispute.reason}"</p>
                        <p className="text-[10px] text-[#8b93b8] mt-1.5">
                          Diajukan oleh {quest.dispute.filedBy} pada {new Date(quest.dispute.filedAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}

                    {/* Proof links if submitted */}
                    {quest.proofOfWork && (
                      <div className="bg-[#1e2342] rounded-lg p-3 border border-[#3e4875]/50 text-xs">
                        <p className="text-[#2bb5a0] font-bold mb-1">Bukti Hasil Kerja (Worker):</p>
                        <p className="text-white">"{quest.proofOfWork.notes}"</p>
                        {quest.proofOfWork.link && (
                          <a 
                            href={quest.proofOfWork.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#f0c040] hover:underline block mt-1.5 font-semibold flex items-center gap-1"
                          >
                            🔗 Tautan Lampiran Bukti <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions for dispute */}
                  <div className="flex flex-col gap-2.5 min-w-[200px] bg-[#1e2342] p-4 rounded-xl border border-[#3e4875]/40 self-stretch justify-center">
                    <h4 className="text-center font-bold text-xs text-[#8b93b8] uppercase tracking-wider mb-1.5">Putusan Arbitrase</h4>
                    
                    <button
                      onClick={() => handleResolveDispute(quest.id, 'WORKER_WON')}
                      className="w-full bg-[#2bb5a0] hover:bg-[#239987] text-white font-extrabold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Award size={14} />
                      Menangkan Worker
                    </button>
                    
                    <button
                      onClick={() => handleResolveDispute(quest.id, 'REQUESTER_WON')}
                      className="w-full bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] font-extrabold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck size={14} />
                      Menangkan Requester
                    </button>
                    
                    <p className="text-[10px] text-[#8b93b8] leading-tight text-center mt-1.5">
                      Keputusan arbitrase akan langsung memotong/merilis saldo escrow ke salah satu pihak.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1a1f3c] border border-dashed border-[#3e4875] rounded-xl p-12 text-center">
                <span className="text-4xl block mb-3">🛡️</span>
                <h3 className="text-white font-bold mb-1">Sengketa Bersih!</h3>
                <p className="text-[#8b93b8] text-xs">Saat ini tidak ada kasus sengketa escrow aktif yang dilaporkan.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. USERS MANAGEMENT TABLE SUBTAB */}
        {activeSubTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#c8cee8] border-collapse">
              <thead>
                <tr className="bg-[#1a1f3c] text-[#8b93b8] font-bold uppercase tracking-wider text-[10px] border-b border-[#3e4875]/50">
                  <th className="p-4 rounded-tl-xl">Pengguna</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Peran (Role)</th>
                  <th className="p-4">Saldo Dompet</th>
                  <th className="p-4">Kredensial</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-xl text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3e4875]/30">
                {filteredUsers.map(u => {
                  const isEditingThis = editingUserId === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#1a1f3c]/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={u.avatarUrl} 
                            alt={u.username} 
                            className="w-8 h-8 rounded-full bg-[#1a1f3c] border border-[#3e4875]" 
                          />
                          <div>
                            <p className="text-white font-extrabold flex items-center gap-1.5">
                              {u.username}
                              <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-indigo-500/20">
                                LVL {u.level}
                              </span>
                            </p>
                            <p className="text-[10px] text-[#f0c040] mt-0.5">★ {u.rating.toFixed(1)} Rating</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{u.email || <span className="text-[#8b93b8]">Tidak ada email</span>}</td>
                      <td className="p-4">
                        <span className={`font-black uppercase tracking-wider text-[9px] px-2 py-0.5 rounded border ${
                          u.role === 'admin' 
                            ? 'bg-[#f0c040]/10 border-[#f0c040]/30 text-[#f0c040]' 
                            : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-white">
                        Rp {u.walletBalance.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-[#8b93b8]">
                        Pass: <b className="text-white text-xs">{u.password || '-'}</b>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold text-[10px] ${u.isBanned ? 'text-red-400' : 'text-[#2bb5a0]'}`}>
                          ● {u.isBanned ? 'BANNED' : 'AKTIF'}
                        </span>
                      </td>
                      <td className="p-4">
                        {isEditingThis ? (
                          <div className="bg-[#1a1f3c] p-3 rounded-lg border border-[#3e4875] space-y-3 max-w-xs ml-auto">
                            <div>
                              <label className="block text-[10px] font-bold text-[#8b93b8] mb-1">TOP UP SALDO (Rp):</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="number"
                                  placeholder="e.g. 500000"
                                  value={topUpAmount}
                                  onChange={e => setTopUpAmount(e.target.value)}
                                  className="bg-[#1e2342] border border-[#3e4875] rounded p-1.5 text-xs text-white outline-none w-full"
                                />
                                <button 
                                  onClick={() => handleTopUpSubmit(u.id)}
                                  className="bg-[#2bb5a0] text-white font-bold px-2 py-1 rounded text-xs"
                                >
                                  Tambah
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-[#8b93b8] mb-1">Set Level:</label>
                                <input
                                  type="number"
                                  placeholder={u.level.toString()}
                                  value={editLevel}
                                  onChange={e => setEditLevel(e.target.value)}
                                  className="bg-[#1e2342] border border-[#3e4875] rounded p-1 text-xs text-white outline-none w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-[#8b93b8] mb-1">Set Rating:</label>
                                <input
                                  type="text"
                                  placeholder={u.rating.toString()}
                                  value={editRating}
                                  onChange={e => setEditRating(e.target.value)}
                                  className="bg-[#1e2342] border border-[#3e4875] rounded p-1 text-xs text-white outline-none w-full"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-[#3e4875]/40">
                              <button 
                                onClick={() => handleSaveLevelRating(u.id)}
                                className="bg-[#f0c040] text-[#1b203e] font-bold px-2.5 py-1 rounded text-xs"
                              >
                                Simpan Profile
                              </button>
                              <button 
                                onClick={() => setEditingUserId(null)}
                                className="bg-transparent border border-[#3e4875] text-[#8b93b8] px-2 py-1 rounded text-xs hover:bg-[#3e4875]"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setTopUpAmount('');
                                setEditLevel(u.level.toString());
                                setEditRating(u.rating.toString());
                              }}
                              className="bg-[#3e4875]/60 hover:bg-[#3e4875] text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer"
                            >
                              ⚙️ Edit / Top Up
                            </button>
                            
                            <button
                              onClick={() => handleRoleToggle(u.id)}
                              className="bg-[#2bb5a0]/15 hover:bg-[#2bb5a0]/25 text-[#2bb5a0] font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer"
                            >
                              🎭 Ubah Role
                            </button>

                            <button
                              onClick={() => handleBanToggle(u.id)}
                              className={`font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                                u.isBanned 
                                  ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                              }`}
                            >
                              <Ban size={12} />
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. QUESTS MANAGEMENT SUBTAB */}
        {activeSubTab === 'quests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#c8cee8] border-collapse">
              <thead>
                <tr className="bg-[#1a1f3c] text-[#8b93b8] font-bold uppercase tracking-wider text-[10px] border-b border-[#3e4875]/50">
                  <th className="p-4 rounded-tl-xl">ID / Judul Quest</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Pembuat (Requester)</th>
                  <th className="p-4">Upah / Bounty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Status Escrow</th>
                  <th className="p-4 rounded-tr-xl text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3e4875]/30">
                {filteredQuestsList.map(q => (
                  <tr key={q.id} className="hover:bg-[#1a1f3c]/40 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-extrabold">{q.title}</p>
                        <p className="text-[10px] text-[#8b93b8] mt-0.5">ID: {q.id}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#1e2342] border border-[#3e4875] text-[#8b93b8] text-[10px] font-bold px-2 py-0.5 rounded">
                        {q.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={q.requester.avatarUrl} alt={q.requester.username} className="w-5 h-5 rounded-full" />
                        <span>{q.requester.username}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#f0c040]">
                      Rp {q.bounty.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`font-extrabold text-[10px] ${
                        q.status === 'COMPLETED' ? 'text-[#2bb5a0]' :
                        q.status === 'DISPUTED' ? 'text-red-400' :
                        q.status === 'IN_PROGRESS' ? 'text-blue-400' : 'text-[#f0c040]'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {q.escrowStatus || 'UNPAID'}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {q.status !== 'COMPLETED' && q.status !== 'CANCELLED' && q.escrowStatus !== 'REFUNDED' && (
                          <button
                            onClick={() => handleCancelAndRefundQuest(q.id)}
                            className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[#f0c040] font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                            title="Batalkan Quest & Refund Deposit Escrow"
                          >
                            <Undo2 size={13} />
                            Batalkan & Refund
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteQuest(q.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Quest Permanen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredQuestsList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#8b93b8]">
                      Tidak ada data quest yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Custom Confirmation Modal for iframe compatibility */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#2a3256] border border-[#3e4875] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#3e4875]">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <AlertOctagon className={confirmModal.isDanger ? "text-red-400" : "text-[#f0c040]"} size={22} />
                {confirmModal.title}
              </div>
              <button 
                onClick={() => setConfirmModal(null)}
                className="text-[#8b93b8] hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-[#c8cee8] leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3e4875]/60">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg bg-[#3a4475] hover:bg-[#434e80] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  const { type, targetId } = confirmModal;
                  setConfirmModal(null);
                  if (type === 'CANCEL_REFUND') executeCancelAndRefundQuest(targetId);
                  else if (type === 'DELETE_QUEST') executeDeleteQuest(targetId);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  confirmModal.isDanger 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
                    : 'bg-[#f0c040] hover:bg-amber-400 text-[#1b203e] shadow-lg shadow-[#f0c040]/20'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2b335a] border-2 border-[#f0c040] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
          <CheckCircle className="text-[#2bb5a0]" size={20} />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#8b93b8] hover:text-white ml-2 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
