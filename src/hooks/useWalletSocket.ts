import {useEffect} from "react";
import {getSocket} from '@/lib/socket';

type WalletUpdateReason =
    | "TOPUP"
    | "SESSION_LOCK"
    | "SESSION_RELEASE"
    | "SESSION_REFUND"
    | "CHALLENGE_LOCK"
    | "CHALLENGE_RELEASE"
    | "PAYOUT"

export function useWalletSocket(
    onWalletUpdate: (reason: WalletUpdateReason) => void,
) {
    useEffect(() => {
        const socket = getSocket();

        const handler = ({reason}: { reason: WalletUpdateReason }) => {
            console.log("Wallet update received:", reason)
            onWalletUpdate(reason)
        }

        socket.on("wallet:update", handler);

        return () => {
            socket.off("wallet:update", handler);
        }
    }, [onWalletUpdate])
}