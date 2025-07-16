import { useState } from "react";
import { Button } from "@innovator/components/ui/button";
import { RescheduleSession } from "./RescheduleSession";

export function SessionCard({ initial, title, time, duration, details, expanded = false }) {
  const [showDetails, setShowDetails] = useState(expanded);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 rounded-lg secondbg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
    
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-800 border dark:border-gray-700 text-white font-bold">
            {initial}
          </div>
          <div>
            <h3 className="font-medium text-black dark:text-white">{title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {time} - {duration}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <Button onClick={() => setShowDetails(!showDetails)} className="dashbutton text-white">
          {showDetails ? "Hide Details" : "View Details"}
        </Button>
        {/* <Button className="dashbutton text-white" onClick={() => setIsOpen(true)}>
          Reschedule
        </Button> */}
        </div>
      </div>
      {showDetails && details && (
        <div className="mt-4 space-y-2 rounded-md secondbg p-4 py-1">
          {/* <p className="text-sm text-black dark:text-white">
            <span className="font-medium">Session Type:</span> {details.type}
          </p> */}
          <p className="text-sm text-black dark:text-white">
            <span className="font-medium">Session Duration:</span> {details.duration}
          </p>
          <p className="text-sm text-black dark:text-white">
            <span className="font-medium">Session Discussion:</span> {details.discussion}
          </p>
          <Button variant="default" size="sm" className="mt-2 dashbutton text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            Open Chat
          </Button>
        </div>
      )}

      <RescheduleSession
        open={isOpen}
        onOpenChange={setIsOpen}/>
    </div>
  );
}
