import {useState, useEffect, useCallback} from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Fetches the problem solver's stats
export const useProblemSolverStats = () => {
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/problem-solvers/dashboard/stats`, {withCredentials: true})
            if (res.data.success) {
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

            const res = await axios.get(
                `${API_BASE_URL}/api/problem-solvers/challenges/explore`,
                {
                    params: { ...filters, page, limit },
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
        // 👇 stringify filters so effect runs only when values change
    }, [page, limit, JSON.stringify(filters)]);

    return { challenges, pagination, loading, isFirstLoad, error, refetch: fetchChallenges };
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
            const res = await axios.get(`${API_BASE_URL}/api/problem-solvers/submissions`, {
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