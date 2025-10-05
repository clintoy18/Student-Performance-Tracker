import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import FullPageSpinner from "../common/LoadingSpinnerPage"

export default function ProtectedRoute() {
    const { isLoading, user } = useAuth()

    if (isLoading) {
        return <FullPageSpinner />
    }

    if (user) {
        return <Outlet />
    }

    return <Navigate to="/" replace />
}