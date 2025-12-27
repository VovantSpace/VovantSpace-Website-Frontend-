import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";

/**
 * TYPES
 */
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
    status: "pending" | "accepted" | "declined" | "counter_proposed";
    declineReason: string;
    counterProposal?: {
        proposedDate: string;
        proposedEndTime: string;
        message?: string;
    };
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
    status: "scheduled" | "completed" | "cancelled";
    rating?: number;
}

export interface Availability {
    _id: string;
    mentor: string;
    type: "recurring" | "specific_date";
    dayOfWeek?: number;
    timeSlots?: Array<{ startTime: string; endTime: string; id?: string }>;
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

/**
 * Shared API request helper (uses Axios client from src/utils/api.ts)
 * IMPORTANT: api.ts already has baseURL = `${VITE_API_BASE_URL}/api`
 * So here we pass paths like "/mentor/..." (NOT "/api/mentor/...").
 */
type ApiResponse<T = any> = {
    success?: boolean;
    message?: string;
    data?: T;
};

function getErrorMessage(err: any, fallback: string) {
    return (
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        fallback
    );
}

async function apiRequest<T = any>(
    method: "get" | "post" | "patch" | "delete",
    url: string,
    body?: any
): Promise<ApiResponse<T>> {
    try {
        const res = await api.request({
            method,
            url,
            data: body,
        });
        return res.data;
    } catch (err: any) {
        throw new Error(getErrorMessage(err, "Something went wrong"));
    }
}

/**
 * Hook for session requests
 */
export const useSessionRequests = (
    status?: string,
    page: number = 1,
    limit: number = 10
) => {
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
            });

            if (status) queryParams.append("status", status);

            const response = await apiRequest<{ requests: SessionRequest[]; pagination: PaginationData }>(
                "get",
                `/mentor/requests?${queryParams.toString()}`
            );

            const payload = response.data as any;

            setRequests(payload?.requests || []);
            setPagination(payload?.pagination || null);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch requests");
            setRequests([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [status, page, limit]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const respondToRequest = async (
        requestId: string,
        action: "accept" | "decline" | "counter_propose",
        data?: { declineReason?: string; counterProposal?: any }
    ) => {
        const response = await apiRequest<{ sessionRequest: SessionRequest }>(
            "patch",
            `/mentor/requests/${requestId}/respond`,
            { action, ...(data || {}) }
        );

        const updated = (response.data as any)?.sessionRequest;

        if (updated) {
            setRequests((prev) =>
                prev.map((req) => (req._id === requestId ? { ...req, ...updated } : req))
            );
        }

        return updated;
    };

    return {
        requests,
        pagination,
        setRequests,
        loading,
        error,
        refetch: fetchRequests,
        respondToRequest,
    };
};

/**
 * Hook for mentor sessions
 */
export const useMentorSessions = (
    status?: string,
    page: number = 1,
    limit: number = 10
) => {
    const [sessions, setSessions] = useState<MentorSession[]>([]);
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
            });

            if (status) queryParams.append("status", status);

            const response = await apiRequest<{ sessions: MentorSession[]; pagination: PaginationData }>(
                "get",
                `/mentor/sessions?${queryParams.toString()}`
            );

            const payload = response.data as any;

            setSessions(payload?.sessions || []);
            setPagination(payload?.pagination || null);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch sessions");
            setSessions([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    }, [status, page, limit]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const addSession = (newSession: MentorSession) => {
        setSessions((prev) => [newSession, ...prev]);
    };

    return {
        sessions,
        pagination,
        loading,
        error,
        refetch: fetchSessions,
        addSession,
    };
};

/**
 * Hook for availability management
 */
export const useAvailability = (mentorId?: string, type?: string) => {
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mapping DAY ENUM -> numeric index
    const DAY_ENUM_TO_INDEX: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
    };

    /** Normalize response from backend → Availability[] */
    const normalizeItem = (a: any): Availability => {
        let normalizedDay: number | undefined;

        if (typeof a.dayOfWeek === "number") normalizedDay = a.dayOfWeek;
        else if (typeof a.dayOfWeek === "string") {
            normalizedDay = DAY_ENUM_TO_INDEX[a.dayOfWeek.toUpperCase()];
        }

        return {
            _id: a._id,
            mentor: a.mentor,
            type: a.type,
            dayOfWeek: normalizedDay,
            specificDate: a.specificDate,
            timeSlots: Array.isArray(a.timeSlots) ? a.timeSlots : [],
            specificTimeSlots: Array.isArray(a.specificTimeSlots) ? a.specificTimeSlots : [],
            specificTimeDate: Array.isArray(a.specificTimeDate) ? a.specificTimeDate : [],
            timeZone: a.timeZone || a.timezone || "UTC",
            hourlyRate: a.hourlyRate ?? 0,
            isActive: a.isActive ?? true,
        };
    };

    const fetchAvailability = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (mentorId) params.append("mentorId", mentorId);
            if (type) params.append("type", type);

            const res = await apiRequest<any>("get", `/mentor/availability?${params.toString()}`);

            const items = Array.isArray(res.data)
                ? res.data
                : Array.isArray((res.data as any)?.data)
                    ? (res.data as any).data
                    : [];

            const normalized = items.map(normalizeItem);
            setAvailability(normalized);
            return normalized;
        } catch (err: any) {
            const msg = err?.message || "Failed to load availability";
            setError(msg);
            setAvailability([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, [mentorId, type]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    /** Save (create or update) availability */
    const saveAvailability = async (payload: any) => {
        try {
            const res = await apiRequest<any>("post", "/mentor/availability", payload);
            await fetchAvailability();
            return { success: true, data: res.data?.data ?? res.data };
        } catch (err: any) {
            return { success: false, error: err?.message || "Failed to save availability" };
        }
    };

    const deleteAvailability = async (id: string) => {
        try {
            await apiRequest<any>("delete", `/mentor/availability/${id}`);
            setAvailability((prev) => prev.filter((a) => a._id !== id));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err?.message || "Failed to delete availability" };
        }
    };

    return {
        availability,
        loading,
        error,
        refetch: fetchAvailability,
        createAvailability: saveAvailability,
        updateAvailability: saveAvailability,
        deleteAvailability,
        setAvailability,
    };
};

/**
 * Hook for dashboard statistics
 */
export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest<DashboardStats>("get", "/mentor/dashboard/stats");
            setStats((response.data as any) || null);
        } catch (err: any) {
            setError(err?.message || "Failed to fetch dashboard stats");
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    };
};

/**
 * Combined hook for mentor dashboard
 */
export const useMentorDashboard = () => {
    const dashboardStats = useDashboardStats();
    const sessionRequests = useSessionRequests("pending", 1, 5);
    const upcomingSessions = useMentorSessions("scheduled", 1, 5);
    const availability = useAvailability();

    const refetchAll = () => {
        dashboardStats.refetch();
        sessionRequests.refetch();
        upcomingSessions.refetch();
        availability.refetch();
    };

    return {
        dashboardStats,
        sessionRequests,
        upcomingSessions,
        availability,
        refetchAll,
    };
};

export function useMentorDetails(mentorId: string | null, open: boolean) {
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMentorDetails = useCallback(async () => {
        if (!mentorId || !open) return;
        setLoading(true);

        try {
            // IMPORTANT: api.ts already includes "/api" in baseURL
            // so do NOT prefix with "/api" here.
            const response = await api.get(`/mentees/mentors/${mentorId}`, {
                withCredentials: true,
            });

            const data = response.data?.data;
            setMentor(data?.mentor || null);
            setError(null);
        } catch (err: any) {
            setError(getErrorMessage(err, "Failed to fetch mentor details"));
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