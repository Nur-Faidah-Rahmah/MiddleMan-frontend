import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import api from '../lib/axios';
import { UserProfile } from '../types';
import { mapUserToProfile } from '../api/mappers';
import {
  getSimulatedCurrentUser,
  setSimulatedCurrentUser,
  getSimulatedUsersList,
  saveSimulatedUsersList
} from '../api/mockStorage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const simulatedUser = getSimulatedCurrentUser();
    setUser(simulatedUser);
    setLoading(false);
  };

  const login = async (credentials: any) => {
    const users = getSimulatedUsersList();
    let found = users.find(u => u.username.toLowerCase() === credentials.email.split('@')[0].toLowerCase());
    if (!found) {
      found = {
        id: `u-${Date.now()}`,
        username: credentials.email.split('@')[0] || 'QuestGiver',
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${credentials.email}`,
        level: 1,
        exp: 0,
        expToNextLevel: 1000,
        walletBalance: 250000,
        rating: 4.8,
      };
      saveSimulatedUsersList([...users, found]);
    }
    setSimulatedCurrentUser(found);
    setUser(found);
  };

  const register = async (data: any) => {
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      username: data.name,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.name}`,
      level: 1,
      exp: 0,
      expToNextLevel: 1000,
      walletBalance: data.role_id === 2 ? 1000000 : 0,
      rating: 5.0,
    };
    const users = getSimulatedUsersList();
    saveSimulatedUsersList([...users, newUser]);
    setSimulatedCurrentUser(newUser);
    setUser(newUser);
  };

  const logout = async () => {
    setSimulatedCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
