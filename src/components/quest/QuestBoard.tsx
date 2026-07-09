import React, { useState } from 'react';
import { QuestCard } from './QuestCard';
import { Quest } from '../../types';

interface QuestBoardProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  currentUserId: string;
}

type TabType = 'ALL' | 'RECOMMENDED' | 'URGENT' | 'MY_QUESTS';

/** Maps a card index to a bento size class, cycling through sizes
 *  to reproduce the asymmetric layout in the reference image. */
const BENTO_SIZES = [
  'sq-card-sm',    // 0 – small portrait
  'sq-card-md',    // 1 – medium landscape
  'sq-card-lg',    // 2 – larger portrait
  'sq-card-xl',    // 3 – tall / big
  'sq-card-wide',  // 4 – wide landscape
  'sq-card-md',    // 5 – medium
  'sq-card-sm',    // 6
  'sq-card-lg',    // 7
  'sq-card-md',    // 8
  'sq-card-wide',  // 9
  'sq-card-xl',    // 10
  'sq-card-sm',    // 11
] as const;

const tabs: { id: TabType; label: string }[] = [
  { id: 'ALL',         label: 'All Quests' },
  { id: 'RECOMMENDED', label: 'Recommended' },
  { id: 'URGENT',      label: 'Urgent' },
  { id: 'MY_QUESTS',   label: 'My Quests' },
];

export function QuestBoard({ quests, onQuestClick, currentUserId }: QuestBoardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  const filteredQuests = quests.filter((quest) => {
    if (activeTab === 'MY_QUESTS')   return quest.assigneeId === currentUserId;
    if (activeTab === 'URGENT') {
      const daysLeft = (new Date(quest.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
      return daysLeft <= 1 && quest.status === 'OPEN';
    }
    if (activeTab === 'RECOMMENDED') return quest.isFeatured || quest.rank === 'S' || quest.rank === 'A';
    return true;
  });

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 2rem 4rem' }}>

      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 className="sq-section-title" style={{ marginBottom: 4 }}>
            Quest Board
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 999,
                padding: '2px 12px',
                marginLeft: 12,
                verticalAlign: 'middle',
              }}
            >
              {filteredQuests.length} available
            </span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Space Grotesk', sans-serif" }}>
            Find your next adventure and earn rewards.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sq-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bento Grid ── */}
      {filteredQuests.length > 0 ? (
        <div className="sq-bento-grid">
          {filteredQuests.map((quest, i) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onClick={onQuestClick}
              sizeClass={BENTO_SIZES[i % BENTO_SIZES.length]}
              showStarDeco={i === 0}
            />
          ))}
        </div>
      ) : (
        <div className="sq-empty">
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.4 }}>📜</div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>
            No Quests Found
          </h3>
          <p style={{ fontSize: '0.85rem' }}>There are no quests matching this filter right now.</p>
        </div>
      )}
    </div>
  );
}
