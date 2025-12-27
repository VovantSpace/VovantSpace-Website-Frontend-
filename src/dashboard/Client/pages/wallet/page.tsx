import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/dashboard/Innovator/components/ui/button";
import { Card } from "@/dashboard/Innovator/components/ui/card";
import { MainLayout } from "@/dashboard/Client/components/layout/main-layout";
import { SendFundSettingsDialog } from "@/dashboard/Innovator/components/modals/SendFundSettingsDialog";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { FundWalletDialog } from "@/dashboard/Innovator/components/modals/fund-wallet-dialog";
import { useWalletSocket } from "@/hooks/useWalletSocket";
import { useWallet } from "@/hooks/useWallet";
import { useTransactions } from "@/hooks/useTransaction";

// ---- helpers ----
function formatMoney(amountInMinor: number, currency = "USD") {
    // assuming minor units (cents)
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
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getTxLabel(type?: string) {
    switch (type) {
        case "WALLET_TOPUP":
            return "Wallet funding";
        case "SESSION_LOCK":
            return "Session booking (escrow)";
        case "SESSION_RELEASE":
            return "Session payment released";
        case "SESSION_REFUND":
            return "Session cancelled (refund)";
        case "CHALLENGE_FUND_LOCK":
            return "Challenge funded (escrow)";
        case "CHALLENGE_RELEASE":
            return "Challenge payment released";
        case "PAYOUT":
            return "Withdrawal / payout";
        default:
            return type || "Transaction";
    }
}

function getTxDirection(type?: string) {
    // NOTE: direction is from the current user's perspective.
    // Here we keep it simple:
    // - TOPUP increases wallet
    // - PAYOUT decreases wallet
    // - LOCK/RELEASE can be neutral depending on side; we’ll show them as outgoing for lock and incoming for release.
    if (type === "WALLET_TOPUP") return "+";
    if (type === "PAYOUT") return "-";
    if (type?.includes("LOCK")) return "-";
    if (type?.includes("RELEASE")) return "+";
    if (type?.includes("REFUND")) return "+";
    return "";
}

type TxLike = {
    _id: string;
    amount: number;
    type?: string;
    status?: string; // "pending" | "completed" | "failed" | "cancelled"
    currency?: string;
    createdAt: string;
};

function TransactionRow({ tx }: { tx: TxLike }) {
    const direction = getTxDirection(tx.type);
    const label = getTxLabel(tx.type);
    const date = formatDate(tx.createdAt);

    const isPositive = direction === "+";
    const amountText =
        direction === "+"
            ? `+${formatMoney(tx.amount, (tx.currency || "USD").toUpperCase())}`
            : direction === "-"
                ? `-${formatMoney(tx.amount, (tx.currency || "USD").toUpperCase())}`
                : formatMoney(tx.amount, (tx.currency || "USD").toUpperCase());

    const status = (tx.status || "").toLowerCase();

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
                            <h3 className="font-semibold dashtext flex items-center gap-2">
                                {label}
                                {status && (
                                    <span
                                        className={[
                                            "text-xs px-2 py-0.5 rounded-full",
                                            status === "completed"
                                                ? "bg-green-900/30 text-green-300"
                                                : status === "pending"
                                                    ? "bg-yellow-900/30 text-yellow-300"
                                                    : status === "failed"
                                                        ? "bg-red-900/30 text-red-300"
                                                        : "bg-gray-800 text-gray-300",
                                        ].join(" ")}
                                    >
                    {status}
                  </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-400">{date}</p>
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

export default function WalletPage() {
    const [isSendFundsSettingsOpen, setIsSendFundsSettingsOpen] = useState(false);
    const [isFundWalletDialogOpen, setIsFundWalletDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("All Time");

    const { wallet, refetch: refetchWallet } = useWallet();
    const { transactions, refetch: refetchTransactions } = useTransactions();

    // ✅ stable refetch function
    const refreshAll = useCallback(async () => {
        await Promise.all([refetchWallet(), refetchTransactions()]);
    }, [refetchWallet, refetchTransactions]);

    // ✅ initial fetch ONCE
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    // ✅ socket triggers refresh
    useWalletSocket(() => {
        refreshAll();
    });

    const txs: TxLike[] = useMemo(() => {
        const list = Array.isArray(transactions) ? transactions : [];
        // optional: sort newest first
        return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [transactions]);

    const stats = useMemo(() => {
        const total = txs.length;
        const pending = txs.filter((t) => (t.status || "").toLowerCase() === "pending").length;
        const successful = txs.filter((t) => (t.status || "").toLowerCase() === "completed").length;
        return { total, pending, successful };
    }, [txs]);

    if (!wallet) return null;

    return (
        <MainLayout>
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
                        <div className="mb-2 text-sm text-gray-400">Total Transactions</div>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold dashtext">{stats.total}</div>
                            <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">Pending Payments</div>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold dashtext">{stats.pending}</div>
                            <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="secondbg p-6">
                        <div className="mb-2 text-sm text-gray-400">Successful Payments</div>
                        <div className="flex items-center">
                            <div className="text-2xl font-bold dashtext">{stats.successful}</div>
                            <Button variant="ghost" size="icon" className="rounded-full text-[#00bf8f]">
                                <ArrowUpRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card
                        className="dashbutton p-6 transition-colors hover:secondbg cursor-pointer"
                        onClick={() => setIsFundWalletDialogOpen(true)}
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
                </div>

                <div className="rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold dashtext">Transactions History</h2>

                        <div className="flex items-center gap-2">
                            {/* Dropdown Menu */}
                            <div className="relative inline-block text-left">
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    id="options-menu"
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
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                role="menuitem"
                                                onClick={() => {
                                                    setSelectedPeriod("All Time");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                All Time
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                role="menuitem"
                                                onClick={() => {
                                                    setSelectedPeriod("This Month");
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                This Month
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                role="menuitem"
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

                            {/* Refresh Button */}
                            <button
                                type="button"
                                onClick={refreshAll}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {txs.length === 0 ? (
                        <Card className="secondbg p-4">
                            <p className="text-sm text-gray-400">No transactions yet.</p>
                        </Card>
                    ) : (
                        txs.map((tx) => <TransactionRow key={tx._id} tx={tx} />)
                    )}
                </div>

                <FundWalletDialog isOpen={isFundWalletDialogOpen} onClose={() => setIsFundWalletDialogOpen(false)} />

                <SendFundSettingsDialog isOpen={isSendFundsSettingsOpen} onClose={() => setIsSendFundsSettingsOpen(false)} />
            </div>
        </MainLayout>
    );
}