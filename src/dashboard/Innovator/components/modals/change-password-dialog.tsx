import type React from "react"

import {useState} from "react"
import {Lock} from "lucide-react"

import {Button} from "@/dashboard/Innovator/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import {Input} from "../../components/ui/input"
import {Label} from "../../components/ui/label"
import {useChangePassword} from "@/hooks/useChangePassword"

export function ChangePasswordDialog({
                                         isOpen,
                                         onClose,
                                     }: {
    isOpen: boolean
    onClose: () => void
}) {
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const {changePassword, isLoading, error, successMessage, setError, setSuccessMessage} = useChangePassword();

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccessMessage("");
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        const result = await changePassword({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        if (result?.success) {
            setTimeout(() => {
                handleClose();
            }, 1000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="secondbg dashtext sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5"/>
                        Change Password
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Make sure your new password is secure and easy to remember.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" className="mt-2 secondbg" required/>
                        </div>
                        <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" className="mt-2 secondbg" required/>
                        </div>
                        <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" className="mt-2 secondbg" required/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="secondbg">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#00bf8f] hover:bg-[#31473A]" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

