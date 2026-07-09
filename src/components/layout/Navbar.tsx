import React, { useState } from 'react';
import { Search, PlusCircle, LogOut, Coins, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface NavbarProps {
  user: UserProfile | null;
  onCreateQuestClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Navbar({ user, onCreateQuestClick, onLoginClick, onLogoutClick }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sq-navbar">
      {/* Logo */}
      <div className="sq-logo-pill" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Sidequest.com
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-3">
        {/* Send Request */}
        <button className="sq-pill-btn" onClick={onCreateQuestClick}>
          <PlusCircle size={15} />
          Send Request
        </button>

        {/* Search Toggle */}
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 border-2 border-sq-teal backdrop-blur-sm sq-search-pulse" style={{ minWidth: 260 }}>
            <Search size={15} className="text-sq-teal shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search quests..."
              className="bg-transparent text-white text-sm outline-none w-full placeholder-white/50"
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={14} className="text-white/60 hover:text-white" />
            </button>
          </div>
        ) : (
          <button className="sq-pill-btn solid" onClick={() => setSearchOpen(true)}>
            <Search size={15} />
            SEARCH
          </button>
        )}

        {/* Get Started / User Info */}
        {user ? (
          <>
            <div className="flex items-center gap-2 sq-pill-btn" style={{ cursor: 'default' }}>
              <Coins size={14} className="text-sq-gold" />
              <span className="text-sq-gold font-bold">{formatCurrency(user.walletBalance)}</span>
            </div>
            <button className="sq-pill-btn" onClick={onLogoutClick} title="Logout">
              <LogOut size={14} />
              Logout
            </button>
            <div className="sq-avatar-circle overflow-hidden border-2 border-white/80">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
          </>
        ) : (
          <>
            <button className="sq-pill-btn" onClick={onLoginClick}>
              Get started?
            </button>
            {/* Avatar placeholder circle */}
            <div
              className="sq-avatar-circle flex items-center justify-center border-2 border-white/80"
              onClick={onLoginClick}
              style={{ cursor: 'pointer' }}
            >
              {/* Empty circle like reference */}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
