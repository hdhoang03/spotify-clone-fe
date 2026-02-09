import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import AuthInputField from './AuthInputField';

interface ForgotPasswordFormProps {
    onSubmitSuccess: (email: string) => void;
    onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmitSuccess, onBackToLogin }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sending OTP to:", email);
        alert(`OTP sent to ${email}`);
        onSubmitSuccess(email);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.</p>
            <AuthInputField 
                icon={<Mail size={18}/>} 
                type="email" 
                placeholder="Email đăng ký" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
            />
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition">
                Gửi mã OTP
            </button>
            <button type="button" onClick={onBackToLogin} className="w-full text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mt-2">
                Quay lại đăng nhập
            </button>
        </form>
    );
};

export default ForgotPasswordForm;