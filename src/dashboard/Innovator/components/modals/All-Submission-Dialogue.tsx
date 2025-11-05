import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/dashboard/Innovator/components/ui/button"
import { Avatar, AvatarImage } from "@/dashboard/Innovator/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/dashboard/Innovator/components/ui/dialog"
import { SubmissionDetailsDialog } from "./SubmissionDetailsDialog"
import { Submission } from "@/types/submission"
import {getImageUrl} from '@/utils/imageHelpers';

interface AllSubmissionsDialogProps {
    submissions: Submission[]
    isOpen: boolean
    onClose: () => void
    onApprove?: (submission: Submission) => void
    onReject?: (submission: Submission) => void
}

export function AllSubmissionsDialog({
                                         submissions,
                                         isOpen,
                                         onClose,
                                         onApprove,
                                         onReject,
                                     }: AllSubmissionsDialogProps) {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

    const safeSubmissions = Array.isArray(submissions) ? submissions : []

    useEffect(() => {
        if (!open) {
            setSelectedSubmission(null)
        }
    }, [isOpen])

    return (
        <>
            {/* =================== MAIN DIALOG =================== */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="secondbg dashtext md:max-w-2xl max-h-[90vh] overflow-y-auto border-[#2a3142] transition-all duration-300">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between text-xl">
                            All Submissions
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {safeSubmissions.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center">No submissions yet.</p>
                        ) : (
                            safeSubmissions.map((submission) => (
                                <div
                                    key={submission._id}
                                    className="secondbg p-4 rounded-xl flex items-center hover:bg-[#1a2230] transition-colors border border-[#2a3142]"
                                >
                                    <div className="md:flex items-center justify-between w-full">
                                        {/* === Avatar + Info === */}
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-14 w-14 border dashborder">
                                                <AvatarImage
                                                    src={getImageUrl(
                                                        submission.problemSolver?.profilePicture,
                                                        `${submission.problemSolver?.firstName} ${submission.problemSolver?.lastName}`
                                                    )}
                                                />
                                            </Avatar>

                                            <div>
                                                <h2 className="text-lg font-semibold dashtext flex items-center gap-2">
                                                    {submission.problemSolver?.firstName}{" "}
                                                    {submission.problemSolver?.lastName}
                                                </h2>
                                                <p className="text-[#6b7280] text-sm">
                                                    {submission.problemSolver?.title || "No title"}
                                                </p>
                                                <div className="flex items-center mt-2 gap-2 text-sm text-[#6b7280]">
                                                    <span>{submission.problemSolver?.rate || "—"}$</span>
                                                    <div className="h-1 w-1 bg-[#4a5568] rounded-full" />
                                                    <span>
                            {submission.problemSolver?.successRate || "—"} Job Success
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* === Action Buttons === */}
                                        <div className="flex gap-2 md:mt-0 mt-6">
                                            <Button
                                                variant="outline"
                                                className="dashbutton text-white border"
                                                onClick={() => {
                                                    console.log("✅ Selected submission:", submission)
                                                    setSelectedSubmission(submission)
                                                }}
                                            >
                                                <span>Details</span>
                                                <ChevronRight className="h-4 w-4 text-[#6b7280]" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* =================== CHILD DIALOG (DETAILS) =================== */}
            {selectedSubmission && (
                <SubmissionDetailsDialog
                    submission={selectedSubmission}
                    isOpen={!!selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onApprove={(sub) => {
                        onApprove?.(sub)
                        setSelectedSubmission(null) // auto-close after approve
                    }}
                    onReject={(sub) => {
                        onReject?.(sub)
                        setSelectedSubmission(null) // auto-close after reject
                    }}
                />
            )}
        </>
    )
}
