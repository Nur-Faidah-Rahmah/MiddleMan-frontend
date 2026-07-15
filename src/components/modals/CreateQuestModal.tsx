import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { Category, Rank } from '../../types';

interface CreateQuestModalProps {
  onClose: () => void;
  onCreate: (quest: any) => void;
}

const PRICE_UNITS = [
  'proyek', 'video', 'hari', 'post', 'trip', 
  'halaman', 'sesi', 'bulan', 'artikel', 'jam'
];

export function CreateQuestModal({ onClose, onCreate }: CreateQuestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Dev');
  const [rank, setRank] = useState<Rank>('B');
  const [bounty, setBounty] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('3');
  const [isOnline, setIsOnline] = useState(true);
  const [priceUnit, setPriceUnit] = useState('proyek');
  const [subTagsText, setSubTagsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse sub-tags
    const subTags = subTagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Default sub-tags if empty
    const finalSubTags = subTags.length > 0 ? subTags : [category, isOnline ? 'Online' : 'Offline'];

    onCreate({
      title,
      description,
      category,
      rank,
      bounty: parseInt(bounty.replace(/\D/g, '') || '0'),
      deadline: new Date(Date.now() + parseInt(deadlineDays) * 86400000).toISOString(),
      isOnline,
      priceUnit,
      subTags: finalSubTags,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0d1117]/85 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#1e2544] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#171d37]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#14b8a6]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Post a New Quest</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 overflow-y-auto hide-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Quest Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium"
                placeholder="e.g., Edit Video Reels Harian"
              />
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium"
                >
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Dev">Dev</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Kurir">Kurir</option>
                  <option value="Belanja">Belanja</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Ojek">Ojek</option>
                  <option value="Fotografi">Fotografi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Rank Difficulty</label>
                <select 
                  value={rank}
                  onChange={(e) => setRank(e.target.value as Rank)}
                  className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium"
                >
                  <option value="C">C (Easy)</option>
                  <option value="B">B (Medium)</option>
                  <option value="A">A (Hard)</option>
                  <option value="S">S (Epic)</option>
                </select>
              </div>
            </div>

            {/* Work Location Toggle and Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Work Location</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOnline(true)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer border ${
                      isOnline 
                        ? 'bg-[#14b8a6]/20 border-[#14b8a6] text-[#14b8a6]' 
                        : 'bg-[#13192f] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOnline(false)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer border ${
                      !isOnline 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-500' 
                        : 'bg-[#13192f] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Offline
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={subTagsText}
                  onChange={(e) => setSubTagsText(e.target.value)}
                  className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium"
                  placeholder="e.g. Video, Editing, Reels"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Quest Description</label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium resize-none"
                placeholder="Describe the task, requirements, and deliverables..."
              />
            </div>

            {/* Pricing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Bounty Reward (IDR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 text-sm font-bold">Rp</span>
                  <input 
                    type="text"
                    required
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[#14b8a6] font-bold focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm"
                    placeholder="150.000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Price Unit</label>
                <select 
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium"
                >
                  {PRICE_UNITS.map(unit => (
                    <option key={unit} value={unit}>per {unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Deadline (Days)</label>
              <input 
                type="number"
                required
                min="1"
                max="30"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                className="w-full bg-[#13192f] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all text-sm font-medium"
              />
            </div>

            {/* Escrow Banner */}
            <div className="bg-[#14b8a6]/10 border border-[#14b8a6]/25 p-4 rounded-xl mt-6">
              <p className="text-xs text-[#14b8a6] font-medium leading-relaxed">
                <strong>Escrow Notice:</strong> The bounty amount will be immediately deducted from your wallet and held safely in escrow until you approve the submitted work.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#14b8a6] hover:bg-[#0d9488] text-white px-8 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-[#14b8a6]/20 transition-all cursor-pointer"
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
