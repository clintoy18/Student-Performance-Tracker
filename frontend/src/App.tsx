import DashboardLayout from "./components/layout/DashboardLayout";
import AuthPage from "./pages/AuthPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<DashboardLayout />} />
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
