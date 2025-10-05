import {useState, useEffect, useCallback} from "react";
import axios from "axios";

interface MentorSearchFilters {
    expertise?: string;
    specialities?: string;
    languages?: string;
    priceMin?: number;
    priceMax?: number;
    experienceLevel?: string;
    sortBy?: "price_low" | "price_high" | "rating" | "experience"
    page?: number;
    limit?: number;
    search?: string
}

export function useMentorSearch(filters: MentorSearchFilters = {}) {
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any>(null);

    const fetchMentors = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, String(value))
                }
            })

            const response = await axios.get(`/api/mentor/mentors/search?${params.toString()}`, {
                withCredentials: true
            })

            const data = response.data?.data || {}
            // Add an initial property to each mentor based on their name
            const mentorsWithInitials = (data.mentors || []).map((mentor: any) => ({
                ...mentor,
                initial: mentor.name ? mentor.name.charAt(0).toUpperCase() : 'M'
            }))
            setMentors(mentorsWithInitials)
            setPagination(data.pagination || {})
            setError(null)
        } catch (err: any) {
            console.error("Mentor search error:", err)
            setError(err.response?.data?.message || "Failed to fetch mentors")
        } finally {
            setLoading(false)
        }
    }, [JSON.stringify(filters)])

    useEffect(() => {
        fetchMentors()
    }, [fetchMentors])

    return {
        mentors,
        pagination,
        loading,
        error,
        refresh: fetchMentors
    }
}