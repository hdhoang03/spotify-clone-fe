import React, { useState } from 'react';
import { User, Mail, Calendar, Lock } from 'lucide-react';
import AuthInputField from './AuthInputField';

interface RegisterFormProps {
    onRegisterSuccess: (email: string) => void;
    onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '', name: '', email: '', dob: '', password: '', confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        console.log("Registering:", formData);
        // Giả lập call API xong -> chuyển sang bước OTP
        onRegisterSuccess(formData.email);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <AuthInputField icon={<User size={18}/>} placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                <AuthInputField icon={<User size={18}/>} placeholder="Họ tên (Name)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <AuthInputField icon={<Mail size={18}/>} type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <AuthInputField icon={<Calendar size={18}/>} type="date" placeholder="Ngày sinh (DOB)" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            <AuthInputField icon={<Lock size={18}/>} type="password" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <AuthInputField icon={<Lock size={18}/>} type="password" placeholder="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />

            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition mt-2">
                Đăng ký & Nhận OTP
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
                Đã có tài khoản? <button type="button" onClick={onSwitchToLogin} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng nhập</button>
            </p>
        </form>
    );
};

export default RegisterForm;