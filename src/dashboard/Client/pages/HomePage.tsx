import {useState, useEffect, JSX} from "react"
import {
    Clock,
    BarChart2,
    Calendar,
    AlertCircle
} from "lucide-react"
import {Button} from "@/dashboard/Innovator/components/ui/button"
import {SessionCard} from "@/dashboard/Client/components/session-card"
import {PaymentConfirmationDialog} from "@/dashboard/Client/components/payment-confirmation-dialog"
import {MainLayout} from "@/dashboard/Client/components/layout/main-layout"
import {useMenteeDashboardSocket} from "@/hooks/useMenteeDashboardSocket"
import {useMenteeDashboardData} from "@/hooks/useMenteeDashboardData";
import {toast} from 'react-hot-toast'

const LoadingStats = (): JSX.Element => (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        ))}
    </div>
);

// Error block
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

export default function HomePage() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    const menteeId = storedUser?._id

    console.log("Mentee ID:", menteeId)

    const {events} = useMenteeDashboardSocket(menteeId)
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)

    const {stats, sessions, notifications, loading, error, refresh} = useMenteeDashboardData(menteeId)

    useEffect(() => {
        if (events.length > 0) {
            const latest = events[0]
            console.log("new real-time event:", latest)

            toast.success(latest.message || "Dashboard updated successfully")
            refresh()
        }
    }, [events])

    const handleCompletePayment = () => {
        setIsPaymentDialogOpen(true)
    }

    const handleConfirmPayment = () => {
        setIsPaymentDialogOpen(false)
        // Handle payment confirmation logic
    }

    return (
        <MainLayout>
            <div className="min-h-screen dashbg p-4 ">
                {loading && (
                    <div className={'mt-10'}>
                        <LoadingStats/>
                        <p className={'text-center text-gray-500 mt-4'}>Loading your dashboard</p>
                    </div>
                )}

                {/* Show error state*/}
                {!loading && error && <ErrorMessage message={error} onRetry={refresh}/>}

                {/* Main content */}
                {!loading && !error && stats && (
                    <>
                        <div className={'grid grid-cols-1 gap-4 md:grid-cols-3'}>
                            <StatsCard
                                title={"Sessions Completed"}
                                value={stats?.completedSessions || 0}
                                icon={Clock}
                                color={'bg-emerald-500'}
                            />
                            <StatsCard
                                title={'Total Sessions'}
                                value={stats?.totalRequests || 0}
                                icon={BarChart2}
                                color={'bg-blue-500'}
                            />
                            <StatsCard
                                title={'Upcoming Sessions'}
                                value={stats?.upcomingSessions || 0}
                                icon={Calendar}
                                color={'bg-purple-500'}
                            />
                        </div>

                        {/*  Upcoming Session  */}
                        <div className={'mt-6'}>
                            <h2 className={'mb-4 text-xl font-bold dark:text-white'}>Upcoming Sessions</h2>
                            {sessions.length === 0 ? (
                                <p className={'text-gray-400 dark:text-gray-300'}>
                                    No upcoming sessions yet.
                                </p>
                            ) : (
                                <div className={'space-y-4'}>
                                    {sessions.map((session) => (
                                        <SessionCard
                                            key={session._id}
                                            mentor={{
                                                name: `${session.mentor.firstName} ${session.mentor.lastName}`,
                                                initial: session.mentor.firstName[0],
                                            }}
                                            title={session.topic}
                                            date={new Date(session.requestedDate).toLocaleDateString()}
                                            time={new Date(session.requestedDate).toLocaleTimeString()}
                                            duration={`${session.duration} mins`}
                                            status={session.status}
                                            onCompletePayment={() => setIsPaymentDialogOpen(true)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/*  Notifications  */}
                        <div className={'mt-6'}>
                            <div className={'flex items-center justify-between'}>
                                <h2 className={'text-xl font-bold dark:text-white'}>Notifications</h2>
                                <button className={'text-sm text-primary hover:underline dark:text-white'}>
                                    Show All
                                </button>
                            </div>
                            <div className={'mt-4 space-y-4'}>
                                {notifications.length === 0 ? (
                                    <p className={'text-gray-400 dark:text-gray-300'}>
                                        No notifications yet
                                    </p>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            className={'flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm secondbg dark:text-white'}
                                        >
                                            <div className={'rounded-full bg-primary/10 p-2 text-primary'}>
                                                <Calendar className={'h-5 w-5'}/>
                                            </div>

                                            <div className={'flex-1'}>
                                                <p className={'text-sm'}>{n.message}</p>
                                                <p className={'mt-1 text-xs text-muted-foreground dark:!text-gray-300'}>
                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/*  Payment dialog  */}
                        <PaymentConfirmationDialog
                            open={isPaymentDialogOpen}
                            onOpenChange={setIsPaymentDialogOpen}
                            sessionDetails={{
                                mentor: "Emma Thompson",
                                topic: "Technical Interview Preparation",
                                date: "Thursday, March 12",
                                time: "10:00 AM",
                                duration: "30 minutes"
                            }}
                            paymentDetails={{
                                sessionFee: 50.0,
                                serviceFee: 2.5,
                                totalAmount: 52.5
                            }}
                            timeLimit={242}
                            onConfirm={() => setIsPaymentDialogOpen(false)}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    )
}

function StatsCard({title, value, color, icon: Icon}: {
    title: string;
    value: string | number;
    color: string;
    icon: any
}) {
    return (
        <div className={'flex items-start gap-4 rounded-lg bg-card p-4 shadow-sm secondbg'}>
            <div className={`rounded-lg ${color} p-3 text-white`}>
                <Icon className={'h-6 w-6'}/>
            </div>
            <div>
                <h3 className="text-sm font-medium dark:text-white">{title}</h3>
                <p className={'text-2xl font-bold dark:text-white'}>{value}</p>
            </div>
        </div>
    )
}
