import React from 'react';
import { Star } from 'lucide-react';
import { Quest } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface QuestCardProps {
  quest: Quest;
  onClick: (quest: Quest) => void;
  onUserClick?: (username: string, avatarUrl?: string) => void;
}

export function QuestCard({ quest, onClick, onUserClick }: QuestCardProps) {
  return (
    <div
      className="group bg-[#3a4475] hover:bg-[#434e80] border border-[#3e4875] rounded-lg p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between select-none h-full"
      onClick={() => onClick(quest)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(quest)}
    >
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
        <span className="text-[#8b93b8] text-xs">
          {quest.category}
        </span>
      </div>

      {/* Title */}
      <p className="text-white font-bold text-base leading-snug mb-3">
        {quest.title}
      </p>

      {/* Sub-tags */}
      <div className="flex flex-wrap gap-1 mb-6">
        {quest.subTags.map((tag) => (
          <span 
            key={tag} 
            className="bg-[#3e4875] text-[#c8cee8] text-xs px-2 py-1 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: User profile & Price block */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#3e4875]">
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
          <span className="text-[#8b93b8] text-xs font-medium hover:text-white transition-colors">
            {quest.requester.username}
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
