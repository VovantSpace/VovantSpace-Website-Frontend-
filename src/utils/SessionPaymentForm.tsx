import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import {Button} from "@mui/material";
import {toast} from "react-toastify";

type SessionPaymentFormProps = {
    onSuccess: () => void | Promise<void>;
};

export function SessionPaymentForm({ onSuccess }: SessionPaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            // error is StripeError
            const msg = (error as StripeError).message ?? "Payment failed";
            toast.error(msg);
            setLoading(false);
            return;
        }

        toast.success("Payment successful!");
        await onSuccess();
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button type="submit" disabled={!stripe || loading}>
    {loading ? "Processing..." : "Pay & Book"}
    </Button>
    </form>
);
}