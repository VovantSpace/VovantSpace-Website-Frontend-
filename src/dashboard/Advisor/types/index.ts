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
    pending?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    timeZone?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
}

export interface ReplyReference {
    id: string;
    content: string;
    userName: string;
}

export interface Channel {
    id: string;
    name: string;
    description?: string;
    status?: "upcoming" | "active" | "closed";
    unreadCount: number;
    nextActiveDate?: string | null;
    closedAt?: string | null;
    mentorId?: string;
    menteeId?: string;
    sessionRequestId?: string;
}

export interface ReplyReference {
    id: string;
    content: string;
    userName: string;
}