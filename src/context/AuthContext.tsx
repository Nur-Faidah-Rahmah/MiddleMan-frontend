import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
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
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: () => {},
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

  const refreshUser = () => {
    const simulatedUser = getSimulatedCurrentUser();
    setUser(simulatedUser);
  };

  const login = async (credentials: any) => {
    const users = getSimulatedUsersList();
    const loginKey = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    const found = users.find(u => 
      (u.email?.toLowerCase() === loginKey || u.username.toLowerCase() === loginKey) && 
      u.password === password
    );

    if (!found) {
      throw new Error('Email/Username atau Password tidak cocok dengan database lokal kami.');
    }

    if (found.isBanned) {
      throw new Error('Akun Anda telah dinonaktifkan (Banned) oleh Administrator.');
    }

    setSimulatedCurrentUser(found);
    setUser(found);
  };

  const register = async (data: any) => {
    const users = getSimulatedUsersList();
    const usernameNorm = data.username.trim().toLowerCase();
    const emailNorm = data.email.trim().toLowerCase();

    const exists = users.some(u => 
      u.username.toLowerCase() === usernameNorm || 
      (u.email && u.email.toLowerCase() === emailNorm)
    );

    if (exists) {
      throw new Error('Username atau Email sudah terdaftar di sistem.');
    }

    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'user',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.username)}`,
      level: 1,
      exp: 0,
      expToNextLevel: 1000,
      walletBalance: data.role === 'admin' ? 10000000 : 5000000, // Rp 10M for Admin, Rp 5M for Client
      rating: 5.0,
      completedJobsCount: 0,
      hasService: false,
    };

    const updatedUsers = [...users, newUser];
    saveSimulatedUsersList(updatedUsers);
    setSimulatedCurrentUser(newUser);
    setUser(newUser);
  };

  const logout = async () => {
    setSimulatedCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
