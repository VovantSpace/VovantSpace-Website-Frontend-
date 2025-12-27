import {useState, useCallback} from 'react'
import axios from 'axios'

export type Transaction = {
    _id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/transactions')
            setTransactions(res.data.transactions)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        transactions,
        loading,
        refetch: fetchTransactions,
    }
}