// import React, { useState } from 'react';
// import { Lock, ArrowRight } from 'lucide-react';
// import AuthInputField from './AuthInputField';
// import { AuthService } from '../../services/authService';
// import type { UserResponse } from '../../types/backend'; // Import Type chuẩn


// interface OtpVerifyFormProps {
//     email: string;
//     onVerifySuccess: (userData: UserResponse) => void;
//     onBackToLogin: () => void;
// }

// const OtpVerifyForm: React.FC<OtpVerifyFormProps> = ({ email, onVerifySuccess, onBackToLogin }) => {
//     const [otpCode, setOtpCode] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const userData = await AuthService.verifyOtp(email, otpCode);
//             onVerifySuccess(userData); // Truyền thông tin user về Modal cha
//         } catch (error) {
//             alert("Mã OTP không đúng hoặc đã hết hạn");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="text-center mb-4">
//                 <p className="text-3xl font-bold tracking-widest text-green-500">
//                     {email || "example@mail.com"}
//                 </p>
//             </div>
//             <AuthInputField
//                 icon={<Lock size={18} />}
//                 placeholder="Nhập mã OTP 6 số"
//                 maxLength={6}
//                 className="text-center tracking-widest text-lg font-bold"
//                 value={otpCode}
//                 onChange={e => setOtpCode(e.target.value)}
//             />

//             <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition flex items-center justify-center gap-2">
//                 Xác thực <ArrowRight size={18} />
//             </button>
//             <button type="button" onClick={onBackToLogin} className="w-full text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mt-2">
//                 Quay lại đăng nhập
//             </button>
//         </form>
//     );
// };

// export default OtpVerifyForm;

import React, { useState } from 'react';
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
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                    <Mail className="text-green-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Xác thực Email</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                    Vui lòng nhập mã OTP 6 chữ số vừa được gửi đến địa chỉ:
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
                    className="text-center tracking-[1em] text-2xl font-black py-4 border-2 focus:border-green-500 transition-all"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} // Chỉ cho nhập số
                />

                <div className="flex justify-center">
                    <button
                        type="button"
                        className="text-xs font-bold text-gray-500 hover:text-green-500 flex items-center gap-1.5 transition-colors group"
                    >
                        <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        Gửi lại mã (60s)
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    type="submit"
                    disabled={otpCode.length < 6 || isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                    {isLoading ? "Đang xác thực..." : "Xác nhận & Đăng nhập"}
                    {!isLoading && <ArrowRight size={18} />}
                </button>

                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    Hủy bỏ và quay lại
                </button>
            </div>
        </form>
    );
};

export default OtpVerifyForm;