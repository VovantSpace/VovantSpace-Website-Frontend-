import {useState, useCallback, useEffect} from "react";
import api from '@/utils/api'
import {getSocket} from "@/lib/socket";

export type Wallet = {
    availableBalance: number;
    lockedBalance: number;
}

export type WalletLedgerEntry = {
    _id: string;
    type: "credit" | "debit";
    amount: number;
    currency: string;
    source: string;
    reference?: string;
    balanceAfter: number;
    createdAt: string;
}

export function useWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<WalletLedgerEntry[]>([])
    const [historyLoading, setHistoryLoading] = useState<boolean>(false)

    const fetchWallet = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/wallet')
            setWallet(res.data.wallet)
        } finally {
            setLoading(false)
        }
    }, [])

    // Fetch wallet history
    const fetchHistory = useCallback(
        async (page = 1, limit = 10) => {
            try {
                setHistoryLoading(true)
                const res = await api.get(
                    `/wallet/history?page=${page}&limit=${limit}`
                )
                setHistory(res.data.items)
            } finally {
                setHistoryLoading(false)
            }
        },
        []
    )

    useEffect(() => {
        fetchWallet()
        fetchHistory()

        const socket = getSocket()

        const handleWalletUpdate = () => {
            fetchWallet();
            fetchHistory()
        }

        socket.on("wallet:update", handleWalletUpdate)

        return () => {
            socket.off("wallet:update", handleWalletUpdate)
        }
    }, [fetchWallet, fetchHistory])

    return {
        wallet,
        loading,
        history,
        historyLoading,
        refetch: fetchWallet,
        refetchHistory: fetchHistory,
    }
}