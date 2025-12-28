// src/hooks/notificationService.ts
import api from "@/utils/api";

/* =========================
   Types
========================= */

export interface Notification {
    _id: string;
    title: string;
    description?: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    metaData?: Record<string, any>;
}

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

/* =========================
   Notifications
========================= */

export async function getNotifications(role: string): Promise<{
    notifications: Notification[];
    unreadCount: number;
    total: number;
}> {
    const res = await api.get("/notifications", {
        params: { role },
    });

    const notifications: Notification[] = res.data?.notification ?? [];

    return {
        notifications,
        unreadCount: res.data?.unreadCount ?? 0,
        total: res.data?.total ?? notifications.length,
    };
}

export async function markNotificationAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
}

export async function handleDeleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
}

/* =========================
   Notification Preferences
========================= */

export async function getNotificationPreferences(): Promise<Record<string, boolean>> {
    const res = await api.get("/notifications/preferences");
    return res.data?.preferences ?? {};
}

export async function updateNotificationPreferences(
    preferences: Record<string, boolean>
): Promise<Record<string, boolean>> {
    const res = await api.put("/notifications/preferences", preferences);
    return res.data?.preferences ?? {};
}

/* =========================
   Default Export
========================= */

const notificationService = {
    // notifications
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    handleDeleteNotification,

    // notification preferences
    getNotificationPreferences,
    updateNotificationPreferences,
};

export default notificationService;
