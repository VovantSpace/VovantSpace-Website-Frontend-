import { useEffect, useState, useCallback } from "react";
import type { User } from "@/hooks/notificationService";
import {
    getCurrentUser,
    refreshProfile as refreshProfileApi,
    logoutUser,
} from "@/services/authService";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const loadUser = useCallback(() => {
        try {
            const currentUser = getCurrentUser();
            setUser(currentUser);
            setAuthError(null);
        } catch {
            setUser(null);
            setAuthError("Failed to load user");
        } finally {
            setAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const refreshProfile = async () => {
        try {
            setAuthLoading(true);
            const refreshed = await refreshProfileApi();
            setUser(refreshed);
        } catch {
            setAuthError("Failed to refresh profile");
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return {
        user,
        isAuthenticated: !!user,
        loading: authLoading,   // ✅ alias exposed here
        authLoading,
        authError,
        refreshProfile,
        logout,
    };
}