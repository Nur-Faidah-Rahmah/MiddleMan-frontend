import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { QuestBoard } from './components/quest/QuestBoard';
import { QuestDetailModal } from './components/modals/QuestDetailModal';
import { CreateQuestModal } from './components/modals/CreateQuestModal';
import { LoginModal } from './components/modals/LoginModal';
import { RegisterModal } from './components/modals/RegisterModal';
import { useAuth } from './context/AuthContext';
import { jobsApi } from './api/jobs';
import { Quest } from './types';

function App() {
  const { user, loading, logout } = useAuth();
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const selectedQuest = quests.find(q => q.id === selectedQuestId);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const data = await jobsApi.getAvailableJobs();
      setQuests(data);
    } catch (err) {
      console.error("Failed to fetch quests", err);
    }
  };

  // Actions
  const handleAcceptQuest = async (questId: string) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      await jobsApi.takeJob(questId);
      await fetchQuests(); // Refresh data
      setSelectedQuestId(null);
    } catch (error) {
      console.error("Failed to accept quest", error);
      alert("Gagal mengambil quest");
    }
  };

  const handleSubmitProof = async (questId: string) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      // Assuming completing is the same as submitting proof for now
      await jobsApi.completeJob(questId);
      await fetchQuests();
    } catch (error) {
      console.error("Failed to submit proof", error);
      alert("Gagal menyelesaikan quest");
    }
  };

  const handleApproveWork = async (questId: string) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      // The backend uses 'verify' for admin, but for customer it might be different.
      // We will refresh for now.
      await fetchQuests();
      setSelectedQuestId(null);
    } catch (error) {
      console.error("Failed to approve work", error);
    }
  };

  const handleCreateQuest = async (questData: any) => {
    if (!user) return setIsLoginModalOpen(true);
    try {
      await jobsApi.createJob({
        title: questData.title,
        description: questData.description,
        price: questData.bounty,
        category_id: 1, // Default to 1 since frontend doesn't choose category ID yet
        deadline: questData.deadline || new Date(Date.now() + 86400000).toISOString().split('T')[0]
      });
      await fetchQuests();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create quest", error);
      alert("Gagal membuat quest");
    }
  };

  const handleCreateClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
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

  return (
    <div className="min-h-screen flex flex-col relative font-sans" style={{ background: 'linear-gradient(135deg, #253047 0%, #2e3a5a 50%, #253558 100%)' }}>
      <Navbar 
        user={user} 
        onCreateQuestClick={handleCreateClick}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={logout}
      />
      
      <main className="flex-1">
        <QuestBoard 
          quests={quests} 
          currentUserId={user?.id || ''}
          onQuestClick={(quest) => setSelectedQuestId(quest.id)}
        />
      </main>

      <Footer />

      {/* Modals */}
      {selectedQuest && (
        <QuestDetailModal 
          quest={selectedQuest} 
          currentUserId={user?.id || ''}
          onClose={() => setSelectedQuestId(null)}
          onAccept={handleAcceptQuest}
          onSubmitProof={handleSubmitProof}
          onApproveWork={handleApproveWork}
        />
      )}

      {isCreateModalOpen && (
        <CreateQuestModal 
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateQuest}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}

      {isRegisterModalOpen && (
        <RegisterModal 
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
