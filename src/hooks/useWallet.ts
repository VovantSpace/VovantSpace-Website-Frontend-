import {useState, useCallback, useEffect} from "react";
import api from "@/utils/api";
import {getSocket} from "@/lib/socket";

export type Wallet = {
    availableBalance: number;
    lockedBalance: number;
    currency?: string;
};

export type WalletStats = {
    totalWithdrawals: number;
    pendingWithdrawals: number;
    successfulWithdrawals: number;
};

export type WalletLedgerEntry = {
    _id: string;
    type: "credit" | "debit";
    amount: number;
    currency: string;
    source: string;
    reference?: string;
    balanceAfter: number;
    createdAt: string;
};

export function useWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<WalletLedgerEntry[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const [stripeStatus, setStripeStatus] = useState<{
        payoutsEnabled: boolean;
        detailsSubmitted: boolean;
    } | null>(null);

    /* ----------------------------
       Stripe Status
    ----------------------------- */
    const fetchStripeStatus = useCallback(async () => {
        try {
            const res = await api.get("/connect/status");
            setStripeStatus(res.data);
        } catch (err) {
            console.error("Stripe status fetch failed:", err);
        }
    }, []);

    /* ----------------------------
       Wallet Fetch
    ----------------------------- */
    const fetchWallet = useCallback(async () => {
        try {
            setLoading(true);

            const res = await api.get("/wallet");
            const payload = res.data?.data;

            setWallet(payload?.wallet ?? null);
            setTransactions(payload?.transactions ?? []);
            setStats(payload?.stats ?? null);
        } catch (err) {
            console.error("Wallet fetch failed:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ----------------------------
       Wallet History
    ----------------------------- */
    const fetchHistory = useCallback(async (page = 1, limit = 5) => {
        try {
            setHistoryLoading(true);

            const res = await api.get(
                `/wallet/history?page=${page}&limit=${limit}`
            );

            setHistory(res.data?.items ?? []);
        } catch (err) {
            console.error("History fetch failed:", err);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    /* ----------------------------
       Initial Load + Socket
    ----------------------------- */
    useEffect(() => {
        fetchWallet();
        fetchHistory();
        fetchStripeStatus();
    }, [fetchWallet, fetchHistory, fetchStripeStatus]);

    useEffect(() => {
        const socket = getSocket();

        const handleWalletUpdate = () => {
            console.log("wallet:updated received")
            fetchWallet();
            fetchHistory()
        }

        socket.on("wallet:updated", handleWalletUpdate)

        return () => {
            socket.off("wallet:updated", handleWalletUpdate);
        }
    }, [fetchWallet, fetchHistory])


    return {
        wallet,
        setWallet,
        stats,
        stripeStatus,
        loading,
        history,
        historyLoading,
        refetch: fetchWallet,
        refetchHistory: fetchHistory,
        transactions,
    };
}