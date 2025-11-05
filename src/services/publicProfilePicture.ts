import {User} from '@/hooks/userService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function getPublicProfile(problemSolverId: string): Promise<User> {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/api/problem-solver/${problemSolverId}/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || `Failed to fetch profile for ${problemSolverId}`);
        }

        const data = result.data;

        // ✅ Ensure portfolio, education, certifications are arrays
        return {
            _id: data.id,
            firstName: data.name?.split(" ")[0] || "",
            lastName: data.name?.split(" ")[1] || "",
            email: data.email,
            profilePicture: data.profilePicture,
            bio: data.bio || "",
            skills: Array.isArray(data.skills) ? data.skills : [],
            experience: data.experience || "",
            education: Array.isArray(data.education) ? data.education : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            portfolio: Array.isArray(data.portfolio)
                ? data.portfolio
                : data.portfolio
                    ? [data.portfolio]
                    : [],
            createdAt: "",
            updatedAt: "",
            role: "Problem Solver",
            isVerified: false,
            sendTips: false,
            agreeTerms: false,
        } as unknown as User;
    } catch (err: any) {
        console.error("❌ Error in getPublicProfile:", err);
        throw new Error(err.message || "Failed to fetch public profile");
    }
}