import api from './api';

export const AuthService = {
    login: async (username: string, password: string, captchaToken: string) => {
        const res = await api.post('/auth/token', { username, password, captchaToken });
        const { token, authenticated } = res.data.result;
        if (authenticated) {
            localStorage.setItem('token', token);
            // Lấy thông tin User sau khi login thành công
            const userRes = await api.get('/user/my');
            localStorage.setItem('user', JSON.stringify(userRes.data.result));
            return userRes.data.result;
        }
    },

    register: (data: any) => api.post('/auth/register', data),

    verifyOtp: async (email: string, otpCode: string) => {
        const res = await api.post('/auth/verify', { email, otpCode });
        const { token } = res.data.result;
        localStorage.setItem('token', token); // Verify xong cho login luôn
        const userRes = await api.get('/user/my');
        localStorage.setItem('user', JSON.stringify(userRes.data.result));
        return userRes.data.result;
    },

    resendOtp: (email: string) => api.post('/auth/resend-otp', { email }),

    logout: async () => {
        const token = localStorage.getItem('token');
        try {
            await api.post('/auth/logout', { token });
        } finally {
            localStorage.clear();
            window.location.reload();
        }
    },

    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),

    resetPassword: (data: { email: string, otpCode: string, newPassword: string }) =>
        api.post('/auth/reset-password', data)
};