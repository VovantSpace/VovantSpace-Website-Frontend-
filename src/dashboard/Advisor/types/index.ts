export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  timeZone: string
  phone?: string
  bio?: string
  skills: string[]
}

export interface Challenge {
  id: string
  name: string
  status: "active" | "in-review" | "completed"
  reward: number
  submissions: number
  problemSolvers: number
  views: number
  daysLeft: number
}

export interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  timestamp: string
  channelId: string
}

export interface Channel {
  id: string
  name: string
  unreadCount: number
}

export interface NotificationPreferences {
  emailNotifications: boolean
  challengeUpdates: boolean
  newMessages: boolean
  marketingEmails: boolean
}

