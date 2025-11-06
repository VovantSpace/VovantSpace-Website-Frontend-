import {getSocket} from "@/lib/socket";

export function initSocketRoom(userId: string, role: "mentor" | "mentee" | "innovator" | "problemSolver") {
    const socket = getSocket();

    const roomName = `${role}_${userId}`;
    console.log("Attempting to join socket room:", roomName, "via socket:", socket.id)
    socket.emit("join_room", roomName);

    console.log(`Joined socket room: ${roomName}`);
}