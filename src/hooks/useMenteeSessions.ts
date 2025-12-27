import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";

export function useMenteeSessions(menteeId: string) {
    const [sessions, setSessions] = useState({
        upcoming: [] as any[],
        completed: [] as any[],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // IMPORTANT:
            // api.ts already has baseURL = `${VITE_API_BASE_URL}/api`
            // so we DO NOT prefix paths with `/api` here.
            const [upcomingRes, completedRes] = await Promise.all([
                api.get("/mentees/sessions", { params: { type: "upcoming" } }),
                api.get("/mentees/sessions", { params: { type: "completed" } }),
            ]);

            // Normalize responses defensively
            const upcomingSessions =
                Array.isArray(upcomingRes.data?.data?.sessions)
                    ? upcomingRes.data.data.sessions
                    : [];

            const completedSessions =
                Array.isArray(completedRes.data?.data?.sessions)
                    ? completedRes.data.data.sessions
                    : [];

            setSessions({
                upcoming: upcomingSessions,
                completed: completedSessions,
            });
        } catch (err: any) {
            console.error("Error fetching mentee sessions:", err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to fetch sessions"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (menteeId) {
            fetchSessions();
        }
    }, [menteeId, fetchSessions]);

    return {
        sessions,
        loading,
        error,
        refresh: fetchSessions,
    };
}
