import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";

/* =========================
   PROBLEM SOLVER STATS
========================= */
export const useProblemSolverStats = () => {
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/problem-solvers/dashboard/stats");

            if (res.data.success) {
                setStats(res.data.data.stats ?? null);
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
};

/* =========================
   EXPLORE CHALLENGES
========================= */
export const useExploreChallenges = (
    filters: any = {},
    page = 1,
    limit = 10
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

            const res = await api.get("/problem-solvers/challenges/explore", {
                params: { ...filters, page, limit },
            });

            if (res.data.success) {
                setChallenges(res.data.data.challenges ?? []);
                setPagination(
                    res.data.data.pagination ?? {
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
    }, [page, limit, JSON.stringify(filters)]);

    return {
        challenges,
        pagination,
        loading,
        isFirstLoad,
        error,
        refetch: fetchChallenges,
    };
};

/* =========================
   MY SUBMISSIONS
========================= */
export const useMySubmissions = (
    status?: string,
    page = 1,
    limit = 10
) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalSubmissions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/problem-solvers/submissions", {
                params: { status, page, limit },
            });

            if (res.data.success) {
                setSubmissions(res.data.data.submissions ?? []);
                setPagination(res.data.data.pagination ?? pagination);
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    }, [status, page, limit]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    return { submissions, pagination, loading, error, refetch: fetchSubmissions };
};

/* =========================
   SUBMIT PITCH
========================= */
export const useSubmitPitch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submitPitch = useCallback(async (challengeId: string, payload: any) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const res = await api.post(
                `/problem-solvers/challenges/${challengeId}/pitch`,
                payload
            );

            if (res.data.success) {
                setSuccess(true);
                toast.success("Pitch submitted successfully");
                return res.data.data;
            } else {
                setError(res.data.message || "Failed to submit pitch");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error submitting pitch");
        } finally {
            setLoading(false);
        }
    }, []);

    return { submitPitch, loading, error, success };
};

/* =========================
   PROFILE
========================= */
export const useProblemSolverProfile = () => {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/problem-solvers/profile");

            if (res.data.success) {
                setProfile(res.data.data);
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
};

/* =========================
   CHALLENGE SUBMISSIONS
========================= */
export const useChallengeSubmissions = (challengeId?: string) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async () => {
        if (!challengeId) return;

        try {
            setLoading(true);
            const res = await api.get(
                `/problem-solvers/challenges/${challengeId}/submissions`
            );

            if (res.data.success) {
                setSubmissions(res.data.data.submissions ?? []);
            } else {
                setError(res.data.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    }, [challengeId]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    return { submissions, loading, error, refetch: fetchSubmissions };
};