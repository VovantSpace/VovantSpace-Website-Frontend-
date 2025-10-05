import {useEffect, useState, useCallback} from "react";
import axios from 'axios'

export function useMenteeDashboardData(menteeId: string) {
    const [stats, setStats] = useState<any>(null)
    const [sessions, setSessions] = useState<any[]>([])
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!menteeId) return;
        setLoading(true)
        try {
            const [statsRes, sessionsRes, notificationsRes] = await Promise.all([
                axios.get("/api/mentees/dashboard/stats", {withCredentials: true}),
                axios.get("/api/mentees/sessions?type=upcoming", {withCredentials: true}),
                axios.get("/api/notifications", {withCredentials: true})
            ])
            setStats(statsRes.data.data)
            setSessions(sessionsRes.data?.data?.sessions || sessionsRes.data?.sessions || [])
            setNotifications(notificationsRes.data.data || [])
            setError(null)
        } catch (err: any) {
            console.error("Dashboard fetch error:", err)
            setError(err.response?.data?.message || "Failed to fetch dashboard data")
        } finally {
            setLoading(false)
        }
    }, [menteeId])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    return {stats, sessions, notifications, loading, error, refresh: fetchAllData}
}