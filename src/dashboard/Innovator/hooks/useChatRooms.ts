import {useEffect, useState} from "react";
import {getSocket} from '@/lib/socket'
import {useAuth} from '@/hooks/notificationService'
import axios from "axios";

export interface ChatRoom {
    _id: string;
    name: string;
    description?: string;
    challenge?: string;
    participants: {_id: string; name: string; avatar?: string}[];
}

export function useChatRooms() {
    const {user} = useAuth();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?._id) return;

        const fetchRooms = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/chat/rooms`, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
                })
                if (res.data?.success) {
                    setRooms(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching chat rooms:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();

        // Subscribe to socket event
        const socket = getSocket();
        socket.on('chat:room-created', (room: ChatRoom) => {
            setRooms((prev) => {
                const exists = prev.find((r) => r._id === room._id);
                return exists ? prev : [...prev, room];
            })
        })

        return () => {
            socket.off('chat:room-created');
        }
    }, [user?._id])

    return {rooms, setRooms, loading};
}