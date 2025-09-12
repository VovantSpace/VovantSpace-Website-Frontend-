import {useState, useEffect, useCallback} from 'react'
import {challengeApi, dashboardApi, Challenge, DashboardStats, CreateChallengeData} from "@/services/challengeService";

export const useChallenges = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChallenges = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await challengeApi.getMyChallenges();
            if (response.success) {
                setChallenges(response.data || []);
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch challenges")
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetchChallenges();
    }, [fetchChallenges])

    const createChallenge = async (data: CreateChallengeData) => {
        try {
            const response = await challengeApi.createChallenge(data);
            if (response.success) {
                await fetchChallenges(); // Refresh the list
                return response.data;
            } else {
                console.error("API error", response.message)
                return null
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create challenge')
        }
    }

    const updateChallengeStatus = async (id: string, status: string) => {
        try {
            const response = await challengeApi.updateChallengeStatus(id, status)
            if (response.success) {
                await fetchChallenges();
                return true;
            } else {
                console.error("API error", response.message)
                return null
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update challenge status")
        }
    }

    const duplicateChallenge = async (id: string) => {
        try {
            const response = await challengeApi.duplicateChallenge(id);
            if (response.success) {
                await fetchChallenges()
                return response.data;
            } else {
                console.error("API error", response.message)
                return null
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "failed to duplicate challenge")
        }
    }

    const promoteChallenge = async (id: string, promotionType: string, duration: number = 7) => {
        try {
            const response = await challengeApi.promoteChallenge(id, promotionType, duration)
            if (response.success) {
                await fetchChallenges()
                return true;
            } else {
                console.error("API error", response.message)
                return null
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to promote challenge")
        }
    }

    const pauseChallenge = async (id: string) => {
        try {
            const response = await dashboardApi.toggleChallengePause(id)
            if (response.success) {
                await fetchChallenges()
                return true
            } else {
                console.error("API error", response.message)
                return null
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to pause/resume challenge")
        }
    }

    return {
        challenges,
        loading,
        error,
        refetch: fetchChallenges,
        createChallenge,
        updateChallengeStatus,
        duplicateChallenge,
        promoteChallenge,
        pauseChallenge
    }
}

export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await dashboardApi.getDashboardOverview()
            if (response.success) {
                setStats(response.data || null);
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch dashboard stats")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
            fetchStats()
        }, [fetchStats]
    )

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    }
}

export const useChallenge = (challengeId: string) => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChallenge = useCallback(async () => {
        if (!challengeId) return;

        try {
            setLoading(true)
            setError(null)
            const response = await challengeApi.getChallengeById(challengeId)
            if (response.success) {
                setChallenge(response.data || null);
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch challenge")
        } finally {
            setLoading(false)
        }
    }, [challengeId])

    useEffect(() => {
        fetchChallenge()
    }, [fetchChallenge])

    const reviewSubmission = async (submissionId: string, action: 'approve' | 'reject') => {
        if (!challengeId) return;

        if (challenge?.status !== 'active') throw new Error('Challenge is not active')

        try {
            const response = await challengeApi.reviewSubmission(challenge._id, submissionId, action)
            if (response.success) {
                await fetchChallenge() // refresh challenge data
                return true
            } else {
                console.error("API error", response.message)
                return null
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to review submission")
        }
    }

    return {
        challenge,
        loading,
        error,
        refetch: fetchChallenge,
        reviewSubmission
    }
}

export const useAnalytics = (timeRange: string = '30d') => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(() => {
        try {
            setLoading(true);
            setError(null);
            const response = await challengeApi.getChallengeAnalytics(timeRange);
            if (response.success) {
                setAnalytics(response.data);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        analytics,
        loading,
        error,
        refetch: fetchAnalytics
    }
}