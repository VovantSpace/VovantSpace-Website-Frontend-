import {useState, useEffect} from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useMenteeSessions(menteeId: string) {
    const [sessions, setSessions] = useState({
        upcoming: [] as any[],
        completed: [] as any[],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = async () => {
        if (!menteeId) return;
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            const [upcomingRes, completedRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/mentees/sessions?type=upcoming`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE_URL}/api/mentees/sessions?type=completed`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            // ✅ Normalize response to ensure arrays
            const upcomingSessions = Array.isArray(upcomingRes.data?.data?.sessions)
                ? upcomingRes.data.data.sessions
                : [];

            const completedSessions = Array.isArray(completedRes.data?.data?.sessions)
                ? completedRes.data.data.sessions
                : [];

            setSessions({
                upcoming: upcomingSessions,
                completed: completedSessions,
            });
        } catch (err: any) {
            console.error("Error fetching sessions:", err);
            setError(err.response?.data?.message || "Failed to fetch sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [menteeId]);

    return { sessions, loading, error, refresh: fetchSessions };
}
