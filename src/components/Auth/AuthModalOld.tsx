// AuthModal.tsx
import React, { useState } from 'react';
import { X, Mail, Lock, User, Calendar, ArrowRight, Eye, EyeOff } from 'lucide-react';

// Định nghĩa các Mode hiển thị
type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'VERIFY_OTP';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: any) => void; // Callback khi đăng nhập xong
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [showPassword, setShowPassword] = useState(false);
    
    // State lưu dữ liệu form (Mapping với DTO Backend)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '', // Frontend only
        dob: '',
        name: '',
        email: '',
        otpCode: ''
    });

    if (!isOpen) return null;

    // --- LOGIC XỬ LÝ (MOCK CALL API) ---

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        // TODO: Call API register (UserCreationRequest)
        console.log("Registering:", formData);
        
        // Giả lập thành công -> chuyển sang xác thực OTP
        setMode('VERIFY_OTP');
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API verify OTP (VerifyOtpRequest)
        console.log("Verifying OTP for:", formData.email, "Code:", formData.otpCode);

        // Giả lập thành công -> Đăng nhập luôn
        onLoginSuccess({ name: formData.name || formData.username, email: formData.email });
        onClose();
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API login
        // TODO: Handle OAuth2 (Google/Facebook) here later
        // onLoginSuccess({ name: "Hoang Developer", email: "dev@test.com" }); // Mock data
        onClose();
    };

    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Call API /forgot-password (ForgotPasswordRequest)
        console.log("Sending OTP to:", formData.email);
        alert(`OTP sent to ${formData.email}`);
        setMode('VERIFY_OTP'); // Chuyển sang nhập OTP để reset pass
    };

    // --- RENDER FORM ---

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-zinc-800">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white">
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header Modal */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {mode === 'LOGIN' && 'Đăng nhập'}
                            {mode === 'REGISTER' && 'Đăng ký tài khoản'}
                            {mode === 'FORGOT_PASSWORD' && 'Quên mật khẩu?'}
                            {mode === 'VERIFY_OTP' && 'Xác thực OTP'}
                        </h2>
                        {mode === 'LOGIN' && <p className="text-sm text-gray-500 mt-2">Tiếp tục để trải nghiệm SpringTunes</p>}
                        {mode === 'VERIFY_OTP' && <p className="text-sm text-gray-500 mt-2">Mã xác thực đã gửi tới {formData.email}</p>}
                    </div>

                    {/* --- FORM LOGIN --- */}
                    {mode === 'LOGIN' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <InputField icon={<User size={18}/>} placeholder="Username hoặc Email" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                            <div className="relative">
                                <InputField icon={<Lock size={18}/>} type={showPassword ? "text" : "password"} placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                            
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setMode('FORGOT_PASSWORD')} className="text-xs font-bold text-gray-500 hover:text-green-500 hover:underline">
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition transform active:scale-95">
                                Đăng nhập
                            </button>

                            {/* OAuth2 Placeholder */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-zinc-700"></div></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-zinc-900 text-gray-500">Hoặc</span></div>
                            </div>
                            {/* TODO: Implement OAuth2 Login here */}
                            <button type="button" className="w-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 10.2-4.19 10.2-10.38c0-.84-.1-1.62-.22-2.51l-.73.99z"></path></svg>
                                Tiếp tục với Google
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                Chưa có tài khoản? <button type="button" onClick={() => setMode('REGISTER')} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng ký ngay</button>
                            </p>
                        </form>
                    )}

                    {/* --- FORM REGISTER --- */}
                    {mode === 'REGISTER' && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <InputField icon={<User size={18}/>} placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                                <InputField icon={<User size={18}/>} placeholder="Họ tên (Name)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <InputField icon={<Mail size={18}/>} type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <InputField icon={<Calendar size={18}/>} type="date" placeholder="Ngày sinh (DOB)" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                            <InputField icon={<Lock size={18}/>} type="password" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            <InputField icon={<Lock size={18}/>} type="password" placeholder="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />

                            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition mt-2">
                                Đăng ký & Nhận OTP
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-2">
                                Đã có tài khoản? <button type="button" onClick={() => setMode('LOGIN')} className="font-bold text-gray-900 dark:text-white hover:underline">Đăng nhập</button>
                            </p>
                        </form>
                    )}

                    {/* --- FORM VERIFY OTP --- */}
                    {mode === 'VERIFY_OTP' && (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-3xl font-bold tracking-widest text-green-500">{formData.email}</p>
                            </div>
                            <InputField icon={<Lock size={18}/>} placeholder="Nhập mã OTP 6 số" maxLength={6} className="text-center tracking-widest text-lg font-bold" value={formData.otpCode} onChange={e => setFormData({...formData, otpCode: e.target.value})} />
                            
                            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition flex items-center justify-center gap-2">
                                Xác thực <ArrowRight size={18} />
                            </button>
                            <button type="button" onClick={() => setMode('LOGIN')} className="w-full text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mt-2">
                                Quay lại đăng nhập
                            </button>
                        </form>
                    )}

                    {/* --- FORM FORGOT PASSWORD --- */}
                    {mode === 'FORGOT_PASSWORD' && (
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                            <p className="text-sm text-gray-500 mb-2">Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.</p>
                            <InputField icon={<Mail size={18}/>} type="email" placeholder="Email đăng ký" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-full transition">
                                Gửi mã OTP
                            </button>
                            <button type="button" onClick={() => setMode('LOGIN')} className="w-full text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mt-2">
                                Quay lại đăng nhập
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// Component con InputField để code gọn hơn
const InputField = ({ icon, className, ...props }: { icon: React.ReactNode; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
            {icon}
        </div>
        <input 
            {...props}
            className={`w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition dark:text-white ${className}`}
        />
    </div>
);

export default AuthModal;