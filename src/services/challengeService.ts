
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with the default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken') ||
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

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
    isPaused?: boolean;
    isPromoted?: boolean;
    promotionType?: string;
}

export interface DashboardStats {
    totalChallenges: number;
    activeChallenges: number;
    completedChallenges: number;
    totalSubmissions: number;
    approvedSubmissions: number;
    totalViews: number;
    totalBudget: number;
    recentActivity: any[];
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
    dueDate?: Date;
    additionalResources?: Array<{
        filename: string;
        url: string;
        fileType: string;
    }>;
}

// Challenge API endpoints
export const challengeApi = {
    // Create a new challenge
    createChallenge: async (data: CreateChallengeData): Promise<ApiResponse<Challenge>> => {
        const response: AxiosResponse<ApiResponse<Challenge>> = await api.post('/challenges', data);
        return response.data;
    },

    // Get user's challenges
    getMyChallenges: async (): Promise<ApiResponse<Challenge[]>> => {
        const response: AxiosResponse<ApiResponse<Challenge[]>> = await api.get('/challenges/my-challenges');
        return response.data;
    },

    // Get challenge by ID
    getChallengeById: async (id: string): Promise<ApiResponse<Challenge>> => {
        const response: AxiosResponse<ApiResponse<Challenge>> = await api.get(`/challenges/${id}`);
        return response.data;
    },

    // Update challenge status
    updateChallengeStatus: async (id: string, status: string): Promise<ApiResponse> => {
        const response: AxiosResponse<ApiResponse> = await api.put(`/challenges/${id}/status`, { status });
        return response.data;
    },

    // Complete challenge
    completeChallenge: async (id: string, winners: Array<{ problemSolver: string, reward: number }>): Promise<ApiResponse> => {
        const response: AxiosResponse<ApiResponse> = await api.put(`/challenges/${id}/complete`, { winners });
        return response.data;
    },

    // Duplicate challenge
    duplicateChallenge: async (id: string): Promise<ApiResponse<Challenge>> => {
        const response: AxiosResponse<ApiResponse<Challenge>> = await api.post(`/challenges/${id}/duplicate`);
        return response.data;
    },

    // Promote the challenge
    promoteChallenge: async (id: string, promotionType: string, duration: number): Promise<ApiResponse> => {
        const response: AxiosResponse<ApiResponse> = await api.put(`/challenges/${id}/promote`, { promotionType, duration });
        return response.data;
    },

    // Review submission
    reviewSubmission: async (challengeId: string, submissionId: string, action: 'approve' | 'reject'): Promise<ApiResponse> => {
        const response: AxiosResponse<ApiResponse> = await api.put(`/challenges/${challengeId}/submissions/${submissionId}`, { action });
        return response.data;
    },

    // Get challenge analytics
    getChallengeAnalytics: async (timeRange?: string): Promise<ApiResponse<any>> => {
        const response: AxiosResponse<ApiResponse<any>> = await api.get('/challenges/analytics', {
            params: { timeRange }
        });
        return response.data;
    }
};

// Dashboard API endpoints
export const dashboardApi = {
    // Get dashboard overview
    getDashboardOverview: async (): Promise<ApiResponse<DashboardStats>> => {
        const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get('/dashboard/overview');
        return response.data;
    },

    // Get challenges for management
    getChallengesManagement: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        sortBy?: string;
    }): Promise<ApiResponse<any>> => {
        const response: AxiosResponse<ApiResponse<any>> = await api.get('/dashboard/challenges', { params });
        return response.data;
    },

    // Toggle challenge pause
    toggleChallengePause: async (challengeId: string): Promise<ApiResponse> => {
        const response: AxiosResponse<ApiResponse> = await api.patch(`/dashboard/challenges/${challengeId}/pause`);
        return response.data;
    }
};

export default api;