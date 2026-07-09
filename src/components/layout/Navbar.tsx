import React from 'react';
import { Shield, Coins, Search, PlusCircle, Bell } from 'lucide-react';
import { UserProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface NavbarProps {
  user: UserProfile | null;
  onCreateQuestClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Navbar({ user, onCreateQuestClick, onLoginClick, onLogoutClick }: NavbarProps) {
  const expPercentage = user ? (user.exp / user.expToNextLevel) * 100 : 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#1a202c]/90 backdrop-blur-md border-b border-rpg-board shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Shield className="w-8 h-8 text-rpg-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            <span className="font-serif font-bold text-2xl tracking-wider text-white">
              SIDEQUEST
            </span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-rpg-gold transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-rpg-card rounded-md leading-5 bg-[#0d1117] text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rpg-gold focus:border-rpg-gold sm:text-sm transition-all shadow-inner"
                placeholder="Search quests, categories, or adventurers..."
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            
            {user ? (
              <>
                {/* Create Quest Button */}
                <button 
                  onClick={onCreateQuestClick}
                  className="hidden sm:flex items-center gap-2 bg-rpg-accent hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-[0_0_15px_rgba(49,130,206,0.3)] border border-blue-400/30"
                >
                  <PlusCircle className="w-5 h-5" />
                  Buat Quest Baru
                </button>

                {/* Wallet Widget */}
                <div className="hidden sm:flex items-center gap-2 bg-rpg-board/50 px-3 py-1.5 rounded-full border border-rpg-card/50">
                  <Coins className="w-5 h-5 text-rpg-gold" />
                  <span className="font-medium text-amber-50">
                    {formatCurrency(user.walletBalance)}
                  </span>
                </div>

                {/* Notifications */}
                <button className="text-slate-400 hover:text-white transition-colors relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#1a202c]" />
                </button>

                {/* Profile Badge */}
                <div className="flex items-center gap-3 pl-4 border-l border-rpg-board cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="relative">
                    <img 
                      className="h-10 w-10 rounded-full border-2 border-rpg-card object-cover bg-rpg-board" 
                      src={user.avatarUrl} 
                      alt={user.username} 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-rpg-gold text-[#1a202c] text-xs font-bold px-1.5 py-0.5 rounded shadow-sm border border-yellow-200">
                      Lv.{user.level}
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-sm font-semibold text-white">{user.username}</div>
                    {/* EXP Bar */}
                    <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-rpg-accent"
                        style={{ width: `${expPercentage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {user.exp} / {user.expToNextLevel} EXP
                    </div>
                  </div>
                  <button 
                    onClick={onLogoutClick}
                    className="ml-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-rpg-gold hover:bg-yellow-500 text-[#1a202c] px-6 py-2 rounded-md font-bold transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Login
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
