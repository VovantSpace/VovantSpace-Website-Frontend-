import {getSocket} from "@/lib/socket";

export function initSocketRoom(userId: string, role: "mentor" | "mentee" | "innovator" | "problemSolver") {
    const socket = getSocket();

    const roomName = `${role}_${userId}`;
    socket.emit("join_room", roomName);

    console.log(`Joined socket room: ${roomName}`)
}