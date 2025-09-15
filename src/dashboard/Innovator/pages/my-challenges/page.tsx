import {useState} from "react";
import {Eye, FileText, Users, Loader2, Search, MoreHorizontal, Play, Pause, TrendingUp,} from "lucide-react";
import {Button} from "@/components/ui/button";
import {MainLayout} from "../../components/layout/main-layout";
import {Badge} from '../../components/ui/badge'
import {WinnerSelectorDialog} from "../../components/modals/WinnerSelectorDialog";
import {AllSubmissionsDialog} from "../../components/modals/All-Submission-Dialogue";
import {ApproveChallenge} from "../../components/modals/ApproveChallenge";
import {useChallenges} from '@/hooks/useChallenges'
import {Challenge} from '@/services/challengeService'
import {challengeApi} from "@/services/challengeService";

export default function ChallengesPage() {
    const {challenges, loading, error, refetch} = useChallenges();
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [challengeToApprove, setChallengeToApprove] = useState<Challenge | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handleReviewSubmit = async (approved: boolean, submissionId: string) => {
        if (!selectedChallenge?._id) return;
        try {
            await challengeApi.reviewSubmission(selectedChallenge._id, submissionId, approved ? 'approve' : 'reject')
            setIsReviewOpen(false);
            refetch();
        } catch (err: any) {
            console.error("Error submitting review:", err.message);
        }
    };

    const canApprove = (challenge: Challenge) => {
        return challenge.approvedSubmissions?.length >= challenge.problemSolversNeeded;
    };

    if (loading) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-64'}>
                    <Loader2 className={'h-8 w-8 animate-spin'}/>
                    <span className={'ml-2'}>Loading challenges</span>
                </div>
            </MainLayout>
        )
    }

    if (error) {
        return (
            <MainLayout>
                <div className={'flex items-center justify-center h-64'}>
                    <div className={'text-center'}>
                        <p className={'text-red-500 mb-4'}>{error}</p>
                        <Button onClick={() => refetch()}>Retry</Button>
                    </div>
                </div>
            </MainLayout>
        )
    }

    const getBadgeVariant = (status: string) => {
        const normalizedStatus = status?.toLowerCase();
        switch (normalizedStatus) {
            case 'active':
                return 'active';
            case 'completed':
                return 'completed'
            case 'draft':
                return 'draft';
            default:
                return 'outline'
        }
    }

    return (
        <MainLayout>
            <div className=" px-3 py-3 md:p-6 dashbg secondbg rounded-xl">
                <h1 className="mb-4 md:mb-6 text-xl md:text-2xl font-bold dashtext">
                    My Challenges
                </h1>

                {/* Responsive Table Container */}
                <div className="overflow-x-auto">
                    <div className="min-w-[900px] rounded-lg secondbg border dashborder shadow-sm">
                        {/* Table Header */}
                        <div
                            className="grid grid-cols-12 md:grid-cols-10 gap-2 md:gap-4 md:px-4 border-b dashborder justify-items-center p-2 items-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-200 whitespace-nowrap">
                            <div className="col-span-2">CHALLENGE TITLE</div>
                            <div className="px-3 md:px-0">SOLVERS</div>
                            <div className="px-3 md:px-0 ">SUBMISSIONS</div>
                            <div className="px-3 md:px-0 relative left-2 right-2">APPROVED</div>
                            <div className="px-3 md:px-0 relative left-2 right-2">REJECTED</div>
                            <div className="px-3 md:px-0">STATUS</div>
                            <div className="px-3 md:px-0 md:col-span-3 col-span-4">ACTIONS</div>
                        </div>

                        {/* Table Rows */}
                        {challenges.map((challenge) => (
                            <div
                                key={challenge._id}
                                className="grid grid-cols-12 md:grid-cols-10 md:px-4 justify-items-center gap-2 md:gap-4 p-2 items-center text-xs md:text-sm whitespace-nowrap"
                            >
                                <div className="col-span-2 font-medium dashtext text-wrap">
                                    {challenge.title}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-200">
                                    <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4"/>
                                    {`${challenge.approvedSubmissions?.length || 0}/${challenge.problemSolversNeeded}`}
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-200">
                                    <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4"/>
                                    {challenge.submissions?.length || 0}
                                </div>
                                <div className="text-[#00bf8f] px-3 md:px-0">
                                    {challenge.approvedSubmissions?.length || 0}
                                </div>
                                <div className="text-red-500 px-3 md:px-0">
                                    {(challenge.submissions?.length || 0) - (challenge.approvedSubmissions?.length || 0)}
                                </div>
                                <div>
                                    <Badge
                                        variant={getBadgeVariant(challenge.status)}
                                        className={'text-xs bg-green-600 text-white dashborder'}
                                    >
                                        {challenge.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-row space-x-2 uppercase md:col-span-3 col-span-5">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                                        onClick={() => {
                                            setSelectedChallenge(challenge);
                                            setIsReviewOpen(true);
                                        }}
                                    >
                                        Submissions
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                                        onClick={() => setChallengeToApprove(challenge)}
                                        disabled={!canApprove(challenge)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="dashbutton text-white text-[11px] py-1.5 px-1.5 uppercase rounded-md dark:hover:text-black w-auto"
                                        onClick={() => setSelectedChallenge(challenge)}
                                    >
                                        Complete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedChallenge && (
                <WinnerSelectorDialog
                    challenge={selectedChallenge}
                    isOpen={!!selectedChallenge}
                    onClose={() => setSelectedChallenge(null)}
                />
            )}

            {challengeToApprove && (
                <ApproveChallenge
                    open={!!challengeToApprove}
                    onClose={() => setChallengeToApprove(null)}
                    approvedCount={challengeToApprove.approvedSubmissions?.length || 0}
                    problemSolversNeeded={challengeToApprove.problemSolversNeeded}
                    innovator={`${challengeToApprove.innovator?.firstName} ${challengeToApprove.innovator?.lastName}`}
                    approvedProblemSolvers={challengeToApprove.approvedSubmissions?.map((sub: any) => sub.problemSolver) || []}
                    onChatCreated={(chat) => console.log("Chat created:", chat)}
                />
            )}

            {selectedChallenge && (
                <AllSubmissionsDialog
                    submissions={selectedChallenge.submissions || []}
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    onApprove={(submissionId: any) => handleReviewSubmit(true, submissionId)}
                    onReject={(submissionId: any) => handleReviewSubmit(false, submissionId)}
                />
            )}
        </MainLayout>
    );
}