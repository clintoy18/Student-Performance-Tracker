import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import GuestRoute from "./components/routing/GuestRoute";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 
          **    Guest Routes
          **    - If authenticated user navigates on
          **      these routes. They will be navigated
          **      back to /home
          */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<AuthPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}
