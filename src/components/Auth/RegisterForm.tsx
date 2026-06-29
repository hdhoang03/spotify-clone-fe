import React, { useState } from 'react';
import { User, Mail, Calendar, Lock, Loader2, ArrowRight } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';

// Khai báo grecaptcha từ script Google ngoài để TypeScript biết
declare const grecaptcha: any;
const RECAPTCHA_SITE_KEY = '6LcrihotAAAAAF0tS8NTpeNhGml_zISMAumggFb2';

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

        const { username, name, email, dob, password, confirmPassword } = formData;
        if (!username || !name || !email || !dob || !password) {
            alert("Please fill in all information!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            // Lấy captcha token từ Google reCAPTCHA v3 (ẩn, không cần tương tác)
            const captchaToken: string = await new Promise((resolve, reject) => {
                grecaptcha.ready(() => {
                    grecaptcha
                        .execute(RECAPTCHA_SITE_KEY, { action: 'register' })
                        .then(resolve)
                        .catch(reject);
                });
            });

            await AuthService.register({ username, password, name, dob, email, captchaToken });
            onRegisterSuccess(email);
        } catch (error: any) {
            alert(error.response?.data?.message || "Đăng ký thất bại, vui lòng kiểm tra lại thông tin!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'google') {
            const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/callback`);
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=298101183026-abdfin7q175621usuv073tno9sf7r13f.apps.googleusercontent.com&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
        } else {
            alert(`Chức năng đăng nhập bằng ${provider} sẽ sớm được tích hợp!`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <AuthInputField icon={<User size={18} />} type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            <AuthInputField icon={<User size={18} />} type="text" placeholder="Display name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <AuthInputField icon={<Mail size={18} />} type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <AuthInputField icon={<Calendar size={18} />} type="date" placeholder="Birthday" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
            <AuthInputField icon={<Lock size={18} />} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <AuthInputField icon={<Lock size={18} />} type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-3 rounded-full transition mt-2 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50"
            >
                {isLoading ? (
                    <><Loader2 className="animate-spin" size={20} /> Checking...</>
                ) : (
                    <>Get OTP to sign up <ArrowRight size={18} /></>
                )}
            </button>

            {/* --- KHU VỰC OAUTH SOCIAL LOGIN --- */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 font-medium">Or sign up with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
                <button type="button" onClick={() => handleSocialLogin('google')} className="flex justify-center items-center py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </button>
            </div>
            {/* ------------------------------------- */}

            <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-bold text-gray-900 dark:text-white hover:underline transition">Log in</button>
            </p>
        </form>
    );
};

export default RegisterForm;
