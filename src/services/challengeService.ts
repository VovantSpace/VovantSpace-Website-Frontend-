import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Challenge {
    _id: string;
    title: string;
    description: string;
    industry: string;
    requiredSkills: string[];
    skillBudgets: Array<{
        skill: string;
        budget: number;
    }>;
    problemSolversNeeded: number;
    totalBudget: number;
    status: string;
    innovator: {
        _id: string;
        firstName: string;
        lastName: string;
        organization?: string;
        profilePicture?: string;
    };
    submissions: any[];
    approvedSubmissions: any[];
    views: number;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateChallengeData {
    title: string;
    description: string;
    industry: string;
    requiredSkills: string[];
    skillBudgets: Array<{
        skill: string;
        budget: number;
    }>;
    problemSolversNeeded: number;
    totalBudget: number;
    dueDate?: string;
}

export interface MyChallengeData {
    id: string;
    name: string;
    problemSolvers: string;
    submissions: number;
    approved: number;
    rejected: number;
    status: string;
    reward: number;
    daysLeft: number | null;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export const challengeService = {
    // Create a new challenge
    createChallenge: async (challengeData: CreateChallengeData) => {
       try {
           console.log('Sending data to backend:', challengeData);
           const response = await api.post('/challenges', challengeData);
           console.log('Response from backend:', response.data);
           return response.data;
       } catch (error: any) {
           console.error('Error creating challenge:', error);
           console.error('Error response:', error.response?.data)
           throw error;
       }
    },

    // Get all challenges (for homepage)
    getAllChallenges: async (params?: {
        page?: number;
        limit?: number;
        industry?: string;
        skills?: string;
    }) => {
        const response = await api.get('/challenges', { params });
        return response.data;
    },

    // Get challenges created by the current user
    getMyChallenges: async (): Promise<{ success: boolean; data: MyChallengeData[]; message?: string }> => {
        const response = await api.get('/challenges/my-challenges');
        return response.data;
    },

    // Get a single challenge by ID
    getChallengeById: async (id: string) => {
        const response = await api.get(`/challenges/${id}`);
        return response.data;
    },

    // Submit a proposal to a challenge
    submitProposal: async (challengeId: string, proposal: string) => {
        const response = await api.post(`/challenges/${challengeId}/submit`, {
            proposal
        });
        return response.data;
    },

    // Review a submission (approve/reject)
    reviewSubmission: async (challengeId: string, submissionId: string, action: 'approve' | 'reject') => {
        const response = await api.put(`/challenges/${challengeId}/submissions/${submissionId}/review`, {
            action
        });
        return response.data;
    },

    // Update challenge status
    updateChallengeStatus: async (id: string, status: string) => {
        const response = await api.put(`/challenges/${id}/status`, { status });
        return response.data;
    },

    // Complete challenge and select winners
    completeChallenge: async (id: string, winners: Array<{ problemSolver: string; reward: number }>) => {
        const response = await api.put(`/challenges/${id}/complete`, { winners });
        return response.data;
    }
};

export default challengeService;