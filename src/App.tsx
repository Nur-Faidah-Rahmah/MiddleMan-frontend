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

function AppContent() {
  const { user, loading, logout } = useAuth();
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    if (!user) return;
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
    if (!user) return;
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
    if (!user) return;
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
    if (!user) return;
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
            />
          } />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        </Routes>
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
