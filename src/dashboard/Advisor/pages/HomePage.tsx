import {JSX, useMemo, useState} from "react";
import {Clock, Users, Star, AlertCircle, DollarSign} from "lucide-react";
import {Button} from '@/components/ui/button'
import {StatsCard} from "../components/modals/StatsCard";
import {DaySelector} from "../components/modals/DaySelector";
import {SessionCard} from "../components/modals/SessionCard";
import {MainLayout} from "../components/layout/main-layout";
import {Link} from "react-router-dom";
import {useDashboardStats, useMentorSessions} from "@/hooks/useMentor";

// Helper functions to get week days starting from today
const getWeekDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i);

        days.push({
            name: date.toLocaleDateString('en-US', {weekday: 'short'}),
            date: date.getDate(),
            fullDate: date,
            isToday: i === 0,
            isSelected: i === 0
        });
    }

    return days;
}

// Fixed: Helper function to group sessions by day using full date as key
const groupSessionsByDay = (sessions: any[]) => {
    const grouped: { [key: string]: any[] } = {}; // Changed to string key

    sessions.forEach(session => {
        const sessionDate = new Date(session.scheduledDate);
        // Use full date string as key instead of just day number to avoid conflicts
        const dayKey = sessionDate.toDateString(); // e.g., "Wed Dec 25 2024"

        if (!grouped[dayKey]) {
            grouped[dayKey] = [];
        }

        grouped[dayKey].push({
            id: session._id,
            time: sessionDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            duration: `${session.duration} min`,
            clientName: `${session.mentee.firstName} ${session.mentee.lastName}`,
            clientAvatar: session.mentee.profilePicture,
            status: session.status,
            amount: session.amount,
        });
    });

    return grouped;
}

// Loading component
const LoadingStats = (): JSX.Element => {
    return <div className={'grid gap-4 md:grid-cols-1 lg:grid-cols-3'}>
        {[1, 2, 3].map((i) => (
            <div key={i} className={'animate-pulse'}>
                <div className={'h-24 bg-gray-200 dark:bg-gray-700 rounded-lg'}></div>
            </div>
        ))}
    </div>;
}

// Error component
const ErrorMessage = ({message, onRetry}: { message: string; onRetry: () => void }) => {
    return <div className={'flex items-center justify-center p-8 text-center'}>
        <div className={'max-w-md'}>
            <AlertCircle className={'h-12 w-12 text-red-500 mx-auto mb-4'}/>
            <h3 className={'text-lg font-semibold text-gray-900 dark:text-white mb-2'}>
                Something went wrong
            </h3>
            <p className={'text-gray-600 dark:text-gray-400 mb-4'}>{message}</p>
            <Button onClick={onRetry} variant={'outline'} className={'dark:text-black'}>
                Try again
            </Button>
        </div>
    </div>
}

export default function HomePage() {
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    // Fetch dashboard stats
    const {
        stats,
        loading: statsLoading,
        error: statsError,
        refetch: refetchStats,
    } = useDashboardStats();

    // Fetch upcoming sessions
    const {
        sessions: upcomingSessions,
        loading: sessionsLoading,
        error: sessionsError,
        refetch: refetchSessions
    } = useMentorSessions('scheduled', 1, 50);

    const days = useMemo(() => {
        const weekDays = getWeekDays();
        return weekDays.map((day, index) => ({
            ...day,
            isSelected: index === selectedDayIndex,
        }))
    }, [selectedDayIndex]);

    const sessionsByDay = useMemo(() => {
        return groupSessionsByDay(upcomingSessions || []);
    }, [upcomingSessions]);

    // Fixed: Get sessions for selected day using full date string
    const selectedDay = days[selectedDayIndex];
    const sessionsForSelectedDay = selectedDay
        ? sessionsByDay[selectedDay.fullDate.toDateString()] || []
        : [];

    // Fixed: Handle day selection properly
    const handleSelectDay = (date: number) => {
        // Find the index of the day with this date number
        const dayIndex = days.findIndex(day => day.date === date);
        if (dayIndex !== -1) {
            setSelectedDayIndex(dayIndex);
        }
    };

    // Handle retry for errors
    const handleRetry = () => {
        refetchStats()
        refetchSessions()
    }

    // Show error state
    if (statsError || sessionsError) {
        return (
            <MainLayout>
                <div className={'p-4 dark:text-white'}>
                    <ErrorMessage
                        message={statsError || sessionsError || "Failed to load dashboard data"}
                        onRetry={handleRetry}
                    />
                </div>
            </MainLayout>
        );
    }

    // Show loading state
    if (statsLoading && sessionsLoading) {
        return (
            <MainLayout>
                <div className={'p-4 dark:text-white'}>
                    <LoadingStats/>
                    <div className={'mt-8'}>
                        <div className={'h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse'}></div>
                        <div className={'h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse'}></div>
                        <div className={'space-y-3'}>
                            {[1, 2, 3].map((i) => (
                                <div key={i}
                                     className={'h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="p-4 dark:text-white">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    <StatsCard
                        title="Total Sessions This Month"
                        value={stats?.completedSessions?.toString() || "0"}
                        icon={Clock}
                        change={{
                            value: stats?.upcomingSessions
                                ? `${stats.upcomingSessions} upcoming sessions`
                                : "No upcoming sessions",
                            positive: (stats?.upcomingSessions || 0) > 0
                        }}
                        iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
                    />
                    <StatsCard
                        title="Total Requests"
                        value={stats?.totalRequests?.toString() || "0"}
                        icon={Users}
                        change={{
                            value: stats?.pendingRequests
                                ? `${stats.pendingRequests} pending requests`
                                : "No pending requests",
                            positive: (stats?.pendingRequests || 0) > 0
                        }}
                        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    />
                    <StatsCard
                        title="Total Earnings"
                        value={`$${stats?.totalEarnings?.toLocaleString() || 0}`}
                        icon={DollarSign}
                        subtitle={stats?.completedSessions ? `From ${stats?.completedSessions} sessions` : "No sessions completed"}
                        change={{
                            value: stats?.averageRatings
                                ? `${stats.averageRatings}★ average rating`
                                : "No ratings yet",
                            positive: (stats?.averageRatings || 0) >= 4
                        }}
                        iconBgColor="bg-green-100 dark:bg-green-900/30"
                    />

                    {stats?.averageRatings && (
                        <StatsCard
                            title={'Average Rating'}
                            value={stats.averageRatings.toString()}
                            icon={Star}
                            subtitle={`${stats.totalRatings || 0} Reviews`}
                            iconBgColor={'bg-yellow-100 dark:bg-yellow-900/30'}
                        />
                    )}
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
                            Upcoming Sessions
                        </h2>
                        {sessionsLoading && (
                            <div className={'text-sm text-gray-500 dark:text-gray-400'}>
                                Loading sessions...
                            </div>
                        )}
                    </div>

                    <DaySelector days={days} onSelectDay={handleSelectDay}/>

                    <div className="mt-4">
                        {sessionsForSelectedDay.length > 0 ? (
                            sessionsForSelectedDay.map((session, index) => (
                                <SessionCard key={session.id || index} {...session} />
                            ))
                        ) : (
                            <div className={'text-center py-8 text-gray-500 dark:text-gray-400'}>
                                {selectedDay ? (
                                    <>
                                        <Clock className={'h-12 w-12 mx-auto mb-4 opacity-50'}/>
                                        <p className={'text-lg font-medium mb-2'}>No sessions scheduled</p>
                                        <p className={'text-sm'}>
                                            {selectedDay.isToday
                                                ? "You have no sessions today"
                                                : `No sessions on ${selectedDay.name}, ${selectedDay.date}`
                                            }
                                        </p>
                                    </>
                                ) : (
                                    <p>Select a day to view sessions</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-6 right-6">
                    <Link to="requests">
                        <Button className="dashbutton rounded-full p-4 text-white shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700 relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            View Requests
                            {/* Show pending requests count badge */}
                            {stats?.pendingRequests && stats.pendingRequests > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex gap-1 items-center justify-center">
                                    {stats.pendingRequests > 9 ? '9+' : stats.pendingRequests}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}