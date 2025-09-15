import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { MainLayout } from '../components/layout/main-layout';
import { CreateChallengeDialog } from '../components/modals/create-challenge-dialog';
import { useDashboardStats, useChallenges } from '@/hooks/useChallenges';
import { toast } from 'react-hot-toast';

// Helper function to safely format numbers
const safeFormatNumber = (value: number | undefined | null): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

export default function HomePage() {
    const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
    const { challenges, loading: challengesLoading, error: challengesError, refetch: refetchChallenges } = useChallenges();
    const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);

    // Filter challenges into active and completed
    const activeChallenges = challenges?.filter(challenge => challenge.status.toLowerCase() === 'active') || [];
    const completedChallenges = challenges?.filter(challenge => challenge.status.toLowerCase() === 'completed') || [];

    if (statsLoading || challengesLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading dashboard...</span>
                </div>
            </MainLayout>
        );
    }

    if (statsError || challengesError) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{statsError || challengesError}</p>
                        <Button
                            onClick={() => {
                                refetchStats();
                                refetchChallenges();
                            }}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const totalChallenges = stats?.totalChallenges ?? 0;
    const activeChallengesCount = stats?.activeChallenges ?? 0;
    const totalBudget = stats?.totalBudget ?? 0;
    const completedChallengesCount = stats?.completedChallenges ?? 0;

    return (
        <MainLayout>
            <div className="dashbg md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dashtext">Overview</h1>
                    <Button className="dashbutton" onClick={() => setIsCreateChallengeOpen(true)}>
                        Create New Challenge
                    </Button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="secondbg p-6 dashtext">
                        <div className="mb-2 text-sm text-gray-400">Total Challenges</div>
                        <div className="text-3xl font-bold">{safeFormatNumber(totalChallenges)}</div>
                        <div className="mt-2 text-sm text-[#00bf8f]">
                            +{safeFormatNumber(totalChallenges - completedChallengesCount)} this month
                        </div>
                    </Card>
                    <Card className="secondbg p-6 dashtext">
                        <div className="mb-2 text-sm text-gray-400">Active Challenges</div>
                        <div className="text-3xl font-bold">{activeChallengesCount}</div>
                        <span>⏳</span>
                    </Card>
                    <Card className="secondbg p-6 dashtext">
                        <div className="mb-2 text-sm text-gray-400">Total Rewards</div>
                        <div className="text-3xl font-bold">${safeFormatNumber(totalBudget)}</div>
                        <div className="mt-2 text-sm text-[#00bf8f]">
                            +${safeFormatNumber(totalBudget * 0.32)} this month
                        </div>
                    </Card>
                </div>

                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold dashtext">Active Challenges</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {activeChallenges.length > 0 ? (
                            activeChallenges.map((challenge) => (
                                <Card key={challenge._id} className="secondbg p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold dashtext">{challenge.title}</h3>
                                            <span className="inline-block rounded-full bg-[#00bf8f]/20 px-2 py-0.5 text-xs text-[#00bf8f]">
                        {challenge.status}
                      </span>
                                        </div>
                                        <div className="text-xl font-bold text-[#00bf8f]">
                                            ${safeFormatNumber(challenge.totalBudget)}
                                        </div>
                                    </div>
                                    <div className="mb-4 flex items-center gap-6 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {safeFormatNumber(challenge.submissions?.length || 0)} Submissions
                                        </div>
                                    </div>
                                    <Link to="/dashboard/innovator/my-challenges">
                                        <Button className="w-full dashbutton">View Details</Button>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <Card className="secondbg p-6 text-center">
                                <p className="text-gray-400">No active challenges found</p>
                                <Button className="mt-4 dashbutton" onClick={() => setIsCreateChallengeOpen(true)}>
                                    Create a Challenge
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold dashtext">Completed Challenges</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {completedChallenges.length > 0 ? (
                            completedChallenges.map((challenge) => (
                                <Card key={challenge._id} className="secondbg p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold dashtext">{challenge.title}</h3>
                                            <span className="inline-block rounded-full bg-[#00bf8f]/20 px-2 py-0.5 text-xs text-[#00bf8f]">
                        {challenge.status}
                      </span>
                                        </div>
                                        <div className="text-xl font-bold text-[#00bf8f]">
                                            ${safeFormatNumber(challenge.totalBudget)}
                                        </div>
                                    </div>
                                    <div className="mb-4 flex items-center gap-6 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {safeFormatNumber(challenge.submissions?.length || 0)} Submissions
                                        </div>
                                    </div>
                                    <Link to="/dashboard/innovator/my-challenges">
                                        <Button className="w-full dashbutton">View Details</Button>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <Card className="secondbg p-6 text-center">
                                <p className="text-gray-400">No completed challenges found.</p>
                            </Card>
                        )}
                    </div>
                </div>

                <CreateChallengeDialog
                    isOpen={isCreateChallengeOpen}
                    onClose={() => setIsCreateChallengeOpen(false)}
                    onChallengeCreated={() => {
                        refetchChallenges();
                        toast.success('Challenge created successfully!');
                    }}
                />
            </div>
        </MainLayout>
    );
}