import type React from "react";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { DollarSign } from "lucide-react";
import { stripePromise } from "@/lib/stripe";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

/* ---------------- Inner Form ---------------- */

function FundWalletForm({
                            clientSecret,
                            onClose,
                        }: {
    clientSecret: string;
    onClose: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        setError(null);

        try {
            // Ensure PaymentElement is mounted & validates inputs
            const submitRes = await elements.submit()
            if (submitRes?.error) {
                setError(submitRes.error.message || "Please check your payment details")
                setIsLoading(false);
                return;
            }

            const result = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (result.error) {
                setError(result.error.message || "Payment failed");
                setIsLoading(false);
                return;
            }

            // ✅ Payment succeeded (webhook will credit wallet)
            onClose();
        } catch (err: any) {
            setError(err?.message || "Payment failed");
        } finally {
            setIsLoading(false);
        }
    };
    const ready = !!stripe && !!elements;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />

            {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <Button type="submit" className="dashbutton w-full" disabled={!ready || isLoading}>
                {isLoading ? "Processing..." : "Add Funds"}
            </Button>
        </form>
    );
}

/* ---------------- Dialog Wrapper ---------------- */

export function FundWalletDialog({
                                     isOpen,
                                     onClose,
                                 }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [amount, setAmount] = useState("");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const numericAmount = Number(amount);

    const initializePayment = async () => {
        if (numericAmount < 5) return;

        setIsInitializing(true);
        try {
            const res = await api.post("/wallet/topup", {
                amount: numericAmount,
                currency: "usd",
            });

            setClientSecret(res.data.clientSecret);
        } catch (err) {
            console.error("Failed to initialize wallet topup:", err);
        } finally {
            setIsInitializing(false);
        }
    };

    // Reset when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setClientSecret(null);
            setAmount("");
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="secondbg dashtext sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Fund Wallet
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: Amount */}
                {!clientSecret && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min={5}
                                placeholder="Enter amount"
                                className="secondbg mt-2"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            {amount && numericAmount < 5 && (
                                <p className="text-sm text-red-500 mt-1">
                                    Minimum amount is $5
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={initializePayment}
                                className="dashbutton w-full"
                                disabled={numericAmount < 5 || isInitializing}
                            >
                                {isInitializing ? "Initializing..." : "Continue"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* Step 2: Stripe Payment */}
                {clientSecret && (
                    <Elements
                        stripe={stripePromise}
                        options={{ clientSecret }}
                    >
                        <FundWalletForm
                            clientSecret={clientSecret}
                            onClose={onClose}
                        />
                    </Elements>
                )}
            </DialogContent>
        </Dialog>
    );
}