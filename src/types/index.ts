export type QuestStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCROW_LOCKED' | 'COMPLETED';
export type Rank = 'S' | 'A' | 'B' | 'C';
export type Category = 'IT & Code' | 'Design' | 'Writing' | 'Video' | 'Misc';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  exp: number; // Current EXP
  expToNextLevel: number;
  walletBalance: number;
  rating: number; // 1-5
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
  requester: {
    id: string;
    username: string;
    avatarUrl: string;
    rating: number;
  };
  assigneeId?: string; // ID of the quester who accepted it
}

export interface AppState {
  currentUser: UserProfile;
  quests: Quest[];
}
