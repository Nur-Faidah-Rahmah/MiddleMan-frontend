import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import api from '../lib/axios';
import { UserProfile } from '../types';
import { mapUserToProfile } from '../api/mappers';

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
    try {
      const response = await api.get('/user'); // Adjust if Laravel user endpoint differs
      if (response.data) {
        setUser(mapUserToProfile(response.data));
      }
    } catch (error) {
      console.log("No authenticated user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    await authApi.getCsrfToken();
    const res = await authApi.login(credentials);
    setUser(mapUserToProfile(res.data.user));
  };

  const register = async (data: any) => {
    await authApi.getCsrfToken();
    const res = await authApi.register(data);
    setUser(mapUserToProfile(res.data.user));
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
