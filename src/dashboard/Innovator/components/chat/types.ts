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
  //unreadCount: number
  description: string
  isEncrypted?: boolean
}

// API response type
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

