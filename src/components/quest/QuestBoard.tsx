import React, { useState } from 'react';
import { QuestCard } from './QuestCard';
import { Quest } from '../../types';
import { Filter } from 'lucide-react';

interface QuestBoardProps {
  quests: Quest[];
  onQuestClick: (quest: Quest) => void;
  currentUserId: string;
}

type TabType = 'ALL' | 'RECOMMENDED' | 'URGENT' | 'MY_QUESTS';

export function QuestBoard({ quests, onQuestClick, currentUserId }: QuestBoardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  const filteredQuests = quests.filter(quest => {
    if (activeTab === 'MY_QUESTS') {
      return quest.assigneeId === currentUserId;
    }
    if (activeTab === 'URGENT') {
      const daysLeft = (new Date(quest.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
      return daysLeft <= 1 && quest.status === 'OPEN';
    }
    if (activeTab === 'RECOMMENDED') {
      return quest.isFeatured || quest.rank === 'S' || quest.rank === 'A';
    }
    return true; // ALL
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: 'ALL', label: 'All Quests' },
    { id: 'RECOMMENDED', label: 'Recommended' },
    { id: 'URGENT', label: 'Urgent' },
    { id: 'MY_QUESTS', label: 'My Active Quests' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white mb-2 flex items-center gap-3">
            Quest Board
            <span className="text-sm font-sans bg-rpg-navy border border-rpg-board px-2 py-1 rounded text-slate-400">
              {filteredQuests.length} Available
            </span>
          </h1>
          <p className="text-slate-400 text-sm">Find your next adventure and earn rewards.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          <div className="flex bg-rpg-navy border border-rpg-board rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-rpg-card text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-rpg-board/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="bg-rpg-navy border border-rpg-board p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-rpg-card transition-colors shrink-0">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              onClick={onQuestClick} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-rpg-navy/50 border border-dashed border-slate-600 rounded-xl">
          <div className="text-6xl mb-4 opacity-50">📜</div>
          <h3 className="text-xl font-bold text-slate-300 mb-2 font-serif">No Quests Found</h3>
          <p className="text-slate-500">There are no quests matching this filter right now.</p>
        </div>
      )}
    </div>
  );
}
