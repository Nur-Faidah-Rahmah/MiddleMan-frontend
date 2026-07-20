export type QuestStatus = 'OPEN' | 'APPLIED' | 'IN_PROGRESS' | 'ESCROW_LOCKED' | 'DISPUTED' | 'COMPLETED' | 'CANCELLED';
export type Rank = 'S' | 'A' | 'B' | 'C';
export type Category = 'Design' | 'Writing' | 'Dev' | 'Social Media' | 'Kurir' | 'Belanja' | 'Cleaning' | 'Ojek' | 'Fotografi';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  exp: number; // Current EXP
  expToNextLevel: number;
  walletBalance: number;
  rating: number; // 1-5
  completedJobsCount?: number;
  
  // Extended Auth & Admin Fields
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  isBanned?: boolean;

  // Worker Service offering fields
  hasService?: boolean;
  serviceTitle?: string;
  serviceCategory?: Category;
  servicePrice?: number;
  servicePriceUnit?: string;
  serviceDescription?: string;
  serviceSkills?: string[];
}

export interface Applicant {
  id: string;
  username: string;
  avatarUrl: string;
  rating: number;
  level: number;
  appliedAt: string;
}

export interface ProofOfWork {
  notes: string;
  link?: string;
  fileName?: string;
  fileSize?: string;
  submittedAt: string;
  tokenCode?: string; // Sistem: Generate Token Selesai
  isClaimed?: boolean; // Worker: Klaim Token
}

export interface Dispute {
  filedBy: string;
  reason: string;
  filedAt: string;
  decision?: 'WORKER_WON' | 'REQUESTER_WON';
  decisionAt?: string;
  adminNotes?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: Category;
  rank: Rank;
  bounty: number;
  status: QuestStatus;
  isFeatured: boolean;
  deadline: string; // ISO date string
  isOnline: boolean;
  priceUnit: string; // e.g. 'video', 'hari', 'proyek', 'post', 'trip', 'halaman', 'sesi', 'bulan', 'artikel', 'jam'
  subTags: string[];
  requester: {
    id: string;
    username: string;
    avatarUrl: string;
    rating: number;
  };
  assigneeId?: string; // ID of the quester who accepted it
  assigneeName?: string; // Name of the quester who accepted it
  assigneeAvatar?: string; // Avatar of the quester who accepted it
  termsAndConditions?: string; // Custom SnK set by Requester
  escrowStatus?: 'UNPAID' | 'DEPOSITED' | 'RELEASED' | 'REFUNDED'; // Escrow Lock Status
  applicants?: Applicant[]; // For 'Requester: Review Pelamar'
  proofOfWork?: ProofOfWork; // For 'Worker: Submit Bukti Kerja'
  dispute?: Dispute; // For 'Worker: Ajukan Dispute / Banding'
}

export interface AppState {
  currentUser: UserProfile;
  quests: Quest[];
}
