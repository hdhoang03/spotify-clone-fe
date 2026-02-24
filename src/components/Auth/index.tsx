import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import OtpVerifyForm from './OtpVerifyForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import type { UserResponse } from '../../types/backend'; // Import Type chuẩn

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'VERIFY_OTP';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: UserResponse) => void; // Chuẩn hóa type input
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

    const handleSwitchToOtp = (email: string) => {
        setPendingEmail(email);
        setMode('VERIFY_OTP');
    };

    // Xử lý xác thực OTP thành công
    // const handleVerifySuccess = async () => {
    //     try {
    //         const newUser = await AuthService.verifyOtp(pendingEmail, "123456");
    //         onLoginSuccess(newUser);
    //         onClose();
    //     } catch (error) {
    //         console.error("Lỗi verify OTP", error);
    //     }
    // };
    const handleVerifySuccess = (userData: UserResponse) => {
        onLoginSuccess(userData); // Gọi callback để Header/App cập nhật UI
        onClose(); // Đóng modal
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
                            {mode === 'LOGIN' && 'Đăng nhập'}
                            {mode === 'REGISTER' && 'Đăng ký tài khoản'}
                            {mode === 'FORGOT_PASSWORD' && 'Quên mật khẩu?'}
                            {mode === 'VERIFY_OTP' && 'Xác thực OTP'}
                        </h2>
                        {mode === 'LOGIN' && <p className="text-sm text-gray-500 mt-2">Tiếp tục để trải nghiệm SpringTunes</p>}
                        {mode === 'VERIFY_OTP' && <p className="text-sm text-gray-500 mt-2">Mã xác thực đã gửi tới {pendingEmail}</p>}
                    </div>

                    {/* Truyền callback onLoginSuccess chuẩn UserResponse xuống dưới */}
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