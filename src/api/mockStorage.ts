import { Quest, UserProfile } from '../types';
import { currentUserMock, mockQuests } from '../data/mockData';

const QUESTS_KEY = 'sq_quests_simulated';
const USER_KEY = 'sq_user_simulated';
const USERS_LIST_KEY = 'sq_users_list_simulated';

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
    localStorage.setItem(USER_KEY, JSON.stringify(currentUserMock));
    return currentUserMock;
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
    const initialUsers = [currentUserMock];
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(data);
};

export const saveSimulatedUsersList = (users: UserProfile[]) => {
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
};
