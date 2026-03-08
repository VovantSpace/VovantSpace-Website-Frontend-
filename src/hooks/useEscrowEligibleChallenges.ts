import {useEffect, useState} from "react";
import api from '@/utils/api';

export function useEscrowEligibleChallenges() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        api.get('/challenges/escrow-eligible')
            .then((res) => {
                if (mounted) setData(res.data.data ?? []);
            })
            .catch((err) => {
            console.error("failed to load escrow challenges", err)
            if (mounted) setData([]);
        }).finally(() => {
            if (mounted) {
                setLoading(false);
            }
        })

        return () => {
            mounted = false;
        }
    }, [])

    return {data, loading}
}