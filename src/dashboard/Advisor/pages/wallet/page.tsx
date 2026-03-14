import { useMemo, useState } from "react";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Card } from "@/dashboard/Innovator/components/ui/card";
import { MainLayout } from "@/dashboard/component/main-layout";
import { WithdrawFundDialog } from "@/dashboard/ProblemSolver/components/modals/WithdrawFundsDialog";
import { SendFundSettingsDialog } from "@/dashboard/Innovator/components/modals/SendFundSettingsDialog";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

function formatMoney(amountInMinor: number, currency = "USD") {
    const value = (amountInMinor ?? 0) / 100;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(value);
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function getHistoryLabel(source?: string) {
    switch (source) {
        case "wallet_topup":
            return "Wallet funding";
        case "session_release":
            return "Session payment received";
        case "session_lock":
            return "Session booking";
        case "refund":
            return "Refund";
        case "withdrawal":
            return "Withdrawal";
        case "withdrawal_request":
            return "Withdrawal request";
        case "escrow_lock":
            return "Funds locked in escrow";
        case "escrow_release":
            return "Escrow released";
        default:
            return source || "Transaction";
    }
}

function HistoryRow({ tx }: { tx: any }) {
    const isPositive = tx.type === "credit";
    const amountText = `${isPositive ? "+" : "-"}${formatMoney(
        tx.amount,
        (tx.currency || "USD").toUpperCase()
    )}`;

    return (
        <Card className="secondbg rounded-none">
            <div className="p-2">
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 py-2 px-3">
                    <div className="flex items-center gap-4">
                        <div className="secondbg p-2">
                            {isPositive ? (
                                <ArrowUpRight className="h-4 w-4 text-[#00bf8f]" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 text-[#00bf8f]" />
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold dashtext">{getHistoryLabel(tx.source)}</h3>
                            <p className="text-sm text-gray-400">{formatDate(tx.createdAt)}</p>
                        </div>
                    </div>

                    <div className={`text-lg font-semibold ${isPositive ? "text-[#00bf8f]" : "text-red-600"}`}>
                        {amountText}
                    </div>
                </div>
            </div>
        </Card>
    );
}

function WalletPageSkeleton() {
    return (
        <div className="space-y-6 md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 animate-pulse">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-32 rounded bg-gray-300 dark:bg-gray-700" />
                    <div className="h-4 w-56 rounded bg-gray-300 dark:bg-gray-700" />
                </div>
                <div className="h-10 w-36 rounded bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="secondbg p-6">
                        <div className="space-y-3">
                            <div className="h-4 w-28 rounded bg-gray-300 dark:bg-gray-700" />
                            <div className="h-8 w-24 rounded bg-gray-300 dark:bg-gray-700" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="secondbg p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-700" />
                            <div className="h-3 w-40 rounded bg-gray-300 dark:bg-gray-700" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-3">
                <div className="h-6 w-48 rounded bg-gray-300 dark:bg-gray-700" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="secondbg p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-4 w-40 rounded bg-gray-300 dark:bg-gray-700" />
                                <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-700" />
                            </div>
                            <div className="h-5 w-20 rounded bg-gray-300 dark:bg-gray-700" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function WalletPage() {
    const [isWithdrawFundOpen, setIsWithdrawFundOpen] = useState(false);
    const [isSendFundsSettingsOpen, setIsSendFundsSettingsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("All Time");

    const { wallet, stats, history, refetch, isLoading, error } = useWallet();

    const filteredHistory = useMemo(() => {
        const list = Array.isArray(history) ? history : [];
        if (selectedPeriod === "All Time") return list;

        const now = new Date();

        return list.filter((tx) => {
            const d = new Date(tx.createdAt);

            if (selectedPeriod === "This Month") {
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }

            if (selectedPeriod === "This Week") {
                const diff = now.getTime() - d.getTime();
                return diff <= 7 * 24 * 60 * 60 * 1000;
            }

            return true;
        });
    }, [history, selectedPeriod]);

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
            {isLoading ? (
                <WalletPageSkeleton />
            ) : error ? (
                <div className="md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2">
                    <Card className="secondbg p-6">
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold dashtext">Failed to load wallet</h2>
                            <p className="text-sm text-red-500">{error}</p>
                            <Button onClick={refetch} className="dashbutton">
                                Try Again
                            </Button>
                        </div>
                    </Card>
                </div>
            ) : !wallet ? (
                <div className="md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2">
                    <Card className="secondbg p-6">
                        <p className="text-sm text-gray-400">Wallet data is unavailable.</p>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold dashtext">Wallet</h1>
                            <p className="text-sm text-gray-400">Manage your wallet and transactions</p>
                        </div>
                        <Button className="dashbutton" onClick={() => setIsSendFundsSettingsOpen(true)}>
                            Wallet Settings
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="secondbg p-6">
                            <div className="mb-2 text-sm text-gray-400">Available Balance</div>
                            <div className="flex items-center">
                                <div className="text-2xl font-bold dashtext">
                                    {formatMoney(wallet.availableBalance, "USD")}
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                    <ArrowUpRight className="h-6 w-6" />
                                </Button>
                            </div>
                        </Card>

                        <Card className="secondbg p-6">
                            <div className="mb-2 text-sm text-gray-400">Total Withdrawals</div>
                            <div className="flex items-center">
                                <div className="text-2xl font-bold dashtext">{stats?.totalWithdrawals ?? 0}</div>
                                <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                    <ArrowUpRight className="h-6 w-6" />
                                </Button>
                            </div>
                        </Card>

                        <Card className="secondbg p-6">
                            <div className="mb-2 text-sm text-gray-400">Pending Withdrawals</div>
                            <div className="flex items-center">
                                <div className="text-2xl font-bold dashtext">{stats?.pendingWithdrawals ?? 0}</div>
                                <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                    <ArrowUpRight className="h-6 w-6" />
                                </Button>
                            </div>
                        </Card>

                        <Card className="secondbg p-6">
                            <div className="mb-2 text-sm text-gray-400">Successful Withdrawals</div>
                            <div className="flex items-center">
                                <div className="text-2xl font-bold dashtext">{stats?.successfulWithdrawals ?? 0}</div>
                                <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                    <ArrowUpRight className="h-6 w-6" />
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card
                            className="dashbutton p-6 transition-colors hover:secondbg cursor-pointer"
                            onClick={() => setIsWithdrawFundOpen(true)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="rounded-full secondbg p-3">
                                    <ArrowUpRight className="h-6 w-6 text-[#00bf8f]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Withdraw Funds</h3>
                                    <p className="text-sm text-gray-300">Withdraw funds to your bank</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold dashtext">Transactions History</h2>

                            <div className="flex items-center gap-2">
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

                                <button
                                    type="button"
                                    onClick={refetch}
                                    disabled={isLoading}
                                    className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                                </button>
                            </div>
                        </div>

                        {filteredHistory.length === 0 ? (
                            <Card className="secondbg p-4">
                                <p className="text-sm text-gray-400">No transactions yet.</p>
                            </Card>
                        ) : (
                            filteredHistory.map((tx) => <HistoryRow key={tx._id} tx={tx} />)
                        )}
                    </div>

                    <WithdrawFundDialog
                        isOpen={isWithdrawFundOpen}
                        onClose={() => setIsWithdrawFundOpen(false)}
                    />

                    <SendFundSettingsDialog
                        isOpen={isSendFundsSettingsOpen}
                        onClose={() => setIsSendFundsSettingsOpen(false)}
                    />
                </div>
            )}
        </MainLayout>
    );
}
