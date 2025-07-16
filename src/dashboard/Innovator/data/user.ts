import type { User } from "../types"

export const users: User[] = [
  {
    id: "user1",
    name: "Maria Lopez",
    role: "innovator",
    skill: "AI Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "online",
  },
  {
    id: "user2",
    name: "Alex Chen",
    role: "problem-solver",
    skill: "Data Scientist",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    status: "away",
  },
  {
    id: "user3",
    name: "Sarah Johnson",
    role: "innovator",
    skill: "Admin",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "online",
  },
]

export const currentUser: User = {
  id: "current-user",
  name: "John Doe",
  role: "innovator",
  skill: "Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  status: "online",
}

