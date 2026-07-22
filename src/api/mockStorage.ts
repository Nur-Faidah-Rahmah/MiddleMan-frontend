import { Quest, UserProfile } from '../types';
import { mockQuests } from '../data/mockData';

const QUESTS_KEY = 'sq_quests_simulated';
const USER_KEY = 'sq_user_simulated';
const USERS_LIST_KEY = 'sq_users_list_simulated';
const NOTIFICATIONS_KEY = 'sq_notifications_simulated';
const CHATS_KEY = 'sq_chats_simulated';
const ACTIVITY_LOGS_KEY = 'sq_activity_logs_simulated';

export interface ActivityItem {
  id: string;
  userId: string;
  type: 'QUEST_COMPLETED' | 'PROFILE_UPDATED' | 'PAYOUT_SUCCESS' | 'QUEST_POSTED' | 'QUEST_APPLIED' | 'SERVICE_UPDATED' | 'PASSWORD_CHANGED';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  questId?: string;
  icon?: string;
  category: 'QUEST' | 'PROFILE' | 'PAYOUT' | 'ACCOUNT';
  status: 'SUCCESS' | 'PENDING' | 'INFO';
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  icon: string;
  questId?: string;
  type?: 'APPLICATION' | 'APPROVAL' | 'PROOF' | 'APPROVED_WORK' | 'DISPUTE' | 'CHAT' | 'SYSTEM';
  senderName?: string;
  senderAvatar?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  sentAt: string;
  questId?: string;
}

export interface ConversationThread {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  questId?: string;
}

// Initialize the mock database with default accounts
const getInitialUsers = (): UserProfile[] => {
  return [
    {
      id: 'demo-admin',
      username: 'Admin',
      email: 'admin@sidequest.com',
      password: 'admin',
      role: 'admin',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
      level: 10,
      exp: 4200,
      expToNextLevel: 5000,
      walletBalance: 10000000,
      rating: 5.0,
      completedJobsCount: 0,
      phone: '081234567890',
      location: 'Bandung, Indonesia',
      isVerified: true,
      skills: ['Escrow', 'Management', 'Arbitrase']
    },
    {
      id: 'demo-client',
      username: 'Client_Demo',
      email: 'client@sidequest.com',
      password: 'client',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=client',
      level: 3,
      exp: 800,
      expToNextLevel: 2000,
      walletBalance: 5000000,
      rating: 4.8,
      completedJobsCount: 0,
      phone: '082198765432',
      location: 'Jakarta, Indonesia',
      isVerified: true,
      skills: ['UI/UX', 'Video Production', 'Branding']
    },
    {
      id: 'demo-worker',
      username: 'Worker_Demo',
      email: 'worker@sidequest.com',
      password: 'worker',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=worker',
      level: 5,
      exp: 1500,
      expToNextLevel: 3000,
      walletBalance: 150000,
      rating: 4.9,
      completedJobsCount: 12,
      hasService: true,
      serviceTitle: 'Jasa Desain Graphic & Web UI Specialist',
      serviceCategory: 'Design',
      servicePrice: 200000,
      servicePriceUnit: 'proyek',
      serviceDescription: 'Spesialis desain antarmuka aplikasi, logo, banner, serta aset visual sosial media berkualitas tinggi.',
      serviceSkills: ['Figma', 'Photoshop', 'Tailwind', 'Illustrator'],
      phone: '085712345678',
      location: 'Surabaya, Indonesia',
      isVerified: true,
      skills: ['Figma', 'React', 'Photoshop', 'Video Editing']
    }
  ];
};

export const getSimulatedQuests = (): Quest[] => {
  const data = localStorage.getItem(QUESTS_KEY);
  if (!data) {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(mockQuests));
    return mockQuests;
  }
  return JSON.parse(data);
};

export const saveSimulatedQuests = (quests: Quest[]) => {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
};

export const getSimulatedCurrentUser = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
};

export const setSimulatedCurrentUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Sinkronkan ke USERS_LIST_KEY agar konsisten di seluruh aplikasi
    const data = localStorage.getItem(USERS_LIST_KEY);
    if (data) {
      const usersList: UserProfile[] = JSON.parse(data);
      const cleanId = user.id.replace(/^ws-/, '');
      const idx = usersList.findIndex(u => u.id === user.id || u.id === cleanId || `ws-${u.id}` === user.id);
      if (idx !== -1) {
        usersList[idx] = { ...usersList[idx], ...user };
      } else {
        usersList.push(user);
      }
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(usersList));
    }
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const getSimulatedUsersList = (): UserProfile[] => {
  const data = localStorage.getItem(USERS_LIST_KEY);
  if (!data) {
    const initialUsers = getInitialUsers();
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(data);
};

export const saveSimulatedUsersList = (users: UserProfile[]) => {
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
};

// --- NOTIFICATION HELPERS ---
export const getSimulatedNotifications = (userId: string): AppNotification[] => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  let all: AppNotification[] = data ? JSON.parse(data) : [];
  if (!data) {
    all = [
      {
        id: 'n-1',
        userId: 'demo-client',
        title: 'Selamat datang di SideQuest!',
        body: 'Posting pekerjaan pertama Anda atau temukan worker berbakat di papan jasa.',
        date: 'Baru saja',
        read: false,
        icon: '🎉',
        type: 'SYSTEM'
      },
      {
        id: 'n-2',
        userId: 'demo-worker',
        title: 'Selamat datang di SideQuest!',
        body: 'Lengkapi profil, hard skills, dan tawarkan jasa kamu untuk menarik minat requester.',
        date: 'Baru saja',
        read: false,
        icon: '🎉',
        type: 'SYSTEM'
      }
    ];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
  }
  return all.filter(n => n.userId === userId);
};

export const addSimulatedNotification = (notif: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  const all: AppNotification[] = data ? JSON.parse(data) : [];
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: 'Baru saja',
    read: false
  };
  all.unshift(newNotif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
  return newNotif;
};

export const markNotificationsAsRead = (userId: string) => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!data) return;
  const all: AppNotification[] = JSON.parse(data);
  const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

export const clearUserNotifications = (userId: string) => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!data) return;
  const all: AppNotification[] = JSON.parse(data);
  const updated = all.filter(n => n.userId !== userId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

// --- CHAT HELPERS ---
export const getSimulatedChatMessages = (conversationId: string): ChatMessage[] => {
  const data = localStorage.getItem(CHATS_KEY);
  const all: ChatMessage[] = data ? JSON.parse(data) : [];
  return all.filter(m => m.conversationId === conversationId);
};

export const sendSimulatedChatMessage = (msg: Omit<ChatMessage, 'id' | 'sentAt'>): ChatMessage => {
  const data = localStorage.getItem(CHATS_KEY);
  const all: ChatMessage[] = data ? JSON.parse(data) : [];
  const newMsg: ChatMessage = {
    ...msg,
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };
  all.push(newMsg);
  localStorage.setItem(CHATS_KEY, JSON.stringify(all));

  // Auto notification for recipient
  addSimulatedNotification({
    userId: msg.recipientId,
    title: `Pesan Baru dari ${msg.senderName}`,
    body: msg.text.length > 50 ? msg.text.substring(0, 50) + '...' : msg.text,
    icon: '💬',
    questId: msg.questId,
    type: 'CHAT',
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatar
  });

  return newMsg;
};

export const getSimulatedUserConversations = (userId: string): ConversationThread[] => {
  const data = localStorage.getItem(CHATS_KEY);
  const all: ChatMessage[] = data ? JSON.parse(data) : [];
  const usersList = getSimulatedUsersList();
  
  const map = new Map<string, ChatMessage>();
  all.forEach(m => {
    if (m.senderId === userId || m.recipientId === userId) {
      const existing = map.get(m.conversationId);
      if (!existing || m.id > existing.id) {
        map.set(m.conversationId, m);
      }
    }
  });

  const threads: ConversationThread[] = [];
  map.forEach((lastMsg, convId) => {
    const otherId = lastMsg.senderId === userId ? lastMsg.recipientId : lastMsg.senderId;
    const otherUser = usersList.find(u => u.id === otherId);

    threads.push({
      conversationId: convId,
      otherUserId: otherId,
      otherUserName: otherUser?.username || (lastMsg.senderId === userId ? 'User' : lastMsg.senderName),
      otherUserAvatar: otherUser?.avatarUrl || lastMsg.senderAvatar,
      lastMessage: lastMsg.text,
      lastMessageTime: lastMsg.sentAt,
      questId: lastMsg.questId
    });
  });

  // If no threads exist, create a default welcome conversation thread
  if (threads.length === 0) {
    const otherUser = usersList.find(u => u.id !== userId);
    if (otherUser) {
      const convId = [userId, otherUser.id].sort().join('_conv_');
      sendSimulatedChatMessage({
        conversationId: convId,
        senderId: otherUser.id,
        senderName: otherUser.username,
        senderAvatar: otherUser.avatarUrl,
        recipientId: userId,
        text: `Halo! Terima kasih telah menggunakan SideQuest. Mari berdiskusi tentang proyek atau penawaran jasa di sini.`
      });
      return getSimulatedUserConversations(userId);
    }
  }

  return threads;
};

// --- ACTIVITY LOG HELPERS ---
export const getSimulatedActivityLogs = (userId: string): ActivityItem[] => {
  const data = localStorage.getItem(ACTIVITY_LOGS_KEY);
  let all: ActivityItem[] = data ? JSON.parse(data) : [];

  if (!data) {
    const cleanUserId = userId.replace(/^ws-/, '');
    all = [
      {
        id: 'act-1',
        userId: 'demo-worker',
        type: 'PAYOUT_SUCCESS',
        title: 'Pencairan Escrow Berhasil',
        description: 'Bounty Rp 250.000 untuk quest "Desain Landing Page Redesign" telah masuk ke saldo dompet Anda.',
        timestamp: '22 Jul 2026, 14:30',
        amount: 250000,
        category: 'PAYOUT',
        status: 'SUCCESS',
        icon: '💰'
      },
      {
        id: 'act-2',
        userId: 'demo-worker',
        type: 'QUEST_COMPLETED',
        title: 'Pekerjaan Quest Selesai',
        description: 'Berhasil menyelesaikan pengerjaan quest "Desain Landing Page Redesign" dan bukti kerja telah disetujui Requester.',
        timestamp: '22 Jul 2026, 14:28',
        amount: 250000,
        category: 'QUEST',
        status: 'SUCCESS',
        icon: '🎉'
      },
      {
        id: 'act-3',
        userId: 'demo-worker',
        type: 'PROFILE_UPDATED',
        title: 'Pembaruan Data Profil',
        description: 'Memperbarui informasi biodata, keahlian utama (Figma, React, Tailwind), dan lokasi tempat tinggal.',
        timestamp: '21 Jul 2026, 09:15',
        category: 'PROFILE',
        status: 'INFO',
        icon: '👤'
      },
      {
        id: 'act-4',
        userId: 'demo-worker',
        type: 'SERVICE_UPDATED',
        title: 'Layanan Jasa Diaktifkan',
        description: 'Membuka profil jasa "Jasa Desain Graphic & Web UI Specialist" dengan tarif Rp 200.000 / proyek.',
        timestamp: '20 Jul 2026, 16:40',
        amount: 200000,
        category: 'PROFILE',
        status: 'SUCCESS',
        icon: '⚡'
      },
      {
        id: 'act-5',
        userId: 'demo-client',
        type: 'QUEST_POSTED',
        title: 'Posting Quest Baru',
        description: 'Membuat quest "Desain Logo & Brand Guidelines" dengan nominal Escrow Rp 500.000 terkunci aman.',
        timestamp: '22 Jul 2026, 11:00',
        amount: 500000,
        category: 'QUEST',
        status: 'SUCCESS',
        icon: '📝'
      },
      {
        id: 'act-6',
        userId: 'demo-client',
        type: 'PROFILE_UPDATED',
        title: 'Pembaruan Profil & Dompet',
        description: 'Memperbarui nomor WhatsApp dan verifikasi kontak utama.',
        timestamp: '20 Jul 2026, 10:00',
        category: 'PROFILE',
        status: 'INFO',
        icon: '👤'
      }
    ];
    localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(all));
  }

  const cleanId = userId.replace(/^ws-/, '');
  return all.filter(a => a.userId === userId || a.userId === cleanId || `ws-${a.userId}` === userId);
};

export const addSimulatedActivityLog = (activity: Omit<ActivityItem, 'id' | 'timestamp'>): ActivityItem => {
  const data = localStorage.getItem(ACTIVITY_LOGS_KEY);
  const all: ActivityItem[] = data ? JSON.parse(data) : [];
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const newActivity: ActivityItem = {
    ...activity,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: `${dateStr}, ${timeStr}`
  };

  all.unshift(newActivity);
  localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(all));
  return newActivity;
};

export const clearSimulatedActivityLogs = (userId: string) => {
  const data = localStorage.getItem(ACTIVITY_LOGS_KEY);
  if (!data) return;
  const all: ActivityItem[] = JSON.parse(data);
  const cleanId = userId.replace(/^ws-/, '');
  const updated = all.filter(a => a.userId !== userId && a.userId !== cleanId && `ws-${a.userId}` !== userId);
  localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(updated));
};

