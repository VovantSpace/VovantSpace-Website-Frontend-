import {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import {setAvailability} from "../../backend-vovant/controllers/mentorController";

export interface SessionRequest {
    _id: string;
    mentor: string;
    mentee: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
        email: string;
    };
    requestedDate: string;
    duration: number;
    amount: string;
    status: 'pending' | 'accepted' | 'declined' | 'counter_proposed';
    declineReason: string;
    counterProposal?: {
        proposedDate: string;
        proposedEndTime: string;
        message?: string;
    }
    createdAt: string;
}

export interface MentorSession {
    _id: string;
    mentor: string;
    mentee: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
        email: string;
    };
    scheduledDate: string;
    duration: number;
    amount: number;
    status: 'scheduled' | 'completed' | 'cancelled';
    rating?: number;
}

export interface Availability {
    _id: string;
    mentor: string;
    type: 'recurring' | 'specific_date';
    dayOfWeek?: number;
    timeSlots?: Array<{ startTime: string; endTime: string, id?: string }>;
    specificDate?: string;
    specificTimeDate?: Array<{ startTime: string; endTime: string }>;
    specificTimeSlots?: Array<{ startTime: string; endTime: string }>;
    timeZone: string;
    hourlyRate: number;
    isActive: boolean;
}

export interface DashboardStats {
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    declinedRequests: number;
    completedSessions: number;
    upcomingSessions: number;
    totalEarnings: number;
    averageRatings: number;
    totalRatings: number;
}

export interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalRequests?: number;
    totalSessions?: number;
    limit: number;
}

interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

interface Certification {
    name: string;
    issuer: string;
    date: string;
}

interface WorkExperience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
}

export interface Mentor {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    expertise?: string;
    specialties?: string[];
    languages?: string[];
    experienceLevel?: string;
    country?: string;
    sessionRate?: number;
    averageHourlyRate?: number;
    averageRating?: number;
    totalSessions?: number;
    completedSessions?: number;
    certifications?: Certification[];
    workExperience?: WorkExperience[];
    stats?: {
        totalSessions: number;
        completedSessions: number;
        averageRating: number;
        totalRatings: number;
    };
    hasPendingRequests?: boolean;
}

// Base API configuration
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
        ...options
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
}

// Hook for session requests
export const useSessionRequests = (status?: string, page: number = 1, limit: number = 10) => {
    const [requests, setRequests] = useState<SessionRequest[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            })

            if (status) {
                queryParams.append('status', status);
            }

            const response = await apiRequest(`/mentor/requests?${queryParams}`);
            setRequests(response.data.requests || []);
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch requests')
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, [status, page, limit]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const respondToRequest = async (
        requestId: string,
        action: 'accept' | 'decline' | 'counter_propose',
        data?: { declineReason?: string, counterProposal?: any }
    ) => {
        try {
            const response = await apiRequest(`/mentor/requests/${requestId}/respond`, {
                method: 'PATCH',
                body: JSON.stringify({action, ...data}),
            })

            setRequests(prev =>
                prev.map(req =>
                    req._id === requestId
                        ? {...req, ...response.data.sessionRequest}
                        : req
                )
            )

            return response.data.sessionRequest;
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to respond to request')
        }
    }

    return {
        requests,
        pagination,
        setRequests,
        loading,
        error,
        refetch: fetchRequests,
        respondToRequest
    }
}

// Hook for mentor sessions
export const useMentorSessions = (status?: string, page: number = 1, limit: number = 10) => {
    const [sessions, setSessions] = useState<MentorSession[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            })

            if (status) {
                queryParams.append('status', status);
            }

            const response = await apiRequest(`/mentor/sessions?${queryParams}`);
            setSessions(response.data.sessions || [])
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, [status, page, limit]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const addSession = (newSession: MentorSession) => {
        setSessions(prev => [newSession, ...prev]);
    }

    return {
        sessions,
        pagination,
        loading,
        error,
        refetch: fetchSessions,
        addSession,
    }
}

// Hook for availability management - COMPLETELY FIXED VERSION
export const useAvailability = (mentorId?: string, type?: string) => {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAvailability = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (type) params.append('type', type);
            if (mentorId) params.append('mentorId', mentorId);

            const res = await apiRequest(`/mentor/availability?${params}`);

            let items = Array.isArray(res.data) ? res.data : res.data?.data || [];

            // Normalize into FE structure
            items = items.map((item: any) => ({
                ...item,
                specificTimeSlots: item.specificTimeSlots || [],
                specificTimeDate: item.specificTimeDate || [],
            }));

            setAvailability(items);
        } catch (e: any) {
            setError(e.message || 'Failed to load availability');
            setAvailability([]);
        } finally {
            setLoading(false);
        }
    }, [mentorId, type]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    const saveAvailability = async (payload: any) => {
        console.log("📤 Saving availability:", payload);

        // ALWAYS send "specificTimeSlots" for specific_date
        if (payload.type === "specific_date") {
            payload.specificTimeSlots = payload.specificTimeSlots || [];
        }

        try {
            const res = await apiRequest(`/mentor/availability`, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            console.log("Raw API response:", res);

            await fetchAvailability();
            return {
                success: true,
                data: res.data?.data || res.data || null
            }

        } catch (e: any) {
            console.error('API error:', e)

            if (e.response?.data) {
                console.error('Response Data:', e.response.data)
                return {
                    success: false,
                    error: e.response.data.error ||
                        e.response.data.message ||
                        "Request failed. Please try again later."
                };
            }
            return { success: false, error: e.message || "Unknown error" };
        }
    };

    const createAvailability = saveAvailability;
    const updateAvailability = saveAvailability;

    const deleteAvailability = async (id: string) => {
        try {
            await apiRequest(`/mentor/availability/${id}`, { method: 'DELETE' });
            setAvailability(prev => prev.filter(a => a._id !== id));
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    };

    return {
        availability,
        loading,
        error,
        refetch: fetchAvailability,
        createAvailability,
        updateAvailability,
        deleteAvailability,
        setAvailability
    };
};

// Hook for dashboard statistics
export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/mentor/dashboard/stats')
            setStats(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
            setStats(null);
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    }
}

// Combined hook for the entire mentor dashboard
export const useMentorDashboard = () => {
    const dashboardStats = useDashboardStats();
    const sessionRequests = useSessionRequests('pending', 1, 5);
    const upcomingSessions = useMentorSessions('scheduled', 1, 5)
    const availability = useAvailability()

    const refetchAll = () => {
        dashboardStats.refetch()
        sessionRequests.refetch()
        upcomingSessions.refetch()
        availability.refetch()
    }

    return {
        dashboardStats,
        sessionRequests,
        upcomingSessions,
        availability,
        refetchAll,
    }
}

export function useMentorDetails(mentorId: string | null, open: boolean) {
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMentorDetails = useCallback(async () => {
        if (!mentorId || !open) return;
        setLoading(true);
        try {
            const response = await axios.get(`/api/mentees/mentors/${mentorId}`, {
                withCredentials: true,
            });

            const data = response.data?.data;
            setMentor(data?.mentor || null);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching mentor details:', err);
            setError(err.response?.data?.message || 'Failed to fetch mentor details');
        } finally {
            setLoading(false);
        }
    }, [mentorId, open]);

    useEffect(() => {
        fetchMentorDetails();
    }, [fetchMentorDetails]);

    return {
        mentor,
        loading,
        error,
        refresh: fetchMentorDetails,
    };
}
