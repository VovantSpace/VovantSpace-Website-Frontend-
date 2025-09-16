import {useState, useEffect, useCallback} from 'react'

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
    timeSlots?: Array<{ startTime: string; endTime: string }>;
    specificDate?: string;
    specificTimeDate?: Array<{ startTime: string; endTime: string }>;
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

// Base API configuration
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/mentor${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        }
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

            const response = await apiRequest(`/requests?${queryParams}`);
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
        action: 'accept' | 'decline' | 'counter_response',
        data?: { declineReason?: string, counterProposal?: any }
    ) => {
        try {
            const response = await apiRequest(`/requests/${requestId}/respond`, {
                method: 'PATCH',
                body: JSON.stringify({action, ...data}),
            })

            // Update the local state
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

            const response = await apiRequest(`/sessions?${queryParams}`);
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

    return {
        sessions,
        pagination,
        loading,
        error,
        refetch: fetchSessions,
    }
}

// Hook for availability management
export const useAvailability = (type?: string) => {
    const [availability, setAvailability] = useState<Availability[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const fetchAvailability = useCallback(async () => {
        try {
            setLoading(true)
            setError(null);

            const queryParams = type ? `${type}` : '';
            const response = await apiRequest(`/availability?${queryParams}`);
            setAvailability(response.data.availability || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch availability')
            setAvailability([])
        } finally {
            setLoading(false)
        }
    }, [type])

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    const createAvailability = async (availabilityData: Omit<Availability, '_id' | 'mentor' | 'isActive'>) => {
        try {
            const response = await apiRequest(`/availability`, {
                    method: 'PUT',
                    body: JSON.stringify(availabilityData)
                }
            )

            setAvailability(prev =>
                prev.map(item =>
                    item._id === response.data.availability._id
                        ? response.data.availability
                        : item
                )
            )

            return response.data.availability;
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to create availability')
        }
    }

    const updateAvailability = async (availabilityData: Omit<Availability, '_id' | 'mentor' | 'isActive'>) => {
        try {
            const response = await apiRequest(`/availability`, {
                method: 'PUT',
                body: JSON.stringify(availabilityData)
            })

            setAvailability(prev =>
                prev.map(item =>
                    item._id === response.data.availability._id
                        ? response.data.availability
                        : item
                )
            )

            return response.data.availability;
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to update availability')
        }
    }

    const deleteAvailability = async (availabilityId: string) => {
        try {
            await apiRequest(`availabilitys/${availabilityId}`, {
                method: 'DELETE',
            })

            setAvailability(prev => prev.filter(item => item._id === availabilityId))
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to delete availability')
        }
    }

    return {
        availability,
        loading,
        error,
        refetch: fetchAvailability,
        createAvailability,
        updateAvailability,
        deleteAvailability,
    }
}

// Hook for dashboard statistics
export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/dashboard/stats')
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
    const sessionRequests = useSessionRequests('pending', 1, 5); // recent pending requests
    const upcomingSessions = useMentorSessions('scheduled', 1, 5) // upcoming sessions
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