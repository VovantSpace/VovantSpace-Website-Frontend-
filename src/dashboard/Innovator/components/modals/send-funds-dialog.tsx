import { useEffect, useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/dashboard/Innovator/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import api from "@/utils/api"
import { usePayableChallenges } from "@/hooks/useChallenges"

/* ---------------- Types ---------------- */

type PayableChallenge = {
    _id: string
    title: string
    solver: {
        _id: string
        name: string
        email?: string
    }
    maxPayableAmountCents: number // dollars
}

/* ---------------- Component ---------------- */

export function SendFundsDialog({
                                    isOpen,
                                    onClose,
                                }: {
    isOpen: boolean
    onClose: () => void
}) {
    const { data: challenges = [], loading } = usePayableChallenges()

    const [challengeId, setChallengeId] = useState("")
    const [solverId, setSolverId] = useState("")
    const [remark, setRemark] = useState("")
    const [amount, setAmount] = useState("") // dollars (UI)
    const [submitting, setSubmitting] = useState(false)

    const [selectedChallenge, setSelectedChallenge] =
        useState<PayableChallenge | null>(null)

    /* ---------------- Reset on close ---------------- */

    useEffect(() => {
        if (!isOpen) {
            setChallengeId("")
            setSolverId("")
            setRemark("")
            setAmount("")
            setSelectedChallenge(null)
            setSubmitting(false)
        }
    }, [isOpen])

    /* ----- Validation ----- */
    const maxCents = selectedChallenge?.maxPayableAmountCents ?? 0
    const maxDollars = maxCents / 100
    const amountTooHigh = Number(amount) > maxDollars

    /* ---------------- Handlers ---------------- */

    const handleChallengeChange = (id: string) => {
        const found = challenges.find((c) => c._id === id)

        if (!found) {
            setChallengeId("")
            setSolverId("")
            setSelectedChallenge(null)
            return
        }

        setChallengeId(found._id)
        setSolverId(found.solver._id)
        setSelectedChallenge(found)
    }

    useEffect(() => {
        if (selectedChallenge) {
            console.log("selectedChallenge.maxPayableAmount =", selectedChallenge.maxPayableAmountCents)
        }
    }, [selectedChallenge]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const dollars = Number(amount)
        if (!challengeId || !solverId || dollars < 5) return

        const amountInCents = Math.round(dollars * 100)

        setSubmitting(true)
        try {
            await api.post("/wallet/transfer", {
                solverId,
                challengeId,
                amount: amountInCents,
                remark,
            })

            onClose()
        } catch (err: any) {
            alert(err?.response?.data?.message || "Transfer failed")
        } finally {
            setSubmitting(false)
        }
    }

    /* ---------------- Render ---------------- */

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] secondbg dashtext max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <Send className="h-5 w-5" />
                        Send Funds
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                        Release funds to a problem solver after challenge completion.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 mt-4">
                    {/* Challenge selector */}
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium">Challenge</Label>
                        <select
                            value={challengeId}
                            onChange={(e) => handleChallengeChange(e.target.value)}
                            disabled={loading}
                            className="p-2 rounded-md border text-sm secondbg border-gray-600"
                        >
                            <option value="">
                                {loading ? "Loading challenges..." : "Select a challenge"}
                            </option>
                            {challenges.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.title} — {c.solver.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Solver (read-only) */}
                    {selectedChallenge && (
                        <div className="grid gap-2">
                            <Label className="text-sm font-medium">Problem Solver</Label>
                            <Input
                                value={selectedChallenge.solver.name}
                                disabled
                                className="secondbg"
                            />
                        </div>
                    )}

                    {/* Remark */}
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium">Remark</Label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Payment description (optional)"
                            className="secondbg p-2 text-sm rounded-md border border-gray-600"
                            rows={3}
                        />
                    </div>

                    {/* Amount */}
                    <div className="grid gap-2">
                        <Label className="text-sm font-medium">Amount ($)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">$</span>
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
                        {amount && Number(amount) < 5 && (
                            <span className="text-sm text-red-500">
                Minimum payout is $5
              </span>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="dashbutton text-white"
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="dashbutton"
                            disabled={
                                submitting ||
                                loading ||
                                !challengeId ||
                                !solverId ||
                                Number(amount) < 5 ||
                                amountTooHigh
                            }
                        >
                            {submitting ? "Sending..." : "Send Funds"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
