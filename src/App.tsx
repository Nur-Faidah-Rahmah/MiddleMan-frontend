import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { QuestBoard } from './components/quest/QuestBoard';
import { QuestDetailModal } from './components/modals/QuestDetailModal';
import { CreateQuestModal } from './components/modals/CreateQuestModal';
import { useAuth } from './context/AuthContext';
import { jobsApi } from './api/jobs';
import { Quest } from './types';
import ProfilePage from './screens/ProfilePage';
import AuthScreen from './screens/AuthScreen';
import AdminDashboard from './screens/AdminDashboard';
import { WorkerProfileModal } from './components/modals/WorkerProfileModal';

function AppContent() {
  const { user, loading, logout } = useAuth();
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWorkerUsername, setSelectedWorkerUsername] = useState<string | null>(null);
  const [selectedWorkerAvatar, setSelectedWorkerAvatar] = useState<string | undefined>(undefined);

  const handleUserClick = (username: string, avatarUrl?: string) => {
    setSelectedWorkerUsername(username);
    setSelectedWorkerAvatar(avatarUrl);
  };

  const selectedQuest = quests.find(q => q.id === selectedQuestId);

  useEffect(() => {
    if (user) {
      fetchQuests();
    }
  }, [user]);

  const fetchQuests = async () => {
    try {
      const data = await jobsApi.getAvailableJobs();
      setQuests(data);
    } catch (err) {
      console.error("Failed to fetch quests", err);
    }
  };

  // Actions
  const handleApplyQuest = async (questId: string) => {
    if (!user) return;
    try {
      await jobsApi.applyJob(questId);
      await fetchQuests(); // Refresh data
    } catch (error: any) {
      console.error("Failed to apply for quest", error);
      alert(error.message || "Gagal mendaftar quest");
    }
  };

  const handleApproveApplicant = async (questId: string, applicantId: string) => {
    if (!user) return;
    try {
      await jobsApi.approveApplicant(questId, applicantId);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to approve applicant", error);
      alert("Gagal menyetujui pekerja");
    }
  };

  const handleSubmitProof = async (questId: string, notes: string, link?: string) => {
    if (!user) return;
    try {
      await jobsApi.submitProof(questId, notes, link);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to submit proof", error);
      alert("Gagal menyerahkan bukti pekerjaan");
    }
  };

  const handleApproveWork = async (questId: string) => {
    if (!user) return;
    try {
      await jobsApi.approveWork(questId);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to approve work", error);
      alert("Gagal menyetujui pekerjaan");
    }
  };

  const handleFileDispute = async (questId: string, reason: string) => {
    if (!user) return;
    try {
      await jobsApi.fileDispute(questId, reason);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to file dispute", error);
      alert("Gagal mengajukan dispute");
    }
  };

  const handleResolveDispute = async (questId: string, decision: 'WORKER_WON' | 'REQUESTER_WON') => {
    if (!user) return;
    try {
      await jobsApi.resolveDispute(questId, decision);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to resolve dispute", error);
      alert("Gagal menyelesaikan dispute");
    }
  };

  const handleClaimToken = async (questId: string) => {
    if (!user) return;
    try {
      await jobsApi.claimToken(questId);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to claim token", error);
      alert("Gagal mengklaim token");
    }
  };

  const handleCreateQuest = async (questData: any) => {
    if (!user) return;
    try {
      await jobsApi.createJob({
        title: questData.title,
        description: questData.description,
        price: questData.bounty,
        category: questData.category || 'Dev',
        deadline: questData.deadline || new Date(Date.now() + 86400000).toISOString(),
        isOnline: questData.isOnline !== undefined ? questData.isOnline : true,
        priceUnit: questData.priceUnit || 'proyek',
        termsAndConditions: questData.termsAndConditions || 'Selesaikan pekerjaan sesuai spesifikasi dan unggah kode sumber final.',
        subTags: questData.subTags || [questData.category || 'Dev']
      });
      await fetchQuests();
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error("Failed to create quest", error);
      alert(error.message || "Gagal membuat quest");
    }
  };

  const handleCreateClick = () => {
    if (user) {
      setIsCreateModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #253047 0%, #2e3a5a 50%, #253558 100%)',
        color: '#3a9e9e',
        fontFamily: "'Syne', sans-serif",
        fontSize: '1.25rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      <Navbar 
        user={user} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateQuestClick={handleCreateClick}
      />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <QuestBoard 
              quests={quests} 
              currentUserId={user?.id || ''}
              searchQuery={searchQuery}
              onQuestClick={(quest) => setSelectedQuestId(quest.id)}
              onUserClick={handleUserClick}
            />
          } />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard onRefreshQuests={fetchQuests} /> : <Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />

      {/* Modals */}
      {selectedQuest && (
        <QuestDetailModal 
          quest={selectedQuest} 
          currentUserId={user?.id || ''}
          onClose={() => setSelectedQuestId(null)}
          onAccept={handleApplyQuest}
          onApproveApplicant={handleApproveApplicant}
          onSubmitProof={handleSubmitProof}
          onApproveWork={handleApproveWork}
          onFileDispute={handleFileDispute}
          onResolveDispute={handleResolveDispute}
          onClaimToken={handleClaimToken}
          onUserClick={handleUserClick}
        />
      )}
      {isCreateModalOpen && (
        <CreateQuestModal 
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateQuest}
        />
      )}
      {selectedWorkerUsername && (
        <WorkerProfileModal
          username={selectedWorkerUsername}
          avatarUrl={selectedWorkerAvatar}
          currentUserId={user?.id || ''}
          onClose={() => {
            setSelectedWorkerUsername(null);
            setSelectedWorkerAvatar(undefined);
          }}
          onHireSuccess={fetchQuests}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
