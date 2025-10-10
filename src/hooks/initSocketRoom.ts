import {getSocket} from "@/lib/socket";

export function initSocketRoom(userId: string, role: "mentor" | "mentee") {
    const socket = getSocket();

    if (role === "mentor") {
        socket.emit("join_mentor_room", userId);
    } else if (role === "mentee") {
        socket.emit("join_mentee_room", userId);
    }

    console.log(`Joined ${role} room: ${userId}`)
}