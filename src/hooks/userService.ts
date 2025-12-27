import { useCallback, useEffect, useState } from "react";
import api from "@/utils/api";

/* =========================
   INTERFACES (KEPT)
========================= */

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profilePicture?: string;
    wallet?: {
        availableBalance: number;
        lockedBalance: number;
    };
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface Notification {
    _id: string;
    title: string;
    description: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export interface Wallet {
    availableBalance: number;
    lockedBalance: number;
}

export interface Transaction {
    _id: string;
    amount: number;
    type: string;
    status: string;
    reference: string;
    createdAt: string;
}

/* =========================
   AUTH
========================= */

export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const res = await api.post("/user/login", { email, password });

    const {user, accessToken} = res.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("currentUser", JSON.stringify(user));
    return res.data;
};

export const signupUser = async (payload: any) => {
    const res = await api.post("/user/signup", payload);
    return res.data;
};

export const getCurrentUser = (): User | null => {
    try {
        const raw = localStorage.getItem("currentUser");
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch (error) {
        return null;
    }
}

export const logoutUser = async () => {
    const res = await api.post("/user/logout");

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    return res.data;
};



/* =========================
   USER PROFILE
========================= */

export const getMyProfile = async (): Promise<User> => {
    const res = await api.get("/user/profile");
    return res.data?.user;
};

export const updateProfile = async (payload: Partial<User>) => {
    const res = await api.put("/user/profile", payload);
    return res.data;
};

export const updateUserRole = async (role: string) => {
    const res = await api.put("/user/update-role", { role });
    return res.data;
};

/* =========================
   PASSWORD & SECURITY
========================= */

export const changePassword = async (
    currentPassword: string,
    newPassword: string
) => {
    const res = await api.post("/user/change-password", {
        currentPassword,
        newPassword,
    });
    return res.data;
};

export const forgotPassword = async (email: string) => {
    const res = await api.post("/user/forgot-password", { email });
    return res.data;
};

export const resetPassword = async (token: string, password: string) => {
    const res = await api.post("/user/reset-password", { token, password });
    return res.data;
};

/* =========================
   PROFILE PICTURE
========================= */

export const uploadProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/user/upload-profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
};

/* =========================
   NOTIFICATIONS
========================= */

export const getNotifications = async (
    role: string
): Promise<Notification[]> => {
    const res = await api.get("/notifications", { params: { role } });
    return res.data?.notifications ?? [];
};

export const markNotificationAsRead = async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
};

export const markAllNotificationsAsRead = async (role: string) => {
    const res = await api.patch("/notifications/mark-all-read", { role });
    return res.data;
};

export const deleteNotification = async (id: string) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
};

/* =========================
   EMAIL VERIFICATION
========================= */

export const resendVerificationEmail = async () => {
    const res = await api.post("/user/resend-verification");
    return res.data;
};

export const verifyEmail = async (token: string) => {
    const res = await api.post("/user/verify-email", { token });
    return res.data;
};

/* =========================
   IDENTITY VERIFICATION
========================= */

export const submitIdentityVerification = async (documents: {
    idFront: File;
    idBack?: File;
    selfie: File;
}) => {
    const formData = new FormData();
    formData.append("idFront", documents.idFront);
    if (documents.idBack) formData.append("idBack", documents.idBack);
    formData.append("selfie", documents.selfie);

    const res = await api.post(
        "/user/verification/identity",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return res.data;
};

/* =========================
   WALLET
========================= */

export const getWallet = async (): Promise<Wallet> => {
    const res = await api.get("/wallet");
    return res.data?.wallet;
};

export const getTransactions = async (): Promise<Transaction[]> => {
    const res = await api.get("/transactions");
    return res.data?.transactions ?? [];
};

/* =========================
   OPTIONAL DEFAULT EXPORT
========================= */

export default {
    loginUser,
    signupUser,
    logoutUser,
    getCurrentUser,
    getMyProfile,
    updateProfile,
    updateUserRole,
    changePassword,
    forgotPassword,
    resetPassword,
    uploadProfilePicture,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    resendVerificationEmail,
    verifyEmail,
    submitIdentityVerification,
    getWallet,
    getTransactions,
};
