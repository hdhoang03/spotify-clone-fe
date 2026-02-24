import React, { useState } from 'react';
import { X, User, Lock, UserCheck, Mail, Calendar, Loader2 } from 'lucide-react';
import type { UserCreationRequest } from '../../../types/backend';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: UserCreationRequest) => Promise<void>;
}

interface InputGroupProps {
    icon: React.ReactNode;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
}

const CreateUserModal = ({ isOpen, onClose, onCreate }: CreateUserModalProps) => {
    const [formData, setFormData] = useState<UserCreationRequest>({
        username: '', password: '', dob: '', name: '', email: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Gọi hàm từ component cha truyền vào
            await onCreate(formData);
            // Reset form sau khi thành công
            setFormData({ username: '', password: '', dob: '', name: '', email: '' });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative -mt-20 bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thêm người dùng mới</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Username */}
                    <InputGroup
                        icon={<User size={18} />}
                        label="Username"
                        placeholder="VD: hoang_dev"
                        value={formData.username}
                        onChange={(val) => setFormData({ ...formData, username: val })}
                    />

                    {/* Password */}
                    <InputGroup
                        icon={<Lock size={18} />}
                        label="Mật khẩu"
                        type="password"
                        placeholder="Nhập mật khẩu..."
                        value={formData.password}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                    />

                    {/* Name */}
                    <InputGroup
                        icon={<UserCheck size={18} />}
                        label="Họ và Tên"
                        placeholder="VD: Nguyễn Văn A"
                        value={formData.name}
                        onChange={(val) => setFormData({ ...formData, name: val })}
                    />

                    {/* Email */}
                    <InputGroup
                        icon={<Mail size={18} />}
                        label="Email"
                        type="email"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={(val) => setFormData({ ...formData, email: val })}
                    />

                    {/* DOB */}
                    <InputGroup
                        icon={<Calendar size={18} />}
                        label="Ngày sinh"
                        type="date"
                        value={formData.dob}
                        onChange={(val) => setFormData({ ...formData, dob: val })}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mt-4 flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận tạo mới"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Component con nội bộ để code gọn hơn
const InputGroup = ({ icon, label, type = "text", placeholder, value, onChange }: InputGroupProps) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
            <input
                required
                type={type}
                placeholder={placeholder}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

export default CreateUserModal;