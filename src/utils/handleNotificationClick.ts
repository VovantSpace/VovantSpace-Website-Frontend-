import { useNavigate } from "react-router-dom";

export const useNotificationHandler = () => {
    const navigate = useNavigate();

    const handleNotificationClick = (notification: any) => {
        if (!notification) {
            console.warn("⚠️ handleNotificationClick called with empty notification");
            return;
        }

        const { type, metaData } = notification;

        console.group("🔔 Notification Click Debug");
        console.log("Type:", type);
        console.log("MetaData:", metaData);
        console.groupEnd();

        // Handle nested shape like metaData.type or metaData.data
        const data = metaData?.type || metaData?.data || metaData || {};

        // Safely extract possible IDs
        const requestId = data.requestId || data.sessionId || data.newSessionId;

        // Always log which ID we ended up with
        console.log("🧭 Extracted session/request ID:", requestId);

        switch (type) {
            // ✅ Handle both "session" and "session_request"
            case "session_request":
            case "session": {
                if (requestId) {
                    navigate("/dashboard/advisor/requests", {state: {requestId}});
                } else {
                    console.warn("⚠️ No valid session or request ID found:", data);
                }
                break;
            }

            case "challenge": {
                if (data.challengeId) {
                    navigate(`/innovator/challenges/${data.challengeId}`);
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

    return { handleNotificationClick };
};
