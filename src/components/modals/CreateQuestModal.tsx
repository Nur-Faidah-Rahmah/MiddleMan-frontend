import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { Category, Rank } from '../../types';

interface CreateQuestModalProps {
  onClose: () => void;
  onCreate: (quest: any) => void;
}

export function CreateQuestModal({ onClose, onCreate }: CreateQuestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('IT & Code');
  const [rank, setRank] = useState<Rank>('C');
  const [bounty, setBounty] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('3');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      category,
      rank,
      bounty: parseInt(bounty.replace(/\D/g, '') || '0'),
      deadline: new Date(Date.now() + parseInt(deadlineDays) * 86400000).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-rpg-navy border-2 border-rpg-board rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-rpg-board bg-[#131821]">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-rpg-gold" />
            <h2 className="font-serif text-2xl font-bold text-white">Post a New Quest</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Quest Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0d1117] border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold transition-colors"
                placeholder="e.g., Slay the Dragon Bug in Checkout"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-[#0d1117] border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
                >
                  <option>IT & Code</option>
                  <option>Design</option>
                  <option>Writing</option>
                  <option>Video</option>
                  <option>Misc</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rank Difficulty</label>
                <select 
                  value={rank}
                  onChange={(e) => setRank(e.target.value as Rank)}
                  className="w-full bg-[#0d1117] border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
                >
                  <option value="C">C (Easy)</option>
                  <option value="B">B (Medium)</option>
                  <option value="A">A (Hard)</option>
                  <option value="S">S (Epic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Quest Description</label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0d1117] border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold transition-colors resize-none"
                placeholder="Describe the task, requirements, and deliverables..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Bounty Reward (IDR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">Rp</span>
                  <input 
                    type="number"
                    required
                    min="10000"
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    className="w-full bg-[#0d1117] border border-slate-600 rounded-md py-2 pl-10 pr-3 text-amber-400 font-bold focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
                    placeholder="150000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Deadline (Days)</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(e.target.value)}
                  className="w-full bg-[#0d1117] border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-rpg-gold focus:ring-1 focus:ring-rpg-gold"
                />
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mt-6">
              <p className="text-sm text-amber-200/80">
                <strong>Escrow Notice:</strong> The bounty amount will be immediately deducted from your wallet and held safely in escrow until you approve the submitted work.
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-md font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-rpg-accent hover:bg-blue-500 text-white px-8 py-2 rounded-md font-bold transition-all shadow-[0_0_15px_rgba(49,130,206,0.4)]"
              >
                Post Quest & Lock Escrow
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
