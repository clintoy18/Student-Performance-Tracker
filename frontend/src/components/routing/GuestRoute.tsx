// components/routing/GuestRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FullPageSpinner from "../common/LoadingSpinnerPage";

export default function GuestRoute() {
  const { isLoading, user } = useAuth();

  // While loading, show spinner
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, allow access to guest routes
  return <Outlet />;
}