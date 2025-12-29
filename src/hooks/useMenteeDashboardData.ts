import {useEffect, useState, useCallback} from "react";
import api from '@/utils/api'

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
                api.get("/mentees/dashboard/stats", {withCredentials: true}),
                api.get("/mentees/sessions?type=upcoming", {withCredentials: true}),
                api.get("/notifications", {withCredentials: true})
            ])
            setStats(statsRes.data.data || {})
            setSessions(sessionsRes.data?.data?.sessions || sessionsRes.data?.sessions || [])
            setNotifications(notificationsRes.data?.data || notificationsRes.data?.notifications || [])
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