import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface MentorSearchFilters {
    expertise?: string;
    specialities?: string;
    languages?: string;
    priceMin?: number;
    priceMax?: number;
    experienceLevel?: string;
    sortBy?: "price_low" | "price_high" | "rating" | "experience";
    page?: number;
    limit?: number;
    search?: string;
}

export function useMentorSearch(filters: MentorSearchFilters = {}) {
    const [mentors, setMentors] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMentors = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, String(value));
                }
            });

            const response = await axios.get(
                `/api/mentees/mentors/search?${params.toString()}`,
                { withCredentials: true }
            );

            console.log("🔍 Mentor search response:", response.data);

            const data = response.data?.data || {};
            const normalized = (data.mentors || []).map((mentor: any) => ({
                ...mentor,

                // ✅ Normalize hourly rate fields
                averageHourlyRate:
                    mentor.averageHourlyRate ??
                    mentor.sessionRate ??
                    mentor.hourlyRate ??
                    0,

                // ✅ Flatten stats safely
                totalSessions: mentor.stats?.totalSessions ?? mentor.totalSessions ?? 0,
                completedSessions:
                    mentor.stats?.completedSessions ?? mentor.completedSessions ?? 0,
                averageRating:
                    mentor.stats?.averageRating ?? mentor.averageRating ?? 0,
                totalRatings: mentor.stats?.totalRatings ?? mentor.totalRatings ?? 0,

                // ✅ Ensure initial
                initial: mentor.firstName?.[0]?.toUpperCase() || "M",
            }));

            setMentors(normalized);
            setPagination(data.pagination || {});
            setError(null);
        } catch (err: any) {
            console.error("❌ Mentor search error:", err);
            setError(err.response?.data?.message || "Failed to fetch mentors");
            setMentors([]);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchMentors();
    }, [fetchMentors]);

    return {
        mentors,
        pagination,
        loading,
        error,
        refresh: fetchMentors,
    };
}
