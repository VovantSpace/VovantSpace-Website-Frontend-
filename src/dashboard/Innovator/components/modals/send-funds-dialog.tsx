import { useEffect, useState, useMemo } from "react";
import { Send } from "lucide-react";

import { Button } from "@/dashboard/Innovator/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import api from "@/utils/api";
import { useEscrowEligibleChallenges } from "@/hooks/useEscrowEligibleChallenges";
import { useWallet } from "@/hooks/useWallet";

/* ---------------- Types ---------------- */

type EscrowEligibleChallenge = {
    _id: string;
    title: string;
    totalBudget: number; // cents
    funding?: {
        escrowAmount?: number; // cents
    };
};

export function SendFundsDialog({
                                    isOpen,
                                    onClose,
                                    onSuccess,
                                }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}) {
    const { data: challenges = [], loading } = useEscrowEligibleChallenges();
    const { wallet } = useWallet();

    const availableBalance = wallet?.availableBalance ?? 0;

    const [challengeId, setChallengeId] = useState("");
    const [remark, setRemark] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [selectedChallenge, setSelectedChallenge] =
        useState<EscrowEligibleChallenge | null>(null);

    /* ---------------- Reset ---------------- */

    useEffect(() => {
        if (!isOpen) {
            setChallengeId("");
            setRemark("");
            setAmount("");
            setSelectedChallenge(null);
            setSubmitting(false);
        }
    }, [isOpen]);

    /* ---------------- Calculations ---------------- */

    const remainingCents = useMemo(() => {
        if (!selectedChallenge) return 0;
        const escrowed = selectedChallenge.funding?.escrowAmount ?? 0;
        return selectedChallenge.totalBudget - escrowed;
    }, [selectedChallenge]);

    const remainingDollars = remainingCents / 100;
    const availableDollars = availableBalance / 100;

    const amountNumber = Number(amount);
    const amountInCents = Math.round(amountNumber * 100);

    const amountTooHigh =
      selectedChallenge ? amountInCents > remainingCents || amountInCents > availableBalance
          : false;

    /* ---------------- Handlers ---------------- */

    const handleChallengeChange = (id: string) => {
        const found = challenges.find((c) => String(c._id) === id);
        if (!found) {
            setSelectedChallenge(null);
            return;
        }
        setChallengeId(found._id);
        setSelectedChallenge(found);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!challengeId || amountNumber < 5 || amountTooHigh) return;

        setSubmitting(true);
        try {
            await api.post("/wallet/escrow", {
                challengeId,
                amount: amountInCents,
                remark,
            });

            await onSuccess();
            onClose();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Escrow failed");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        console.log("Wallet raw:", wallet);
        console.log("Available balance (raw):", availableBalance);
        console.log("selected Challenge: ", selectedChallenge)
        console.log("challenges:", challenges);
    }, [wallet])

    /* ---------------- Render ---------------- */

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] secondbg dashtext max-h-[85vh] flex flex-col p-6">

                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <Send className="h-5 w-5" />
                        Lock Funds in Escrow
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                        Funds will be locked securely until you release them.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Content */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden mt-4"
                >
                    <div className="flex-1 overflow-y-auto space-y-5 pr-1">

                        {/* Wallet Info */}
                        <div className="text-sm text-gray-400">
                            Available Balance:{" "}
                            <span className="text-white font-semibold">
                                ${availableDollars.toFixed(2)}
                            </span>
                        </div>

                        {/* Challenge Selector */}
                        <div className="grid gap-2">
                            <Label>Challenge</Label>
                            <select
                                value={challengeId}
                                onChange={(e) => handleChallengeChange(e.target.value)}
                                disabled={loading}
                                className="p-2 rounded-md border text-sm secondbg border-gray-600"
                            >
                                <option value="">
                                    {loading ? "Loading..." : "Select a challenge"}
                                </option>
                                {challenges.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Remaining Budget */}
                        {selectedChallenge && (
                            <div className="text-sm text-gray-400">
                                Remaining Budget:{" "}
                                <span className="text-white font-semibold">
                                    ${remainingDollars.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {/* Amount */}
                        <div className="grid gap-2">
                            <Label>Amount ($)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">
                                    $
                                </span>
                                <Input
                                    type="number"
                                    min={5}
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="secondbg pl-8"
                                    placeholder="0.00"
                                />
                            </div>

                            {amountNumber > 0 && amountNumber < 5 && (
                                <span className="text-sm text-red-500">
                                    Minimum escrow amount is $5
                                </span>
                            )}

                            {amountTooHigh && (
                                <span className="text-sm text-red-500">
                                    Amount exceeds available balance or remaining budget
                                </span>
                            )}
                        </div>

                        {/* Remark */}
                        <div className="grid gap-2">
                            <Label>Remark (Optional)</Label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Payment description"
                                className="secondbg p-2 text-sm rounded-md border border-gray-600"
                                rows={3}
                            />
                        </div>

                        {/* Preview */}
                        {selectedChallenge && amountNumber > 0 && !amountTooHigh && (
                            <div className="bg-gray-800 rounded-md p-3 text-sm text-gray-300">
                                You are locking{" "}
                                <span className="text-white font-semibold">
                                    ${amountNumber.toFixed(2)}
                                </span>{" "}
                                into escrow.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                submitting ||
                                loading ||
                                !challengeId ||
                                amountNumber < 5 ||
                                amountTooHigh
                            }
                        >
                            {submitting ? "Locking..." : "Lock Funds"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
