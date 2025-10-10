import {io, Socket} from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Singleton socket instance
let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
            randomizationFactor: 0.5,
            autoConnect: true
        })

        socket.on("connect", () => console.log("Socket connected:", socket?.id))
        socket.on("disconnect", (reason => console.log("Socket disconnected: ", reason)))
        socket.on("reconnect_attempt", (attempt => console.log(`Reconnecting (#${attempt})`)))
        socket.on("reconnect_failed", () => console.warn("Reconnection failed"))
    }

    return socket
}



export function disconnectSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}