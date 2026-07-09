import React from 'react';
import { Star, Clock, Coins, ShieldAlert } from 'lucide-react';
import { Quest } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface QuestCardProps {
  quest: Quest;
  onClick: (quest: Quest) => void;
}

export function QuestCard({ quest, onClick }: QuestCardProps) {
  const isFeatured = quest.isFeatured;
  
  const rankColors = {
    'S': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    'A': 'text-rpg-gold border-rpg-gold/30 bg-rpg-gold/10',
    'B': 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    'C': 'text-green-400 border-green-400/30 bg-green-400/10',
  };

  const getStatusBadge = (status: Quest['status']) => {
    switch (status) {
      case 'OPEN': return null;
      case 'IN_PROGRESS': 
        return <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded backdrop-blur-sm">IN PROGRESS</span>;
      case 'ESCROW_LOCKED':
        return <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded backdrop-blur-sm">IN ESCROW</span>;
      case 'COMPLETED':
        return <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/50 rounded backdrop-blur-sm">COMPLETED</span>;
    }
  };

  const daysLeft = Math.ceil((new Date(quest.deadline).getTime() - Date.now()) / (1000 * 3600 * 24));
  const isUrgent = daysLeft <= 1 && quest.status === 'OPEN';

  return (
    <div 
      onClick={() => onClick(quest)}
      className={`relative group bg-rpg-card rounded-lg p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isFeatured 
          ? 'border-2 border-rpg-gold shadow-[0_0_15px_rgba(255,215,0,0.15)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)]' 
          : 'border border-rpg-board hover:border-slate-400'
      } ${quest.status !== 'OPEN' ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      {/* Featured Ribbon */}
      {isFeatured && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-rpg-gold to-yellow-600 text-rpg-navy text-xs font-bold px-3 py-1 rounded shadow-lg flex items-center gap-1 z-10 border border-yellow-200 rotate-3 group-hover:rotate-6 transition-transform">
          <Star className="w-3 h-3 fill-rpg-navy" />
          FEATURED BOUNTY
        </div>
      )}

      {getStatusBadge(quest.status)}

      <div className="flex justify-between items-start mb-3 mt-4">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-xs font-medium px-2 py-1 rounded bg-rpg-navy text-slate-300 border border-slate-600">
            {quest.category}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded border ${rankColors[quest.rank]}`}>
            Rank {quest.rank}
          </span>
        </div>
        
        {isUrgent && (
          <div className="flex items-center gap-1 text-red-400 text-xs font-bold animate-pulse">
            <ShieldAlert className="w-3 h-3" />
            URGENT
          </div>
        )}
      </div>

      <h3 className="font-serif text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-rpg-gold transition-colors">
        {quest.title}
      </h3>
      
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {quest.description}
      </p>

      {/* Requester Info */}
      <div className="flex items-center gap-2 mb-4 bg-rpg-navy/50 p-2 rounded-md">
        <img src={quest.requester.avatarUrl} alt={quest.requester.username} className="w-6 h-6 rounded-full border border-slate-500" />
        <span className="text-xs text-slate-300 font-medium">{quest.requester.username}</span>
        <div className="flex items-center ml-auto gap-1">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs text-slate-300">{quest.requester.rating}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-600/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Bounty Reward</span>
          <div className="flex items-center gap-1.5">
            <Coins className="w-5 h-5 text-rpg-gold" />
            <span className="font-bold text-lg text-amber-50">
              {formatCurrency(quest.bounty)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
        </div>
      </div>
      
      {/* Hover Action */}
      <div className="absolute inset-x-0 -bottom-4 opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 flex justify-center pointer-events-none">
        <button className="bg-rpg-accent/90 backdrop-blur text-white text-sm font-bold py-2 px-6 rounded-full shadow-[0_0_15px_rgba(49,130,206,0.5)] border border-blue-400/50 pointer-events-auto hover:bg-blue-500">
          {quest.status === 'OPEN' ? 'Ambil Quest' : 'Lihat Detail'}
        </button>
      </div>
    </div>
  );
}
