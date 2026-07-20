import React from 'react';
import { Search } from 'lucide-react';
import { UserProfile } from '../../types';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: UserProfile | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateQuestClick: () => void;
}

export function Navbar({
  user,
  searchQuery,
  onSearchChange,
  onCreateQuestClick
}: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-[#252b4e] border-b border-[#3e4875] sticky top-0 z-50">
      {/* Logo */}
      <Link 
        to="/"
        className="flex items-baseline gap-2 cursor-pointer select-none" 
        onClick={() => {
          onSearchChange('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <span className="text-[#f0c040] text-2xl font-bold">✦</span>
        <span className="text-white font-bold text-xl tracking-wide">SideQuest</span>
        <span className="text-[#8b93b8] text-sm">.com</span>
      </Link>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-xl mx-8 relative flex items-center gap-2">
        <div className="relative w-full flex items-center bg-[#3a4068] border border-[#3e4875] rounded-full overflow-hidden transition-colors">
          <div className="pl-4 pr-2 text-[#8b93b8]">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari pekerjaan, kategori, atau pengguna..."
            className="w-full bg-transparent text-[#c8cee8] text-sm py-3 outline-none placeholder-[#8b93b8]"
          />
        </div>
        <button 
          className="bg-[#2bb5a0] hover:bg-[#239987] rounded-full text-white font-bold text-sm px-6 py-3 transition-colors shrink-0"
          onClick={() => {}}
        >
          SEARCH
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Admin Link */}
        {user?.role === 'admin' && (
          <Link 
            to="/admin" 
            className="border border-[#f0c040] text-[#f0c040] hover:bg-[#f0c040]/10 rounded-full font-bold text-sm px-5 py-2.5 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🛡️ Admin Panel</span>
          </Link>
        )}

        {/* Send Request Button */}
        <button 
          id="btn-send-request"
          className="border border-[#2bb5a0] text-[#2bb5a0] hover:bg-[#2bb5a0]/10 rounded-full font-bold text-sm px-5 py-2.5 transition-all cursor-pointer"
          onClick={onCreateQuestClick}
        >
          Send Request
        </button>

        {/* Auth Button */}
        {user && (
          <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white select-none bg-[#3a4475] flex items-center justify-center hover:opacity-80 transition-opacity">
            <img
              src={user.avatarUrl}
              alt={user.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}
