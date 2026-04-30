// import React, { useState } from 'react';
// import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'; // Thêm icon Loader
// import AuthInputField from './AuthInputField';
// import { AuthService } from '../../services/authService'; // Import Service
// import type { UserResponse } from '../../types/backend';

// interface LoginFormProps {
//     onLoginSuccess: (userData: UserResponse) => void; // Dùng Type chuẩn
//     onForgotPassword: () => void;
//     onSwitchToRegister: () => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onForgotPassword, onSwitchToRegister }) => {
//     const [formData, setFormData] = useState({ username: '', password: '' });
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             // Gọi Service thật đã kết nối Axios
//             const user = await AuthService.login(formData.username, formData.password);
//             onLoginSuccess(user);
//         } catch (error: any) {
//             const errorMsg = error.response?.data?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại!";
//             alert(errorMsg);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <AuthInputField
//                 icon={<User size={18} />}
//                 placeholder="Username hoặc Email"
//                 value={formData.username}
//                 onChange={e => setFormData({ ...formData, username: e.target.value })}
//             />

//             <div className="relative">
//                 <AuthInputField
//                     icon={<Lock size={18} />}
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Mật khẩu"
//                     value={formData.password}
//                     onChange={e => setFormData({ ...formData, password: e.target.value })}
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//             </div>

//             <div className="flex justify-end">
//                 <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-gray-500 hover:text-green-500 hover:underline">
//                     Quên mật khẩu?
//                 </button>
//             </div>

//             <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition transform active:scale-95 flex justify-center items-center gap-2"
//             >
//                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Đăng nhập"}
//             </button>

//             {/* ... Phần OAuth giữ nguyên ... */}
//             <p className="text-center text-sm text-gray-500 mt-4">
//                 Chưa có tài khoản? <button type="button" onClick={onSwitchToRegister} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng ký ngay</button>
//             </p>
//         </form>
//     );
// };

// export default LoginForm;

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, Facebook, Github } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';
import type { UserResponse } from '../../types/backend';

interface LoginFormProps {
    onLoginSuccess: (userData: UserResponse) => void;
    onForgotPassword: () => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onForgotPassword, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = await AuthService.login(formData.username, formData.password);
            onLoginSuccess(user);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại!";
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý tạm thời cho các nút Social Login
    const handleSocialLogin = (provider: string) => {
        // Sau này ở đây bạn sẽ gọi window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`
        alert(`Chức năng đăng nhập bằng ${provider} sẽ sớm được tích hợp!`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInputField
                icon={<Lock size={18} />}
                type="text"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
            />

            <div className="relative">
                <AuthInputField
                    icon={<Lock size={18} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            <div className="flex justify-end">
                <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-gray-500 hover:text-green-500 hover:underline">
                    Quên mật khẩu?
                </button>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition transform active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-green-500/20"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Đăng nhập"}
            </button>

            {/* --- KHU VỰC OAUTH SOCIAL LOGIN --- */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 font-medium">Hoặc tiếp tục với</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => handleSocialLogin('google')} className="flex justify-center items-center py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    {/* SVG Icon chuẩn của Google */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </button>
                <button type="button" onClick={() => handleSocialLogin('facebook')} className="flex justify-center items-center py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <Facebook size={20} className="text-[#1877F2]" />
                </button>
                <button type="button" onClick={() => handleSocialLogin('github')} className="flex justify-center items-center py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <Github size={20} className="text-gray-900 dark:text-white" />
                </button>
            </div>
            {/* ------------------------------------- */}

            <p className="text-center text-sm text-gray-500 mt-6">
                Chưa có tài khoản? <button type="button" onClick={onSwitchToRegister} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng ký ngay</button>
            </p>
        </form>
    );
};

export default LoginForm;