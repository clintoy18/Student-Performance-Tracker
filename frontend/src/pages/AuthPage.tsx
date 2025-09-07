import { GraduationCap } from 'lucide-react';
import Button from '../components/common/Button';
import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

type AuthAction = 'signIn' | 'signUp';

const AuthPage: React.FC = () => {
    const [authAction, setAuthAction] = useState<AuthAction>('signIn');

    const handleAction = (action: AuthAction): void => {
        setAuthAction(action);
    };

    const getButtonStyle = (action: AuthAction) => {
        return authAction === action
            ? 'p-2 text-sm bg-white text-black hover:bg-gray-100 border border-gray-300' // active state
            : 'p-2 text-sm bg-transparent text-black hover:bg-gray-50 border border-transparent'; 
    };

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-6">
            {/* Header Section */}
            <div className="flex flex-col w-full items-center text-center mb-6">
                <GraduationCap size={40} style={{ marginBottom: '20px' }} />
                <h1 className="font-heading font-bold text-2xl mb-1">Student Progress Tracker</h1>
                <p className="font-sans text-base">Sign in to your account or create a new one</p>
            </div>

            {/* Form and Buttons */}
            <div className="w-full bg-white p-6 space-y-6 mb-6">
                {/* Button Group */}
                <div className="flex gap-4 justify-center mb-4">
                    <Button
                        className={`rounded-sm ${getButtonStyle('signIn')}`}
                        label="Sign In"
                        type="button"
                        onClick={() => handleAction('signIn')}
                        aria-pressed={authAction === 'signIn'}
                    />
                    <Button
                        className={`rounded-sm ${getButtonStyle('signUp')}`}
                        label="Sign Up"
                        type="button"
                        onClick={() => handleAction('signUp')}
                        aria-pressed={authAction === 'signUp'}
                    />
                </div>

                {/* Form */}
                {authAction === 'signIn' ? <LoginForm /> : <RegisterForm />}
            </div>

            {/* Info Section */}
            <div className="space-y-2 text-center">
                <p className="text-sm font-sans">
                    <b>Getting Started:</b> Create your first account with any
                    email/password combination.
                </p>
                <p className="text-xs font-sans">
                    The first account created will automatically become an
                    Admin. Additional accounts will be Students by default.
                    Admins can promote users to Teachers or Admins from
                    their dashboard.
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
