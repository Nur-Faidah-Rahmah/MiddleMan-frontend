import api from '../lib/axios';
import { mapJobToQuest } from './mappers';
import { Quest } from '../types';
import {
  getSimulatedQuests,
  saveSimulatedQuests,
  getSimulatedCurrentUser,
  setSimulatedCurrentUser
} from './mockStorage';

export const jobsApi = {
  getAvailableJobs: async (): Promise<Quest[]> => {
    return getSimulatedQuests();
  },
  
  getMyRequests: async (): Promise<Quest[]> => {
    const user = getSimulatedCurrentUser();
    if (!user) return [];
    return getSimulatedQuests().filter(q => q.requester.id === user.id);
  },
  
  createJob: async (jobData: any) => {
    const user = getSimulatedCurrentUser();
    if (!user) throw new Error("Must be logged in to create quest");
    
    const bountyNum = parseFloat(jobData.price || jobData.bounty || '0');
    if (user.walletBalance < bountyNum) {
      throw new Error(`Saldo tidak mencukupi untuk mendepositkan Rp ${bountyNum.toLocaleString('id-ID')} ke Escrow. Silakan top up terlebih dahulu.`);
    }

    // Deduct user wallet balance for escrow deposit
    user.walletBalance -= bountyNum;
    setSimulatedCurrentUser(user);

    const quests = getSimulatedQuests();
    const newQuest: Quest = {
      id: `q-${Date.now()}`,
      title: jobData.title,
      description: jobData.description,
      category: jobData.category || 'Dev',
      rank: jobData.rank || 'B',
      bounty: bountyNum,
      status: 'OPEN',
      isFeatured: false,
      deadline: jobData.deadline || new Date(Date.now() + 86400000).toISOString(),
      isOnline: jobData.isOnline !== undefined ? jobData.isOnline : true,
      priceUnit: jobData.priceUnit || 'proyek',
      subTags: jobData.subTags || [jobData.category || 'Lokal'],
      requester: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
      },
      termsAndConditions: jobData.termsAndConditions || 'Harap selesaikan pekerjaan sesuai deskripsi secara profesional.',
      escrowStatus: 'DEPOSITED',
      applicants: []
    };
    saveSimulatedQuests([newQuest, ...quests]);
    return newQuest;
  },
  
  applyJob: async (jobId: string) => {
    const user = getSimulatedCurrentUser();
    if (!user) throw new Error("Must be logged in to apply");
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        const applicants = q.applicants || [];
        const alreadyApplied = applicants.some(a => a.id === user.id);
        if (alreadyApplied) return q;
        const newApplicant = {
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          rating: user.rating,
          level: user.level,
          appliedAt: new Date().toISOString()
        };
        return {
          ...q,
          status: 'APPLIED' as const,
          applicants: [...applicants, newApplicant]
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  approveApplicant: async (jobId: string, applicantId: string) => {
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        // Strip ws- prefix if present
        const cleanId = applicantId.startsWith('ws-') ? applicantId.replace('ws-', '') : applicantId;
        
        // Find applicant either in quest applicants or in users list
        const users = getSimulatedUsersList();
        const applicant = q.applicants?.find(a => a.id === cleanId) || users.find(u => u.id === cleanId);
        
        return {
          ...q,
          status: 'IN_PROGRESS' as const,
          assigneeId: cleanId,
          assigneeName: applicant?.username,
          assigneeAvatar: applicant?.avatarUrl
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  takeJob: async (jobId: string) => {
    const user = getSimulatedCurrentUser();
    if (!user) throw new Error("Must be logged in to take quest");
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        return { 
          ...q, 
          status: 'IN_PROGRESS' as const, 
          assigneeId: user.id,
          assigneeName: user.username,
          assigneeAvatar: user.avatarUrl
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },
  
  submitProof: async (jobId: string, notes: string, link?: string) => {
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        return {
          ...q,
          status: 'ESCROW_LOCKED' as const,
          proofOfWork: {
            notes,
            link: link || '',
            fileName: 'bukti_kerja_v1.zip',
            fileSize: '1.8 MB',
            submittedAt: new Date().toISOString(),
            tokenCode: `SQ-CLAIM-${Math.floor(100000 + Math.random() * 900000)}`,
            isClaimed: false
          }
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  completeJob: async (jobId: string) => {
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        return { 
          ...q, 
          status: 'COMPLETED' as const,
          escrowStatus: 'RELEASED' as const
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  approveWork: async (jobId: string) => {
    const quests = getSimulatedQuests();
    const quest = quests.find(q => q.id === jobId);
    if (!quest) throw new Error("Quest not found");

    // Release the escrowed bounty to the worker's wallet
    const users = localStorage.getItem('sq_users_list_simulated');
    if (users && quest.assigneeId) {
      try {
        const usersList = JSON.parse(users);
        const updatedUsers = usersList.map((u: any) => {
          if (u.id === quest.assigneeId) {
            return {
              ...u,
              walletBalance: (u.walletBalance || 0) + quest.bounty,
              completedJobsCount: (u.completedJobsCount || 0) + 1,
              exp: (u.exp || 0) + 250 // Reward EXP
            };
          }
          return u;
        });
        localStorage.setItem('sq_users_list_simulated', JSON.stringify(updatedUsers));
        
        // Also update current user if they are the assignee
        const currentUser = getSimulatedCurrentUser();
        if (currentUser && currentUser.id === quest.assigneeId) {
          currentUser.walletBalance += quest.bounty;
          currentUser.completedJobsCount = (currentUser.completedJobsCount || 0) + 1;
          currentUser.exp += 250;
          setSimulatedCurrentUser(currentUser);
        }
      } catch (err) {
        console.error("Failed to release funds in simulated storage", err);
      }
    }

    const updated = quests.map(q => {
      if (q.id === jobId) {
        return {
          ...q,
          status: 'COMPLETED' as const,
          escrowStatus: 'RELEASED' as const
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  fileDispute: async (jobId: string, reason: string) => {
    const user = getSimulatedCurrentUser();
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        return {
          ...q,
          status: 'DISPUTED' as const,
          dispute: {
            filedBy: user?.username || 'Worker',
            reason,
            filedAt: new Date().toISOString()
          }
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  resolveDispute: async (jobId: string, decision: 'WORKER_WON' | 'REQUESTER_WON') => {
    const quests = getSimulatedQuests();
    const quest = quests.find(q => q.id === jobId);
    if (!quest) throw new Error("Quest not found");

    if (decision === 'WORKER_WON') {
      // Release funds to worker
      const users = localStorage.getItem('sq_users_list_simulated');
      if (users && quest.assigneeId) {
        try {
          const usersList = JSON.parse(users);
          const updatedUsers = usersList.map((u: any) => {
            if (u.id === quest.assigneeId) {
              return {
                ...u,
                walletBalance: (u.walletBalance || 0) + quest.bounty,
                completedJobsCount: (u.completedJobsCount || 0) + 1,
                exp: (u.exp || 0) + 250
              };
            }
            return u;
          });
          localStorage.setItem('sq_users_list_simulated', JSON.stringify(updatedUsers));

          // Also update current user if they are the assignee
          const currentUser = getSimulatedCurrentUser();
          if (currentUser && currentUser.id === quest.assigneeId) {
            currentUser.walletBalance += quest.bounty;
            currentUser.completedJobsCount = (currentUser.completedJobsCount || 0) + 1;
            currentUser.exp += 250;
            setSimulatedCurrentUser(currentUser);
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // Refund to requester
      const users = localStorage.getItem('sq_users_list_simulated');
      if (users) {
        try {
          const usersList = JSON.parse(users);
          const updatedUsers = usersList.map((u: any) => {
            if (u.id === quest.requester.id) {
              return {
                ...u,
                walletBalance: (u.walletBalance || 0) + quest.bounty
              };
            }
            return u;
          });
          localStorage.setItem('sq_users_list_simulated', JSON.stringify(updatedUsers));

          // Also update current user if they are the requester
          const currentUser = getSimulatedCurrentUser();
          if (currentUser && currentUser.id === quest.requester.id) {
            currentUser.walletBalance += quest.bounty;
            setSimulatedCurrentUser(currentUser);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }

    const updated = quests.map(q => {
      if (q.id === jobId) {
        return {
          ...q,
          status: decision === 'WORKER_WON' ? ('COMPLETED' as const) : ('CANCELLED' as const),
          escrowStatus: decision === 'WORKER_WON' ? ('RELEASED' as const) : ('REFUNDED' as const),
          dispute: {
            filedBy: q.dispute?.filedBy || 'Worker',
            reason: q.dispute?.reason || 'Dispute diajukan.',
            filedAt: q.dispute?.filedAt || new Date().toISOString(),
            decision,
            decisionAt: new Date().toISOString(),
            adminNotes: decision === 'WORKER_WON'
              ? 'Arbitrase Admin: Setelah peninjauan, hasil kerja dinilai memenuhi syarat SnK. Dana escrow dilepas ke saldo Worker.'
              : 'Arbitrase Admin: Setelah peninjauan, hasil kerja terbukti tidak memenuhi syarat SnK atau melanggar ketentuan. Dana escrow direfund ke Requester.'
          }
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },

  claimToken: async (jobId: string) => {
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId && q.proofOfWork) {
        return {
          ...q,
          proofOfWork: {
            ...q.proofOfWork,
            isClaimed: true
          }
        };
      }
      return q;
    });
    saveSimulatedQuests(updated);
    return { success: true };
  },
  
  getCategories: async () => {
    return [
      { id: 1, name: 'IT & Code' },
      { id: 2, name: 'Design' },
      { id: 3, name: 'Writing' },
      { id: 4, name: 'Video' },
      { id: 5, name: 'Misc' }
    ];
  }
};
