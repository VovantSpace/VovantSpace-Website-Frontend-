import {useState, useEffect, useCallback} from 'react'
import {getSocket} from '@/lib/socket'


export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: "Innovator" | "Problem Solver" | "Advisor/Mentor" | "Client/Mentee";
    profilePicture?: string;
    isVerified: boolean;
    sendTips: boolean;
    agreeTerms: boolean;

    // Innovator fields
    organization?: string;
    industry?: "Technology" | 'Finance' | "Healthcare" | 'Education' | 'Other';
    bio?: string;
    website?: string;
    linkedin?: string;

    // Problem Solver fields
    skills?: string[];
    experience?: "1-3 years" | "4-6 years" | "7-10 years" | "11+ years";
    portfolio?: string;

    // Advisor/Mentor fields
    expertise?: string;
    specialties?: string[];
    languages?: string[];

    // Client/Mentee fields
    advisorType?: string;
    reason?: string[];
    experienceLevel?: "Beginner" | "Intermediate" | "Advanced" | "Expert";

    createdAt: string;
    updatedAt: string;

    education?: Education[];
    certification?: Certification[];
    workExperience?: WorkExperience[];
}

interface Certification {
    certificationName: string
    issuingOrganization: string
    dateObtained: string
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
}

export interface WorkExperience {
    id: number;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "Innovator" | "Problem Solver" | "Advisor/Mentor" | "Client/Mentee";
    sendTips?: boolean;
    agreeTerms: boolean;

    // Role-specific fields
    organization?: string;
    industry?: string;
    bio?: string;
    website?: string;
    linkedin?: string;
    skills?: string[];
    experience?: string;
    portfolio?: string;
    expertise?: string;
    specialties?: string[];
    languages?: string[];
    advisorType?: string;
    reason?: string[];
    experienceLevel?: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    industry?: string;
    organization?: string;
    website?: string;
    linkedin?: string;
    skills?: string[];
    experience?: string;
    education?: Education[];
    certifications?: Certification[];
    workExperience?: WorkExperience[];
    portfolio?: string;
    expertise?: string;
    specialties?: string[];
    languages?: string[];
    advisorType?: string;
    reason?: string[];
    experienceLevel?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export interface NotificationPreferences {
    emailNotifications: boolean;
    challengeUpdates: boolean;
    newMessages: boolean;
    marketingEmails: boolean;
}

export interface Notification {
    _id: string;
    userId: string;
    title: string;
    description: string;
    type: 'submission' | 'review' | 'deadline' | 'message' | 'challenge' | 'system' | 'session' | 'mentor';
    isRead: boolean;
    createdAt: string;
    role: "mentor" | "mentee" | "innovator" | "problemSolver";
    updatedAt: string;
    metaData?: {
        challengeId?: string;
        submissionId?: string;
        messageId?: string;
        [key: string]: any;
        requestId?: string;
    }
}

export interface NotificationResponse {
    success: boolean;
    notification: Notification[]; // Note: keeping your property name
    unreadCount: number;
    total: number;
}

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token")

    const response = await fetch(
        `${API_BASE_URL}/api/user${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(token && {Authorization: `Bearer ${token}`}),
                ...options.headers,
            },
            ...options,
        }
    )

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = '/login';
        throw new Error("Session expired. Please log in again")
    }

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Request failed: ${response.status}`)
    }

    return response.json()
}

// Separate API request function for notifications
const notificationApiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token")

    const response = await fetch(
        `${API_BASE_URL}/api/notifications${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(token && {Authorization: `Bearer ${token}`}),
                ...options.headers,
            },
            ...options,
        }
    )

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = '/login';
        throw new Error("Session expired. Please log in again")
    }


    if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || `Request failed: ${response.status}`)
    }

    return response.json()
}

// Hook for authentication
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await apiRequest('/profile');
                    if (response.success) {
                        setUser(response.user);
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                    }
                } catch (err) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setError(err instanceof Error ? err.message : 'Authentication failed');
                }
            } else {
                setIsAuthenticated(false);
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (response.success) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                setIsAuthenticated(true);
            }

            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (signupData: SignupData): Promise<AuthResponse> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/signup', {
                method: 'POST',
                body: JSON.stringify(signupData),
            });

            if (response.success) {
                localStorage.setItem('token', response.token);
                setUser(response.user);
                setIsAuthenticated(true);
            }

            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Signup failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    };

    const clearError = () => {
        setError(null);
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        setUser
    };
};

// Hook for profile management
export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProfile = async (): Promise<User> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/profile');

            if (!response.success) {
                setError('Profile not found');
            }

            return response.user;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData: UpdateProfileData): Promise<User> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });

            if (!response.success) {
                setError(response.message || "Failed to update profile");
            }

            return response.user;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (role: string): Promise<User> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/update-role', {
                method: 'PUT',
                body: JSON.stringify({role}),
            });

            if (!response.success) {
                setError(response.message || 'Failed to update role');
            }

            return response.user;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const uploadProfilePicture = async (file: File): Promise<string> => {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('profilePicture', file);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/user/upload-profile-picture`, {
                method: 'POST',
                headers: {
                    ...(token && {'Authorization': `Bearer ${token}`}),
                },
                body: formData,
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || !result.success) {
                setError(result.message || "Failed to upload picture");
                throw new Error(result.message || "Failed to upload picture");
            }

            return result.profilePictureUrl;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload profile picture';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getProfile,
        updateProfile,
        updateUserRole,
        uploadProfilePicture,
    };
};

// Hook for password management
export const usePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/change-password', {
                method: 'POST',
                body: JSON.stringify(passwordData),
            });

            if (!response.success) {
                setError(response.message || 'Failed to change password');
                return;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/forgot-password', {
                method: 'POST',
                body: JSON.stringify({email}),
            });

            if (!response.success) {
                setError(response.message || "Failed to send reset password email")
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email for password';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token: string, newPassword: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/reset-password', {
                method: 'POST',
                body: JSON.stringify({token, newPassword}),
            });

            if (!response.success) {
                setError(response.message || "failed to reset password")
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        changePassword,
        forgotPassword,
        resetPassword,
    };
};

// Hook for notifications
export const useNotifications = (
    role: "mentor" | "mentee" | "innovator" | "problemSolver"
) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);

    const { user, isAuthenticated } = useAuth();

    // 🔗 FETCH notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const response: NotificationResponse = await notificationApiRequest(
                `?role=${role}`
            );
            if (response.success) {
                setNotifications(response.notification);
                setUnreadCount(response.unreadCount);
            }
        } catch {
            setError("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    }, [role]);

    // 💥 Add new notification to state
    const addNotification = useCallback(
        (notification: Notification) => {
            if (notification.role && notification.role !== role) return;
            setNotifications((prev) => [notification, ...prev]);
            if (!notification.isRead)
                setUnreadCount((prev) => Math.max(0, prev + 1));
        },
        [role]
    );

    // ✅ Mark as read
    const markAsRead = useCallback(async (id: string) => {
        const response = await notificationApiRequest(`/${id}/read`, {
            method: "PATCH",
        });
        if (response.success) {
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    }, []);

    // ✅ Mark all as read
    const markAllAsRead = useCallback(async () => {
        const response = await notificationApiRequest(
            `/mark-all-read?role=${role}`,
            { method: "PATCH" }
        );
        if (response.success) {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    }, [role]);

    // 🗑 Delete notification
    const deleteNotification = useCallback(async (id: string) => {
        const response = await notificationApiRequest(`/${id}`, {
            method: "DELETE",
        });
        if (response.success) {
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        }
    }, []);

    // 🔌 SOCKET: connect, join room, listen for new notifications
    useEffect(() => {
        if (!isAuthenticated || !user?._id || !role) {
            console.warn("Skipping socket join:", { isAuthenticated, user, role });
            return;
        }

        const socket = getSocket();
        const userId = user._id;
        const roomName = `${role}_${userId}`;

        console.log(`🎯 Joining socket room: ${roomName}`);
        socket.emit("join_room", roomName);

        const handleConnect = () => {
            setConnected(true);
            console.log(`✅ Connected to socket: ${socket.id}`);
        };

        const handleDisconnect = () => {
            setConnected(false);
            console.warn("⚠️ Socket disconnected");
        };

        const handleNewNotification = (notification: Notification) => {
            console.log(`💥 [${role}] new notification:`, notification);
            addNotification(notification);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("new_notification", handleNewNotification);

        // cleanup
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("new_notification", handleNewNotification);
        };
    }, [role, user?._id, isAuthenticated, addNotification]);

    // 🕒 Initial fetch + polling (optional)
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        connected,
        fetchNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
};


// Hook for account verification
export const useVerification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestVerification = async (verificationType: 'email' | 'identity'): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/verification/request', {
                method: 'POST',
                body: JSON.stringify({type: verificationType}),
            });

            if (!response.success) {
                setError(response.message || 'Failed to request verification');
                return;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to request verification';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (token: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiRequest('/verification/email', {
                method: 'POST',
                body: JSON.stringify({token}),
            });

            if (!response.success) {
                setError(response.message || 'Failed to verify email');
                return;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to verify email';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const submitIdentityVerification = async (documents: FormData): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/user/verification/identity`, {
                method: 'POST',
                headers: {
                    ...(token && {'Authorization': `Bearer ${token}`}),
                },
                body: documents,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({message: 'Verification failed'}));
                setError("Failed to verify identity");
            }

            const result = await response.json();

            if (!result.success) {
                setError("Failed to request verification");
                return;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit identity verification';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        requestVerification,
        verifyEmail,
        submitIdentityVerification,
    };
};

// Combined hook for complete user management
export const useUserService = (role: "mentor" | "mentee" | "innovator" | "problemSolver") => {
    const auth = useAuth();
    const profile = useProfile();
    const password = usePassword();
    const notifications = useNotifications(role);
    const verification = useVerification();

    // Derived helpers that wrap the hooks
    const updateUserAndRefresh = async (
        profileData: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            bio: string;
            industry: string;
            organization: string;
            website: string;
            linkedin: string;
            skills: string[];
            experience: string;
            portfolio: string;
            expertise: string;
            specialties: string[];
            languages: string[];
            advisorType: string;
            reason: string[];
            experienceLevel: string;
            education: Education[];
            certifications: Certification[];
            workExperience: any[]
        }
    ): Promise<User> => {
        const updatedUser = await profile.updateProfile(profileData);
        auth.setUser(updatedUser);
        return updatedUser;
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const user = await profile.getProfile();
            auth.setUser(user);
        } catch (err) {
            // Handle refresh error, possibly logout if the token is invalid
            if (err instanceof Error && err.message.includes('Authentication')) {
                auth.logout();
            }
            throw err;
        }
    };

    return {
        // ✅ Auth
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        authLoading: auth.loading,
        authError: auth.error,
        login: auth.login,
        signup: auth.signup,
        logout: auth.logout,
        clearAuthError: auth.clearError,
        setUser: auth.setUser,

        // ✅ Profile
        updateProfile: updateUserAndRefresh,
        refreshProfile: refreshUser,
        uploadProfilePicture: profile.uploadProfilePicture,
        updateUserRole: profile.updateUserRole,
        profileLoading: profile.loading,
        profileError: profile.error,

        // ✅ Password
        changePassword: password.changePassword,
        forgotPassword: password.forgotPassword,
        resetPassword: password.resetPassword,
        passwordLoading: password.loading,
        passwordError: password.error,

        // ✅ Real-time Notifications
        notifications: notifications.notifications,
        unreadNotificationsCount: notifications.unreadCount,
        fetchNotifications: notifications.fetchNotifications,
        notificationsLoading: notifications.loading,
        notificationsError: notifications.error,

        // ✅ Notification Preferences
        // notificationPreferences: notifications.preferences,
        // updateNotificationPreferences: notifications.updateNotificationPreferences,
        // refetchNotificationPreferences: notifications.getNotificationPreferences,

        // ✅ Verification
        requestVerification: verification.requestVerification,
        verifyEmail: verification.verifyEmail,
        submitIdentityVerification: verification.submitIdentityVerification,
        verificationLoading: verification.loading,
        verificationError: verification.error,
    };
};