import React from 'react';
import { Coins, Clock, Star, ShieldAlert } from 'lucide-react';
import { Quest } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface QuestCardProps {
  quest: Quest;
  onClick: (quest: Quest) => void;
  /** Extra CSS class(es) for bento sizing */
  sizeClass?: string;
  /** Show the gold star decoration (featured top-left accent) */
  showStarDeco?: boolean;
}

const rankColors: Record<string, { border: string; text: string; bg: string }> = {
  S: { border: '#a78bfa', text: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  A: { border: '#d4a843', text: '#d4a843', bg: 'rgba(212,168,67,0.15)' },
  B: { border: '#60a5fa', text: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  C: { border: '#4ade80', text: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
};

const statusLabel: Record<Quest['status'], string | null> = {
  OPEN: null,
  IN_PROGRESS: 'IN PROGRESS',
  ESCROW_LOCKED: 'IN ESCROW',
  COMPLETED: 'COMPLETED',
};

const statusColors: Record<Quest['status'], string> = {
  OPEN: '',
  IN_PROGRESS: 'rgba(96,165,250,0.85)',
  ESCROW_LOCKED: 'rgba(251,191,36,0.85)',
  COMPLETED: 'rgba(74,222,128,0.85)',
};

export function QuestCard({ quest, onClick, sizeClass = 'sq-card-md', showStarDeco = false }: QuestCardProps) {
  const daysLeft = Math.ceil((new Date(quest.deadline).getTime() - Date.now()) / (1000 * 3600 * 24));
  const isUrgent = daysLeft <= 1 && quest.status === 'OPEN';
  const rank = rankColors[quest.rank] ?? rankColors['C'];
  const label = statusLabel[quest.status];
  const labelColor = statusColors[quest.status];

  return (
    <div
      className={`sq-job-card sq-animate-in ${sizeClass}`}
      onClick={() => onClick(quest)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(quest)}
    >
      {/* Gold star decoration (only on first featured card) */}
      {showStarDeco && (
        <div className="sq-star-deco">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="26,4 30,20 46,20 33,30 38,46 26,36 14,46 19,30 6,20 22,20"
              fill="none"
              stroke="#d4a843"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Inner lines for the geometric star style */}
            <line x1="26" y1="4" x2="26" y2="48" stroke="#d4a843" strokeWidth="1" opacity="0.5" />
            <line x1="4" y1="26" x2="48" y2="26" stroke="#d4a843" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Status badge */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: showStarDeco ? 44 : 14,
            background: labelColor,
            backdropFilter: 'blur(4px)',
            borderRadius: 6,
            padding: '3px 10px',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.05em',
            zIndex: 10,
          }}
        >
          {label}
        </div>
      )}

      {/* Featured ribbon */}
      {quest.isFeatured && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'linear-gradient(135deg, #d4a843, #e8c060)',
            color: '#253047',
            fontSize: '0.6rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            padding: '3px 10px',
            borderRadius: 999,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Star size={9} fill="#253047" />
          FEATURED
        </div>
      )}

      {/* Rank badge — top center */}
      <div
        className="card-badge"
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          borderColor: rank.border,
          color: rank.text,
          background: rank.bg,
          zIndex: 10,
        }}
      >
        RANK {quest.rank}
      </div>

      {/* Urgent indicator */}
      {isUrgent && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#fca5a5',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            animation: 'pulse 1.5s infinite',
          }}
        >
          <ShieldAlert size={12} />
          URGENT
        </div>
      )}

      {/* Bottom content overlay */}
      <div className="card-content">
        <div className="card-title">{quest.title}</div>
        <div className="card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Coins size={11} style={{ color: '#d4a843' }} />
            <span style={{ color: '#d4a843', fontWeight: 700 }}>{formatCurrency(quest.bounty)}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} />
            {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
          </span>
        </div>
      </div>
    </div>
  );
}
