import React, { useState } from 'react';
import { User, Mail, Calendar, Lock, Loader2, ArrowRight } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';

interface RegisterFormProps {
    onRegisterSuccess: (email: string) => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '', name: '', email: '', dob: '', password: '', confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Kiểm tra nhập đủ các trường
        const { username, name, email, dob, password, confirmPassword } = formData;
        if (!username || !name || !email || !dob || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // 2. Kiểm tra khớp mật khẩu
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            // 3. Gọi API Register (Backend sẽ check trùng Username/Email tại đây)
            // Nếu trùng, Backend sẽ ném Exception và rơi vào block catch
            await AuthService.register({
                username,
                name,
                email,
                dob,
                password
            });

            // 4. Nếu thành công (Code 1000), mới chuyển sang bước nhập OTP
            onRegisterSuccess(formData.email);
        } catch (error: any) {
            // Lấy message lỗi từ ApiResponse của Backend (ví dụ: "User existed")
            const serverMessage = error.response?.data?.message;
            alert(serverMessage || "Đăng ký thất bại, tài khoản hoặc email có thể đã tồn tại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-3">
                <AuthInputField
                    icon={<User size={18} />}
                    placeholder="Username"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
                <AuthInputField
                    icon={<User size={18} />}
                    placeholder="Họ tên"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <AuthInputField
                icon={<Mail size={18} />}
                type="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Ngày sinh</label>
                <AuthInputField
                    icon={<Calendar size={18} />}
                    type="date"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                />
            </div>

            <AuthInputField
                icon={<Lock size={18} />}
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
            />

            <AuthInputField
                icon={<Lock size={18} />}
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            />

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3.5 rounded-full transition mt-2 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Đang kiểm tra...
                    </>
                ) : (
                    <>
                        Đăng ký & Nhận mã OTP
                        <ArrowRight size={18} />
                    </>
                )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Đã có tài khoản?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-bold text-gray-900 dark:text-white hover:underline transition"
                >
                    Đăng nhập ngay
                </button>
            </p>
        </form>
    );
};

export default RegisterForm;