import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import AuthInputField from './AuthInputField';

interface OtpVerifyFormProps {
    email: string;
    onVerifySuccess: () => void;
    onBackToLogin: () => void;
}

const OtpVerifyForm: React.FC<OtpVerifyFormProps> = ({ email, onVerifySuccess, onBackToLogin }) => {
    const [otpCode, setOtpCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Verifying OTP for:", email, "Code:", otpCode);
        onVerifySuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
                <p className="text-3xl font-bold tracking-widest text-green-500">
                    {email || "example@mail.com"}
                </p>
            </div>
            <AuthInputField 
                icon={<Lock size={18}/>} 
                placeholder="Nhập mã OTP 6 số" 
                maxLength={6} 
                className="text-center tracking-widest text-lg font-bold" 
                value={otpCode} 
                onChange={e => setOtpCode(e.target.value)} 
            />
            
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition flex items-center justify-center gap-2">
                Xác thực <ArrowRight size={18} />
            </button>
            <button type="button" onClick={onBackToLogin} className="w-full text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mt-2">
                Quay lại đăng nhập
            </button>
        </form>
    );
};

export default OtpVerifyForm;