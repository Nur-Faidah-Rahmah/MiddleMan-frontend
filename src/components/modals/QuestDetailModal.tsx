import React from 'react';
import { X, Coins, Clock, UploadCloud, CheckCircle } from 'lucide-react';
import { Quest } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface QuestDetailModalProps {
  quest: Quest;
  currentUserId: string;
  onClose: () => void;
  onAccept: (questId: string) => void;
  onSubmitProof: (questId: string) => void;
  onApproveWork: (questId: string) => void; // For simulating escrow approval
}

export function QuestDetailModal({ 
  quest, 
  currentUserId, 
  onClose, 
  onAccept,
  onSubmitProof,
  onApproveWork
}: QuestDetailModalProps) {
  
  const isOwner = quest.requester.id === currentUserId;
  const isAssignee = quest.assigneeId === currentUserId;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-rpg-navy border-2 border-rpg-board rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-rpg-board bg-[#131821]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-rpg-card text-slate-300">
                {quest.category}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded border text-rpg-gold border-rpg-gold/30 bg-rpg-gold/10">
                Rank {quest.rank}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                quest.status === 'OPEN' ? 'text-blue-400 border-blue-400/30' : 
                quest.status === 'IN_PROGRESS' ? 'text-purple-400 border-purple-400/30' :
                quest.status === 'ESCROW_LOCKED' ? 'text-amber-400 border-amber-400/30' :
                'text-green-400 border-green-400/30'
              }`}>
                {quest.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">{quest.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rpg-card flex items-center justify-center border border-slate-600">
                <img src={quest.requester.avatarUrl} alt={quest.requester.username} className="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Requester</p>
                <p className="font-medium text-slate-200">{quest.requester.username}</p>
                <p className="text-xs text-yellow-500">★ {quest.requester.rating} Rating</p>
              </div>
            </div>

            <div className="flex flex-col justify-center px-4 border-l border-rpg-board">
              <p className="text-xs text-slate-400 uppercase mb-1">Bounty Amount</p>
              <div className="flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-rpg-gold" />
                <span className="font-bold text-xl text-amber-50">
                  {formatCurrency(quest.bounty)}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center px-4 border-l border-rpg-board">
              <p className="text-xs text-slate-400 uppercase mb-1">Deadline</p>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-5 h-5 text-slate-400" />
                <span>{new Date(quest.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-serif text-lg font-bold text-white mb-2">Quest Description</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {quest.description}
            </p>
          </div>

          {/* Interactive State Area */}
          <div className="bg-[#131821] rounded-lg p-5 border border-rpg-board">
            
            {quest.status === 'OPEN' && !isOwner && (
              <div className="text-center">
                <h4 className="text-lg font-medium text-white mb-2">Ready to take on this quest?</h4>
                <p className="text-sm text-slate-400 mb-4">By accepting, you commit to completing the task before the deadline.</p>
                <button 
                  onClick={() => onAccept(quest.id)}
                  className="w-full sm:w-auto bg-rpg-accent hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(49,130,206,0.4)]"
                >
                  Terima Quest (Accept)
                </button>
              </div>
            )}

            {quest.status === 'IN_PROGRESS' && isAssignee && (
              <div className="text-center">
                <h4 className="text-lg font-medium text-white mb-2">Submit Your Proof of Work</h4>
                <p className="text-sm text-slate-400 mb-4">Upload your files or provide a link to complete the quest.</p>
                
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 mb-4 hover:border-rpg-accent transition-colors cursor-pointer bg-rpg-navy">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-slate-500 mt-1">Max 5MB (JPG, PNG, PDF)</p>
                </div>

                <button 
                  onClick={() => onSubmitProof(quest.id)}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-[#1a202c] font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  Submit to Escrow
                </button>
              </div>
            )}

            {quest.status === 'ESCROW_LOCKED' && isOwner && (
              <div className="text-center">
                <h4 className="text-lg font-medium text-amber-400 mb-2 flex justify-center items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Dana Ditahan di Escrow
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  The Quester has submitted their work. Please review it. If it meets your requirements, approve to release the funds.
                </p>
                
                <div className="bg-rpg-navy p-4 rounded-lg border border-slate-600 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">ZIP</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white font-medium">completed_work_v1.zip</p>
                      <p className="text-xs text-slate-400">2.4 MB</p>
                    </div>
                  </div>
                  <button className="text-rpg-accent hover:text-blue-400 text-sm font-medium">Download</button>
                </div>

                <button 
                  onClick={() => onApproveWork(quest.id)}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2 mx-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Release Funds
                </button>
              </div>
            )}

            {quest.status === 'ESCROW_LOCKED' && isAssignee && (
              <div className="text-center py-6">
                <h4 className="text-lg font-medium text-amber-400 mb-2">Work Under Review</h4>
                <p className="text-sm text-slate-400">Your work has been submitted. Waiting for the requester to approve and release the escrow funds.</p>
              </div>
            )}

            {quest.status === 'COMPLETED' && (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <h4 className="font-serif text-2xl font-bold text-white mb-2">Quest Completed!</h4>
                <p className="text-slate-400">The reward has been successfully transferred.</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
