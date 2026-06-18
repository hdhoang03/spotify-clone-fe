import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerifyForm from './OtpVerifyForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import type { UserResponse } from '../../types/backend';
import ResetPasswordForm from './ResetPasswordForm';

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'VERIFY_OTP' | 'RESET_PASSWORD';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: UserResponse) => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [pendingEmail, setPendingEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMode('LOGIN');
            setPendingEmail('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- LOGIC CHUYỂN ĐỔI ---

    const handleSwitchToOtpRegister = (email: string) => {
        setPendingEmail(email);
        setMode('VERIFY_OTP');
    };

    const handleSwitchToResetPassword = (email: string) => {
        setPendingEmail(email);
        setMode('RESET_PASSWORD'); // Từ form quên pass đẩy qua form đổi pass
    };

    const handleVerifySuccess = (userData: UserResponse) => {
        onLoginSuccess(userData);
        onClose();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-zinc-800">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white">
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {mode === 'LOGIN' && 'Log in'}
                            {mode === 'REGISTER' && 'Sign up'}
                            {mode === 'FORGOT_PASSWORD' && 'Forgot password?'}
                            {mode === 'VERIFY_OTP' && 'Verify Email'}
                            {mode === 'RESET_PASSWORD' && 'Reset password'}
                        </h2>
                        {mode === 'LOGIN' && <p className="text-sm text-gray-500 mt-2">Continue to experience SpringTunes</p>}
                    </div>

                    {mode === 'LOGIN' && (
                        <LoginForm
                            onLoginSuccess={(data) => { onLoginSuccess(data); onClose(); }}
                            onForgotPassword={() => setMode('FORGOT_PASSWORD')}
                            onSwitchToRegister={() => setMode('REGISTER')}
                        />
                    )}

                    {mode === 'REGISTER' && (
                        <RegisterForm
                            onRegisterSuccess={handleSwitchToOtpRegister}
                            onSwitchToLogin={() => setMode('LOGIN')}
                        />
                    )}

                    {mode === 'VERIFY_OTP' && (
                        <OtpVerifyForm
                            email={pendingEmail}
                            onVerifySuccess={handleVerifySuccess}
                            onBackToLogin={() => setMode('LOGIN')}
                        />
                    )}

                    {mode === 'FORGOT_PASSWORD' && (
                        <ForgotPasswordForm
                            onSubmitSuccess={handleSwitchToResetPassword}
                            onBackToLogin={() => setMode('LOGIN')}
                        />
                    )}

                    {mode === 'RESET_PASSWORD' && (
                        <ResetPasswordForm
                            email={pendingEmail}
                            onResetSuccess={() => setMode('LOGIN')}
                            onBackToLogin={() => setMode('LOGIN')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;