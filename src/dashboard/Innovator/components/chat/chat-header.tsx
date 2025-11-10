import { Video as VideoIcon, Phone as PhoneIcon, Calendar as CalendarIcon,Briefcase} from "lucide-react";
import { useState } from "react";
import { VideoCallDialog } from "./video-call-dialog";
import { ScheduleReviewDialog } from "../modals/schedule-review-dialog";
import type { Channel, CallData } from "./types";

interface ChatHeaderProps {
  channel: Channel | null;
  onVideoCall: (data: CallData) => void;
  onAudioCall: (data: CallData) => void;
  onScheduleCall: (data: { date: string; time: string; duration: string }) => void;
}

export function ChatHeader({ channel, onVideoCall, onAudioCall, onScheduleCall }: ChatHeaderProps) {
  const [activeDialog, setActiveDialog] = useState<"video" | "audio" | "schedule" | null>(null);

  if (!channel) {
      return (
          <div className={'border-b px-6 py-3 flex items-center justify-between dashtext dashbg'}>
              <h1 className={'text-sm font-semibold'}>No channel selected</h1>
          </div>
      )
  }

  const handleClose = () => setActiveDialog(null);

  return (
    <div className="border-b px-6 py-3 flex items-center justify-between dashtext dashbg">
      <div>
        <h1 className="text-sm font-semibold">{channel?.name}</h1>
        <p className="text-xs text-muted-foreground flex gap-x-1 items-center dark:text-gray-400"><Briefcase className="h-4 w-4 md:flex hidden" />{channel?.description}</p>
      </div>

      {activeDialog === "schedule" && (
        <ScheduleReviewDialog
          isOpen={true}
          onClose={handleClose}
          onSchedule={(data) => {
            onScheduleCall(data);
            handleClose();
          }}
        />
      )}

      {(activeDialog === "video" || activeDialog === "audio") && (
        <VideoCallDialog
          isOpen={true}
          onClose={handleClose}
          onSchedule={(data) => {
            if (activeDialog === "video") {
              onVideoCall({ ...data, type: "video" });
            } else if (activeDialog === "audio") {
              onAudioCall({ ...data, type: "audio" });
            }
            handleClose();
          }}
          mode="ongoing"
          type={activeDialog === "audio" ? "audio" : "video"}
        />
      )}
    </div>
  );
}
