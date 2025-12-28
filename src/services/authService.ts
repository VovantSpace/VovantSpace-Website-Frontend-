import api from "@/utils/api"
import {User} from "@/hooks/notificationService"

export function getCurrentUser(): User | null {
    try {
        const raw = localStorage.getItem("currentUser");
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export async function refreshProfile(): Promise<User> {
    const res = await api.get('/me')
    const user = res.data?.user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
}

export async function logoutUser() {
    await api.post("/auth/logout");
    localStorage.removeItem("currentUser");
}