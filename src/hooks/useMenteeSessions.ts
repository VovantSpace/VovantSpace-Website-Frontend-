import {useEffect, useState} from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useMenteeSessions(menteeId: string) {
    const [sessions, setSessions] = useState<{
        upcoming: any[];
        completed: any[];
    }>({
        upcoming: [],
        completed: []
    });
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSessions = async () => {
        if (!menteeId) return;
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")

            // Fetch both upcoming and completed sessions
            const [upcomingRes, completedRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/mentees/sessions?type=upcoming`, {
                    headers: {Authorization: `Bearer ${token}`},
                }),
                axios.get(`${API_BASE_URL}/api/mentees/sessions?type=completed`, {
                    headers: {Authorization: `Bearer ${token}`},
                })
            ])

            setSessions({
                upcoming: upcomingRes.data.data || [],
                completed: completedRes.data.data.sessions || []
            })
        } catch (err: any) {
            console.error("Error fetching sessions:", err)
            setError(err.response?.data?.message || "Failed to fetch sessions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [menteeId])

    return {sessions, loading, error, refresh: fetchSessions}
}