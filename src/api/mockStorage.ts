import { Quest, UserProfile } from '../types';

const QUESTS_KEY = 'sq_quests_simulated';
const USER_KEY = 'sq_user_simulated';
const USERS_LIST_KEY = 'sq_users_list_simulated';

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
      // Initially, they do NOT have a service, but they can easily enable it in profile page.
      // Or let's pre-configure it for Worker_Demo, but keep it customizable.
      hasService: false,
    }
  ];
};

export const getSimulatedQuests = (): Quest[] => {
  const data = localStorage.getItem(QUESTS_KEY);
  if (!data) {
    // Requirements say make "pekerjaan tersedia" empty by default!
    const emptyQuests: Quest[] = [];
    localStorage.setItem(QUESTS_KEY, JSON.stringify(emptyQuests));
    return emptyQuests;
  }
  return JSON.parse(data);
};

export const saveSimulatedQuests = (quests: Quest[]) => {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
};

export const getSimulatedCurrentUser = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) {
    // Initial page MUST be login/register, so no logged-in user by default
    return null;
  }
  return JSON.parse(data);
};

export const setSimulatedCurrentUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
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
