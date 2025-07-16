import type { User, ChatMessage } from "../types"

export const canDeleteMessage = (message: ChatMessage, currentUser: User): boolean => {
  return message.userId === currentUser.id || currentUser.role === "admin" || currentUser.role === "innovator"
}

export const canEditMessage = (message: ChatMessage, currentUser: User): boolean => {
  if (message.userId !== currentUser.id) return false
  if (!message.seenBy) return true
  return message.seenBy.length <= 2
}

export const canReactToMessage = (message: ChatMessage, currentUser: User): boolean => {
  return true // All users can react
}

export const canReplyToMessage = (message: ChatMessage, currentUser: User): boolean => {
  return true // All users can reply
}

export const canReportMessage = (message: ChatMessage, currentUser: User): boolean => {
  return message.userId !== currentUser.id
}

export const canStarMessage = (message: ChatMessage, currentUser: User): boolean => {
  return true // All users can star messages
}

export const getAvailableActions = (message: ChatMessage, currentUser: User): string[] => {
  const actions = []

  if (canDeleteMessage(message, currentUser)) actions.push("delete")
  if (canEditMessage(message, currentUser)) actions.push("edit")
  if (canReactToMessage(message, currentUser)) actions.push("react")
  if (canReplyToMessage(message, currentUser)) actions.push("reply")
  if (canReportMessage(message, currentUser)) actions.push("report")
  if (canStarMessage(message, currentUser)) actions.push("star")

  return actions
}

