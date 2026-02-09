import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import AuthInputField from './AuthInputField';

interface UserInfo {
    name: string;
    email: string;
    avatarUrl?: string;
}

interface LoginFormProps {
    onLoginSuccess: (userData: any) => void;
    onForgotPassword: () => void;
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onForgotPassword, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API login here
        console.log("Logging in with:", formData);
        onLoginSuccess({ name: "Hoang Developer", email: "dev@test.com", avatarUrl: "https://tse2.mm.bing.net/th/id/OIP.0vBZdbQMidBucCMPWCmfiwHaNH?rs=1&pid=ImgDetMain&o=7&rm=3"}); // Mock data
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInputField 
                icon={<User size={18}/>} 
                placeholder="Username hoặc Email" 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})} 
            />
            
            <div className="relative">
                <AuthInputField 
                    icon={<Lock size={18}/>} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mật khẩu" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
            </div>
            
            <div className="flex justify-end">
                <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-gray-500 hover:text-green-500 hover:underline">
                    Quên mật khẩu?
                </button>
            </div>

            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition transform active:scale-95">
                Đăng nhập
            </button>

            {/* OAuth2 Section */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-zinc-700"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-zinc-900 text-gray-500">Hoặc</span></div>
            </div>
            <button type="button" className="w-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 10.2-4.19 10.2-10.38c0-.84-.1-1.62-.22-2.51l-.73.99z"></path></svg>
                Tiếp tục với Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Chưa có tài khoản? <button type="button" onClick={onSwitchToRegister} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng ký ngay</button>
            </p>
        </form>
    );
};

export default LoginForm;