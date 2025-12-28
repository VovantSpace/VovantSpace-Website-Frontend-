import {Navigate} from 'react-router-dom'
import {useAuth} from "@/hooks/useAuth"
import {JSX} from 'react'

export function ProtectedRoute({children}: { children: JSX.Element }) {
    const {isAuthenticated, loading} = useAuth()

    if (loading) return null

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }
    return children;
}