import { Quest, UserProfile } from '../types';

export const mapJobToQuest = (job: any): Quest => {
  return {
    id: job.id.toString(),
    title: job.title,
    description: job.description,
    category: job.category?.name || 'Dev',
    rank: 'C', // Backend doesn't have rank, using default
    bounty: parseFloat(job.price),
    status: mapJobStatus(job.status),
    isFeatured: false,
    deadline: job.deadline,
    isOnline: true,
    priceUnit: 'proyek',
    subTags: [],
    requester: job.customer ? {
      id: job.customer.id.toString(),
      username: job.customer.name,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${job.customer.name}`,
      rating: 5.0, // Default rating as it's not in user model
    } : {
      id: 'unknown',
      username: 'Unknown User',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=unknown',
      rating: 5.0,
    },
    assigneeId: job.worker_id ? job.worker_id.toString() : undefined,
  };
};

export const mapJobStatus = (status: string): Quest['status'] => {
  switch (status) {
    case 'pending_verification':
      return 'OPEN';
    case 'approved':
      return 'OPEN';
    case 'on_progress':
      return 'IN_PROGRESS';
    case 'completed':
      return 'COMPLETED';
    default:
      return 'OPEN';
  }
};

export const mapUserToProfile = (user: any): UserProfile => {
  return {
    id: user.id.toString(),
    username: user.name,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`,
    level: 1, // Default level
    exp: 0,
    expToNextLevel: 1000,
    walletBalance: 0, // Should be fetched from another endpoint if exists
    rating: 5.0,
    role: user.role_id === 1 ? 'admin' : (user.role_id === 2 ? 'customer' : 'worker'),
  };
};
