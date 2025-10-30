import {useState, useEffect, useCallback} from "react";
import axios from "axios";
import api from '../utils/api'
import {toast} from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Fetches the problem solver's stats
export const useProblemSolverStats = () => {
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`${API_BASE_URL}/api/problem-solvers/dashboard/stats`, {withCredentials: true})
            if (res.data.success) {
                console.log("Problem Solver Stats:", res.data.data.stats);
                setStats(res.data.data.stats || null);
            } else {
                setError(res.data.message);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetch stats");
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return {stats, loading, error, refetch: fetchStats};
}


// Fetches challenges for the problems solvers
export const useExploreChallenges = (
    filters: any = {},
    page: number = 1,
    limit: number = 10
) => {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalChallenges: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChallenges = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `${API_BASE_URL}/api/problem-solvers/challenges/explore`,
                {
                    params: {...filters, page, limit},
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setChallenges(res.data.data.challenges || []);
                setPagination(
                    res.data.data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalChallenges: 0,
                    }
                );
                setError(null);
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch challenges");
        } finally {
            setLoading(false);
            setIsFirstLoad(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
        // 👇 stringify filters so effects runs only when values change
    }, [page, limit, JSON.stringify(filters)]);

    return {challenges, pagination, loading, isFirstLoad, error, refetch: fetchChallenges};
};

// API that handles the pitches
export const useMySubmissions = (status?: string, page: number = 1, limit: number = 10) => {
    const [submissions, setSubmissions] = useState<any[]>([])
    const [pagination, setPagination] = useState({currentPage: 1, totalPages: 1, totalSubmissions: 0})
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true)
            const res = await api.get(`${API_BASE_URL}/api/problem-solvers/submissions`, {
                params: {status, page, limit},
                withCredentials: true
            })
            if (res.data.success) {
                setSubmissions(res.data.data.submissions || []);
                setPagination(res.data.data.pagination || {currentPage: 1, totalPages: 1, totalSubmissions: 0})
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch submissions");
        } finally {
            setLoading(false)
        }
    }, [status, page, limit])

    useEffect(() => {
        fetchSubmissions()
    }, [fetchSubmissions])

    return {submissions, pagination, loading, error, refetch: fetchSubmissions}
}

export const useSubmitPitch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false)

    const submitPitch = useCallback(
        async (challengeId: string, payload: any) => {
            try {
                setLoading(true);
                setError(null);
                setSuccess(false)

                const res = await api.post(
                    `${API_BASE_URL}/api/problem-solvers/challenges/${challengeId}/pitch`,
                        payload,
                    {withCredentials: true}
                )

                if (res.data.success) {
                    setSuccess(true)
                    return res.data.data
                } else {
                    setError(res.data.message || "Failed to submit pitch");
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Error Submitting pitch!");
            } finally {
                setLoading(false)
            }
        },

        []
    )
    return {submitPitch, loading, error, success}
}

export const useProblemSolverProfile = () => {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(
                `${API_BASE_URL}/api/problem-solvers/profile`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setProfile(res.data.data);
            } else {
                setError(res.data.message || "Failed to fetch profile");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ only run once on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
};
