import {getSocket} from "@/lib/socket";

export function initSocketRoom(userId: string, role: "mentor" | "mentee" | "innovator" | "problemSolver") {
    const socket = getSocket();

    switch (role) {
        case "mentor":
            socket.emit("join_mentor_room", userId);
            break;
        case "mentee":
            socket.emit("join_mentee_room", userId);
            break;
        case "innovator":
            socket.emit("join_innovator_room", userId);
            break;
        case "problemSolver":
            socket.emit("join_solver_room", userId);
            break;
        default:
            console.warn("Unknown role:", role)
    }
    console.log(`Joined ${role} room: ${userId}`)
}