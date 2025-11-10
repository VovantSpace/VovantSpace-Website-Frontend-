import {useState, useEffect, useRef} from "react"
import axios from "axios"
import {getSocket} from "@/lib/socket"
import {encryptMessage} from "@/dashboard/Innovator/lib/encryption"
import type {ChatMessage, User, ReplyReference} from "@/dashboard/Innovator/types"
import {ChatMessageItem} from "./chat-message-item"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import {Input} from "@/dashboard/Innovator/components/ui/input"
import {X, Paperclip, Send} from "lucide-react"

interface ChatInterfaceProps {
    currentUser: User
    channelId: string
}

export function ChatInterface({currentUser, channelId}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [activeReply, setActiveReply] = useState<ReplyReference | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isTyping, setIsTyping] = useState(false)
    const [typingUser, setTypingUser] = useState<string | null>(null)

    // 🧭 Auto-scroll when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    // 🔌 Fetch chat history
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/chat/${channelId}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                })
                if (res.data?.success) {
                    setMessages(res.data.data)
                }
            } catch (err) {
                console.error("Error fetching chat history:", err)
            }
        }

        fetchMessages()
    }, [channelId])

    // 🔥 Socket events
    useEffect(() => {
        const socket = getSocket()
        socket.emit("chat:join-room", channelId)

        // Handle new messages
        socket.on("chat:new-message", (incoming: ChatMessage) => {
            setMessages((prev) => {
                const exists = prev.some((m) => m.id === incoming.id)
                return exists ? prev : [...prev, incoming]
            })
        })

        // Typing indicator
        socket.on('chat:typing', (userName: string) => {
            setTypingUser(userName)
            setIsTyping(true)
            setTimeout(() => setIsTyping(false), 2000)
        })

        // Handle message edits
        socket.on("chat:message-edited", (updated) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === updated.id ? {...msg, content: updated.content, isEdited: true} : msg
                )
            )
        })

        socket.on("chat:message-deleted", ({id}) => {
            setMessages((prev) => prev.filter((msg) => msg.id !== id))
        })

        return () => {
            socket.emit("chat:leave-room", channelId)
            socket.off("chat:new-message")
            socket.off("chat:message-edited")
            socket.off("chat:message-deleted")
            socket.off("chat:typing")
        }
    }, [channelId])

    // 📨 Handle sending message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const encryptedContent = await encryptMessage(newMessage)
        const clientTempId = `temp-${Date.now()}`

        // Optimistic UI
        const tempMessage: ChatMessage = {
            id: clientTempId,
            userId: currentUser.id,
            content: encryptedContent,
            timestamp: new Date().toISOString(),
            channelId,
            status: "pending",
            user: currentUser,
            isEncrypted: true,
            seenBy: [currentUser.id],
            replyTo: activeReply ?? undefined,
        }

        setMessages((prev) => [...prev, tempMessage])
        setNewMessage("")
        setActiveReply(null)

        try {
            const res = await axios.post(
                "/api/chat/send",
                {
                    channelId,
                    content: encryptedContent,
                    replyTo: activeReply,
                },
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }
            )

            if (res.data?.success) {
                const sent = res.data.data
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === clientTempId ? {...sent, status: "delivered"} : msg
                    )
                )
            }
        } catch (err) {
            console.error("Error sending message:", err)
        }
    }

    const handleTyping = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
        const socket = getSocket()
        socket.emit('chat:typing', {
            channelId,
            userName: currentUser.name,
        })
    }

    // ✏️ Handle edit / delete / reply
    const handleAction = async (action: string, messageId: string, data?: any) => {
        if (action === "edit" && data?.content) {
            try {
                const res = await axios.put(`/api/chat/edit/${messageId}`, data, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                })
                if (res.data?.success) {
                    const updated = res.data.data
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === messageId ? {...msg, content: updated.content, isEdited: true} : msg
                        )
                    )
                }
            } catch (err) {
                console.error("Error editing message:", err)
            }
        }

        if (action === "delete") {
            try {
                const res = await axios.delete(`/api/chat/delete/${messageId}`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                })
                if (res.data?.success) {
                    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
                }
            } catch (err) {
                console.error("Error deleting message:", err)
            }
        }

        if (action === "reply") {
            setActiveReply({
                id: messageId,
                content: data?.content || "",
                userName: data?.userName || "",
            })
        }
    }

    // 📎 File upload
    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("channelId", channelId)
            formData.append("uploadType", "chat")

            const res = await axios.post("/api/chat/upload", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            })

            if (res.data?.success) {
                const uploaded = res.data.data
                setMessages((prev) => [...prev, uploaded])
            }
        } catch (err) {
            console.error("File upload failed:", err)
        } finally {
            e.target.value = ""
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message) => (
                    <ChatMessageItem
                        key={message.id}
                        message={message}
                        currentUser={currentUser}
                        onAction={(action, data) => handleAction(action, message.id, data)}
                    />
                ))}
                <div ref={messagesEndRef}/>
                {/* scroll anchor */}
            </div>

            {/* 🗨️ Reply bar */}
            {activeReply && (
                <div
                    className="p-2 border-t border-gray-300 dark:border-gray-700 bg-muted/20 flex items-center justify-between">
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{activeReply.userName}</span>
                        <span className="text-xs truncate text-gray-500">{activeReply.content}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setActiveReply(null)}>
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
            )}

            {/* Message input */}
            <form
                onSubmit={handleSendMessage}
                className="border-t p-3 flex items-center gap-3 bg-white dark:bg-gray-900"
            >
                <input type="file" id="fileInput" className="hidden" onChange={handleFileSelected}/>

                {/* 📎 Attach file */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
                </Button>

                {/* ✏️ Message field */}
                <Input
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:ring-0 text-sm px-4 py-2"
                />

                {/* 📨 Send */}
                <Button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="rounded-full bg-green-700 hover:bg-green-800 text-white p-2"
                >
                    <Send className="h-5 w-5"/>
                </Button>
            </form>
        </div>
    )
}
