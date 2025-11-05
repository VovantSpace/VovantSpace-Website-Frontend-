import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "../../components/layout/main-layout";
import { Badge } from "../../components/ui/badge";
import { WinnerSelectorDialog } from "../../components/modals/WinnerSelectorDialog";
import { AllSubmissionsDialog } from "../../components/modals/All-Submission-Dialogue";
import { ApproveChallenge } from "../../components/modals/ApproveChallenge";
import { useChallenges } from "@/hooks/useChallenges";
import { Challenge, challengeApi } from "@/services/challengeService";

export default function ChallengesPage() {
    const { challenges, loading, error, refetch } = useChallenges();
    const [selectedChallengeForSubmissions, setSelectedChallengeForSubmissions] =
        useState<Challenge | null>(null);
    const [dynamicSubmissions, setDynamicSubmissions] = useState<any[]>([]);
    const [challengeToApprove, setChallengeToApprove] = useState<Challenge | null>(null);
    const [selectedChallengeForCompletion, setSelectedChallengeForCompletion] =
        useState<Challenge | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const challengeIdFromQuery = params.get("challengeId");
    const challengeIdFromState = location.state?.challengeId;
    const challengeId = challengeIdFromQuery || challengeIdFromState;

    // 🚀 Auto-open when navigating from a notification (with challengeId in state)
    useEffect(() => {
        const openFromNotification = async () => {
            if (challengeId && challenges?.length > 0) {
                const target = challenges.find((c) => c._id === challengeId);
                if (target) {
                    setSelectedChallengeForSubmissions(target);
                    setIsReviewOpen(true);
                    await fetchSubmissions(target._id);
                    // Remove query param after opening
                    window.history.replaceState({}, document.title, "/dashboard/innovator/my-challenges");
                }
            }
        };
        openFromNotification();
    }, [challengeId, challenges]);

    // 🧩 Fetch challenge submissions dynamically
    const fetchSubmissions = async (challengeId: string) => {
        try {
            setSubmissionsLoading(true);
            const response = await challengeApi.getChallengeSubmissions(challengeId);
            setDynamicSubmissions(response.data?.submissions || []);
        } catch (err) {
            console.error("Error fetching submissions:", err);
            setDynamicSubmissions([]);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const handleReviewSubmit = async (approved: boolean, submissionId: string) => {
        if (!selectedChallengeForSubmissions?._id) return;
        try {
            await challengeApi.reviewSubmission(
                selectedChallengeForSubmissions._id,
                submissionId,
                approved ? "approve" : "reject"
            );
            await fetchSubmissions(selectedChallengeForSubmissions._id); // Refresh submissions
            refetch(); // Refresh challenges list
        } catch (err: any) {
            console.error("Error submitting review:", err.message);
        }
    };

    const handleChallengeCompleted = () => {
        refetch();
        setSelectedChallengeForCompletion(null);
    };

    const canApprove = (challenge: Challenge) => {
        return (challenge.approvedSubmissions?.length || 0) >= challenge.problemSolversNeeded;
    };

    const getBadgeVariant = (status: string) => {
        const normalizedStatus = status?.toLowerCase();
        switch (normalizedStatus) {
            case "active":
                return "active";
            case "completed":
                return "completed";
            case "draft":
                return "draft";
            default:
                return "outline";
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading challenges...</span>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => refetch()}>Retry</Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="px-3 py-3 md:p-6 dashbg secondbg rounded-xl">
                <h1 className="mb-4 md:mb-6 text-xl md:text-2xl font-bold dashtext">My Challenges</h1>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <div className="min-w-[900px] rounded-lg secondbg border dashborder shadow-sm">
                        {/* Header */}
                        <div className="grid grid-cols-12 md:grid-cols-10 gap-2 md:gap-4 md:px-4 border-b dashborder justify-items-center p-2 items-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-200 whitespace-nowrap">
                            <div className="col-span-2">CHALLENGE TITLE</div>
                            <div className="px-3 md:px-0">SOLVERS</div>
                            <div className="px-3 md:px-0">SUBMISSIONS</div>
                            <div className="px-3 md:px-0 relative left-2 right-2">APPROVED</div>
                            <div className="px-3 md:px-0 relative left-2 right-2">REJECTED</div>
                            <div className="px-3 md:px-0">STATUS</div>
                            <div className="px-3 md:px-0 md:col-span-3 col-span-4">ACTIONS</div>
                        </div>

                        {/* Rows */}
                        {challenges.map((challenge) => (
                            <div
                                key={challenge._id}
                                className="grid grid-cols-12 md:grid-cols-10 md:px-4 justify-items-center gap-2 md:gap-4 p-2 items-center text-xs md:text-sm whitespace-nowrap"
                            >
                                <div className="col-span-2 font-medium dashtext text-wrap">{challenge.title}</div>

                                <div className="flex items-center text-gray-600 dark:text-gray-200">
                                    <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {`${challenge.approvedSubmissions?.length || 0}/${challenge.problemSolversNeeded}`}
                                </div>

                                <div className="flex items-center text-gray-600 dark:text-gray-200">
                                    <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {challenge.submissions?.length || 0}
                                </div>

                                <div className="text-[#00bf8f] px-3 md:px-0">
                                    {challenge.approvedSubmissions?.length || 0}
                                </div>

                                <div className="text-red-500 px-3 md:px-0">
                                    {(challenge.submissions?.length || 0) -
                                        (challenge.approvedSubmissions?.length || 0)}
                                </div>

                                <div>
                                    <Badge
                                        variant={getBadgeVariant(challenge.status)}
                                        className="text-xs bg-green-600 text-white dashborder"
                                    >
                                        {challenge.status}
                                    </Badge>
                                </div>

                                <div className="flex flex-row space-x-2 uppercase md:col-span-3 col-span-5">
                                    {/* 🔍 Submissions */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                                        onClick={() => {
                                            setSelectedChallengeForSubmissions(challenge);
                                            setIsReviewOpen(true);
                                            fetchSubmissions(challenge._id);
                                        }}
                                    >
                                        Submissions
                                    </Button>

                                    {/* ✅ Approve */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                                        onClick={() => setChallengeToApprove(challenge)}
                                        disabled={!canApprove(challenge)}
                                    >
                                        Approve
                                    </Button>

                                    {/* 🏁 Complete */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                                        onClick={() => setSelectedChallengeForCompletion(challenge)}
                                    >
                                        Complete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Winner Selector Dialog */}
            {selectedChallengeForCompletion && (
                <WinnerSelectorDialog
                    challenge={selectedChallengeForCompletion}
                    isOpen={!!selectedChallengeForCompletion}
                    onClose={() => setSelectedChallengeForCompletion(null)}
                />
            )}

            {/* Approve Challenge Dialog */}
            {challengeToApprove && (
                <ApproveChallenge
                    open={!!challengeToApprove}
                    onClose={() => setChallengeToApprove(null)}
                    approvedCount={challengeToApprove.approvedSubmissions?.length || 0}
                    problemSolversNeeded={challengeToApprove.problemSolversNeeded}
                    innovator={`${challengeToApprove.innovator?.firstName} ${challengeToApprove.innovator?.lastName}`}
                    approvedProblemSolvers={
                        challengeToApprove.approvedSubmissions?.map((sub: any) => sub.problemSolver) || []
                    }
                    onChatCreated={(chat) => console.log("Chat created:", chat)}
                />
            )}

            {/* All Submissions Dialog */}
            {selectedChallengeForSubmissions && (
                <AllSubmissionsDialog
                    submissions={dynamicSubmissions}
                    isOpen={isReviewOpen}
                    onClose={() => {
                        setIsReviewOpen(false);
                        setSelectedChallengeForSubmissions(null);
                        setDynamicSubmissions([]);
                    }}
                    onApprove={(submission: any) => handleReviewSubmit(true, submission._id)}
                    onReject={(submission: any) => handleReviewSubmit(false, submission._id)}
                />
            )}
        </MainLayout>
    );
}
