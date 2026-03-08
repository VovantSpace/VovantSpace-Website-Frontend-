import type React from "react";
import { useState } from "react";
import { DollarSign } from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

import { Button } from "@/dashboard/Innovator/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/dashboard/Innovator/components/ui/dialog";
import { Input } from "@/dashboard/Innovator/components/ui/input";
import { Label } from "@/dashboard/Innovator/components/ui/label";

export function WithdrawFundDialog({
                                       isOpen,
                                       onClose,
    onSuccess
                                   }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount < 5) {
            toast.error("Minimum withdrawal is $5");
            return;
        }

        try {
            setIsLoading(true);

            await api.post("/wallet/withdraw", {
                amount: Math.round(numericAmount * 100), // send cents
            });

            toast.success("Withdrawal request submitted for approval");

            setAmount("");
            onClose();
            onSuccess?.();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Withdrawal failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="secondbg dashtext sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Withdraw Funds
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 pb-4">
                        <div>
                            <Label htmlFor="amount">Amount (USD)</Label>
                            <div className="relative mt-2">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    id="amount"
                                    type="number"
                                    min={5}
                                    step="0.01"
                                    placeholder="Enter Amount"
                                    className="secondbg pl-10"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {amount && Number(amount) < 5 && (
                            <span className="text-sm font-medium text-red-500">
                Minimum withdrawal is $5
              </span>
                        )}

                        <div className="text-sm text-gray-400">
                            Funds will be sent to your connected Stripe payout method.
                            Processing may take 1–3 business days.
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="dashbutton w-full"
                            disabled={isLoading || Number(amount) < 5}
                        >
                            {isLoading ? "Submitting..." : "Request Withdrawal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}