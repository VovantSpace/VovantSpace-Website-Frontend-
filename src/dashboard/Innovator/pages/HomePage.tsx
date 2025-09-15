import {useState, useEffect} from "react"
import {Clock, FileText} from "lucide-react"
import {Link} from "react-router-dom"
import {Button} from "../components/ui/button"
import {Card} from "../components/ui/card"
import {MainLayout} from "../components/layout/main-layout"
import {CreateChallengeDialog} from "../components/modals/create-challenge-dialog"
import {useDashboardStats, useChallenges} from "@/hooks/useChallenges";
import {toast} from 'react-hot-toast'
import {Loader2} from "lucide-react";

// Helper function to safely format numbers
const safeFormatNumber = (value: number | undefined | null): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }
    return value.toLocaleString();
};

// Helper function to count challenges created this month
const getChallengesThisMonth = (challenges: any[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return challenges.filter(challenge => {
        if (!challenge.createdAt) return false;
        const createdDate = new Date(challenge.createdAt);
        return createdDate >= startOfMonth;
    }).length;
};

export default function HomePage() {
    const {stats, loading: statsLoading, error: statsError, refetch: refetchStats} = useDashboardStats()
    const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false)
    const {challenges, loading: challengesLoading, error: challengesError, refetch: refetchChallenges} = useChallenges()

    // Refresh stats when challenges change
    useEffect(() => {
        if (!challengesLoading && !statsLoading) {
            refetchStats();
        }
    }, [challenges.length]);

    // Filter challenges into active and completed
    const activeChallenges = challenges?.filter(challenge => challenge.status.toLowerCase() === 'active') || []
    const completedChallenges = challenges?.filter(challenge => challenge.status.toLowerCase() === 'completed') || []

    // Calculate this month's statistics
    const challengesCreatedThisMonth = getChallengesThisMonth(challenges || []);
    const totalBudgetFromChallenges = challenges?.reduce((sum, challenge) => sum + (challenge.totalBudget || 0), 0) || 0;

    if (statsLoading || challengesLoading) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-64'}>
                    <Loader2 className={'h-8 w-8 animate-spin'}/>
                    <span className={'ml-2'}>Loading dashboard</span>
                </div>
            </MainLayout>
        )
    }

    if (statsError || challengesError) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-64'}>
                    <div className={'text-center'}>
                        <p className={'text-red-500 mb-4'}>{statsError || challengesError}</p>
                        <Button onClick={() => {
                            refetchStats();
                            refetchChallenges()
                        }}>Retry</Button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    // Use actual challenge data if stats are unavailable or inconsistent
    const totalChallenges = Math.max(stats?.totalChallenges ?? 0, challenges?.length ?? 0);
    const activeChallengesCount = Math.max(stats?.activeChallenges ?? 0, activeChallenges.length);
    const completedChallengesCount = Math.max(stats?.completedChallenges ?? 0, completedChallenges.length);
    const totalBudget = Math.max(stats?.totalBudget ?? 0, totalBudgetFromChallenges);

    const handleChallengeCreated = () => {
        // Refresh both challenges and stats
        Promise.all([
            refetchChallenges(),
            refetchStats()
        ]).then(() => {
            toast.success('Challenge created successfully!');
        });
    };

    return (
        <MainLayout>
            <div className="dashbg md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 ">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dashtext">Overview</h1>
                    <Button className="dashbutton" onClick={() => setIsCreateChallengeOpen(true)}>Create New
                        Challenge
                    </Button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="secondbg p-6 dashtext">
                        <div className="mb-2 text-sm text-gray-400">Total Challenges</div>
                        <div className="text-3xl font-bold">{totalChallenges}</div>
                        <div className="mt-2 text-sm text-[#00bf8f]">
                            +{challengesCreatedThisMonth} this month
                        </div>
                    </Card>
                    <Card className="secondbg p-6 dashtext">
                        <div className="mb-2 text-sm text-gray-400">Active Challenges</div>
                        <div className="text-3xl font-bold">{activeChallengesCount}</div>
                        <div className="mt-2 text-sm text-gray-500">
                            {completedChallengesCount} completed
                        </div>
                    </Card>
                    <Card className="secondbg p-6 dashtext">
                        <div className="mb-2 text-sm text-gray-400">Total Rewards</div>
                        <div className="text-3xl font-bold">${safeFormatNumber(totalBudget)}</div>
                        <div className="mt-2 text-sm text-[#00bf8f]">
                            Avg: ${totalChallenges > 0 ? safeFormatNumber(Math.round(totalBudget / totalChallenges)) : '0'}
                        </div>
                    </Card>
                </div>

                <div className="mb-8">
                    <h2 className={'mb-4 text-xl font-bold dashtext'}>
                        Active Challenges ({activeChallenges.length})
                    </h2>
                    <div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
                        {activeChallenges.length > 0 ? (
                            activeChallenges.map((challenge) => (
                                <Card key={challenge._id} className={'secondbg p-6'}>
                                    <div className={'mb-4'}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className={'text-lg font-semibold dashtext mb-2'}>{challenge.title}</h3>
                                                <span
                                                    className={'inline-block rounded-full bg-[#00bf8f]/20 px-2 py-0.5 text-xs text-[#00bf8f]'}>
                                                    {challenge.status}
                                                </span>
                                            </div>
                                            <div className={'text-xl font-bold text-[#00bf8f]'}>
                                                ${safeFormatNumber(challenge.totalBudget)}
                                            </div>
                                        </div>
                                        <div className={'mb-4 flex items-center gap-6 text-sm text-gray-400'}>
                                            <div className={'flex items-center gap-2'}>
                                                <FileText className={'w-4 h-4'}/>
                                                <span>{challenge.submissions?.length || 0} submissions</span>
                                            </div>
                                            <div className={'flex items-center gap-2'}>
                                                <span>👥 {challenge.problemSolversNeeded || 1} needed</span>
                                            </div>
                                        </div>
                                        <Link to={`/dashboard/innovator/my-challenges/${challenge._id}`}>
                                            <Button className={'w-full dashbutton'}>View Details</Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className={'secondbg p-6 text-center'}>
                                <p className={'text-gray-400'}>No active challenges found</p>
                                <Button className={'mt-4 dashbutton'} onClick={() => setIsCreateChallengeOpen(true)}>
                                    Create a Challenge
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className={'mb-4 text-xl font-bold dashtext'}>
                        Completed Challenges ({completedChallenges.length})
                    </h2>
                    <div className={'grid grid-cols-1 gap-4 md:grid-cols-2'}>
                        {completedChallenges.length > 0 ? (
                            completedChallenges.map((challenge) => (
                                <Card key={challenge._id} className={'secondbg p-6'}>
                                    <div className={'mb-4'}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className={'text-lg font-semibold dashtext mb-2'}>{challenge.title}</h3>
                                                <span
                                                    className={'inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400'}>
                                                    {challenge.status}
                                                </span>
                                            </div>
                                            <div className={'text-xl font-bold text-[#00bf8f]'}>
                                                ${safeFormatNumber(challenge.totalBudget)}
                                            </div>
                                        </div>
                                        <div className={'mb-4 flex items-center gap-6 text-sm text-gray-400'}>
                                            <div className={'flex items-center gap-2'}>
                                                <FileText className={'h-4 w-4'}/>
                                                <span>{challenge.submissions?.length || 0} submissions</span>
                                            </div>
                                            <div className={'flex items-center gap-2'}>
                                                <span>✅ {challenge.approvedSubmissions?.length || 0} approved</span>
                                            </div>
                                        </div>
                                        <Link to={`/dashboard/completed-challenges/${challenge._id}`}>
                                            <Button className={'w-full dashbutton'}>View Details</Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className={'secondbg p-6 text-center'}>
                                <p className={'text-gray-400'}>No completed challenges found.</p>
                            </Card>
                        )}
                    </div>
                </div>

                <CreateChallengeDialog
                    isOpen={isCreateChallengeOpen}
                    onClose={() => setIsCreateChallengeOpen(false)}
                    onChallengeCreated={handleChallengeCreated}
                />
            </div>
        </MainLayout>
    )
}