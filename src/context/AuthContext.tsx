import {createContext, useContext, useEffect, useMemo, useState} from "react";
import api from "@/utils/api";

export interface User {
    _id: string;

    // Core identity
    firstName: string;
    lastName: string;
    email: string;
    role: string;

    // Optional profile data
    bio?: string;
    experience?: string;
    expertise?: string;
    industry?: string;
    phone?: string;
    organization?: string;
    country?: string;
    timeZone?: string;

    // Media
    profilePicture?: string;
    portfolio?: string;
    website?: string;
    linkedin?: string;

    // Professional info
    skills?: string[];
    specialties?: string[];
    languages?: string[];
    education?: any[];
    certification?: any[];
    workExperience?: any[];
    advisorType?: string;
    experienceLevel?: string;
    reason: string;

    // Wallet
    wallet?: {
        availableBalance: number;
        lockedBalance: number;
    };

    // Notifications
    notificationPreferences?: {
        emailNotifications?: boolean;
        challengeUpdates?: boolean;
        marketingEmails?: boolean;
        newMessages?: boolean;
    };

    // System
    status?: string;
    isEmailVerified?: boolean;
    sendTips?: boolean;
    agreeTerms?: boolean;

    createdAt?: string;
    updatedAt?: string;
}

type LoginResponse =
    | { success: true, user: User; message: string }
    | { success: false, message: string }

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    bootstrapped: boolean;

    // actions
    login:(email: string, password: string) => Promise<LoginResponse>
    logout: () => Promise<void>;
    refreshProfile: () => Promise<User>;
    signup?: (data: any) => Promise<any>

    authLoading: boolean;
    authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [bootstrapped, setBootstrapped] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null)
    const token = localStorage.getItem("token");
    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        const bootstrap = async () => {
            try {
                if (!token) {
                    setUser(null);
                    return;
                }

                const res = await api.get("/user/profile");
                const u: User = res.data?.user ?? res.data;
                setUser(u);
                setAuthError(null)
            } catch {
                setUser(null);
                localStorage.removeItem("token");
            } finally {
                setBootstrapped(true);
            }
        };

        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (
        email: string,
        password: string
    ): Promise<LoginResponse> => {
        const res = await api.post("/user/login", { email, password });

        const authToken: string | undefined =
            res.data?.token ??
            res.data?.accessToken ??
            res.data?.access_token;

        const userData: User | undefined = res.data?.user;

        if (!authToken || !userData) {
            return { success: false, message: "Invalid response from server" };
        }

        localStorage.setItem("token", authToken);
        setUser(userData);

        return { success: true, user: userData, message: "Login successful" };
    };

    const logout = async (): Promise<void> => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const refreshProfile = async (): Promise<User> => {
        const res = await api.get("/user/profile");
        const u: User = res.data?.user ?? res.data;
        setUser(u);
        return u;
    };

    const signup = async (data: any) => {
        const res = await api.post("/user/signup", data);

        const authToken =
            res.data?.token ??
            res.data?.accessToken ??
            res.data?.access_token;

        const userData = res.data?.user;

        if (!authToken || !userData) {
            return { success: false, message: "Invalid response from server" };
        }
    }

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            isAuthenticated,
            authLoading: !bootstrapped,
            authError,
            loading: !bootstrapped,
            bootstrapped,
            signup,
            login,
            logout,
            refreshProfile,
        }),
        [user, isAuthenticated, bootstrapped]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


// ✅ Clean: useAuth === useAppContext (same hook)
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

// If you still have code importing useAppContext, alias it:
export const useAppContext = useAuth;
