import {useNavigate} from "react-router-dom";

export const useNotificationHandler = () => {
    const navigate = useNavigate();

    const handleNotificationClick = (notification: any) => {
        if (!notification) {
            console.warn("⚠️ handleNotificationClick called with empty notification");
            return;
        }

        const {type, metaData, role} = notification;
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const userRole = storedUser?.role?.toLowerCase();

        console.group("🔔 Notification Click Debug");
        console.log("Type:", type);
        console.log("MetaData:", metaData);
        console.groupEnd();

        // Handle nested shape like metaData.type or metaData.data
        const data = metaData?.type || metaData?.data || metaData || {};

        // Safely extract possible IDs
        const requestId = data.requestId || data.sessionId || data.newSessionId;

        const normalizedRole = (role || "").toLowerCase();

        // Always log which ID we ended up with
        console.log("🧭 Extracted session/request ID:", requestId);

        switch (type) {
            // ✅ Handle both "session" and "session_request"
            case "session_request":
            case "session": {
                if (normalizedRole.includes("mentor") || normalizedRole.includes('advisor')) {
                    navigate('/dashboard/advisor/requests', {state: {requestId}});
                } else if (normalizedRole.includes("mentee") || normalizedRole.includes('client')) {
                    navigate('/dashboard/client/my-sessions', {state: {requestId}});
                } else {
                    console.warn("⚠️ Unknown role:", role);
                }
                break;
            }

            case "challenge": {
                if (data.challengeId) {
                    navigate("/dashboard/innovator/my-challenges", {
                        state: {challengeId: data.challengeId},
                    });
                } else {
                    console.warn("⚠️ Missing challengeId:", data);
                }
                break;
            }

            case "pitch_approved":
            case "pitch_rejected": {
                if (data.challengeId) {
                    navigate(`/problem-solver/challenges/${data.challengeId}`);
                } else {
                    console.warn("⚠️ Missing challengeId:", data);
                }
                break;
            }

            default:
                console.warn("⚠️ Unhandled notification type:", type, data);
                navigate("/");
        }
    };

    return {handleNotificationClick};
};
