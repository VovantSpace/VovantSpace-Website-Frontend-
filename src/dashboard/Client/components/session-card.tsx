import { useEffect, useState } from "react";
import { Calendar, Clock,MessageSquare  } from "lucide-react";
import { AvatarInitial } from "@/dashboard/Client/components/avatar-initial";
import { StatusBadge } from "@/dashboard/Client/components/status-badge";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import StarRating from "@/dashboard/Client/components/star-rating";

interface SessionCardProps {
  mentor: {
    name: string;
    initial: string;
  };
  title: string;
  date: string;
  time: string;
  duration: string;
  status: "confirmed" | "completed" | "cancelled" | "pending_payment";
  review?: {
    text: string;
    rating: number;
  };
  paymentRequired?: {
    timeRemaining: number; // Time in seconds
  };
  onCancel?: () => void;
  onCompletePayment?: () => void;
}

export function SessionCard({
  mentor,
  title,
  date,
  time,
  duration,
  status,
  review,
  paymentRequired,
  onCancel,
  onCompletePayment,
}: SessionCardProps) {
  const [remainingTime, setRemainingTime] = useState(paymentRequired?.timeRemaining || 0);

  useEffect(() => {
    if (!remainingTime) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg bg-card p-3 dark:text-white shadow-sm secondbg">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <AvatarInitial initial={mentor.initial} />
          <div className="space-y-1">
            <h3 className="font-medium text-primary dark:text-white">{mentor.name}</h3>
            <p className="font-medium">{title}</p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                <span>{time}</span>
              </div>
              <div className="text-sm text-muted-foreground dark:text-gray-300">Session Duration: {duration}</div>
              {paymentRequired && (
                <div className=" flex items-center text-center gap-2 text-sm font-medium text-destructive">
                  <span>Payment required within: {formatTime(remainingTime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <StatusBadge status={status} className="border-gray-700 dark:border-gray-300 text-center" />
      </div>

      {review && (
        <div className="mt-4 rounded-md bg-secondary/50 p-3">
          <p className="mb-2 text-sm">{review.text}</p>
          <StarRating rating={review.rating} />
        </div>
      )}

      <div className="mt-2 flex justify-end gap-2">
        {status === "confirmed" && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="dashbutton border-none hover:bg-green-800 !text-white"
          >
            <MessageSquare className="w-5 h-5"/>
            Chat
          </Button>
        )}
        {status === "pending_payment" && (
          <Button className="dashbutton border-none hover:bg-green-800 !text-white" onClick={onCompletePayment}>
            Complete Payment
          </Button>
        )}
      </div>
    </div>
  );
}
