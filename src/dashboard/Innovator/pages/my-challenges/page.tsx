import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/dashboard/Innovator/components/ui/badge";
import { MainLayout } from "../../components/layout/main-layout";
import { WinnerSelectorDialog } from "../../components/modals/WinnerSelectorDialog";
import { AllSubmissionsDialog } from "../../components/modals/All-Submission-Dialogue";
import { ApproveChallenge } from "../../components/modals/ApproveChallenge";
import { useChallenges } from "@/hooks/useChallenges";
import { Challenge, challengeApi } from "@/services/challengeService";
import { toast } from "react-hot-toast";

export default function ChallengesPage() {
    const { challenges, loading, error, refetch, setChallenges } = useChallenges();
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

    // 🪄 Auto-open challenge when navigated via notification
    useEffect(() => {
        const openFromNotification = async () => {
            if (challengeId && challenges?.length > 0) {
                const target = challenges.find((c) => c._id === challengeId);
                if (target) {
                    setSelectedChallengeForSubmissions(target);
                    setIsReviewOpen(true);
                    await fetchSubmissions(target._id);
                    window.history.replaceState({}, document.title, "/dashboard/innovator/my-challenges");
                }
            }
        };
        openFromNotification();
    }, [challengeId, challenges]);

    // 📥 Fetch submissions for a specific challenge
    const fetchSubmissions = async (challengeId: string) => {
        try {
            setSubmissionsLoading(true);
            const res = await challengeApi.getChallengeSubmissions(challengeId);
            setDynamicSubmissions(res.data?.submissions || []);
        } catch (err) {
            console.error("fetchSubmissions error:", err);
            setDynamicSubmissions([]);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    // ✅ Approve or reject a submission
    const handleReviewSubmit = async (approved: boolean, submissionId: string) => {
        if (!selectedChallengeForSubmissions?._id) return;
        try {
            const res = await challengeApi.reviewSubmission(
                selectedChallengeForSubmissions._id,
                submissionId,
                approved ? "approve" : "reject"
            );

            const { approvedCount, rejectedCount, submissionCount } = res.data?.data || {};

            // update modal list
            setDynamicSubmissions((prev) =>
                prev.map((sub) =>
                    sub._id === submissionId
                        ? { ...sub, status: approved ? "approved" : "rejected" }
                        : sub
                )
            );

            // update table instantly
            setChallenges((prev) =>
                prev.map((ch) =>
                    ch._id === selectedChallengeForSubmissions._id
                        ? { ...ch, approvedCount, rejectedCount, submissionCount }
                        : ch
                )
            );

            toast.success(`Submission ${approved ? "approved" : "rejected"} successfully`);
            await Promise.all([
                refetch(), // refresh challenge list
                fetchSubmissions(selectedChallengeForSubmissions._id),
            ]);
        } catch (err: any) {
            console.error("review error:", err);
            toast.error("Action failed, please try again later.");
        }
    };

    // ⏱ Periodic refresh
    useEffect(() => {
        const interval = setInterval(() => refetch(), 300000);
        return () => clearInterval(interval);
    }, []);

    const handleChallengeCompleted = () => {
        refetch();
        setSelectedChallengeForCompletion(null);
    };

    const getBadgeVariant = (status: string) => {
        const s = status?.toLowerCase();
        if (s === "active") return "active";
        if (s === "completed") return "completed";
        if (s === "draft") return "draft";
        return "outline";
    };

    if (loading)
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading challenges...</span>
                </div>
            </MainLayout>
        );

    if (error)
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

    return (
        <MainLayout>
            <div className="px-3 py-3 md:p-6 dashbg secondbg rounded-xl">
                <h1 className="mb-4 md:mb-6 text-xl md:text-2xl font-bold dashtext">
                    My Challenges
                </h1>

                <div className="overflow-x-auto">
                    <div className="min-w-[900px] rounded-lg secondbg border dashborder shadow-sm">
                        {/* Header */}
                        <div className="grid grid-cols-12 md:grid-cols-10 gap-2 md:gap-4 md:px-4 border-b dashborder justify-items-center p-2 items-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-200 whitespace-nowrap">
                            <div className="col-span-2">CHALLENGE TITLE</div>
                            <div className="px-3 md:px-0">SOLVERS</div>
                            <div className="px-3 md:px-0">SUBMISSIONS</div>
                            <div className="px-3 md:px-0">APPROVED</div>
                            <div className="px-3 md:px-0">REJECTED</div>
                            <div className="px-3 md:px-0">STATUS</div>
                            <div className="px-3 md:px-0 md:col-span-3 col-span-4">ACTIONS</div>
                        </div>

                        {/* Rows */}
                        {challenges.map((ch) => (
                            <div
                                key={ch._id}
                                className="grid grid-cols-12 md:grid-cols-10 md:px-4 justify-items-center gap-2 md:gap-4 p-2 items-center text-xs md:text-sm whitespace-nowrap"
                            >
                                <div className="col-span-2 font-medium dashtext text-wrap">{ch.title}</div>

                                <div className="flex items-center text-gray-600 dark:text-gray-200">
                                    <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {`${ch.approvedCount || 0}/${ch.problemSolversNeeded}`}
                                </div>

                                <div className="flex items-center text-gray-600 dark:text-gray-200">
                                    <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                    {ch.submissionCount || 0}
                                </div>

                                <div className="text-[#00bf8f] px-3 md:px-0">
                                    {ch.approvedCount || 0}
                                </div>

                                <div className="text-red-500 px-3 md:px-0">
                                    {ch.rejectedCount || 0}
                                </div>

                                <div>
                                    <Badge
                                        variant={getBadgeVariant(ch.status)}
                                        className="text-xs bg-green-600 text-white dashborder"
                                    >
                                        {ch.status}
                                    </Badge>
                                </div>

                                <div className="flex flex-row space-x-2 uppercase md:col-span-3 col-span-5">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black"
                                        onClick={() => {
                                            setSelectedChallengeForSubmissions(ch);
                                            setIsReviewOpen(true);
                                            fetchSubmissions(ch._id);
                                        }}
                                    >
                                        Submissions
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black"
                                        onClick={() => setChallengeToApprove(ch)}
                                        disabled={(ch.approvedCount || 0) < ch.problemSolversNeeded}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black"
                                        onClick={() => setSelectedChallengeForCompletion(ch)}
                                    >
                                        Complete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedChallengeForCompletion && (
                <WinnerSelectorDialog
                    challenge={selectedChallengeForCompletion}
                    isOpen={!!selectedChallengeForCompletion}
                    onClose={() => setSelectedChallengeForCompletion(null)}
                />
            )}

            {challengeToApprove && (
                <ApproveChallenge
                    open={!!challengeToApprove}
                    onClose={() => setChallengeToApprove(null)}
                    approvedCount={challengeToApprove.approvedCount || 0}
                    problemSolversNeeded={challengeToApprove.problemSolversNeeded}
                    innovator={`${challengeToApprove.innovator?.firstName || ""} ${
                        challengeToApprove.innovator?.lastName || ""
                    }`}
                    approvedProblemSolvers={[]}
                    onChatCreated={(chat) => console.log("Chat created:", chat)}
                />
            )}

            {selectedChallengeForSubmissions && (
                <AllSubmissionsDialog
                    submissions={dynamicSubmissions}
                    isOpen={isReviewOpen}
                    onClose={() => {
                        setIsReviewOpen(false);
                        setSelectedChallengeForSubmissions(null);
                        setDynamicSubmissions([]);
                    }}
                    onApprove={(sub: any) => handleReviewSubmit(true, sub._id)}
                    onReject={(sub: any) => handleReviewSubmit(false, sub._id)}
                />
            )}
        </MainLayout>
    );
}
