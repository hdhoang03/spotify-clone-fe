import React, { useState } from 'react';
import { Lock, Loader2, ChevronLeft } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';

interface ResetPasswordFormProps {
    email: string;
    onResetSuccess: () => void;
    onBackToLogin: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email, onResetSuccess, onBackToLogin }) => {
    const [formData, setFormData] = useState({ otpCode: '', newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.resetPassword({
                email,
                otpCode: formData.otpCode,
                newPassword: formData.newPassword
            });
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            onResetSuccess(); // Chuyển về login
        } catch (error: any) {
            alert(error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">OTP has been sent to</p>
                <p className="font-bold text-green-500 truncate px-4">{email}</p>
            </div>

            <AuthInputField
                icon={<Lock size={18} />}
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                value={formData.otpCode}
                onChange={e => setFormData({ ...formData, otpCode: e.target.value.replace(/[^0-9]/g, '') })}
                required
            />

            <AuthInputField
                icon={<Lock size={18} />}
                type="password"
                placeholder="New password"
                value={formData.newPassword}
                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                required
            />

            <AuthInputField
                icon={<Lock size={18} />}
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
            />

            <div className="space-y-3 mt-6">
                <button
                    type="submit"
                    disabled={isLoading || formData.otpCode.length < 6}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black font-bold py-3.5 rounded-full transition flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Confirm change password"}
                </button>

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

export default ResetPasswordForm;