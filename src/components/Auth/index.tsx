import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerifyForm from './OtpVerifyForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'VERIFY_OTP';

interface UserInfo {
    name: string;
    email: string;
    avatarUrl?: string;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: UserInfo) => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [pendingEmail, setPendingEmail] = useState('');

    useEffect(() => {
        if (isOpen){
            setMode('LOGIN');
            setPendingEmail('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- LOGIC CHUYỂN ĐỔI ---
    
    // Khi đăng ký thành công hoặc gửi yêu cầu quên pass -> chuyển sang xác thực OTP
    const handleSwitchToOtp = (email: string) => {
        setPendingEmail(email);
        setMode('VERIFY_OTP');
    };

    // Khi verify OTP thành công -> Login luôn
    const handleVerifySuccess = () => {
        const newMockUser: UserInfo = {
            email: pendingEmail,
            name: "New user",// Hoặc lấy tên từ form đăng ký nếu có lưu state
            avatarUrl: "https://tse2.mm.bing.net/th/id/OIP.0vBZdbQMidBucCMPWCmfiwHaNH?rs=1&pid=ImgDetMain&o=7&rm=3"
        }
        onLoginSuccess({ email: pendingEmail, name: "New User" }); 
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-zinc-800">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white">
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header Modal */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {mode === 'LOGIN' && 'Đăng nhập'}
                            {mode === 'REGISTER' && 'Đăng ký tài khoản'}
                            {mode === 'FORGOT_PASSWORD' && 'Quên mật khẩu?'}
                            {mode === 'VERIFY_OTP' && 'Xác thực OTP'}
                        </h2>
                        {mode === 'LOGIN' && <p className="text-sm text-gray-500 mt-2">Tiếp tục để trải nghiệm SpringTunes</p>}
                        {mode === 'VERIFY_OTP' && <p className="text-sm text-gray-500 mt-2">Mã xác thực đã gửi tới {pendingEmail}</p>}
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
                            onRegisterSuccess={handleSwitchToOtp}
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
                            onSubmitSuccess={handleSwitchToOtp}
                            onBackToLogin={() => setMode('LOGIN')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;