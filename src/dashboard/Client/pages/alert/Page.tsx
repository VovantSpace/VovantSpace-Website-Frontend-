import { useState } from "react";
import { Bell, CheckCircle, Info, AlertCircle } from "lucide-react";

import { Card } from "@innovator/components/ui/card";
import { Button } from "@innovator/components/ui/button";
import { MainLayout } from "../../components/layout/main-layout";

export default function AlertPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Payment Received",
      description: "You have received a payment of $200.",
      date: "20/02/2025",
      type: "success",
      read: false,
    },
    {
      id: "2",
      title: "New Message",
      description: "You have a new message from John Doe.",
      date: "19/02/2025",
      type: "info",
      read: false,
    },
    {
      id: "3",
      title: "System Maintenance",
      description: "Scheduled maintenance on 22/02/2025.",
      date: "18/02/2025",
      type: "warning",
      read: false,
    },
    {
      id: "4",
      title: "Transaction Failed",
      description: "Your recent transaction failed.",
      date: "17/02/2025",
      type: "error",
      read: false,
    },
  ]);

  //   const renderIcon = (type) => {
  //     switch (type) {
  //       case "success":
  //         return <CheckCircle className="h-5 w-5 text-[#00bf8f]" />;
  //       case "info":
  //         return <Info className="h-5 w-5 text-blue-500" />;
  //       case "warning":
  //         return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  //       case "error":
  //         return <AlertCircle className="h-5 w-5 text-red-600" />;
  //       default:
  //         return <Bell className="h-5 w-5 text-gray-500" />;
  //     }
  //   };

  return (
    <MainLayout>
      <div className="space-y-6 md:p-6 px-3 pt-2">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold dashtext">Alerts</h1>
            <p className="text-sm text-gray-400">
              Stay updated with your latest alerts and notifications.
            </p>
          </div>
          <Button className="dashbutton">Mark All as Read</Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="p-4 flex items-start secondbg gap-4 transition-colors hover:secondbg cursor-pointer  border-l-4 border-[#175047]"

            >
              {/* Icon */}
              {/* <div className="flex-shrink-0">
                <div className="rounded-full secondbg p-2">
                  {renderIcon(notification.type)}
                </div>
              </div> */}

              {/* Notification Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold dashtext">{notification.title}</h3>
                  <span className="text-xs text-gray-500">{notification.date}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
              </div>


            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
