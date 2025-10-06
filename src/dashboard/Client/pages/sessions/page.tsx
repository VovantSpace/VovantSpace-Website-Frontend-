import {useState, JSX} from "react";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/dashboard/Innovator/components/ui/tabs";
import {SessionCard} from "@/dashboard/Client/components/session-card";
import {PaymentConfirmationDialog} from "@/dashboard/Client/components/payment-confirmation-dialog";
import {MainLayout} from "@/dashboard/Client/components/layout/main-layout";
import {useMenteeSessions} from "@/hooks/useMenteeSessions";
import {useSessionSocket} from "@/hooks/useMenteeDashboardSocket";
import {Button} from "@/components/ui/button";
import {AlertCircle} from "lucide-react";
import {toast} from "react-hot-toast";

// 🔹 Loading skeleton
const LoadingStats = (): JSX.Element => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm animate-pulse"
            >
                {/* Shimmer effect */}
                <div
                    className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300/20 to-transparent dark:via-gray-600/20"/>

                {/* Placeholder content */}
                <div className="p-4 space-y-4">
                    <div className="h-4 w-3/4 rounded-md bg-gray-300 dark:bg-gray-600"></div>
                    <div className="h-3 w-1/2 rounded-md bg-gray-300 dark:bg-gray-700"></div>
                    <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex gap-2">
                        <div className="h-3 w-1/3 rounded-md bg-gray-300 dark:bg-gray-700"></div>
                        <div className="h-3 w-1/4 rounded-md bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

// 🔹 Error block
const ErrorMessage = ({
                          message,
                          onRetry,
                      }: {
    message: string;
    onRetry: () => void;
}) => (
    <div className="flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"/>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <Button onClick={onRetry} variant="outline" className="dark:text-black">
                Try again
            </Button>
        </div>
    </div>
);

export default function MySessions() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    // ✅ get menteeId from local storage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const menteeId = storedUser?._id;

    // fetch both upcoming and completed sessions
    const {sessions, loading, error, refresh} = useMenteeSessions(menteeId);

    // Extract arrays safely to apply
    const upcomingSessions = sessions.upcoming || []
    const completedSessions = sessions.completed || []

    // ✅ Real-time socket updates
    useSessionSocket(menteeId, (evt) => {
        toast.success(evt?.message || "Your sessions were updated");
        refresh();
    });

    const handleCompletePayment = () => setIsPaymentDialogOpen(true);
    const handleConfirmPayment = () => setIsPaymentDialogOpen(false);

    return (
        <MainLayout>
            <div className="min-h-screen p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-white">My Sessions</h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 w-full justify-start border-b bg-transparent p-0">
                        <TabsTrigger
                            value="upcoming"
                            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary dark:data-[state=active]:border-white dark:data-[state=active]:text-black"
                        >
                            Upcoming
                            <span
                                className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {upcomingSessions?.length || 0}
              </span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="completed"
                            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary dark:data-[state=active]:border-white dark:data-[state=active]:text-black"
                        >
                            Completed
                        </TabsTrigger>
                    </TabsList>

                    {/* 🔹 Upcoming Tab */}
                    <TabsContent value="upcoming" className="space-y-4">
                        {loading ? (
                            <LoadingStats/>
                        ) : error ? (
                            <ErrorMessage message={error} onRetry={refresh}/>
                        ) : upcomingSessions.length === 0 ? (
                            <p className="text-center text-gray-400 mt-6">No upcoming sessions found.</p>
                        ) : (
                            upcomingSessions.map((session) => (
                                <SessionCard
                                    key={session._id}
                                    mentor={{
                                        name: `${session.mentor.firstName} ${session.mentor.lastName}`,
                                        initial: session.mentor.firstName?.[0] || "M",
                                    }}
                                    title={session.topic || "Untitled Session"}
                                    date={new Date(session.scheduledDate).toLocaleDateString()}
                                    time={new Date(session.scheduledDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                    duration={`${session.duration} mins`}
                                    status={session.status}
                                    onCompletePayment={() => setIsPaymentDialogOpen(true)}
                                />
                            ))
                        )}
                    </TabsContent>


                    {/* 🔹 Completed Tab */}
                    <TabsContent value="completed" className="space-y-4">
                        {loading ? (
                            <LoadingStats/>
                        ) : error ? (
                            <ErrorMessage
                                message={error}
                                onRetry={refresh}
                            />
                        ) : completedSessions.length === 0 ? (
                            <p className="text-gray-500 text-center mt-6">
                                No completed sessions
                            </p>
                        ) : (
                            completedSessions.map((session) => (
                                <SessionCard
                                    key={session._id}
                                    mentor={{
                                        name: `${session.mentor.firstName} ${session.mentor.lastName}`,
                                        initial: session.mentor.firstName[0],
                                    }}
                                    title={session.topic}
                                    date={new Date(session.scheduledDate).toDateString()}
                                    time={new Date(session.scheduledDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    duration={`${session.duration} mins`}
                                    status={session.status}
                                    review={
                                        session.rating
                                            ? {
                                                text: session.notes || "No feedback provided",
                                                rating: session.rating,
                                            }
                                            : undefined
                                    }
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>

                {/* 🔹 Payment dialog */}
                <PaymentConfirmationDialog
                    open={isPaymentDialogOpen}
                    onOpenChange={setIsPaymentDialogOpen}
                    sessionDetails={{
                        mentor: "Emma Thompson",
                        topic: "Technical Interview Preparation",
                        date: "Thursday, March 21",
                        time: "11:00 AM",
                        duration: "30 minutes",
                    }}
                    paymentDetails={{
                        sessionFee: 50.0,
                        serviceFee: 2.5,
                        totalAmount: 52.5,
                    }}
                    timeLimit={242}
                    onConfirm={handleConfirmPayment}
                />
            </div>
        </MainLayout>
    );
}
