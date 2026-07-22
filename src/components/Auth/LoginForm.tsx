import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthInputField from './AuthInputField';
import { AuthService } from '../../services/authService';
import type { UserResponse } from '../../types/backend';

// Khai báo grecaptcha từ script Google ngoài để TypeScript biết
declare const grecaptcha: any;
const RECAPTCHA_SITE_KEY = '6LcrihotAAAAAF0tS8NTpeNhGml_zISMAumggFb2';

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
            // Lấy captcha token từ Google reCAPTCHA v3 (ẩn, không cần tương tác)
            const captchaToken: string = await new Promise((resolve, reject) => {
                grecaptcha.ready(() => {
                    grecaptcha
                        .execute(RECAPTCHA_SITE_KEY, { action: 'login' })
                        .then(resolve)
                        .catch(reject);
                });
            });

            const user = await AuthService.login(formData.username, formData.password, captchaToken);
            onLoginSuccess(user);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Login failed, please try again!";
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'google') {
            const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/callback`);
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=298101183026-abdfin7q175621usuv073tno9sf7r13f.apps.googleusercontent.com&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile`;
        } else {
            alert(`Login with ${provider} will be integrated soon!`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInputField
                icon={<Lock size={18} />}
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
            />

            <div className="relative">
                <AuthInputField
                    icon={<Lock size={18} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            <div className="flex justify-end">
                <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-gray-500 hover:text-primary-500 hover:underline">
                    Forgot password?
                </button>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-full transition transform active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-primary-500/20"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Log in"}
            </button>

            {/* --- KHU VỰC OAUTH SOCIAL LOGIN --- */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-zinc-900 text-gray-500 font-medium">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
                <button type="button" onClick={() => handleSocialLogin('google')} className="flex justify-center items-center py-2.5 border border-gray-200 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </button>
            </div>
            {/* ------------------------------------- */}

            <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account? <button type="button" onClick={onSwitchToRegister} className="font-bold text-gray-900 dark:text-white hover:underline">Sign up now</button>
            </p>
        </form>
    );
};

export default LoginForm;