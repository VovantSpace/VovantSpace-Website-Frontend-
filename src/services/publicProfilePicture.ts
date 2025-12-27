import {User} from '@/hooks/userService'
import api from "@/utils/api"

export async function getPublicProfile(problemSolverId: string): Promise<User> {
    try {
        const response = await api.get(
            `/problem-solver/${problemSolverId}/profile`
        )

        const data = response.data?.data

       if (!data) {
           throw new Error("Invalid profile response")
       }

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