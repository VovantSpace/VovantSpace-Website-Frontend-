

import { Bell } from "lucide-react"
import { format } from "date-fns"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/dashboard/Innovator/components/ui/dropdown-menu"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { ScrollArea } from "@/dashboard/Innovator/components/ui/scroll-area"

const notifications = [
  {
    id: 1,
    title: "New Challenge Submission",
    description: "John Doe submitted a solution for AI Smart Farming",
    timestamp: new Date(2024, 1, 20, 14, 30),
    type: "submission",
  },
  {
    id: 2,
    title: "Review Required",
    description: "3 submissions pending review for Smart City Challenge",
    timestamp: new Date(2024, 1, 20, 12, 15),
    type: "review",
  },
  {
    id: 3,
    title: "Challenge Deadline",
    description: "Healthcare Analytics Challenge ends in 24 hours",
    timestamp: new Date(2024, 1, 20, 10, 0),
    type: "deadline",
  },
]

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-400 dashtext !bg-transparent">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]  dashtext">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold dark:text-black">Notifications</h4>
            <Button variant="ghost" className="text-sm text-[#00bf8f]">
              Mark all as read
            </Button>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator className="" /> */}
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col border-t gap-1 p-4 focus:secondbg"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div className="font-medium text-left dark:text-black">{notification.title}</div>
                <div className="text-xs text-gray-400">{format(notification.timestamp, "h:mm a")}</div>
              </div>
              <p className="text-sm text-gray-400">{notification.description}</p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        {/* <DropdownMenuSeparator className="secondbg" />
        <DropdownMenuItem className="cursor-pointer p-4 text-center focus:secondbg">
          <span className="w-full text-[#00bf8f]">View All Notifications</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

