import { useState, useEffect } from "react";
import { Button } from "@/dashboard/ProblemSolver/components/ui/button";
import { Card } from "@/dashboard/Innovator/components/ui/card";
import { MainLayout } from "@/dashboard/ProblemSolver/components/layout/main-layout";
import { WithdrawFundDialog } from "../../components/modals/WithdrawFundsDialog";
import { SolverSendDialog } from "@/dashboard/ProblemSolver/components/modals/SolverSendDialog";
import { SendFundSettingsDialog } from "@/dashboard/Innovator/components/modals/SendFundSettingsDialog";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { getSocket } from "@/lib/socket";
import api from "@/utils/api";
import { toast } from "react-hot-toast";

export default function WalletPage() {
    const [WithdrawFundOpen, setIsWithdrawFundOpen] = useState(false);
    const [isSendFundsOpen, setIsSendFundsOpen] = useState(false);
    const [isSendFundsSettingsOpen, setIsSendFundsSettingsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("All Time");
    const [refreshing, setRefreshing] = useState(false);

    const {
        wallet,
        setWallet,
        history,
        refetch,
        refetchHistory,
        stats,
        stripeStatus,
        isLoading
    } = useWallet();

    /* ----------------------------
       Stripe onboarding redirect
    ----------------------------- */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get("onboarding") === "success") {
            toast.success("Stripe account connected successfully 🎉");
            refetch();
        }

        if (params.get("refresh") === "true") {
            toast("Please complete Stripe onboarding to enable payouts.");
        }
    }, []);

    /* ----------------------------
       Socket live wallet update
    ----------------------------- */
    useEffect(() => {
        const socket = getSocket();

        const handleWalletUpdate = async () => {
            await refetch();
            await refetchHistory?.();
        }

        socket.on("wallet:updated", handleWalletUpdate);

        return () => {
            socket.off("wallet:updated", handleWalletUpdate);
        }

    }, [refetch, refetchHistory]);

    console.log("History state:", history);

    /* ----------------------------
       Stripe onboarding handler
    ----------------------------- */
    const handleStripeOnboarding = async () => {
        try {
            await api.post("/connect/create");

            const res = await api.get("/connect/onboard");

            if (res.data?.url) {
                window.location.href = res.data.url;
            }

        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to start onboarding");
        }
    };

    /* ----------------------------
       Manual refresh
    ----------------------------- */
    const handleRefresh = async () => {
        if (refreshing) return;

        try {
            setRefreshing(true);

            await Promise.all([
                refetch?.(),
                refetchHistory?.(),
            ]);

        } catch (err) {
            console.error("Refresh failed:", err);
        } finally {
            setRefreshing(false);
        }
    };

    /* ----------------------------
       Stripe not ready UI
    ----------------------------- */
    if (!stripeStatus) return null;

    if (!stripeStatus.payoutsEnabled) {
        return (
            <MainLayout>
                <div className="p-6">
                    <Card className="secondbg p-6 text-center space-y-4">
                        <h3 className="text-xl font-semibold text-white">
                            Connect Stripe to Withdraw Funds
                        </h3>
                        <p className="text-gray-400">
                            You must connect your Stripe account before withdrawing.
                        </p>
                        <Button onClick={handleStripeOnboarding} className="dashbutton">
                            Connect Stripe Account
                        </Button>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    if (isLoading) {
        return (
            <MainLayout>
                <div className={'flex min-h-[60vh] flex-col items-center justify-center gap-3'}>
                    <RefreshCw className={'h-8 w-8 animate-spin text-[#00bf8f]'}/>
                    <p className={'text-sm text-gray-400'}>Loading wallet...</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6 md:p-6 px-3 pt-2">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold dashtext">Wallet</h1>
                        <p className="text-sm text-gray-400">
                            Manage your wallet and transactions
                        </p>
                    </div>
                    <Button
                        className="dashbutton"
                        onClick={() => setIsSendFundsSettingsOpen(true)}
                    >
                        Wallet Settings
                    </Button>
                </div>

                {/* Wallet Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">
                            Available Balance
                        </div>
                        <div className="text-2xl font-bold dashtext">
                            ${((wallet?.availableBalance ?? 0) / 100).toFixed(2)}
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">
                            Total Withdrawals
                        </div>
                        <div className="text-2xl font-bold dashtext">
                            {stats?.totalWithdrawals ?? 0}
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">
                            Pending Withdrawals
                        </div>
                        <div className="text-2xl font-bold dashtext">
                            {stats?.pendingWithdrawals ?? 0}
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">
                            Successful Withdrawals
                        </div>
                        <div className="text-2xl font-bold dashtext">
                            {stats?.successfulWithdrawals ?? 0}
                        </div>
                    </Card>
                </div>

                {/* Withdraw Button */}
                <Card
                    className={`dashbutton p-6 transition-colors ${
                        stripeStatus.payoutsEnabled
                            ? "cursor-pointer hover:secondbg"
                            : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() =>
                        stripeStatus.payoutsEnabled && setIsWithdrawFundOpen(true)
                    }
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-full secondbg p-3">
                            <ArrowUpRight className="h-6 w-6 text-[#00bf8f]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Withdraw Funds</h3>
                            {!stripeStatus.payoutsEnabled && (
                                <p className="text-sm text-red-400">
                                    Stripe verification still in progress
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Transactions */}
                <div className="rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold dashtext">
                            Transactions History
                        </h2>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="p-2 rounded-md border bg-white dark:bg-gray-800"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                            />
                        </button>
                    </div>

                    {history && history.length > 0 ? (
                        history.map((tx) => {
                            const isCredit = tx.type === "credit";

                            return (
                                <Card key={tx._id} className="secondbg rounded-none">
                                    <div className="p-2 flex justify-between">
                                        <div>
                                            <h3 className="font-semibold dashtext capitalize">
                                                {tx.source.replace(/_/g, " ")}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div
                                            className={`text-lg font-semibold ${
                                                isCredit ? "text-[#00bf8f]" : "text-red-600"
                                            }`}
                                        >
                                            {isCredit ? "+" : "-"}$
                                            {(tx.amount / 100).toFixed(2)}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-sm">No transactions found.</p>
                    )}
                </div>

                <WithdrawFundDialog
                    isOpen={WithdrawFundOpen}
                    onSuccess={async () => {
                        await refetch();
                        await refetchHistory?.();
                    }}
                    onClose={() => setIsWithdrawFundOpen(false)}
                />

                <SolverSendDialog
                    isOpen={isSendFundsOpen}
                    onClose={() => setIsSendFundsOpen(false)}
                />

                <SendFundSettingsDialog
                    isOpen={isSendFundsSettingsOpen}
                    onClose={() => setIsSendFundsSettingsOpen(false)}
                />
            </div>
        </MainLayout>
    );
}