import {useState, useEffect} from "react";
import {Button} from "@/dashboard/Innovator/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/dashboard/Innovator/components/ui/dialog";
import {Avatar, AvatarImage} from "@/dashboard/Innovator/components/ui/avatar";
import {FullProfileDialog} from "./ViewPSFullProfile";
import {Submission} from "@/types/submission";
import {getPublicProfile} from "@/services/publicProfilePicture";
import {User} from "@/hooks/notificationService";
import {getImageUrl} from "@/utils/imageHelpers";

interface SubmissionDetailsDialogProps {
    submission: Submission | null;
    isOpen: boolean;
    onClose: () => void;
    onApprove?: (submission: Submission) => void;
    onReject?: (submission: Submission) => void;
}

export function SubmissionDetailsDialog({
                                            submission,
                                            isOpen,
                                            onClose,
                                            onApprove,
                                            onReject,
                                        }: SubmissionDetailsDialogProps) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch the Problem Solver’s live profile (only if not already populated)
    useEffect(() => {
        const fetchProfile = async () => {
            if (!submission || !submission.problemSolver || !submission?.problemSolver?._id) {
                console.warn('No problemSolver data in submission:', submission);
                setProfileData(null);
                return;
            }

            // Skip fetch if already populated with real data
            if (submission.problemSolver.firstName && submission.problemSolver.lastName) {
                setProfileData(submission.problemSolver as unknown as User);
                return;
            }

            try {
                setLoading(true);
                const data = await getPublicProfile(submission.problemSolver._id);
                setProfileData(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [submission])

    // ✅ Utility: Safely get a full name
    const getFullName = () => {
        const first = profileData?.firstName || submission?.problemSolver?.firstName || "";
        const last = profileData?.lastName || submission?.problemSolver?.lastName || "";
        return `${first} ${last}`.trim() || "No name available";
    };

    // ✅ Utility: Safely get skills
    const getSkills = () =>
        (profileData?.skills || submission?.problemSolver?.skills || []).join(", ") || "No skills listed";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="secondbg dashtext max-w-2xl max-h-[90vh] overflow-y-auto border-[#2a3142]">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between text-xl">
                        Submission Details
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <p className="text-center text-gray-400">Loading profile...</p>
                ) : error ? (
                    <p className="text-center text-red-400">{error}</p>
                ) : (
                    <div className="space-y-6">
                        {/* =================== Profile Section =================== */}
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage
                                    src={getImageUrl(
                                        profileData?.profilePicture || submission?.problemSolver?.profilePicture,
                                        getFullName()
                                    )}
                                />
                            </Avatar>

                            <div className="space-y-1 flex-grow">
                                <h2 className="text-xl font-semibold dashtext">{getFullName()}</h2>

                                {(profileData?.experience || submission?.problemSolver?.experience) && (
                                    <p className="text-gray-300 text-sm">
                                        {profileData?.experience || submission?.problemSolver?.experience}
                                    </p>
                                )}

                                {(profileData?.skills?.length || submission?.problemSolver?.skills?.length) && (
                                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                                        <span className="text-gray-300 text-sm">{getSkills()}</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => setProfileOpen(true)}
                                    className="text-emerald-400 text-sm hover:underline mt-1"
                                >
                                    View Full Profile →
                                </button>
                            </div>
                        </div>

                        {/* =================== Solution Summary =================== */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium dashtext">Solution Summary</h3>
                            <div
                                className="dark:text-gray-300 text-black text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: submission?.solutionSummary || "No summary provided.",
                                }}
                            />
                        </div>

                        {/* =================== Action Buttons =================== */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                onClick={() => submission && onReject?.(submission)}
                                className="bg-red-700 text-white border hover:bg-red-800 border-red-500/30"
                            >
                                Reject
                            </Button>
                            <Button
                                onClick={() => submission && onApprove?.(submission)}
                                className="bg-green-700 text-white border hover:bg-green-800 border-[#00bf8f]/30"
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>

            {/* =================== Full Profile Modal =================== */}
            {profileData && (
                <FullProfileDialog
                    profile={profileData}
                    isOpen={profileOpen}
                    onClose={() => setProfileOpen(false)}
                />
            )}
        </Dialog>
    );
}
