import api from '../lib/axios';
import { mapJobToQuest } from './mappers';
import { Quest } from '../types';
import {
  getSimulatedQuests,
  saveSimulatedQuests,
  getSimulatedCurrentUser
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
    const quests = getSimulatedQuests();
    const newQuest: Quest = {
      id: `q-${Date.now()}`,
      title: jobData.title,
      description: jobData.description,
      category: jobData.category || 'Dev',
      rank: 'B',
      bounty: parseFloat(jobData.price || jobData.bounty || '0'),
      status: 'OPEN',
      isFeatured: false,
      deadline: jobData.deadline || new Date(Date.now() + 86400000).toISOString(),
      isOnline: jobData.isOnline !== undefined ? jobData.isOnline : true,
      priceUnit: jobData.priceUnit || 'proyek',
      subTags: jobData.subTags || ['Lokal'],
      requester: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
      }
    };
    saveSimulatedQuests([newQuest, ...quests]);
    return newQuest;
  },
  
  takeJob: async (jobId: string) => {
    const user = getSimulatedCurrentUser();
    if (!user) throw new Error("Must be logged in to take quest");
    const quests = getSimulatedQuests();
    const updated = quests.map(q => {
      if (q.id === jobId) {
        return { ...q, status: 'IN_PROGRESS' as const, assigneeId: user.id };
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
        return { ...q, status: 'COMPLETED' as const };
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
