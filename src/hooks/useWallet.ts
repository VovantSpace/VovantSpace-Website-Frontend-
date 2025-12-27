import {useState, useCallback} from "react";
import axios from "axios";

export type Wallet = {
    availableBalance: number;
    lockedBalance: number;
}

export function useWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(false)

    const fetchWallet = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/wallet')
            setWallet(res.data.wallet)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        wallet,
        loading,
        refetch: fetchWallet,
    }
}