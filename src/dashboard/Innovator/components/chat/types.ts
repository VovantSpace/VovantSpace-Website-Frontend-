import {PollOption} from "@/dashboard/Innovator/types";

export type SessionStatus = "upcoming" | "active" | "closed";

export interface Channel {
    description?: string;
    id: string;
    name: string;
    mentorId: string;
    menteeId: string;
    sessionRequestId: string;

    // meta
    status: SessionStatus;
    nextActiveDate: string | null;
    closedAt: string | null;
    messages?: ChatMessage[];

    unreadCount: number;
}

export interface ChatMessage {
    id: string;
    channelId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;

    content?: string;
    fileUrl?: string;
    fileType?: string;

    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;

    timeZone: string;
    bio?: string;
    phone?: string;
    skills: string[];
}

export interface CallData {
    type: "video" | "audio";
    channelId: string;
    userId: string;
    scheduled?: boolean; // true if it’s a scheduled session
    timestamp?: string;   // ISO time when call started
}

export interface PollData {
    question: string;
    options: PollOption[];
    allowMultiple: boolean;
    audioUrl?: string;
}