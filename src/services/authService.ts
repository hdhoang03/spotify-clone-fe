import api from './api';
import { setUICache, clearSession } from '../utils/userStorage';

export const AuthService = {
    /**
     * Login – BE set httpOnly cookie, không trả token trong body.
     * FE chỉ cần gọi API, cookie được xử lý tự động bởi browser.
     */
    login: async (username: string, password: string, captchaToken: string) => {
        const res = await api.post('/auth/token', { username, password, captchaToken });
        const { authenticated } = res.data.result;
        if (authenticated) {
            // Lấy thông tin User sau khi login thành công (cookie đã được set)
            const userRes = await api.get('/user/my');
            const user = userRes.data.result;
            // ⚠️ Chỉ lưu 3 field tối giản vào localStorage – không lưu email/role/...
            setUICache(user);
            return user;
        }
    },

    register: (data: any) => api.post('/auth/register', data),

    /**
     * Verify OTP – BE set httpOnly cookie sau khi xác minh thành công.
     * Không còn nhận token từ body.
     */
    verifyOtp: async (email: string, otpCode: string) => {
        const res = await api.post('/auth/verify', { email, otpCode });
        const { authenticated } = res.data.result;
        if (authenticated) {
            // Cookie đã được set bởi BE — gọi ngay /user/my để lấy profile
            const userRes = await api.get('/user/my');
            const user = userRes.data.result;
            // ⚠️ Chỉ lưu 3 field tối giản vào localStorage
            setUICache(user);
            return user;
        }
    },

    resendOtp: (email: string) => api.post('/auth/resend-otp', { email }),

    /**
     * Logout – BE đọc cookie, blacklist token, xóa cookie.
     * FE chỉ cần gọi endpoint và dọn UI cache.
     */
    logout: async () => {
        try {
            // Không cần gửi token trong body — BE đọc từ cookie
            await api.post('/auth/logout');
            // Đợi 1 chút để trình duyệt kịp xử lý header Set-Cookie xoá token
            await new Promise(resolve => setTimeout(resolve, 100));
        } finally {
            // ✅ Chỉ xóa session keys (ui_cache, is_premium)
            // Token nằm trong httpOnly cookie → BE đã xóa qua Set-Cookie maxAge=0
            // KHÔNG dùng localStorage.clear() – sẽ mất springtunes_settings và i18n
            clearSession();
            window.location.reload();
        }
    },

    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

    resetPassword: (data: { email: string, otpCode: string, newPassword: string }) =>
        api.post('/auth/reset-password', data)
};