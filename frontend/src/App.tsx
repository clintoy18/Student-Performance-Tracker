// UPDATED App.tsx - Add ToastProvider wrapper
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import GuestRoute from "./components/routing/GuestRoute";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext"; // ✅ Import ToastProvider

export default function App() {
  return (
    <ToastProvider> {/* ✅ Wrap everything with ToastProvider */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/" element={<AuthPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}