import React, { useState } from 'react';
import { Mail, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';

interface ForgotPasswordFormProps {
    onSubmitSuccess: (email: string) => void;
    onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmitSuccess, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await AuthService.forgotPassword(email);
            onSubmitSuccess(email); // Chuyển sang form nhập OTP và pass mới
        } catch (error: any) {
            alert(error.response?.data?.message || "Có lỗi xảy ra, không thể gửi mã OTP!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your registered email to receive the password reset OTP.
                </p>
                <AuthInputField
                    icon={<Mail size={18} />}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-3">
                <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black font-bold py-3.5 rounded-full transition flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send OTP"}
                </button>

                {/* Nút Back custom cho Modal */}
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full flex items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition group py-2"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Log in
                </button>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;