import { GraduationCap } from "lucide-react";
import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ILoginRequest, IRegisterRequest } from "@interfaces";
import Modal from "../components/common/modal/Modal";

type AuthAction = "signIn" | "signUp";

const AuthPage: React.FC = () => {
  const [authAction, setAuthAction] = useState<AuthAction>("signIn");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState<string>("");
  const navigate = useNavigate();
  const { handleLogin, handleRegister } = useAuth();

  const handleLoginSubmit = async (credentials: ILoginRequest) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await handleLogin(credentials);
      navigate("/dashboard");
    } catch (err) {
      setLoginError("Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (credentials: IRegisterRequest) => {
    setIsRegistering(true);
    setRegisterError(null);

    try {
      const userId = await handleRegister(credentials);
      
      // Store the generated userId and show modal
      setGeneratedUserId(userId);
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error(err);
      setRegisterError(err?.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAuthAction("signIn"); // Switch to login form after closing modal
  };

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(generatedUserId);
    // You can add a toast notification here if you have one
    alert("User ID copied to clipboard!");
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
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              authAction === "signIn"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthAction("signUp")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              authAction === "signUp"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
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

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          title="Registration Successful!"
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account Created</h3>
              <p className="text-gray-600 mt-1">Your account has been successfully created.</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800 mb-1">Important: Save Your User ID</p>
                  <p className="text-sm text-yellow-700">
                    You'll need this ID to log in. Please save it somewhere safe.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your User ID:
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-900 break-all">
                  {generatedUserId}
                </code>
                <button
                  onClick={handleCopyUserId}
                  className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={handleCloseSuccessModal}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Sign In
              </button>
              <button
                onClick={handleCopyUserId}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Copy User ID & Continue
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AuthPage;