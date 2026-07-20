import React, { useState } from 'react';
import { 
  X, Coins, Clock, UploadCloud, CheckCircle, 
  AlertTriangle, Gavel, Key, FileText, UserCheck, 
  ShieldAlert, Sparkles, CheckSquare, Square, ChevronRight
} from 'lucide-react';
import { Quest } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface QuestDetailModalProps {
  quest: Quest;
  currentUserId: string;
  onClose: () => void;
  onAccept: (questId: string) => void; // Map to onApply in parent
  onApproveApplicant: (questId: string, applicantId: string) => void;
  onSubmitProof: (questId: string, notes: string, link?: string) => void;
  onApproveWork: (questId: string) => void;
  onFileDispute: (questId: string, reason: string) => void;
  onResolveDispute: (questId: string, decision: 'WORKER_WON' | 'REQUESTER_WON') => void;
  onClaimToken: (questId: string) => void;
  onUserClick?: (username: string, avatarUrl?: string) => void;
}

export function QuestDetailModal({ 
  quest, 
  currentUserId, 
  onClose, 
  onAccept,
  onApproveApplicant,
  onSubmitProof,
  onApproveWork,
  onFileDispute,
  onResolveDispute,
  onClaimToken,
  onUserClick
}: QuestDetailModalProps) {
  
  const isOwner = quest.requester.id === currentUserId;
  const isAssignee = quest.assigneeId === currentUserId;
  const hasApplied = quest.applicants?.some(a => a.id === currentUserId);

  // States
  const [acceptedSnK, setAcceptedSnK] = useState(false);
  const [proofNotes, setProofNotes] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [typedToken, setTypedToken] = useState('');
  const [isClaimedLocal, setIsClaimedLocal] = useState(quest.proofOfWork?.isClaimed || false);

  const handleApply = () => {
    if (!acceptedSnK) return;
    onAccept(quest.id);
  };

  const handleSubmitWork = () => {
    if (!proofNotes.trim()) {
      alert("Harap masukkan catatan bukti pengerjaan.");
      return;
    }
    onSubmitProof(quest.id, proofNotes, proofLink);
  };

  const handleDisputeSubmit = () => {
    if (!disputeReason.trim()) {
      alert("Harap masukkan alasan dispute / banding.");
      return;
    }
    onFileDispute(quest.id, disputeReason);
    setShowDisputeForm(false);
  };

  const handleClaimSubmit = () => {
    const expected = quest.proofOfWork?.tokenCode;
    if (!expected || typedToken.trim() !== expected) {
      alert("Kode Token Salah! Pastikan Anda memasukkan kode token yang digenerate oleh sistem.");
      return;
    }
    onClaimToken(quest.id);
    setIsClaimedLocal(true);
    alert("✨ Selamat! Token valid. Dana escrow telah dicairkan langsung ke Saldo Dompet Anda.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-[#0d1117]/85 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#252b4e] border-2 border-[#3e4875] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col my-8 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-[#3e4875] bg-[#1a1f3c]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-[#2e3557] text-[#c8cee8]">
                {quest.category}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded border text-[#f0c040] border-[#f0c040]/30 bg-[#f0c040]/10">
                Rank {quest.rank}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                quest.status === 'OPEN' ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' : 
                quest.status === 'APPLIED' ? 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5' : 
                quest.status === 'IN_PROGRESS' ? 'text-purple-400 border-purple-400/30 bg-purple-400/5' :
                quest.status === 'ESCROW_LOCKED' ? 'text-amber-400 border-amber-400/30 bg-amber-400/5' :
                quest.status === 'DISPUTED' ? 'text-red-400 border-red-400/30 bg-red-400/5' :
                quest.status === 'COMPLETED' ? 'text-[#2bb5a0] border-[#2bb5a0]/30 bg-[#2bb5a0]/5' :
                'text-[#ff5c5c] border-[#ff5c5c]/30 bg-[#ff5c5c]/5'
              }`}>
                {quest.status === 'OPEN' ? '🧭 OPEN' : 
                 quest.status === 'APPLIED' ? '🔎 REVIEW PELAMAR' :
                 quest.status === 'IN_PROGRESS' ? '⚔️ TAKEN (IN PROGRESS)' :
                 quest.status === 'ESCROW_LOCKED' ? '🔒 ESCROW REVIEW' :
                 quest.status === 'DISPUTED' ? '⚠️ DISPUTED' :
                 quest.status === 'COMPLETED' ? '✓ COMPLETED' : '✗ CANCELLED / REFUNDED'}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">{quest.title}</h2>
          </div>
          <button onClick={onClose} className="text-[#8b93b8] hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-6 p-4 bg-[#2e3557]/50 rounded-xl border border-[#3e4875]/40">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
              onClick={() => onUserClick?.(quest.requester.username, quest.requester.avatarUrl)}
            >
              <div className="w-12 h-12 rounded-full bg-[#3a4475] flex items-center justify-center border border-[#3e4875]">
                <img src={quest.requester.avatarUrl} alt={quest.requester.username} className="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p className="text-[10px] text-[#8b93b8] uppercase font-bold tracking-wider">Requester</p>
                <p className="font-bold text-white hover:text-[#f0c040] transition-colors">{quest.requester.username}</p>
                <p className="text-xs text-[#f0c040]">★ {quest.requester.rating} Rating</p>
              </div>
            </div>

            <div className="flex flex-col justify-center px-4 border-l border-[#3e4875]">
              <p className="text-[10px] text-[#8b93b8] uppercase font-bold tracking-wider mb-1">Upah Escrow</p>
              <div className="flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-[#f0c040]" />
                <span className="font-extrabold text-lg text-white">
                  {formatCurrency(quest.bounty)}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center px-4 border-l border-[#3e4875]">
              <p className="text-[10px] text-[#8b93b8] uppercase font-bold tracking-wider mb-1">Batas Waktu</p>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-5 h-5 text-[#8b93b8]" />
                <span className="text-sm font-semibold">{new Date(quest.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-2">Deskripsi Tugas</h3>
            <p className="text-[#c8cee8] text-sm leading-relaxed whitespace-pre-wrap">
              {quest.description}
            </p>
          </div>

          {/* Custom SnK Section */}
          <div className="border border-[#3e4875] rounded-xl p-5 bg-[#1a1f3c]">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2bb5a0]" /> 📜 Syarat & Ketentuan (SnK) Khusus Requester
            </h4>
            <p className="text-[#c8cee8] text-xs leading-relaxed italic bg-[#2e3557]/40 p-3 rounded-lg border border-[#3e4875]/20">
              "{quest.termsAndConditions || 'Mengerjakan tugas dengan jujur, mengunggah file orisinal, serta menaati deadline. Dilarang melakukan plagiarisme atau spamming.'}"
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#2bb5a0] font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Dana terproteksi 100% di Escrow SideQuest & tunduk pada log SnK yang tidak dapat diubah (immutable).</span>
            </div>
          </div>

          {/* Interactive State Area */}
          <div className="bg-[#131821] rounded-xl p-5 border border-[#3e4875] shadow-inner">
            
            {/* 1. STATUS: OPEN (Apply with SnK checkbox) */}
            {quest.status === 'OPEN' && !isOwner && (
              <div className="space-y-4">
                <div className="bg-[#1a1f3c] p-4 rounded-xl border border-[#3e4875] space-y-3">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-[#2bb5a0]">
                    <CheckSquare className="w-4 h-4" /> Persetujuan Kontrak Kerja (SnK)
                  </h4>
                  <p className="text-[#8b93b8] text-[11px] leading-relaxed">
                    Sebelum mengajukan lamaran (apply), Anda wajib menyetujui SnK Web SideQuest serta SnK Khusus Requester di atas. Pelanggaran kesepakatan dapat diajukan ke Arbitrase oleh pihak lawan.
                  </p>
                  
                  <button 
                    onClick={() => setAcceptedSnK(!acceptedSnK)}
                    className="flex items-start gap-2.5 text-left text-white text-xs font-semibold focus:outline-none select-none mt-2 group"
                  >
                    <span className="mt-0.5 shrink-0 transition-transform group-active:scale-95">
                      {acceptedSnK ? (
                        <CheckSquare className="w-4 h-4 text-[#2bb5a0]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8b93b8] hover:text-white" />
                      )}
                    </span>
                    <span className={acceptedSnK ? "text-white" : "text-[#8b93b8] hover:text-white"}>
                      Saya menyatakan telah membaca, memahami, dan menyetujui seluruh SnK Web dan SnK Khusus Requester di atas.
                    </span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button 
                    onClick={handleApply}
                    disabled={!acceptedSnK}
                    className={`w-full sm:w-auto font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center gap-2 mx-auto ${
                      acceptedSnK 
                        ? 'bg-[#2bb5a0] hover:bg-[#239987] text-white shadow-[0_0_20px_rgba(43,181,160,0.3)] cursor-pointer' 
                        : 'bg-[#2e3557] text-[#8b93b8] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> Apply Quest (Ajukan Lamaran)
                  </button>
                </div>
              </div>
            )}

            {/* If OPEN and user is owner */}
            {quest.status === 'OPEN' && isOwner && (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-400/10 flex items-center justify-center mx-auto mb-2 text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-sm">Menunggu Pelamar</h4>
                <p className="text-xs text-[#8b93b8] max-w-sm mx-auto">
                  Quest Anda berstatus <strong>OPEN</strong>. Pekerja akan mengajukan lamaran beserta skill yang mereka miliki setelah menyetujui SnK Anda.
                </p>
              </div>
            )}

            {/* 2. STATUS: APPLIED (Review Pelamar) */}
            {quest.status === 'APPLIED' && (
              <div>
                {isOwner ? (
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2 text-[#f0c040]">
                      <UserCheck className="w-4 h-4" /> Requester: Tinjau Pelamar Quest
                    </h4>
                    <p className="text-[#c8cee8] text-xs">
                      Pilih pelamar terbaik untuk memulai pengerjaan quest ini. Menyetujui pekerja akan mengunci kontrak status <strong>TAKEN</strong>.
                    </p>
                    
                    <div className="space-y-3">
                      {(quest.applicants && quest.applicants.length > 0) ? (
                        quest.applicants.map(app => (
                          <div key={app.id} className="bg-[#1a1f3c] border border-[#3e4875] rounded-xl p-4 flex items-center justify-between gap-4">
                            <div 
                              className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
                              onClick={() => onUserClick?.(app.username, app.avatarUrl)}
                            >
                              <img src={app.avatarUrl} alt={app.username} className="w-10 h-10 rounded-full border border-[#3e4875] hover:scale-105 transition-transform" />
                              <div>
                                <h5 className="text-white font-bold text-sm flex items-center gap-1.5 hover:text-[#f0c040] transition-colors">
                                  {app.username}
                                  <span className="bg-[#f0c040]/10 text-[#f0c040] text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-[#f0c040]/20">LVL {app.level}</span>
                                </h5>
                                <p className="text-xs text-[#8b93b8]">★ {app.rating} Rating</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => onApproveApplicant(quest.id, app.id)}
                                className="bg-[#2bb5a0] hover:bg-[#239987] text-white font-bold text-xs px-4 py-2 rounded-full transition-colors cursor-pointer"
                              >
                                Setuju (Pilih)
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#8b93b8] text-xs italic text-center py-2">Belum ada pelamar.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#f0c040]/10 flex items-center justify-center mx-auto mb-2 text-[#f0c040]">
                      <UserCheck className="w-6 h-6 animate-pulse" />
                    </div>
                    <h4 className="text-white font-bold text-sm">Lamaran Terkirim!</h4>
                    <p className="text-xs text-[#c8cee8] max-w-sm mx-auto leading-relaxed">
                      {hasApplied 
                        ? 'Anda telah mendaftar quest ini. Saat ini, Requester sedang mereview profil, rating, dan kelayakan sertifikat keahlian Anda.'
                        : 'Quest ini sedang berada dalam masa review lamaran pelamar oleh Requester.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. STATUS: IN_PROGRESS (Mengerjakan / Submit Bukti) */}
            {quest.status === 'IN_PROGRESS' && (
              <div>
                {isAssignee ? (
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2 text-[#a78bfa]">
                      <UploadCloud className="w-4 h-4" /> Worker: Kirim Bukti Pekerjaan
                    </h4>
                    <p className="text-[#c8cee8] text-xs leading-relaxed">
                      Tugas telah dialokasikan ke Anda ("Status: TAKEN & Cancel Dikunci"). Selesaikan pekerjaan, lampirkan catatan bukti, tautan (jika ada), lalu klik tombol Submit di bawah.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#8b93b8] text-[10px] font-bold uppercase tracking-wider mb-1">Catatan Bukti Pengerjaan (Wajib)</label>
                        <textarea 
                          rows={3}
                          value={proofNotes}
                          onChange={e => setProofNotes(e.target.value)}
                          placeholder="Jelaskan apa saja yang telah Anda kerjakan secara detail sesuai SnK..."
                          className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[#8b93b8] text-[10px] font-bold uppercase tracking-wider mb-1">Tautan Pekerjaan (Opsional)</label>
                        <input 
                          type="text"
                          value={proofLink}
                          onChange={e => setProofLink(e.target.value)}
                          placeholder="e.g. Link Google Drive, Figma, GitHub..."
                          className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2bb5a0] transition-colors"
                        />
                      </div>

                      <div className="border-2 border-dashed border-[#3e4875] rounded-lg p-5 hover:border-[#2bb5a0] transition-colors bg-[#2e3557]/40 text-center">
                        <UploadCloud className="w-8 h-8 text-[#8b93b8] mx-auto mb-1" />
                        <p className="text-xs text-white font-semibold">bukti_pekerjaan.zip</p>
                        <p className="text-[10px] text-[#8b93b8]">Simulasi File Upload Terlampir (1.8 MB)</p>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button 
                        onClick={handleSubmitWork}
                        className="w-full bg-[#2bb5a0] hover:bg-[#239987] text-white font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(43,181,160,0.3)] cursor-pointer"
                      >
                        Kirim Bukti ke Escrow (Submit)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#a78bfa]/10 flex items-center justify-center mx-auto mb-2 text-[#a78bfa]">
                      <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
                    </div>
                    <h4 className="text-white font-bold text-sm">Quest Sedang Dikerjakan</h4>
                    <p className="text-xs text-[#8b93b8] max-w-sm mx-auto leading-relaxed">
                      {isOwner 
                        ? `Pekerja pilihan Anda (ID assignee: ${quest.assigneeId}) sedang mengerjakan tugas ini. Batas waktu pengerjaan terkunci.`
                        : `Quest ini telah diambil dan sedang dikerjakan oleh Hunter terpilih.`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 4. STATUS: ESCROW_LOCKED (Review Hasil & Dispute Option) */}
            {quest.status === 'ESCROW_LOCKED' && (
              <div className="space-y-4">
                <div className="bg-[#1a1f3c] p-4 rounded-xl border border-[#3e4875] space-y-3">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-[#f0c040]">
                    <ShieldAlert className="w-4 h-4" /> Dana Ditangguhkan di Escrow
                  </h4>
                  <p className="text-[#8b93b8] text-[11px] leading-relaxed">
                    Bukti pekerjaan telah diserahkan. Dana bounty aman berada di dalam smart-contract escrow SideQuest dan tidak dapat ditarik sepihak oleh siapapun sampai ada persetujuan hasil kerja atau keputusan Arbitrase.
                  </p>

                  {quest.proofOfWork && (
                    <div className="bg-[#2e3557]/60 p-4 rounded-lg border border-[#3e4875]/40 text-left space-y-2.5">
                      <p className="text-xs font-bold text-[#2bb5a0] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Hasil Bukti Pekerjaan:
                      </p>
                      <p className="text-white text-xs whitespace-pre-wrap pl-5 font-medium">
                        "{quest.proofOfWork.notes}"
                      </p>
                      {quest.proofOfWork.link && (
                        <p className="text-xs pl-5">
                          <span className="text-[#8b93b8]">Tautan: </span>
                          <a href={quest.proofOfWork.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-semibold break-all">
                            {quest.proofOfWork.link}
                          </a>
                        </p>
                      )}
                      <div className="flex items-center gap-3 bg-[#131821] p-2.5 rounded border border-[#3e4875] mt-2">
                        <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center text-xs font-extrabold text-blue-400">
                          ZIP
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-xs text-white font-bold">{quest.proofOfWork.fileName || 'bukti_kerja.zip'}</p>
                          <p className="text-[10px] text-[#8b93b8]">{quest.proofOfWork.fileSize || '1.8 MB'}</p>
                        </div>
                        <button className="text-[#2bb5a0] hover:underline text-xs font-bold cursor-pointer">Download</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Owner Actions (Approve or Reject/Prepare Dispute) */}
                {isOwner && (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => onApproveWork(quest.id)}
                      className="w-full bg-[#2bb5a0] hover:bg-[#239987] text-white font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(43,181,160,0.3)] cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" /> Ya, Setujui Hasil (Approve & Rilis Token)
                    </button>
                    
                    <button 
                      onClick={() => setShowDisputeForm(!showDisputeForm)}
                      className="w-full border border-[#ff5c5c]/50 hover:bg-[#ff5c5c]/10 text-[#ff7878] font-bold py-2.5 rounded-full transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" /> Hasil Tidak Sesuai? Laporkan ke Arbitrase
                    </button>
                  </div>
                )}

                {/* Assignee Actions (Waiting or Filing Dispute) */}
                {isAssignee && !isOwner && (
                  <div className="space-y-4">
                    <div className="text-center py-2 text-[#8b93b8] text-xs">
                      ⏳ Menunggu persetujuan Requester untuk merilis token pencairan dana.
                    </div>
                    <div className="text-center">
                      <button 
                        onClick={() => setShowDisputeForm(!showDisputeForm)}
                        className="border border-[#ff5c5c]/50 hover:bg-[#ff5c5c]/10 text-[#ff7878] font-bold py-2.5 px-6 rounded-full transition-all text-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4" /> Pekerjaan Anda Ditolak / Berdebat? Ajukan Dispute
                      </button>
                    </div>
                  </div>
                )}

                {/* Dispute Submission Form overlay in panel */}
                {showDisputeForm && (
                  <div className="bg-[#1a1f3c] border border-red-500/30 rounded-xl p-4 mt-3 space-y-3">
                    <h5 className="text-[#ff7878] font-bold text-xs uppercase flex items-center gap-1.5">
                      <Gavel className="w-4 h-4" /> Ajukan Formulir Dispute / Banding ke Admin
                    </h5>
                    <p className="text-[#8b93b8] text-[10px] leading-relaxed">
                      Admin akan meninjau bukti kerja, catatan korespondensi, serta log SnK yang disetujui di awal untuk menentukan pemenang secara adil.
                    </p>
                    <textarea 
                      rows={3}
                      value={disputeReason}
                      onChange={e => setDisputeReason(e.target.value)}
                      placeholder="Jelaskan alasan mengapa Anda mengajukan dispute dan buktikan bahwa tindakan Anda sesuai SnK..."
                      className="w-full bg-[#2e3557] border border-[#3e4875] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5c5c] transition-colors placeholder:text-[#8b93b8]"
                    />
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setShowDisputeForm(false)}
                        className="text-[#8b93b8] hover:text-white text-xs px-3 py-1.5"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={handleDisputeSubmit}
                        className="bg-[#ff5c5c] hover:bg-[#ff4444] text-white font-bold text-xs px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        Kirim Aduan Resmi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. STATUS: DISPUTED (Admin dispute resolution and immutable logs) */}
            {quest.status === 'DISPUTED' && (
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
                  <h4 className="text-[#ff7878] font-bold text-xs uppercase flex items-center gap-1.5">
                    <Gavel className="w-4 h-4" /> Arbitrase Sedang Berjalan (Dispute)
                  </h4>
                  <p className="text-[#c8cee8] text-xs leading-relaxed">
                    Kontrak kerja ini telah ditangguhkan secara resmi. Pihak pelapor: <strong className="text-white">"{quest.dispute?.filedBy}"</strong> mengajukan klaim atas ketidaksesuaian kesepakatan dengan alasan:
                  </p>
                  <p className="text-white text-xs bg-[#131821] p-3 rounded border border-red-500/20 italic">
                    "{quest.dispute?.reason || 'Tidak ada alasan rinci disediakan.'}"
                  </p>
                </div>

                {/* Simulated Admin Control Center - Perfect for showcasing the full workflow */}
                <div className="bg-[#1a1f3c] border-2 border-[#ff5c5c]/20 rounded-xl p-5 space-y-3">
                  <h5 className="text-[#ff7878] font-extrabold text-xs flex items-center gap-1.5 uppercase">
                    <ShieldAlert className="w-4 h-4 text-red-400" /> Simulator Panel: Keputusan Arbitrase Admin
                  </h5>
                  <p className="text-[#8b93b8] text-[10px] leading-relaxed">
                    Sesuai workflow bagan, Admin meninjau bukti tak terbantahkan (immutable logs) dari SnK kontrak di SideQuest, lalu menetapkan keputusan final:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button 
                      onClick={() => onResolveDispute(quest.id, 'WORKER_WON')}
                      className="bg-[#2bb5a0] hover:bg-[#239987] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <span className="font-bold">Kabulkan Banding Worker</span>
                      <span className="text-[9px] opacity-80 font-normal text-center">Dana Escrow dilepas ke saldo pekerja</span>
                    </button>
                    
                    <button 
                      onClick={() => onResolveDispute(quest.id, 'REQUESTER_WON')}
                      className="bg-[#ff5c5c] hover:bg-[#ff4444] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <span className="font-bold">Kabulkan Klaim Requester</span>
                      <span className="text-[9px] opacity-80 font-normal text-center">Kontrak dibatalkan & dana escrow direfund</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. STATUS: COMPLETED (Generate Token & Claim) */}
            {quest.status === 'COMPLETED' && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-[#2bb5a0]/15 flex items-center justify-center mx-auto mb-3 text-[#2bb5a0] border border-[#2bb5a0]/30 shadow-[0_0_20px_rgba(43,181,160,0.2)]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <h4 className="font-serif text-2xl font-bold text-white">Quest Disetujui!</h4>
                
                {/* Generation of finished completion token code */}
                {quest.proofOfWork?.tokenCode ? (
                  <div className="bg-[#1a1f3c] border border-[#3e4875] rounded-xl p-5 max-w-md mx-auto space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-[#2bb5a0] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
                        <Key className="w-3.5 h-3.5 text-[#f0c040]" /> Sistem: Generate Token Selesai
                      </p>
                      <p className="text-[#8b93b8] text-[11px] leading-relaxed">
                        SideQuest Smart-Contract telah membuat tanda terima kriptografis (completion token) bukti pengerjaan sukses untuk transaksi ini.
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-[#131821] px-4 py-3 rounded-lg border border-[#3e4875] font-mono text-sm">
                      <span className="text-[#f0c040] font-extrabold">{quest.proofOfWork.tokenCode}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(quest.proofOfWork?.tokenCode || '');
                          setCopiedToken(true);
                          setTimeout(() => setCopiedToken(false), 2000);
                        }}
                        className="text-xs bg-[#2bb5a0]/20 hover:bg-[#2bb5a0]/30 text-[#2bb5a0] px-2.5 py-1 rounded transition-colors font-sans font-bold cursor-pointer"
                      >
                        {copiedToken ? 'Copied! ✓' : 'Copy'}
                      </button>
                    </div>

                    {/* Claim flow based on flowchart */}
                    {isAssignee && !isClaimedLocal && (
                      <div className="space-y-3 pt-2 border-t border-[#3e4875]/40 text-left">
                        <p className="text-white text-xs font-bold flex items-center gap-1 text-[#f0c040]">
                          <ChevronRight className="w-4 h-4" /> Worker: Klaim Token Selesai
                        </p>
                        <p className="text-[#8b93b8] text-[10px] leading-relaxed">
                          Masukkan kembali token selesai di atas ke input di bawah untuk memverifikasi dompet dan memicu pelepasan saldo escrow langsung ke Wallet Anda.
                        </p>

                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={typedToken}
                            onChange={e => setTypedToken(e.target.value)}
                            placeholder="Paste token di sini..."
                            className="flex-1 bg-[#131821] border border-[#3e4875] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2bb5a0] font-mono"
                          />
                          <button 
                            onClick={handleClaimSubmit}
                            className="bg-[#f0c040] hover:bg-[#dfb134] text-[#131821] font-extrabold text-xs px-4 rounded-lg transition-colors cursor-pointer"
                          >
                            Klaim Dana
                          </button>
                        </div>
                      </div>
                    )}

                    {(isClaimedLocal || quest.proofOfWork.isClaimed) ? (
                      <div className="bg-[#2bb5a0]/10 border border-[#2bb5a0]/20 text-[#2bb5a0] rounded-lg py-2 px-4 text-xs font-bold flex items-center justify-center gap-1.5 mt-2">
                        <CheckCircle className="w-4 h-4" /> Transaksi Berhasil & Saldo Telah Dicairkan!
                      </div>
                    ) : (
                      !isAssignee && (
                        <div className="text-[10px] text-[#8b93b8] leading-relaxed italic pt-2">
                          * Worker ({quest.assigneeName || 'Hunter'}) harus mengklaim token selesai di atas untuk melikuidasi saldo escrow mereka.
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#8b93b8]">Bounty telah berhasil dilepas ke saldo pekerja.</p>
                )}
              </div>
            )}

            {/* 7. STATUS: CANCELLED */}
            {quest.status === 'CANCELLED' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#ff5c5c]/10 flex items-center justify-center mx-auto text-[#ff5c5c] border border-[#ff5c5c]/20">
                  <X className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">Quest Dibatalkan & Refunded</h4>
                <p className="text-xs text-[#c8cee8] leading-relaxed max-w-sm mx-auto">
                  Kontrak ini dibatalkan oleh putusan Arbitrase Admin. Sesuai workflow, dana jaminan escrow telah dikembalikan (refund) sepenuhnya ke saldo dompet Requester.
                </p>
                {quest.dispute?.adminNotes && (
                  <div className="bg-[#1a1f3c] border border-[#3e4875] p-3 rounded-lg text-left text-[11px] text-[#8b93b8] italic">
                    <strong>Catatan Admin:</strong> "{quest.dispute.adminNotes}"
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
