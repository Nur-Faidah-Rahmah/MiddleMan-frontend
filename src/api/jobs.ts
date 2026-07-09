import api from '../lib/axios';
import { mapJobToQuest } from './mappers';
import { Quest } from '../types';

export const jobsApi = {
  getAvailableJobs: async (): Promise<Quest[]> => {
    const response = await api.get('/available-jobs');
    return response.data.data.map(mapJobToQuest);
  },
  
  getMyRequests: async (): Promise<Quest[]> => {
    const response = await api.get('/my-requests');
    return response.data.data.map(mapJobToQuest);
  },
  
  createJob: async (jobData: any) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },
  
  takeJob: async (jobId: string) => {
    const response = await api.put(`/jobs/${jobId}/take`);
    return response.data;
  },
  
  completeJob: async (jobId: string) => {
    const response = await api.put(`/jobs/${jobId}/complete`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  }
};
