import React from 'react';
import { UserCheck } from 'lucide-react';
import { Quest } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface QuestCardProps {
  quest: Quest;
  onClick: (quest: Quest) => void;
  onUserClick?: (username: string, avatarUrl?: string) => void;
  currentUserId?: string;
}

export function QuestCard({ quest, onClick, onUserClick, currentUserId }: QuestCardProps) {
  const isOwnQuest = Boolean(
    currentUserId && (
      quest.requester.id === currentUserId || 
      quest.requester.id === currentUserId.replace(/^ws-/, '') ||
      `ws-${quest.requester.id}` === currentUserId
    )
  );

  return (
    <div
      className={`group rounded-xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between select-none h-full relative overflow-hidden ${
        isOwnQuest
          ? 'bg-gradient-to-b from-[#3e487a] via-[#37416e] to-[#2d355e] border-2 border-[#f0c040] shadow-lg shadow-[#f0c040]/15 hover:border-amber-300'
          : 'bg-[#3a4475] hover:bg-[#434e80] border border-[#3e4875]'
      }`}
      onClick={() => onClick(quest)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(quest)}
    >
      {/* Self-posted Highlight Ribbon Header */}
      {isOwnQuest && (
        <div className="mb-2.5 flex items-center justify-between bg-amber-500/15 border border-amber-400/40 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-extrabold text-[#f0c040] flex items-center gap-1.5 uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-[#f0c040]" /> Quest Diposting Anda
          </span>
          <span className="text-[9px] bg-[#f0c040] text-[#1b203e] font-black px-1.5 py-0.2 rounded-full">
            Pemilik
          </span>
        </div>
      )}

      {/* Top row: badge & category */}
      <div className="flex items-start justify-between mb-3">
        <span 
          className={`text-xs font-bold px-2 py-1 rounded-sm ${
            quest.isOnline 
              ? 'text-white bg-[#2bb5a0]' 
              : 'text-[#2e3557] bg-[#f0c040]'
          }`}
        >
          {quest.isOnline ? 'Online' : 'Offline'}
        </span>
        <span className="text-[#8b93b8] text-xs font-medium">
          {quest.category}
        </span>
      </div>

      {/* Title */}
      <p className="text-white font-bold text-base leading-snug mb-3 group-hover:text-[#2bb5a0] transition-colors">
        {quest.title}
      </p>

      {/* Sub-tags */}
      <div className="flex flex-wrap gap-1 mb-6">
        {quest.subTags.map((tag) => (
          <span 
            key={tag} 
            className="bg-[#3e4875]/80 text-[#c8cee8] text-xs px-2 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: User profile & Price block */}
      <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-[#3e4875]">
        {/* Requester Info */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onUserClick?.(quest.requester.username, quest.requester.avatarUrl);
          }}
        >
          <img
            src={quest.requester.avatarUrl}
            alt={quest.requester.username}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover border border-white/10"
          />
          <span className="text-[#8b93b8] text-xs font-medium hover:text-white transition-colors flex items-center gap-1">
            {quest.requester.username}
            {isOwnQuest && (
              <span className="text-[10px] text-[#f0c040] font-bold">(Anda)</span>
            )}
          </span>
          <span className="text-[#f0c040] text-xs font-bold">
            ★ {quest.requester.rating.toFixed(1)}
          </span>
        </div>

        {/* Price block */}
        <div className="text-right">
          <p className="text-[#2bb5a0] font-bold text-sm">
            {formatCurrency(quest.bounty)}
          </p>
          <p className="text-[#8b93b8] text-xs mt-0.5">
            per {quest.priceUnit}
          </p>
        </div>
      </div>
    </div>
  );
}

