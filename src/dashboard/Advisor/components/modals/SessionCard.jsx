import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@innovator/components/ui/button";
import { RescheduleSession } from "./RescheduleSession";
import { useNavigate } from "react-router-dom";

export function SessionCard({
                                id,
                                clientName,
                                topic,
                                time,
                                duration,
                                fullDate,
                                expanded = false
                            }) {
    const [showDetails, setShowDetails] = useState(expanded);
    const navigate = useNavigate();

    const initial = clientName ? clientName.charAt(0).toUpperCase() : "U";

    return (
        <div className="mb-4 rounded-lg secondbg p-4 shadow-sm">
            <div className="flex items-center justify-between">

                {/* LEFT SIDE */}
                <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-800 border text-white font-bold">
                        {initial}
                    </div>

                    <div>
                        <h3 className="font-medium text-black dark:text-white">
                            {topic}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {time} – {duration}
                        </p>
                    </div>
                </div>

                {/* VIEW DETAILS BUTTON */}
                <Button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDetails(!showDetails);
                    }}
                    className="dashbutton text-white"
                >
                    {showDetails ? "Hide Details" : "View Details"}
                </Button>
            </div>

            {/* Expandable section */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    showDetails ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
            >
                <div className="space-y-3 rounded-md secondbg p-4 py-1">

                    <p className="text-sm text-black dark:text-white">
                        <span className="font-medium">Session Topic:</span> {topic}
                    </p>

                    <p className="text-sm text-black dark:text-white">
                        <span className="font-medium">Session Duration:</span> {duration}
                    </p>

                    <p className="text-sm text-black dark:text-white">
                        <span className="font-medium">Session Date:</span>{" "}
                        {new Date(fullDate).toDateString()}
                    </p>

                    {/*<Button*/}
                    {/*    variant="default"*/}
                    {/*    size="sm"*/}
                    {/*    className="mt-2 dashbutton text-white"*/}
                    {/*    onClick={() => navigate(`/advisor/session-chats/${id}`)}*/}
                    {/*>*/}
                    {/*    <svg*/}
                    {/*        xmlns="http://www.w3.org/2000/svg"*/}
                    {/*        className="mr-2 h-4 w-4"*/}
                    {/*        viewBox="0 0 20 20"*/}
                    {/*        fill="currentColor"*/}
                    {/*    >*/}
                    {/*        <path*/}
                    {/*            fillRule="evenodd"*/}
                    {/*            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"*/}
                    {/*            clipRule="evenodd"*/}
                    {/*        />*/}
                    {/*    </svg>*/}
                    {/*    Open Chat*/}
                    {/*</Button>*/}
                </div>
            </div>

            <RescheduleSession open={false} onOpenChange={() => {}} />
        </div>
    );
}

SessionCard.propTypes = {
    id: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    fullDate: PropTypes.string.isRequired,
    expanded: PropTypes.bool,
};