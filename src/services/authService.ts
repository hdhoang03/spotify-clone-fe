// // src/services/authService.ts
// import api from './api';

// export const AuthService = {
//     // 1. Đăng nhập và lưu cả token vào localStorage
//     login: async (username: string, password: string) => {
//         const response = await api.post('/auth/token', { username, password });
//         const { token, authenticated } = response.data.result;

//         if (authenticated) {
//             localStorage.setItem('token', token);
//             // Sau khi có token, lấy thông tin user
//             const userResponse = await api.get('/user/my');
//             const userData = userResponse.data.result;
//             localStorage.setItem('user', JSON.stringify(userData));
//             return userData;
//         }
//         throw new Error("Xác thực thất bại");
//     },

//     // 2. Làm mới Token (Refresh)
//     refreshToken: async () => {
//         const token = localStorage.getItem('token');
//         if (!token) return null;

//         try {
//             const response = await api.post('/auth/refresh', { token });
//             const newToken = response.data.result.token;
//             localStorage.setItem('token', newToken);
//             return newToken;
//         } catch (error) {
//             // Nếu refresh thất bại (token đã bị logout hoặc quá hạn refresh)
//             AuthService.logoutLocal();
//             return null;
//         }
//     },

//     // 3. Đăng xuất (Gọi API để vô hiệu hóa token ở backend)
//     logout: async () => {
//         const token = localStorage.getItem('token');
//         try {
//             if (token) {
//                 await api.post('/auth/logout', { token });
//             }
//         } finally {
//             AuthService.logoutLocal();
//         }
//     },

//     // Xóa dữ liệu ở trình duyệt ngay lập tức
//     logoutLocal: () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/'; // Đẩy về trang chủ hoặc trang login
//     }
// };

// src/services/authService.ts
import api from './api';

export const AuthService = {
    login: async (username: string, password: string) => {
        const res = await api.post('/auth/token', { username, password });
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

    logout: async () => {
        const token = localStorage.getItem('token');
        try {
            await api.post('/auth/logout', { token });
        } finally {
            localStorage.clear();
            window.location.reload();
        }
    }
};