import { GraduationCap } from "lucide-react";
import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";

type AuthAction = "signIn" | "signUp";

const AuthPage: React.FC = () => {
  const [authAction, setAuthAction] = useState<AuthAction>("signIn");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (credentials: {
    userId: string;
    password: string;
  }) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      navigate("/home");
    } catch (err) {
      setLoginError("Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (credentials: any) => {
    setIsRegistering(true);
    setRegisterError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      navigate("/login");
    } catch (err) {
      setRegisterError("Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <GraduationCap size={32} className="text-gray-700" />
          </div>
          <h1 className="font-heading font-bold text-xl text-gray-900 mb-1">
            GradeTracker
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setAuthAction("signIn")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              authAction === "signIn"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthAction("signUp")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              authAction === "signUp"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {authAction === "signIn" ? (
          <LoginForm
            onLogin={handleLoginSubmit}
            isLoading={isLoggingIn}
            error={loginError}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegisterSubmit}
            isLoading={isRegistering}
            error={registerError}
          />
        )}

        {/* Terms Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;