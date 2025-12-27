// @/dashboard/Innovator/types.ts
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    timeZone: string;
    phone?: string;
    bio?: string;
    skills: string[];
}

export interface Challenge {
    id: string;
    name: string;
    status: "active" | "in-review" | "completed";
    reward: number;
    submissions: number;
    problemSolvers: number;
    views: number;
    daysLeft: number;
}

export interface Transaction {
    id: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    date: string;
}

export interface Channel {
    id: string;
    name: string;
    unreadCount: number;
    company: string;
    description?: string;
    messages?: ChatMessage[];

    status?: 'upcoming' | 'active' | 'closed'
    nextActiveDate?: string | null;
    closedAt?: string | null;
}

export interface NotificationPreferences {
    emailNotifications: boolean;
    challengeUpdates: boolean;
    newMessages: boolean;
    marketingEmails: boolean;
}

export interface StarredMessage {
    id: string;
    content: string;
    author: User; // Updated to require User, remove optional
    timestamp: string;
    channelId: string;
}

export interface PollData {
    question: string;
    options: PollOption[];
    allowMultiple: boolean;
    voters?: Record<string, number[]>;
    audioUrl?: string;
}

export interface PollOption {
    id: number;
    text: string;
    votes: number;
}

export interface CallData {
    time: string;
    participants: string[];
    title?: string;
    type: "video" | "audio";
}

export interface ChatMessage {
    id: string;
    _id?: string;
    userId: string;
    content: string;
    timestamp: string;
    channelId: string;
    status: "pending" | "sent" | "delivered" | "seen" | "failed";
    user?: User;
    isEncrypted?: boolean;
    seenBy?: string[];
    fileType?: "image" | "audio" | "document";
    fileUrl?: string;
    isPoll?: boolean;
    pollData?: PollData;
    isCall?: boolean;
    callData?: CallData;
    reactions?: MessageReaction[];
    isStarred?: boolean;
    replyTo?: ReplyReference;
    editHistory?: EditHistory[];
}

export interface MessageReaction {
    emoji: string;
    users: string[];
}

export interface ReplyReference {
    id: string;
    content: string;
    userName: string;
}

export interface EditHistory {
    content: string;
    timestamp: string;
}

export interface ReplyReference {
    id: string;
    content: string;
    userName: string;
}

export interface ChatChannel {
    id: string;
    name: string;
    description?: string;

    status?: "upcoming" | "active" | "closed"
    nextActiveDate?: string | null;
    closedAt?: string | null;
}

export type MessageAction = "edit" | "delete" | "reply" | "react" | "star" | "report" | "poll" | "call";