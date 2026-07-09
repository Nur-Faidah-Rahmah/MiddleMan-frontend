import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-rpg-navy border-2 border-rpg-gold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.2)] w-full max-w-md overflow-hidden animate-fade-in relative">
        <div className="absolute top-3 right-3">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rpg-gold to-yellow-200 mb-6 font-cinzel text-center">
            Login to SideQuest
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-rpg-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-rpg-gold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-rpg-primary py-2 rounded font-medium text-black mt-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-rpg-gold hover:underline">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
