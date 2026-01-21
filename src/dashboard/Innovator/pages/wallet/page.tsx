import { useState, useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";

import { MainLayout } from "@/dashboard/Innovator/components/layout/main-layout";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Card } from "@/dashboard/Innovator/components/ui/card";

import { FundWalletDialog } from "@/dashboard/Innovator/components/modals/fund-wallet-dialog";
import { SendFundsDialog } from "@/dashboard/Innovator/components/modals/send-funds-dialog";
import { SendFundSettingsDialog } from "../../components/modals/SendFundSettingsDialog";

import { useWallet } from "@/hooks/useWallet";

function formatMoneyMinor(amountMinor: number) {
    return `$${(amountMinor / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function humanizeSource(source: string) {
    return source.replace(/_/g, " ");
}

export default function WalletPage() {
    const [isFundWalletOpen, setIsFundWalletOpen] = useState(false);
    const [isSendFundsOpen, setIsSendFundsOpen] = useState(false);
    const [isSendFundsSettingsOpen, setIsSendFundsSettingsOpen] = useState(false);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("All Time");

    const {
        wallet,
        history,
        loading,
        historyLoading,
        refetch,
        refetchHistory,
    } = useWallet();

    // NOTE: Your backend history endpoint supports page/limit. This is a "recent" view.
    const refreshAll = async () => {
        await Promise.all([refetch(), refetchHistory(1, 10)]);
    };

    const available = wallet?.availableBalance ?? 0;
    const locked = wallet?.lockedBalance ?? 0;

    // Small “frontend stats” (since ledger doesn’t include pending/success by default)
    const derivedStats = useMemo(() => {
        const total = history.length;
        const credits = history.filter((h) => h.type === "credit").length;
        const debits = history.filter((h) => h.type === "debit").length;
        return { total, credits, debits };
    }, [history]);

    return (
        <MainLayout>
            <div className="space-y-6 md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold dashtext">Wallet</h1>
                        <p className="text-sm text-gray-400">
                            Manage your wallet and transactions
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            className="dashbutton"
                            onClick={() => setIsSendFundsSettingsOpen(true)}
                        >
                            Wallet Settings
                        </Button>
                    </div>
                </div>

                {/* Top cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">Available Balance</div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold dashtext">
                                {loading ? "…" : formatMoneyMinor(available)}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-[#00bf8f]"
                                title="Available balance"
                            >
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">Locked Balance</div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold dashtext">
                                {loading ? "…" : formatMoneyMinor(locked)}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-[#00bf8f]"
                                title="Locked balance"
                            >
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">Total Activity</div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold dashtext">
                                {historyLoading ? "…" : derivedStats.total}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-[#00bf8f]"
                                title="Total ledger entries loaded"
                            >
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">Credits / Debits</div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold dashtext">
                                {historyLoading ? "…" : `${derivedStats.credits}/${derivedStats.debits}`}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-[#00bf8f]"
                                title="Credits vs Debits (loaded)"
                            >
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Actions */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card
                        className="dashbutton p-6 transition-colors hover:secondbg cursor-pointer"
                        onClick={() => setIsFundWalletOpen(true)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-full secondbg p-3">
                                <ArrowDownRight className="h-6 w-6 text-[#00bf8f]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Fund Wallet</h3>
                                <p className="text-sm text-gray-300">Add funds to your wallet</p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="dashbutton p-6 transition-colors hover:secondbg cursor-pointer"
                        onClick={() => setIsSendFundsOpen(true)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-full secondbg p-3">
                                <ArrowUpRight className="h-6 w-6 text-[#00bf8f]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Send Funds</h3>
                                <p className="text-sm text-gray-300">
                                    Transfer funds to others
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* History */}
                <div className="rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold dashtext">Transactions History</h2>

                        <div className="flex items-center gap-2">
                            {/* Period dropdown (UI-only for now) */}
                            <div className="relative inline-block text-left">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    aria-haspopup="true"
                                    aria-expanded={dropdownOpen ? "true" : "false"}
                                >
                                    {selectedPeriod}
                                    <svg
                                        className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${
                                            dropdownOpen ? "rotate-180" : ""
                                        }`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                        <div className="py-1">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedPeriod("All Time");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                All Time
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedPeriod("This Month");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                This Month
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setSelectedPeriod("This Week");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                This Week
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Refresh */}
                            <button
                                type="button"
                                onClick={refreshAll}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                title="Refresh"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${
                                        loading || historyLoading ? "animate-spin" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Loading / Empty */}
                    {historyLoading && (
                        <Card className="secondbg rounded-none">
                            <div className="p-4 text-sm text-gray-400">Loading history…</div>
                        </Card>
                    )}

                    {!historyLoading && history.length === 0 && (
                        <Card className="secondbg rounded-none">
                            <div className="p-4 text-sm text-gray-400">
                                No wallet activity yet.
                            </div>
                        </Card>
                    )}

                    {/* History list */}
                    {!historyLoading &&
                        history.length > 0 &&
                        history.map((entry) => {
                            const isCredit = entry.type === "credit";

                            return (
                                <Card key={entry._id} className="secondbg rounded-none">
                                    <div className="p-2">
                                        <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 py-2 px-3">
                                            <div className="flex items-center gap-4">
                                                <div className="secondbg p-2">
                                                    {isCredit ? (
                                                        <ArrowDownRight className="h-4 w-4 text-[#00bf8f]" />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                                                    )}
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold dashtext capitalize">
                                                        {humanizeSource(entry.source)}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        {formatDate(entry.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className={`text-lg font-semibold ${
                                                    isCredit ? "text-[#00bf8f]" : "text-red-600"
                                                }`}
                                            >
                                                {isCredit ? "+" : "-"}
                                                {formatMoneyMinor(entry.amount)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                </div>

                {/* Dialogs */}
                <FundWalletDialog
                    isOpen={isFundWalletOpen}
                    onClose={() => setIsFundWalletOpen(false)}
                />

                <SendFundsDialog
                    isOpen={isSendFundsOpen}
                    onClose={() => setIsSendFundsOpen(false)}
                />

                <SendFundSettingsDialog
                    isOpen={isSendFundsSettingsOpen}
                    onClose={() => setIsSendFundsSettingsOpen}
                />
            </div>
        </MainLayout>
    );
}