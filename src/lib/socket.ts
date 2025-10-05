import {io, Socket} from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Singleton socket instance
let socket: Socket | null = null;

export function getSocket() {
    if (!socket) {
        socket = io(SOCKET_URL, {withCredentials: true})
    }
    return socket
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}