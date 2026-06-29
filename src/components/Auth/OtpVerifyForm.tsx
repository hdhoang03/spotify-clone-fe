import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, Mail, RefreshCcw } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';
import type { UserResponse } from '../../types/backend';

interface OtpVerifyFormProps {
    email: string;
    onVerifySuccess: (userData: UserResponse) => void;
    onBackToLogin: () => void;
}

const OtpVerifyForm: React.FC<OtpVerifyFormProps> = ({ email, onVerifySuccess, onBackToLogin }) => {
    const [otpCode, setOtpCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(300);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    const handleResendOtp = async () => {
        if (resendTimer > 0 || isResending) return;

        setIsResending(true);
        try {
            await AuthService.resendOtp(email);
            setResendTimer(300);
            alert("OTP has been sent to your email");
        } catch (error) {
            alert("Có lỗi xảy ra khi gửi lại mã OTP");
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length < 6) return;

        setIsLoading(true);
        try {
            const userData = await AuthService.verifyOtp(email, otpCode);
            onVerifySuccess(userData);
        } catch (error) {
            alert("Mã OTP không đúng hoặc đã hết hạn");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section với Icon */}
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-2">
                    <Mail className="text-primary-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                    Please enter the 6-digit OTP code sent to your email:
                </p>

                {/* Email Pill - Giải quyết vấn đề email quá dài */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full border border-gray-200 dark:border-zinc-700 max-w-full">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[200px] sm:max-w-[300px]">
                        {email}
                    </span>
                </div>
            </div>

            {/* OTP Input Field */}
            <div className="space-y-4">
                <AuthInputField
                    icon={<Lock size={18} />}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="text-center tracking-[1em] text-2xl font-black py-4 border-2 focus:border-primary-500 transition-all"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} // Chỉ cho nhập số
                />

                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || isResending}
                        className={`text-xs font-bold flex items-center gap-1.5 transition-colors group ${
                            resendTimer > 0 || isResending
                                ? 'text-gray-500 cursor-not-allowed opacity-70'
                                : 'text-gray-500 hover:text-primary-500'
                        }`}
                    >
                        <RefreshCcw size={14} className={`${resendTimer === 0 && !isResending ? 'group-hover:rotate-180' : ''} ${isResending ? 'animate-spin' : ''} transition-transform duration-500`} />
                        {isResending ? "Đang gửi..." : resendTimer > 0 ? `Resend code (${formatTime(resendTimer)})` : "Resend code"}
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    type="submit"
                    disabled={otpCode.length < 6 || isLoading}
                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                >
                    {isLoading ? "Đang xác thực..." : "Confirm & Login"}
                    {!isLoading && <ArrowRight size={18} />}
                </button>

                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    Cancel and return to login
                </button>
            </div>
        </form>
    );
};

export default OtpVerifyForm;