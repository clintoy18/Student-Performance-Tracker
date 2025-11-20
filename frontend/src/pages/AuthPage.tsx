import { GraduationCap } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ILoginRequest, IRegisterRequest } from "@interfaces";
import Modal from "../components/common/modal/Modal";
import { useToast } from "../context/ToastContext";

type AuthAction = "signIn" | "signUp";

// Error messages constants
const ERROR_MESSAGES = {
  LOGIN_FAILED: "Invalid credentials. Please check your User ID and password.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
} as const;

const AuthPage: React.FC = () => {
  const { success, error, warning } = useToast();
  const [authAction, setAuthAction] = useState<AuthAction>("signIn");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState<string>("");
  const navigate = useNavigate();
  const { handleLogin, handleRegister } = useAuth();

  // Handle modal close with escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSuccessModal) {
        handleCloseSuccessModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showSuccessModal]);

  // Get appropriate error message
  const getErrorMessage = useCallback((error: unknown): string => {
    if (error instanceof Error) {
      switch (error.message) {
        case "NETWORK_ERROR":
          return ERROR_MESSAGES.NETWORK_ERROR;
        case "INVALID_CREDENTIALS":
          return ERROR_MESSAGES.LOGIN_FAILED;
        default:
          return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      }
    }
    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }, []);

  const handleLoginSubmit = async (credentials: ILoginRequest) => {
    // Prevent multiple simultaneous submissions
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    
    try {
      await handleLogin(credentials);
      success('Login Successful');
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      error(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (credentials: IRegisterRequest) => {
    // Prevent multiple simultaneous submissions
    if (isRegistering) return;

    setIsRegistering(true);
    try {
      const userId = await handleRegister(credentials);
      
      // Store the generated userId and show modal
      setGeneratedUserId(userId);
      setShowSuccessModal(true);

      // Success toast will be shown from the modal copy action if needed
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    setAuthAction("signIn");
  }, []);

  const handleCopyUserId = useCallback(async () => {
    if (!generatedUserId) return;

    try {
      await navigator.clipboard.writeText(generatedUserId);
      success("User ID copied to clipboard");
    } catch (err) {
      // Fallback for clipboard API failure
      const textArea = document.createElement("textarea");
      textArea.value = generatedUserId;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        success("User ID copied to clipboard");
      } catch (fallbackErr) {
        error("Failed to copy User ID");
      }
      document.body.removeChild(textArea);
    }
  }, [generatedUserId, success, error]);

  const handleTabChange = useCallback((action: AuthAction) => {
    setAuthAction(action);
  }, []);

  // Accessibility: Handle keyboard navigation for tabs
  const handleTabKeyDown = useCallback((event: React.KeyboardEvent, action: AuthAction) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabChange(action);
    }
  }, [handleTabChange]);

  return (
    <div 
      className="min-h-screen bg-white flex items-center justify-center p-4"
      role="main"
      aria-label="Authentication"
    >
      <div className="w-full max-w-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3" aria-hidden="true">
            <GraduationCap size={32} className="text-gray-700" />
          </div>
          <h1 className="font-heading font-bold text-xl text-gray-900 mb-1">
            GradeTracker
          </h1>
        </div>

        {/* Tabs */}
        <div 
          className="flex border-b border-gray-200 mb-6"
          role="tablist"
          aria-label="Authentication type"
        >
          <button
            role="tab"
            aria-selected={authAction === "signIn"}
            aria-controls="signin-form"
            id="signin-tab"
            onClick={() => handleTabChange("signIn")}
            onKeyDown={(e) => handleTabKeyDown(e, "signIn")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              authAction === "signIn"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={authAction === "signUp"}
            aria-controls="signup-form"
            id="signup-tab"
            onClick={() => handleTabChange("signUp")}
            onKeyDown={(e) => handleTabKeyDown(e, "signUp")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              authAction === "signUp"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div 
          role="tabpanel"
          id={authAction === "signIn" ? "signin-form" : "signup-form"}
          aria-labelledby={authAction === "signIn" ? "signin-tab" : "signup-tab"}
        >
          {authAction === "signIn" ? (
            <LoginForm
              onLogin={handleLoginSubmit}
              isLoading={isLoggingIn}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegisterSubmit}
              isLoading={isRegistering}
            />
          )}
        </div>

        {/* Terms Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a 
              href="/terms" 
              className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Read our Terms and Conditions"
            >
              Terms
            </a>{" "}
            and{" "}
            <a 
              href="/privacy" 
              className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Read our Privacy Policy"
            >
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          title="Registration Successful!"
          aria-label="Registration success modal"
        >
          <div className="space-y-4">
            <div className="text-center">
              <div 
                className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
                aria-hidden="true"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account Created</h3>
              <p className="text-gray-600 mt-1">Your account has been successfully created.</p>
            </div>

            <div 
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              role="alert"
              aria-label="Important notice"
            >
              <div className="flex items-start">
                <svg 
                  className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
              <label htmlFor="user-id-display" className="block text-sm font-medium text-gray-700 mb-2">
                Your User ID:
              </label>
              <div className="flex items-center space-x-2">
                <code 
                  id="user-id-display"
                  className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono text-gray-900 break-all"
                >
                  {generatedUserId}
                </code>
                <button
                  onClick={handleCopyUserId}
                  className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Copy User ID to clipboard"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={handleCloseSuccessModal}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Continue to sign in"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AuthPage;