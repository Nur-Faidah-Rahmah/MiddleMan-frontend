import React, { useState } from 'react';
import { X, Briefcase, Coins, Calendar, FileText } from 'lucide-react';
import { WorkerProfileCard } from '../quest/WorkerProfileCard';
import { WorkerProfileDetails } from '../../utils/profileLookup';
import { jobsApi } from '../../api/jobs';

interface WorkerProfileModalProps {
  username: string;
  avatarUrl?: string;
  currentUserId: string;
  onClose: () => void;
  onHireSuccess?: () => void; // Optional callback to refresh parent balance/lists
}

export function WorkerProfileModal({
  username,
  avatarUrl,
  currentUserId,
  onClose,
  onHireSuccess
}: WorkerProfileModalProps) {
  const [isHiring, setIsHiring] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfileDetails | null>(null);

  // Hiring Form States
  const [hireTitle, setHireTitle] = useState('');
  const [hireDesc, setHireDesc] = useState('');
  const [hireBounty, setHireBounty] = useState('');
  const [hireDeadline, setHireDeadline] = useState('');
  const [isHiringSubmitting, setIsHiringSubmitting] = useState(false);
  const [hireError, setHireError] = useState('');
  const [hireSuccess, setHireSuccess] = useState(false);

  const handleStartHiring = (worker: WorkerProfileDetails) => {
    setSelectedWorker(worker);
    setHireTitle(`Pekerjaan Khusus — ${worker.category}`);
    setHireDesc(`Membutuhkan jasa ${worker.title} untuk membantu menyelesaikan proyek saya...`);
    setHireBounty(worker.price.toString());
    setHireDeadline(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setHireError('');
    setHireSuccess(false);
    setIsHiring(true);
  };

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    if (!hireTitle.trim() || !hireDesc.trim() || !hireBounty.trim() || !hireDeadline.trim()) {
      setHireError('Semua field harus diisi.');
      return;
    }

    const bountyNum = parseFloat(hireBounty);
    if (isNaN(bountyNum) || bountyNum <= 0) {
      setHireError('Upah harus berupa angka yang valid.');
      return;
    }

    setIsHiringSubmitting(true);
    setHireError('');

    try {
      // Create a direct job with worker as assignee
      const newJob = await jobsApi.createJob({
        title: hireTitle,
        description: hireDesc,
        price: bountyNum,
        category: selectedWorker.category,
        deadline: new Date(hireDeadline).toISOString(),
        isOnline: selectedWorker.isOnline,
        priceUnit: selectedWorker.priceUnit,
        termsAndConditions: 'Pekerjaan langsung. Selesaikan pekerjaan sesuai requirement yang telah didiskusikan.',
        subTags: selectedWorker.skills.slice(0, 3)
      });

      // Assign to worker immediately
      await jobsApi.approveApplicant(newJob.id, selectedWorker.id);

      setHireSuccess(true);
      setTimeout(() => {
        setIsHiring(false);
        onClose();
        if (onHireSuccess) {
          onHireSuccess();
        } else {
          window.location.reload(); // Fallback reload
        }
      }, 2500);
    } catch (err: any) {
      setHireError(err.message || 'Gagal mengirim penawaran pekerjaan.');
    } finally {
      setIsHiringSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark backdrop blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal content container */}
      <div className="relative w-full max-w-lg bg-[#252b4e] border-2 border-[#3e4875] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Title / Action Bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#1e2342] border-b border-[#3e4875]">
          <div className="flex items-center gap-2">
            <Briefcase className="text-[#f0c040] w-5 h-5" />
            <h2 className="text-white font-bold text-base tracking-tight font-serif">
              {isHiring ? 'Kirim Penawaran Kerja (Escrow)' : 'Profil Profesional'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#8b93b8] hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {!isHiring ? (
            <div className="p-1">
              <WorkerProfileCard
                username={username}
                avatarUrl={avatarUrl}
                currentUserId={currentUserId}
                onHireClick={handleStartHiring}
                isModalView={true}
              />
            </div>
          ) : (
            <div className="p-6">
              {hireSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#2bb5a0]/15 rounded-full flex items-center justify-center text-4xl mb-4 text-[#2bb5a0] border border-[#2bb5a0]/30 shadow-lg animate-bounce">
                    ✓
                  </div>
                  <h3 className="text-white font-extrabold text-xl mb-2">Penawaran Dikirim Berhasil!</h3>
                  <p className="text-[#c8cee8] text-sm leading-relaxed mb-4 max-w-sm">
                    Dana penawaran Anda telah didepositkan sementara ke <strong>Escrow Lock</strong>. Pekerjaan telah ditugaskan langsung ke <strong>{selectedWorker?.fullName}</strong>.
                  </p>
                  <span className="text-[#8b93b8] text-xs">Menutup halaman dan memperbarui data...</span>
                </div>
              ) : (
                <form onSubmit={handleHireSubmit} className="space-y-4 text-left">
                  
                  {/* Small worker summary box */}
                  <div className="bg-[#1e2342] rounded-xl p-4 border border-[#3e4875] flex items-center gap-3">
                    <img
                      src={selectedWorker?.avatarUrl}
                      alt={selectedWorker?.fullName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-[#f0c040]/50 bg-[#131821]"
                    />
                    <div>
                      <h4 className="text-white font-bold text-sm leading-tight">{selectedWorker?.fullName}</h4>
                      <p className="text-[#2bb5a0] text-xs font-semibold">{selectedWorker?.title}</p>
                      <p className="text-[#8b93b8] text-[10px] mt-0.5">Rating: {selectedWorker?.rating}★ | Proyek Selesai: {selectedWorker?.completedJobsCount}</p>
                    </div>
                  </div>

                  {hireError && (
                    <div className="bg-[#ff5c5c]/10 border border-[#ff5c5c]/30 text-[#ff7878] p-3 rounded-xl text-xs font-bold">
                      ⚠️ {hireError}
                    </div>
                  )}

                  {/* Fields */}
                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold mb-1.5 uppercase tracking-wider">Judul Pekerjaan / Quest</label>
                    <input
                      type="text"
                      required
                      value={hireTitle}
                      onChange={(e) => setHireTitle(e.target.value)}
                      placeholder="e.g. Pembuatan Desain Infografis Brand"
                      className="w-full bg-[#1e2342] border border-[#3e4875] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8b93b8] text-xs font-bold mb-1.5 uppercase tracking-wider">Spesifikasi Detail Tugas (SnK)</label>
                    <textarea
                      rows={3}
                      required
                      value={hireDesc}
                      onChange={(e) => setHireDesc(e.target.value)}
                      placeholder="Jelaskan kebutuhan pekerjaan dan output yang Anda harapkan..."
                      className="w-full bg-[#1e2342] border border-[#3e4875] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8b93b8] text-xs font-bold mb-1.5 uppercase tracking-wider">Ditawarkan Upah (Rp)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-2.5 text-[#8b93b8] text-sm">Rp</span>
                        <input
                          type="text"
                          required
                          value={hireBounty}
                          onChange={(e) => setHireBounty(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-[#1e2342] border border-[#3e4875] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#8b93b8] text-xs font-bold mb-1.5 uppercase tracking-wider">Batas Waktu (Deadline)</label>
                      <input
                        type="date"
                        required
                        value={hireDeadline}
                        onChange={(e) => setHireDeadline(e.target.value)}
                        className="w-full bg-[#1e2342] border border-[#3e4875] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f0c040] focus:ring-1 focus:ring-[#f0c040] transition-all"
                      />
                    </div>
                  </div>

                  {/* Escrow Disclaimer */}
                  <div className="bg-[#1c213a] border border-[#3e4875]/60 rounded-xl p-4 space-y-2 text-xs text-[#8b93b8] leading-relaxed">
                    <p className="flex items-center gap-1.5 text-white font-bold text-[10px] uppercase tracking-wider">
                      <Coins size={12} className="text-[#f0c040]" /> Jaminan Escrow Aman
                    </p>
                    <p>
                      Dana sebesar <strong className="text-white">Rp {parseFloat(hireBounty || '0').toLocaleString('id-ID')}</strong> akan diamankan sementara di dompet <strong>Escrow Lock</strong>. Pekerja akan segera dikontrak dan dana baru dicairkan setelah Anda mengonfirmasi hasil pekerjaan mereka.
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[#3e4875]/40 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsHiring(false)}
                      className="flex-1 border border-[#3e4875] hover:bg-[#3e4875] text-[#c8cee8] text-xs font-bold py-3 rounded-full transition-colors cursor-pointer"
                    >
                      Kembali ke Profil
                    </button>
                    <button
                      type="submit"
                      disabled={isHiringSubmitting}
                      className="flex-1 bg-[#f0c040] hover:bg-[#d4a82d] text-[#1b203e] text-xs font-extrabold py-3 rounded-full transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-[#f0c040]/10"
                    >
                      {isHiringSubmitting ? 'Memproses...' : 'Kirim Penawaran & Deposit'}
                    </button>
                  </div>

                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
