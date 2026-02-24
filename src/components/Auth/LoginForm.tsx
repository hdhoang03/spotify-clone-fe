import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'; // Thêm icon Loader
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService'; // Import Service
import type { UserResponse } from '../../types/backend';

interface LoginFormProps {
    onLoginSuccess: (userData: UserResponse) => void; // Dùng Type chuẩn
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
            // Gọi Service thật đã kết nối Axios
            const user = await AuthService.login(formData.username, formData.password);
            onLoginSuccess(user);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại!";
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInputField
                icon={<User size={18} />}
                placeholder="Username hoặc Email"
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
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
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full transition transform active:scale-95 flex justify-center items-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Đăng nhập"}
            </button>

            {/* ... Phần OAuth giữ nguyên ... */}
            <p className="text-center text-sm text-gray-500 mt-4">
                Chưa có tài khoản? <button type="button" onClick={onSwitchToRegister} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng ký ngay</button>
            </p>
        </form>
    );
};

export default LoginForm;