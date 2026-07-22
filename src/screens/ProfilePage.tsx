import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { jobsApi } from '../api/jobs';
import { Quest, Category, UserProfile } from '../types';
import { QuestDetailModal } from '../components/modals/QuestDetailModal';
import { ActivityLog } from '../components/ui/ActivityLog';
import { 
  getSimulatedUsersList, 
  saveSimulatedUsersList, 
  getSimulatedCurrentUser, 
  setSimulatedCurrentUser,
  getSimulatedNotifications,
  markNotificationsAsRead,
  clearUserNotifications,
  getSimulatedUserConversations,
  getSimulatedChatMessages,
  sendSimulatedChatMessage,
  addSimulatedActivityLog,
  AppNotification,
  ConversationThread,
  ChatMessage
} from '../api/mockStorage';
import { 
  Settings, Briefcase, PlusCircle, History, Bell, LogOut, 
  ShieldAlert, Sparkles, Check, CheckCircle, AlertTriangle, 
  DollarSign, MapPin, Star, Laptop, Shield, MessageSquare,
  Send, Eye, Phone, Tag, BarChart2, TrendingUp, Award, Clock,
  Key, ShieldCheck, UserCheck, RefreshCw, Layers, Activity
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

const AVATAR_PRESETS = [
  { name: 'Adventurer', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=' },
  { name: 'Lorelei', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=' },
  { name: 'Bottts', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=' },
  { name: 'Fun Emoji', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=' },
  { name: 'Avataaars', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' }
];

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [activePage, setActivePage] = useState('Profil & Pengaturan');
  const [notifSubTab, setNotifSubTab] = useState<'notif' | 'chat'>('notif');

  // Quests & History States
  const [userQuests, setUserQuests] = useState<Quest[]>([]);
  const [activityFilter, setActivityFilter] = useState<'all' | 'posted' | 'accepted'>('all');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  // Selected Quest for Modal
  const selectedQuest = userQuests.find(q => q.id === selectedQuestId);

  // Profile Information States
  const [fullname, setFullname] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '081234567890');
  const [location, setLocation] = useState(user?.location || 'Bandung, Indonesia');
  const [bio, setBio] = useState(user?.serviceDescription || 'Anggota guild SideQuest yang berdedikasi.');
  const [skillsStr, setSkillsStr] = useState(user?.skills?.join(', ') || 'UI/UX, React, Figma');
  const [avatarSeed, setAvatarSeed] = useState(user?.username || 'user');
  const [selectedAvatarPreset, setSelectedAvatarPreset] = useState(AVATAR_PRESETS[0].url);

  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  // Notifications & Chat States
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessageText, setInputMessageText] = useState('');

  useEffect(() => {
    if (user) {
      setFullname(user.username);
      setPhone(user.phone || '081234567890');
      setLocation(user.location || 'Bandung, Indonesia');
      setBio(user.serviceDescription || 'Anggota guild SideQuest yang berdedikasi.');
      setSkillsStr(user.skills?.join(', ') || 'UI/UX, React, Figma');
      
      setHasService(user.hasService || false);
      setServiceTitle(user.serviceTitle || '');
      setServiceCategory(user.serviceCategory || 'Dev');
      setServicePrice(user.servicePrice?.toString() || '150000');
      setServicePriceUnit(user.servicePriceUnit || 'proyek');
      setServiceDescription(user.serviceDescription || '');
      setServiceSkills(user.serviceSkills?.join(', ') || '');

      fetchNotifications();
      fetchConversations();
    }
    fetchUserQuests();
  }, [user]);

  useEffect(() => {
    if (selectedConvId) {
      const msgs = getSimulatedChatMessages(selectedConvId);
      setChatMessages(msgs);
    }
  }, [selectedConvId]);

  const fetchUserQuests = async () => {
    try {
      const data = await jobsApi.getAvailableJobs();
      setUserQuests(data);
    } catch (err) {
      console.error('Failed to fetch user quests', err);
    }
  };

  const fetchNotifications = () => {
    if (user) {
      const notifs = getSimulatedNotifications(user.id);
      setNotifications(notifs);
    }
  };

  const fetchConversations = () => {
    if (user) {
      const threads = getSimulatedUserConversations(user.id);
      setConversations(threads);
      if (threads.length > 0 && !selectedConvId) {
        setSelectedConvId(threads[0].conversationId);
      }
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
            username: fullname.trim(),
            phone: phone.trim(),
            location: location.trim(),
            serviceDescription: bio.trim(),
            skills: skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
            avatarUrl: `${selectedAvatarPreset}${encodeURIComponent(avatarSeed.trim())}`
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

      addSimulatedActivityLog({
        userId: user.id,
        type: 'PROFILE_UPDATED',
        title: 'Pembaruan Profil Pengguna',
        description: `Memperbarui nama (${fullname.trim()}), lokasi (${location.trim() || 'Lokal'}), dan keahlian (${skillsStr || 'Umum'}).`,
        category: 'PROFILE',
        status: 'INFO',
        icon: '👤'
      });

      alert('✨ Profil & Pengaturan Anda berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui profil.');
    }
  };

  // Change Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (!oldPassword) {
      setPasswordError('Masukkan kata sandi lama.');
      return;
    }

    // Verify old password against stored password or default demo password
    const expectedPass = user.password || (user.id === 'demo-admin' ? 'admin' : user.id === 'demo-client' ? 'client' : 'worker');
    if (oldPassword !== expectedPass) {
      setPasswordError('Kata sandi lama yang Anda masukkan salah!');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setPasswordError('Kata sandi baru minimal 4 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    try {
      const usersList = getSimulatedUsersList();
      const updated = usersList.map(u => {
        if (u.id === user.id) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      saveSimulatedUsersList(updated);
      
      const updatedCur = updated.find(u => u.id === user.id);
      if (updatedCur) {
        setSimulatedCurrentUser(updatedCur);
        refreshUser();
      }

      addSimulatedActivityLog({
        userId: user.id,
        type: 'PASSWORD_CHANGED',
        title: 'Sandi Akun Diperbarui',
        description: 'Kata sandi akun Anda telah diperbarui secara aman.',
        category: 'ACCOUNT',
        status: 'SUCCESS',
        icon: '🔑'
      });

      setPasswordMsg('🎉 Kata sandi berhasil diperbarui!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Gagal mengubah kata sandi.');
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

      addSimulatedActivityLog({
        userId: user.id,
        type: 'SERVICE_UPDATED',
        title: hasService ? 'Layanan Jasa Diaktifkan' : 'Layanan Jasa Dinonaktifkan',
        description: hasService 
          ? `Membuka penawaran jasa "${serviceTitle.trim()}" (Tarif: Rp ${(isNaN(priceNum) ? 150000 : priceNum).toLocaleString('id-ID')}/${servicePriceUnit}).`
          : 'Layanan penawaran jasa Anda telah dinonaktifkan.',
        amount: isNaN(priceNum) ? 150000 : priceNum,
        category: 'PROFILE',
        status: 'SUCCESS',
        icon: '⚡'
      });
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

  // Chat Sending Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessageText.trim() || !selectedConvId) return;

    const currentThread = conversations.find(c => c.conversationId === selectedConvId);
    if (!currentThread) return;

    const newMsg = sendSimulatedChatMessage({
      conversationId: selectedConvId,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatarUrl,
      recipientId: currentThread.otherUserId,
      text: inputMessageText.trim(),
      questId: currentThread.questId
    });

    setInputMessageText('');
    setChatMessages(prev => [...prev, newMsg]);
    fetchConversations();
  };

  // Start Chat with a target user
  const startChatWithUser = (targetUserId: string, targetUsername: string, targetAvatarUrl: string, questId?: string) => {
    if (!user) return;
    const convId = [user.id, targetUserId].sort().join('_conv_');
    
    // Check if conversation exists
    const existing = conversations.find(c => c.conversationId === convId);
    if (!existing) {
      sendSimulatedChatMessage({
        conversationId: convId,
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatarUrl,
        recipientId: targetUserId,
        text: `Halo ${targetUsername}! Saya ingin berdiskusi mengenai pekerjaan di SideQuest.`,
        questId
      });
      fetchConversations();
    }
    
    setSelectedConvId(convId);
    setActivePage('Notifikasi & Chat');
    setNotifSubTab('chat');
  };

  // Callback Handlers for QuestDetailModal
  const handleApplyQuest = async (questId: string) => {
    try {
      await jobsApi.applyJob(questId);
      await fetchUserQuests();
      fetchNotifications();
    } catch (error: any) {
      alert(error.message || "Gagal mendaftar");
    }
  };

  const handleApproveApplicant = async (questId: string, applicantId: string) => {
    try {
      await jobsApi.approveApplicant(questId, applicantId);
      await fetchUserQuests();
      fetchNotifications();
    } catch (error) {
      alert("Gagal menyetujui pekerja");
    }
  };

  const handleSubmitProof = async (questId: string, notes: string, link?: string) => {
    try {
      await jobsApi.submitProof(questId, notes, link);
      await fetchUserQuests();
      fetchNotifications();
    } catch (error) {
      alert("Gagal menyerahkan bukti pekerjaan");
    }
  };

  const handleApproveWork = async (questId: string) => {
    try {
      await jobsApi.approveWork(questId);
      await fetchUserQuests();
      fetchNotifications();
      refreshUser();
    } catch (error) {
      alert("Gagal menyetujui pekerjaan");
    }
  };

  const handleFileDispute = async (questId: string, reason: string) => {
    try {
      await jobsApi.fileDispute(questId, reason);
      await fetchUserQuests();
      fetchNotifications();
    } catch (error) {
      alert("Gagal mengajukan dispute");
    }
  };

  const handleResolveDispute = async (questId: string, decision: 'WORKER_WON' | 'REQUESTER_WON') => {
    try {
      await jobsApi.resolveDispute(questId, decision);
      await fetchUserQuests();
      fetchNotifications();
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

  const handleMarkAllNotificationsRead = () => {
    if (user) {
      markNotificationsAsRead(user.id);
      fetchNotifications();
    }
  };

  const handleClearAllNotifications = () => {
    if (user) {
      clearUserNotifications(user.id);
      fetchNotifications();
    }
  };

  // Helper functions for quest relationship
  const cleanUserId = user.id.replace(/^ws-/, '');

  const isUserRequester = (q: Quest) => {
    return q.requester.id === user.id || q.requester.id === cleanUserId || `ws-${q.requester.id}` === user.id;
  };

  const isUserApplicant = (q: Quest) => {
    return q.applicants?.some(a => {
      const cleanAppId = a.id.replace(/^ws-/, '');
      return a.id === user.id || cleanAppId === cleanUserId || `ws-${cleanAppId}` === user.id;
    }) || false;
  };

  const isUserAssignee = (q: Quest) => {
    if (!q.assigneeId) return false;
    const cleanAssigneeId = q.assigneeId.replace(/^ws-/, '');
    return q.assigneeId === user.id || cleanAssigneeId === cleanUserId || `ws-${cleanAssigneeId}` === user.id;
  };

  const isUserWorker = (q: Quest) => {
    return isUserAssignee(q) || isUserApplicant(q);
  };

  // Analytics & Stats Calculations for Riwayat
  const myPostedQuests = userQuests.filter(isUserRequester);
  const myAcceptedQuests = userQuests.filter(isUserWorker);

  const totalEscrowCommitted = myPostedQuests.reduce((acc, q) => acc + q.bounty, 0);
  const totalEarnedAsWorker = myAcceptedQuests.filter(q => q.status === 'COMPLETED').reduce((acc, q) => acc + q.bounty, 0);
  
  const completedCount = userQuests.filter(q => (isUserRequester(q) || isUserWorker(q)) && q.status === 'COMPLETED').length;
  const inProgressCount = userQuests.filter(q => (isUserRequester(q) || isUserWorker(q)) && (q.status === 'IN_PROGRESS' || q.status === 'ESCROW_LOCKED')).length;
  const appliedCount = userQuests.filter(q => (isUserRequester(q) || isUserWorker(q)) && (q.status === 'OPEN' || q.status === 'APPLIED' || (isUserApplicant(q) && !isUserAssignee(q)))).length;
  const disputeCount = userQuests.filter(q => (isUserRequester(q) || isUserWorker(q)) && q.status === 'DISPUTED').length;

  const totalMyQuests = myPostedQuests.length + myAcceptedQuests.length;
  const successRate = totalMyQuests > 0 ? Math.round((completedCount / totalMyQuests) * 100) : 100;

  // Filter lists
  const filteredQuests = userQuests.filter(q => {
    if (activityFilter === 'posted') return isUserRequester(q);
    if (activityFilter === 'accepted') return isUserWorker(q);
    return isUserRequester(q) || isUserWorker(q);
  });

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const selectedThread = conversations.find(c => c.conversationId === selectedConvId);

  return (
    <div className="flex bg-[#2e3557] min-h-[calc(100vh-80px)] text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#252b4e] border-r border-[#3e4875] flex flex-col shrink-0">
        
        {/* User Summary Section */}
        <div className="p-6 flex flex-col items-center border-b border-[#3e4875]">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#f0c040] mb-3 bg-[#3a4475] shadow-lg relative group">
            <img 
              src={user.avatarUrl} 
              alt={fullname} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {user.isVerified && (
              <span className="absolute bottom-0 right-0 bg-[#2bb5a0] text-white p-1 rounded-full border-2 border-[#252b4e]" title="Guild Verified ID">
                <ShieldCheck size={12} />
              </span>
            )}
          </div>
          <h2 className="text-white font-bold text-base mb-1 text-center flex items-center gap-1.5">
            {fullname}
          </h2>
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
              className="flex-1 bg-[#2bb5a0]/10 border border-[#2bb5a0]/30 hover:bg-[#2bb5a0] text-white text-[11px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
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

                addSimulatedActivityLog({
                  userId: user.id,
                  type: 'PAYOUT_SUCCESS',
                  title: 'Top Up Saldo Demo Berhasil',
                  description: 'Menambahkan saldo latihan sebesar Rp 1.000.000 ke dompet Escrow Anda.',
                  amount: 1000000,
                  category: 'PAYOUT',
                  status: 'SUCCESS',
                  icon: '💰'
                });

                alert('Tambah Saldo Demo Berhasil! Rp 1.000.000 telah ditambahkan.');
              }}
              className="flex-1 bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] text-[11px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
            >
              +1 Juta
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 flex flex-col gap-1">
          {[
            { id: 'Profil & Pengaturan', icon: <Settings size={16} /> },
            { id: 'Notifikasi & Chat', icon: <Bell size={16} />, count: unreadNotifCount },
            { id: 'Log Aktivitas', icon: <Activity size={16} /> },
            { id: 'Buka Layanan Jasa', icon: <Laptop size={16} /> },
            { id: 'Posting Pekerjaan', icon: <PlusCircle size={16} /> },
            { id: 'Riwayat Aktivitas', icon: <History size={16} />, count: filteredQuests.length }
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
        
        {/* PAGE 1: FULL RESTORED PROFILE SETTINGS */}
        {activePage === 'Profil & Pengaturan' && (
          <div className="max-w-4xl flex flex-col gap-8 animate-fade-in">
            <div className="border-b border-[#3e4875] pb-4">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Settings size={24} className="text-[#2bb5a0]" /> Profil & Pengaturan Akun
              </h1>
              <p className="text-[#8b93b8] text-xs mt-1">
                Kelola informasi akun, kata sandi, verifikasi id guild, dan kustomisasi avatar Anda.
              </p>
            </div>

            {/* SECTION 1: PERSONAL & GUILD DATA */}
            <form onSubmit={handleSaveProfile} className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] space-y-6">
              <h3 className="text-white font-extrabold text-sm border-b border-[#3e4875]/60 pb-3 flex items-center gap-2">
                <UserCheck size={18} className="text-[#f0c040]" /> 1. Data Diri & Keahlian Guild
              </h3>

              {/* Avatar Preset Picker */}
              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-3">Pilih Gaya Avatar</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                  {AVATAR_PRESETS.map((preset) => {
                    const sampleUrl = `${preset.url}${encodeURIComponent(fullname || 'user')}`;
                    const isSelected = selectedAvatarPreset === preset.url;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setSelectedAvatarPreset(preset.url)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#2bb5a0]/20 border-[#2bb5a0] shadow-md' 
                            : 'bg-[#2e3557] border-[#3e4875] hover:border-[#8b93b8]'
                        }`}
                      >
                        <img src={sampleUrl} alt={preset.name} className="w-12 h-12 rounded-full bg-[#131821]" />
                        <span className="text-[10px] font-bold text-white">{preset.name}</span>
                      </button>
                    );
                  })}
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
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Email Terdaftar</label>
                  <input 
                    type="email" 
                    disabled
                    value={user.email || `${user.username.toLowerCase()}@sidequest.com`}
                    className="w-full bg-[#2e3557]/40 border border-[#3e4875] rounded-xl px-4 py-3 text-[#8b93b8] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Nomor Telepon / WhatsApp</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 081234567890"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Lokasi Utama (Kota, Negara)</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Daftar Keahlian Utama (Pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  value={skillsStr}
                  onChange={e => setSkillsStr(e.target.value)}
                  placeholder="e.g. UI/UX, React, Tailwind, Video Editing, Writing"
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Biografi / Ringkasan Profil</label>
                <textarea 
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Ceritakan tentang keahlian atau bisnis jasa Anda..."
                  className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="submit" className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-extrabold px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-md">
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>

            {/* SECTION 2: CHANGE PASSWORD */}
            <form onSubmit={handleChangePassword} className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] space-y-6">
              <h3 className="text-white font-extrabold text-sm border-b border-[#3e4875]/60 pb-3 flex items-center gap-2">
                <Key size={18} className="text-[#a78bfa]" /> 2. Keamanan & Ubah Kata Sandi Akun
              </h3>

              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordMsg && (
                <div className="bg-[#2bb5a0]/10 border border-[#2bb5a0]/30 text-[#2bb5a0] p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{passwordMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Kata Sandi Saat Ini</label>
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#8b93b8] text-xs font-bold uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                  />
                </div>
              </div>

              <button type="submit" className="bg-[#a78bfa] hover:bg-[#8b5cf6] text-white text-xs font-extrabold px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-md">
                Perbarui Kata Sandi
              </button>
            </form>

            {/* SECTION 3: GUILD VERIFICATION STATUS */}
            <div className="bg-[#3a4475] rounded-xl p-6 border border-[#3e4875] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2bb5a0]/15 border border-[#2bb5a0]/30 flex items-center justify-center text-[#2bb5a0]">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                    Lencana Verifikasi Guild ID: <span className="text-[#2bb5a0]">TERVERIFIKASI ✓</span>
                  </h4>
                  <p className="text-[#8b93b8] text-xs mt-0.5">Akun Anda terhubung dengan identitas terverifikasi untuk bertransaksi aman di Escrow SideQuest.</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Identitas Guild Anda sudah terverifikasi 100%.')}
                className="bg-[#2e3557] border border-[#3e4875] hover:border-[#8b93b8] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Cek Dokumen
              </button>
            </div>
          </div>
        )}

        {/* PAGE 2: LOG AKTIVITAS & RIWAYAT PROGRESS */}
        {activePage === 'Log Aktivitas' && (
          <div className="max-w-5xl animate-fade-in space-y-6">
            <ActivityLog
              userId={user.id}
              userName={fullname}
              onQuestSelect={(questId) => setSelectedQuestId(questId)}
            />
          </div>
        )}

        {/* PAGE 3: NOTIFIKASI & SEKSI CHAT ANTAR PENGGUNA */}
        {activePage === 'Notifikasi & Chat' && (
          <div className="max-w-5xl animate-fade-in flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#3e4875] pb-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Bell size={24} className="text-[#f0c040]" /> Notifikasi & Chat Direkt
                </h1>
                <p className="text-[#8b93b8] text-xs mt-1">
                  Pantau notifikasi pekerjaan serta berdiskusi langsung dengan pengguna lain di SideQuest.
                </p>
              </div>

              {/* Sub tab selection */}
              <div className="flex bg-[#1e2342] p-1 rounded-xl border border-[#3e4875]">
                <button
                  onClick={() => setNotifSubTab('notif')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    notifSubTab === 'notif' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  <Bell size={14} /> Notifikasi ({notifications.length})
                </button>
                <button
                  onClick={() => setNotifSubTab('chat')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    notifSubTab === 'chat' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  <MessageSquare size={14} /> Chat Direct ({conversations.length})
                </button>
              </div>
            </div>

            {/* SUB-TAB 1: NOTIFIKASI LIST */}
            {notifSubTab === 'notif' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#252b4e] p-4 rounded-xl border border-[#3e4875]/60">
                  <p className="text-xs text-[#8b93b8]">
                    Showing <strong className="text-white">{notifications.length}</strong> notifications for user.
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleMarkAllNotificationsRead}
                      className="bg-transparent border border-[#3e4875] hover:border-[#8b93b8] text-[#c8cee8] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Tandai Dibaca
                    </button>
                    <button 
                      onClick={handleClearAllNotifications}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Bersihkan
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="bg-[#252b4e] border border-[#3e4875]/60 hover:border-[#3e4875] rounded-xl p-5 flex items-start justify-between gap-4 transition-all shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl bg-[#1e2342] w-12 h-12 rounded-xl flex items-center justify-center border border-[#3e4875]/40 shrink-0">
                          {n.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
                            {n.title}
                            {!n.read && <span className="w-2 h-2 rounded-full bg-red-400 block shrink-0 animate-pulse" />}
                          </h3>
                          <p className="text-xs text-[#c8cee8] mt-1 leading-relaxed">{n.body}</p>
                          <p className="text-[10px] text-[#8b93b8] mt-2 font-semibold">{n.date}</p>
                        </div>
                      </div>

                      {/* Notification Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        {n.questId && (
                          <button
                            onClick={() => setSelectedQuestId(n.questId!)}
                            className="bg-[#2bb5a0] hover:bg-[#239987] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Eye size={14} /> Lihat Quest
                          </button>
                        )}
                        {n.senderName && (
                          <button
                            onClick={() => {
                              const usersList = getSimulatedUsersList();
                              const target = usersList.find(u => u.username === n.senderName);
                              if (target) {
                                startChatWithUser(target.id, target.username, target.avatarUrl, n.questId);
                              } else {
                                setNotifSubTab('chat');
                              }
                            }}
                            className="bg-[#1e2342] border border-[#3e4875] hover:bg-[#3a4475] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare size={14} /> Chat Sender
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {notifications.length === 0 && (
                    <div className="bg-[#252b4e] border border-dashed border-[#3e4875]/80 rounded-xl p-12 text-center">
                      <span className="text-3xl block mb-3">🔔</span>
                      <h3 className="text-white font-bold mb-1">Notifikasi Bersih</h3>
                      <p className="text-[#8b93b8] text-xs">Belum ada pembaruan notifikasi baru.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: INTEGRATED DIRECT CHAT SECTION */}
            {notifSubTab === 'chat' && (
              <div className="bg-[#252b4e] border border-[#3e4875] rounded-xl overflow-hidden flex h-[580px]">
                {/* Left: Contact/Threads Sidebar */}
                <div className="w-72 bg-[#1e2342] border-r border-[#3e4875] flex flex-col shrink-0">
                  <div className="p-4 border-b border-[#3e4875] flex items-center justify-between">
                    <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#2bb5a0]" /> Percakapan
                    </h3>
                    <button 
                      onClick={fetchConversations}
                      className="text-[#8b93b8] hover:text-white p-1"
                      title="Refresh Chat"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>

                  <div className="p-3 border-b border-[#3e4875]/60 bg-[#171b33]">
                    <p className="text-[10px] text-[#8b93b8] uppercase font-bold tracking-wider mb-2">Mulai Chat Kontak Demo</p>
                    <div className="flex gap-2">
                      {getSimulatedUsersList().filter(u => u.id !== user.id).map(demoUser => (
                        <button
                          key={demoUser.id}
                          onClick={() => startChatWithUser(demoUser.id, demoUser.username, demoUser.avatarUrl)}
                          className="flex items-center gap-1.5 bg-[#252b4e] hover:bg-[#3a4475] border border-[#3e4875] px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                        >
                          <img src={demoUser.avatarUrl} alt={demoUser.username} className="w-5 h-5 rounded-full" />
                          <span>{demoUser.username}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#3e4875]/40">
                    {conversations.map(thread => {
                      const isSelected = thread.conversationId === selectedConvId;
                      return (
                        <div
                          key={thread.conversationId}
                          onClick={() => setSelectedConvId(thread.conversationId)}
                          className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#3a4475]' : 'hover:bg-[#2a3052]'
                          }`}
                        >
                          <img src={thread.otherUserAvatar} alt={thread.otherUserName} className="w-10 h-10 rounded-full border border-[#3e4875]" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-white font-bold text-xs truncate">{thread.otherUserName}</h4>
                              <span className="text-[10px] text-[#8b93b8]">{thread.lastMessageTime}</span>
                            </div>
                            <p className="text-xs text-[#8b93b8] truncate">{thread.lastMessage}</p>
                          </div>
                        </div>
                      );
                    })}

                    {conversations.length === 0 && (
                      <p className="text-center text-xs text-[#8b93b8] p-6">Belum ada percakapan.</p>
                    )}
                  </div>
                </div>

                {/* Right: Active Chat Window */}
                <div className="flex-1 flex flex-col bg-[#131821]">
                  {selectedThread ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 bg-[#1a1f3c] border-b border-[#3e4875] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={selectedThread.otherUserAvatar} alt={selectedThread.otherUserName} className="w-10 h-10 rounded-full border border-[#3e4875]" />
                          <div>
                            <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                              {selectedThread.otherUserName}
                              <span className="w-2 h-2 rounded-full bg-[#2bb5a0]" title="Online" />
                            </h3>
                            <p className="text-[10px] text-[#8b93b8]">Diskusi Pekerjaan & Escrow SideQuest</p>
                          </div>
                        </div>

                        {selectedThread.questId && (
                          <button
                            onClick={() => setSelectedQuestId(selectedThread.questId!)}
                            className="bg-[#2bb5a0]/15 border border-[#2bb5a0]/30 hover:bg-[#2bb5a0] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> Quest Terkait
                          </button>
                        )}
                      </div>

                      {/* Messages Display */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
                        {chatMessages.map(msg => {
                          const isMe = msg.senderId === user.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                                isMe 
                                  ? 'bg-[#2bb5a0] text-white rounded-tr-none' 
                                  : 'bg-[#252b4e] border border-[#3e4875] text-[#c8cee8] rounded-tl-none'
                              }`}>
                                <p className="font-medium">{msg.text}</p>
                                <span className={`text-[9px] block text-right mt-1 font-mono ${isMe ? 'text-white/80' : 'text-[#8b93b8]'}`}>
                                  {msg.sentAt}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {chatMessages.length === 0 && (
                          <div className="text-center text-[#8b93b8] text-xs py-12">
                            Mulai obrolan baru dengan {selectedThread.otherUserName}.
                          </div>
                        )}
                      </div>

                      {/* Quick Shortcuts */}
                      <div className="px-4 py-2 bg-[#1a1f3c]/60 border-t border-[#3e4875]/40 flex gap-2 overflow-x-auto text-[11px]">
                        {[
                          "Apakah quest ini masih tersedia?",
                          "Saya sudah menyerahkan bukti pengerjaan.",
                          "Terima kasih atas persetujuannya!"
                        ].map((txt) => (
                          <button
                            key={txt}
                            onClick={() => setInputMessageText(txt)}
                            className="bg-[#252b4e] hover:bg-[#3a4475] border border-[#3e4875] text-[#c8cee8] px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
                          >
                            {txt}
                          </button>
                        ))}
                      </div>

                      {/* Message Input Box */}
                      <form onSubmit={handleSendMessage} className="p-3 bg-[#1a1f3c] border-t border-[#3e4875] flex gap-2">
                        <input 
                          type="text" 
                          value={inputMessageText}
                          onChange={e => setInputMessageText(e.target.value)}
                          placeholder="Ketik pesan..."
                          className="flex-1 bg-[#2e3557] border border-[#3e4875] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                        />
                        <button 
                          type="submit"
                          className="bg-[#2bb5a0] hover:bg-[#239987] text-white p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Send size={16} />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#8b93b8]">
                      <MessageSquare size={40} className="mb-2 opacity-50" />
                      <p className="text-xs">Pilih percakapan di sebelah kiri untuk mulai mengobrol.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAGE 3: BUKA LAYANAN JASA */}
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

        {/* PAGE 4: POST QUEST */}
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

        {/* PAGE 5: ACTIVITY HISTORY WITH STATISTICAL DASHBOARD */}
        {activePage === 'Riwayat Aktivitas' && (
          <div className="max-w-5xl animate-fade-in flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3e4875] pb-4 gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <BarChart2 size={24} className="text-[#2bb5a0]" /> Riwayat Aktivitas & Statistik
                </h1>
                <p className="text-[#8b93b8] text-xs mt-1">
                  Pantau performa, riwayat transaksi escrow, dan statistik pengerjaan quest Anda.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActivePage('Log Aktivitas')}
                  className="px-3.5 py-1.5 bg-[#2bb5a0]/15 hover:bg-[#2bb5a0]/30 border border-[#2bb5a0]/40 text-[#2bb5a0] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Timeline Log Aktivitas</span>
                </button>
              
              {/* Filter Tabs */}
              <div className="flex bg-[#1e2342] p-1 rounded-xl border border-[#3e4875] self-start sm:self-auto text-xs">
                <button
                  onClick={() => setActivityFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    activityFilter === 'all' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  Semua Aktivitas
                </button>
                <button
                  onClick={() => setActivityFilter('posted')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    activityFilter === 'posted' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  Sebagai Requester
                </button>
                <button
                  onClick={() => setActivityFilter('accepted')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    activityFilter === 'accepted' ? 'bg-[#2bb5a0] text-white' : 'text-[#8b93b8] hover:text-white'
                  }`}
                >
                  Sebagai Worker
                </button>
              </div>
            </div>
            </div>

            {/* TOP STATISTICAL ANALYTICS DASHBOARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#252b4e] border border-[#3e4875] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Posted (Requester)</span>
                  <Briefcase className="w-5 h-5 text-[#f0c040]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{myPostedQuests.length}</p>
                  <p className="text-[11px] text-[#2bb5a0] mt-1 font-semibold">
                    Escrow: Rp {totalEscrowCommitted.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="bg-[#252b4e] border border-[#3e4875] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Diambil (Worker)</span>
                  <Award className="w-5 h-5 text-[#2bb5a0]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{myAcceptedQuests.length}</p>
                  <p className="text-[11px] text-[#2bb5a0] mt-1 font-semibold">
                    Bounty Cair: Rp {totalEarnedAsWorker.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="bg-[#252b4e] border border-[#3e4875] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Tingkat Keberhasilan</span>
                  <TrendingUp className="w-5 h-5 text-[#a78bfa]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{successRate}%</p>
                  <p className="text-[11px] text-[#8b93b8] mt-1">
                    {completedCount} Selesai / {totalMyQuests} Total
                  </p>
                </div>
              </div>

              <div className="bg-[#252b4e] border border-[#3e4875] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#8b93b8] text-xs font-bold uppercase tracking-wider">Aktif di Escrow</span>
                  <Clock className="w-5 h-5 text-[#ff7878]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{inProgressCount + appliedCount}</p>
                  <p className="text-[11px] text-[#8b93b8] mt-1">
                    {inProgressCount} Pengerjaan • {appliedCount} Masa Review
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS BREAKDOWN PROGRESS BAR */}
            <div className="bg-[#252b4e] border border-[#3e4875] rounded-xl p-5 space-y-3">
              <h3 className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} className="text-[#2bb5a0]" /> Distribusi Status Pekerjaan
              </h3>

              <div className="w-full h-3 bg-[#131821] rounded-full overflow-hidden flex">
                <div style={{ width: `${totalMyQuests > 0 ? (completedCount / totalMyQuests) * 100 : 0}%` }} className="bg-[#2bb5a0] h-full" title="Completed" />
                <div style={{ width: `${totalMyQuests > 0 ? (inProgressCount / totalMyQuests) * 100 : 0}%` }} className="bg-[#a78bfa] h-full" title="In Progress" />
                <div style={{ width: `${totalMyQuests > 0 ? (appliedCount / totalMyQuests) * 100 : 0}%` }} className="bg-[#f0c040] h-full" title="Review" />
                <div style={{ width: `${totalMyQuests > 0 ? (disputeCount / totalMyQuests) * 100 : 0}%` }} className="bg-red-400 h-full" title="Disputed" />
              </div>

              <div className="flex flex-wrap gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2bb5a0]" />
                  <span className="text-white font-bold">Selesai: {completedCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" />
                  <span className="text-white font-bold">Dalam Pengerjaan: {inProgressCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f0c040]" />
                  <span className="text-white font-bold">Review / Applied: {appliedCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-white font-bold">Dispute: {disputeCount}</span>
                </div>
              </div>
            </div>

            {/* QUEST LIST */}
            {filteredQuests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuests.map(quest => {
                  const isMyPost = isUserRequester(quest);
                  const isApplicantOnly = isUserApplicant(quest) && !isUserAssignee(quest) && quest.status !== 'COMPLETED' && quest.status !== 'CANCELLED';

                  let statusLabel = quest.status as string;
                  let statusBadgeClass = "bg-[#3e4875] text-white border-[#4e5885]";

                  if (isApplicantOnly || quest.status === 'APPLIED') {
                    statusLabel = "PENDING";
                    statusBadgeClass = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                  } else if (quest.status === 'IN_PROGRESS') {
                    statusLabel = "IN PROGRESS";
                    statusBadgeClass = "bg-purple-500/20 text-purple-300 border-purple-500/40";
                  } else if (quest.status === 'ESCROW_LOCKED') {
                    statusLabel = "REVIEW BUKTI";
                    statusBadgeClass = "bg-blue-500/20 text-blue-300 border-blue-500/40";
                  } else if (quest.status === 'DISPUTED') {
                    statusLabel = "DISPUTE";
                    statusBadgeClass = "bg-red-500/20 text-red-300 border-red-500/40";
                  } else if (quest.status === 'COMPLETED') {
                    statusLabel = "SELESAI";
                    statusBadgeClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                  } else if (quest.status === 'OPEN') {
                    statusLabel = "OPEN";
                    statusBadgeClass = "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
                  } else if (quest.status === 'CANCELLED') {
                    statusLabel = "DIBATALKAN";
                    statusBadgeClass = "bg-gray-500/20 text-gray-300 border-gray-500/40";
                  }

                  return (
                    <div 
                      key={quest.id}
                      onClick={() => setSelectedQuestId(quest.id)}
                      className="bg-[#252b4e] border border-[#3e4875]/80 hover:border-[#f0c040] rounded-xl p-5 cursor-pointer transition-all flex flex-col justify-between group shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                            isMyPost 
                              ? 'bg-[#f0c040]/10 border-[#f0c040]/20 text-[#f0c040]' 
                              : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                          }`}>
                            {isMyPost ? 'Requester' : 'Worker'}
                          </span>
                          
                          <span className="text-[10px] text-[#8b93b8] font-mono">ID: {quest.id}</span>
                        </div>

                        <h3 className="text-white font-extrabold text-sm mb-1 group-hover:text-[#f0c040] transition-colors">{quest.title}</h3>
                        <p className="text-[#8b93b8] text-xs line-clamp-2 mb-4">{quest.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#3e4875]/40 mt-auto text-xs">
                        <div>
                          <p className="text-[#8b93b8] text-[9px] uppercase font-bold">Bounty Escrow</p>
                          <p className="text-[#2bb5a0] font-black">Rp {quest.bounty.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#8b93b8] text-[9px] uppercase font-bold mb-0.5">Status</p>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border inline-block ${statusBadgeClass}`}>
                            {statusLabel}
                          </span>
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

      </main>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestDetailModal
          quest={selectedQuest}
          currentUserId={user.id}
          onClose={() => setSelectedQuestId(null)}
          onAccept={handleApplyQuest}
          onApproveApplicant={handleApproveApplicant}
          onSubmitProof={handleSubmitProof}
          onApproveWork={handleApproveWork}
          onFileDispute={handleFileDispute}
          onResolveDispute={handleResolveDispute}
          onClaimToken={handleClaimToken}
          onUserClick={(username, avatarUrl) => {
            const usersList = getSimulatedUsersList();
            const target = usersList.find(u => u.username === username);
            if (target) {
              startChatWithUser(target.id, target.username, target.avatarUrl, selectedQuest.id);
              setSelectedQuestId(null);
            }
          }}
        />
      )}
    </div>
  );
}
