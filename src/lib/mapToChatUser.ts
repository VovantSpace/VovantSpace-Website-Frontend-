import type {User as ChatUser} from '@/dashboard/Innovator/types'


type InputUser =
    | {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
    timeZone?: string;
    profilePicture?: string;
    skills?: string[];
    phone?: string;
    bio?: string;
} | ChatUser;

/**
 * Maps the authenticated user (from useAuth) into the standardized ChatUser shape
 */

export function mapToChatUser(user: InputUser): ChatUser {
    if ("id" in user) {
        return user;
    }

    return {
        id: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Vovant User",
        email: user.email,
        avatar: user.profilePicture || "",
        role: user.role,
        timeZone: user.timeZone || "UTC",
        phone: user.phone || "",
        bio: user.bio || "",
        skills: user.skills || [],
    }
}