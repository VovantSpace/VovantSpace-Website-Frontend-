// User types
export interface User {
  id: string
  name: string
  role: "admin" | "innovator" | "problem-solver" | "user"
  skill: string
  avatar: string
  status: "online" | "away" | "offline"
  lastSeen?: string
}

// Message types
export interface ChatMessage {
  id: string
  userId: string
  content: string
  timestamp: string
  channelId: string
  status: "pending" | "sent" | "delivered" | "seen"
  user?: User
  reactions?: MessageReaction[]
  replyTo?: ReplyReference
  isStarred?: boolean
  isEncrypted?: boolean
  fileType?: "image" | "audio" | "document"
  fileUrl?: string
  seenBy?: string[]
  isPoll?: boolean
  pollData?: PollData
  editHistory?: EditHistory[]
}

export interface MessageReaction {
  emoji: string
  users: string[]
}

export interface ReplyReference {
  id: string
  content: string
  userName: string
}

export interface EditHistory {
  content: string
  timestamp: string
}

// Poll types
export interface PollData {
  question: string
  options: PollOption[]
  allowMultiple: boolean
  voters?: Record<string, number[]>
  audioUrl?: string
}

export interface PollOption {
  id: number
  text: string
  votes: number
}

// Call types
export interface CallData {
  id: string
  title: string
  startTime: string
  type: "audio" | "video"
  status: "scheduled" | "ongoing" | "ended"
  participants: string[]
  hostId: string
  screenSharing?: boolean
}

// Channel types
export interface Channel {
  id: string
  name: string
  unreadCount: number
  description: string
  isEncrypted?: boolean
}

// Star message type
export interface StarredMessage {
  id: string
  content: string
  author: User
  timestamp: string
  channelId: string
}

// Message action types
export type MessageAction = "edit" | "delete" | "reply" | "react" | "star" | "report" | "poll" | "call"

// API response type
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

