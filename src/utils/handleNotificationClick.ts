import {useNavigate} from 'react-router-dom'

export const useNotificationHandler = () => {
    const navigate = useNavigate()

    const handleNotificationClick = (notification: any) => {
        const {type, metaData} = notification;
        console.log("Navigating to:",  {type: metaData})

        switch (type) {
            case "session_request":
                navigate(`/mentor/sessions/${metaData?.requestId}`)
                break;

            case "session":
                navigate(`/mentor/sessions/${metaData?.sessionId}`)
                break;

            case "challenge":
                if (metaData?.challengeId) {
                    navigate(`/innovator/challenges/${metaData.challengeId}`)
                }
                break;

            case "pitch_approved":
            case "pitch_rejected":
                if (metaData?.challengeId) {
                    navigate(`/problem-solver/challenges/${metaData.challengeId}`)
                }
                break;

            default:
                console.log("unhandled notification type:", type)
                navigate("/")
        }
    }

    return {handleNotificationClick}
}