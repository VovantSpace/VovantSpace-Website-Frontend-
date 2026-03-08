import {useEffect, useState} from "react";
import {Send} from "lucide-react";

import {Button} from "@/dashboard/Innovator/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader, DialogTitle
} from "../ui/dialog";
import {Label} from  "../../components/ui/label";
import api from "@/utils/api";
import {usePayableChallenges} from "@/hooks/useChallenges";

type PayableChallenge = {
    _id: string;
    title: string;
    solver: {
        _id: string;
        name: string;
        email?: string;
    };
    maxPayableAmountCents: number;
}

export function ReleaseFundsDialog({
    isOpen,
    onClose,
    onSuccess,
                                   }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>
}) {
    const {data: challenges = [], loading} = usePayableChallenges();

    const [selected, setSelected] = useState<PayableChallenge | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSelected(null);
            setSubmitting(false);
        }
    }, [isOpen]);

    const handleChange = (id: string) => {
        const found = challenges.find((c) => c._id === id);
        setSelected(found ?? null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selected) return;

        setSubmitting(true);
        try {
            await api.post("/wallet/transfer", {
                challengeId: selected._id,
                solverId: selected.solver._id,
            })

            await onSuccess();
            onClose();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Release failed");
        } finally {
            setSubmitting(false);
        }
    }

    const amountDollars = selected ? selected.maxPayableAmountCents / 100 : 0;


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={'sm:max-w-[425px] secondbg dashtext p-6'}>
                <DialogHeader>
                    <DialogTitle className={'flex items-center gap-2 text-xl font-semibold'}>
                        <Send className={'h-5 w-5'}/>
                        Release Funds
                    </DialogTitle>
                    <DialogDescription className={'text-gray-400 text-sm'}>
                        Release escrowed funds to the problem solver after completion.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className={'grid gap-6 mt-4'}>
                    {/* Challenge selector */}
                    <div className={'grid gap-2'}>
                        <Label className={'text-sm font-medium'}>Challenge</Label>
                        <select
                            disabled={loading}
                            value={selected?._id ?? ""}
                            onChange={(e) => handleChange(e.target.value)}
                            className={'p-2 rounded-md border text-sm secondbg border-gray-600'}
                        >
                            <option value="">
                                {loading ? "Loading challenges..." : "Select a challenge"}
                            </option>
                            {challenges.map((c) => (
                                <option value={c._id} key={c._id}>
                                    {c.title} - {c.solver.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/*  Summary  */}
                    {selected && (
                        <div className={'rounded-md border border-gray-600 p-3 text-sm'}>
                            <p>
                                <span className={'text-gray-400'}>Solver:</span>{" "}
                                <span className={'font-semibold'}>{selected.solver.name}</span>
                            </p>
                            <p className={'mt-1'}>
                                <span className={'text-gray-400'}>Amount:</span>{" "}
                                <span className={'font-semibold text-green-400'}>
                                    ${amountDollars.toFixed(2)}
                                </span>
                            </p>
                        </div>
                    )}

                    <DialogFooter className={'pt-4'}>
                        <Button
                            type={"button"}
                            variant={"outline"}
                            onClick={onClose}
                            className={'dashbutton text-white'}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type={"submit"}
                            className={'dashbutton'}
                            disabled={submitting || loading || !selected}
                        >
                            {submitting ? "Releasing..." : "Release Funds"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
