import { useState, JSX, SetStateAction } from "react";
import {
    ArrowUpRight,
    MapPin,
    Star,
    Clock,
    DollarSign,
    AlertCircle,
    BarChart as ChartBar,
    Trophy,
} from "lucide-react";

import { Card } from "@/dashboard/Innovator/components/ui/card";
import { Badge } from "@/dashboard/Innovator/components/ui/badge";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/dashboard/Innovator/components/ui/select";
import { MainLayout } from "@/dashboard/ProblemSolver/components/layout/main-layout";
import { CreateChallengeDialog } from "@/dashboard/Innovator/components/modals/create-challenge-dialog";
import { ApplyChallengeDialog } from "@/dashboard/ProblemSolver/components/modals/ApplyChallengeDialog";

// ✅ Hooks for Problem Solver dashboard
import {
    useProblemSolverStats,
    useExploreChallenges,
} from "@/hooks/useProblemSolver";

// Reusable loading skeleton
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
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
    const [isCreateChallengeOpen, setIsCreateChallengeOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [industryFilter, setIndustryFilter] = useState("all");
    const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>(
        []
    );
    const [page, setPage] = useState(1);
    const limit = 10;

    // ✅ Use hooks here
    const {
        stats,
        loading: statsLoading,
        error: statsError,
        refetch: refetchStats,
    } = useProblemSolverStats();

    const {
        challenges,
        pagination,
        loading: challengesLoading,
        error: challengesError,
        refetch: refetchChallenges,
    } = useExploreChallenges(
        { industry: industryFilter !== "all" ? industryFilter : undefined },
        page,
        limit
    );

    // handle pitch apply
    const handleApplyNow = (challenge: SetStateAction<null>) => {
        setSelectedChallenge(challenge);
        setIsApplyDialogOpen(true);
    };

    const toggleDescription = (id: string) => {
        setExpandedDescriptions((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    return (
        <MainLayout>
            <div className="dashbg md:p-6 px-3 pt-2 md:mr-14">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dashtext">Overview</h1>
                </div>

                {/* Stats Section */}
                {statsLoading ? (
                    <LoadingStats />
                ) : statsError ? (
                    <ErrorMessage message={statsError} onRetry={refetchStats} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Card 1: Submissions */}
                        <Card className="p-6 secondbg !dark:text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                                        Total Submissions
                                    </p>
                                    <h2 className="text-3xl font-bold dark:text-white">
                                        {stats?.totalSubmissions || 0}
                                    </h2>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-emerald-800 flex items-center justify-center">
                                    <ChartBar className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </Card>

                        {/* Card 2: Earnings */}
                        <Card className="p-6 secondbg !dark:text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                                        Rewards Earned
                                    </p>
                                    <h2 className="text-3xl font-bold dark:text-white">
                                        ${stats?.totalEarnings || 0}
                                    </h2>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </Card>

                        {/* Card 3: Active Collaborations */}
                        <Card className="p-6 secondbg !dark:text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                                        Active Collaborations
                                    </p>
                                    <h2 className="text-3xl font-bold dark:text-white">
                                        {stats?.activeCollaborations || 0}
                                    </h2>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                                    <Trophy className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Challenges Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dashtext flex">
                        Recommended Challenges
                    </h2>
                    <div className="secondbg">
                        <Select
                            value={industryFilter}
                            onValueChange={(val) => setIndustryFilter(val)}
                        >
                            <SelectTrigger  className="secondbg text-center text-sm">
                                <SelectValue placeholder="All Industries" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Industries</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="energy">Energy & Sustainability</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {challengesLoading ? (
                    <p>Loading challenges...</p>
                ) : challengesError ? (
                    <ErrorMessage message={challengesError} onRetry={refetchChallenges} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {challenges.map((challenge) => (
                            <Card key={challenge._id} className="md:p-4 p-2 secondbg">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            <Clock className="h-4 w-4" />
                                            <span>
                        Posted{" "}
                                                {new Date(challenge.createdAt).toLocaleDateString()}
                      </span>
                                        </div>
                                        <h3 className="text-xl font-bold">{challenge.title}</h3>
                                    </div>
                                    <span className="text-lg font-extrabold text-emerald-600">
                    ${challenge.totalBudget}
                  </span>
                                </div>

                                <Badge className="mb-4">{challenge.industry}</Badge>

                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                                    {expandedDescriptions.includes(challenge._id)
                                        ? challenge.description
                                        : `${challenge.description.slice(0, 150)}...`}
                                    <button
                                        onClick={() => toggleDescription(challenge._id)}
                                        className="ml-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        {expandedDescriptions.includes(challenge._id)
                                            ? "less"
                                            : "more"}
                                    </button>
                                </p>

                                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Solutions Submitted: {challenge.submissions?.length || 0}
                  </span>
                                    <Button
                                        onClick={() => handleApplyNow(challenge)}
                                        className="dashbutton text-white"
                                    >
                                        Pitch Now
                                        <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateChallengeDialog
                isOpen={isCreateChallengeOpen}
                onClose={() => setIsCreateChallengeOpen(false)}
            />
            {isApplyDialogOpen && (
                <ApplyChallengeDialog
                    isOpen={isApplyDialogOpen}
                    onClose={() => {
                        setIsApplyDialogOpen(false);
                        setSelectedChallenge(null);
                    }}
                    challenge={selectedChallenge}
                />
            )}
        </MainLayout>
    );
}
