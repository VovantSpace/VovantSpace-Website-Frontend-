import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@innovator/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@innovator/components/ui/dialog";
import { MainLayout } from "../../components/layout/main-layout";

export default function RequestsPage() {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  const handleAccept = () => {
    setShowAcceptDialog(false);
    // Handle accept logic here
  };

  const handleDecline = () => {
    setShowDeclineDialog(false);
    // Handle decline logic here
  };

  return (
    <MainLayout>
      <div className="p-4">

        <div className="rounded-lg bg-card secondbg p-6 py-4 shadow-sm text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-800 text-white text-primary">
                D
              </div>
              <h2 className="text-xl font-bold text-black dark:text-white">David Wilson</h2>
            </div>
            <div className="flex space-x-2">
              {/* Accept Dialog */}
              <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogTrigger asChild>
                  <Button className="dashbutton bg-emerald-600 text-white hover:bg-emerald-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Accept
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-6 rounded-lg bg-white dark:bg-gray-900">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-black dark:text-white">
                      Accept Session Request
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-black dark:text-white">
                      Are you sure you want to accept this session request from David Wilson?
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleAccept}
                        className="dashbutton w-full bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Confirm Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAcceptDialog(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Decline Dialog */}
              <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Decline
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md p-6 rounded-lg bg-white dark:bg-gray-900">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-black dark:text-white">
                      Decline Session Request
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-black dark:text-white">
                      Are you sure you want to decline this session request from David Wilson?
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={handleDecline}
                        variant="destructive"
                        className="dashbutton w-full"
                      >
                        Confirm Decline
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeclineDialog(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Session Details */}
          <div className="mt-3 space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-black dark:text-white">
                Wednesday, March 20 at 3:00 PM
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-black dark:text-white">Session Duration: 30 minutes</span>
            </div>


            <div className="flex items-center flex-wrap gap-x-2">
              <h3 className="font-medium text-black dark:text-white">Session Discussion:</h3>
              <p className=" text-black dark:text-white">
                Discuss transition to management role
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
