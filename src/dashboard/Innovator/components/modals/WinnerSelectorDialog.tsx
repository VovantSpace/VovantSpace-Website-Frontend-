import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {Button} from "../../components/ui/button";
import {challengeApi, Challenge} from "@/services/challengeService";
import {toast} from 'react-hot-toast';

interface ChallengeCompleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    // onBlockChat?: () => void; // Callback to block the chat automatically
    challenge: Challenge | null
    onChallengeCompleted?: () => void; // Callback to handle challenge completion
}

export function WinnerSelectorDialog({
                                         isOpen,
                                         onClose,
                                         challenge,
                                         onChallengeCompleted
                                     }: ChallengeCompleteDialogProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!challenge?._id) return;

        try {
            setIsSubmitting(true);
            const winners = (challenge.approvedSubmissions || []).map((submission) => ({
                problemSolver: submission.problemSolver || submission._id,
                reward: challenge.skillBudgets?.find((sb) => sb.skill === submission.skill)?.budget || 0,
            }))

            const response = await challengeApi.completeChallenge(challenge._id, winners);
            if (response.success) {
                setIsConfirmed(true);
                toast.success("Challenge completed successfully");
                if (onChallengeCompleted) {
                    onChallengeCompleted();
                }
            } else {
                toast.error(response.message || "Failed to complete challenge");
                setIsSubmitting(false);
            }
        } catch (error: any) {
            console.error("Error completing challenge:", error);
            toast.error(error?.response?.data?.message || "Failed to complete challenge");
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsConfirmed(false);
        setIsSubmitting(false);
        onClose();
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md secondbg dashtext p-4 rounded-xl shadow-2xl">
                <DialogHeader className="">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Challenge Completion
                    </DialogTitle>
                </DialogHeader>
                {isConfirmed ? (
                    <div className="text-center">
                        <p className="text-md font-medium mb-4 dashtext">
                            Congratulations, this project is successful. Thank you for choosing VovantSpace.
                        </p>
                        <Button className="dashbutton w-full" onClick={handleClose} disabled={isSubmitting}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <div>
                        <p className="text-md text-center ">
                            Are you sure the challenge "{challenge?.title || 'this challenge'}" has been solved and solution has been
                            completed?
                        </p>
                        <div className="flex justify-center gap-4 mt-3">
                            <Button
                                variant="outline"
                                className="border border-gray-400 dark:text-black"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                No
                            </Button>
                            <Button
                                className="dashbutton"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Completing..." : "Yes"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}