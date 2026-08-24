import api from './api';
import type { UserProfile } from '../constants/profile';

export const UserService = {
    // 1. GET: Lấy thông tin user thực từ server (không đọc localStorage)
    getProfile: async (): Promise<UserProfile | null> => {
        const token = localStorage.getItem('token');

        // Guest chưa đăng nhập → trả về null ngay, không gọi API
        if (!token || token === 'null' || token === 'undefined') return null;

        try {
            const res = await api.get('/user/my');
            const user = res.data?.result ?? null;

            // Cập nhật cache localStorage với dữ liệu mới nhất từ server
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('user_profile', JSON.stringify(user));
            }
            return user;
        } catch (err: any) {
            const status = err?.response?.status;

            // Token không hợp lệ / hết hạn (401/403) → xóa session hẳn, trả về null
            // KHÔNG fallback về cache vì cache có thể chứa token/role giả
            if (status === 401 || status === 403) {
                console.warn('[UserService] Token invalid, clearing session...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('user_profile');
                window.dispatchEvent(new Event('user-update'));
                return null;
            }

            // Lỗi mạng tạm thời (ERR_NETWORK, 5xx, ...) → fallback về cache để không mất UX
            console.error('[UserService] Lỗi mạng, dùng cache tạm:', err);
            const cached = localStorage.getItem('user');
            return cached ? JSON.parse(cached) : null;
        }
    },

    // 2. UPDATE: Gửi lên server và đồng bộ lại localStorage
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const res = await api.patch('/user/my', data);
        const updatedUser = res.data?.result;

        // Cập nhật cache sau khi server xác nhận thành công
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('user_profile', JSON.stringify(updatedUser));

        // Bắn sự kiện để Header (Avatar) và Sidebar cập nhật ngay lập tức
        window.dispatchEvent(new Event('user-update'));

        return updatedUser;
    },

    // 3. UPLOAD: Upload ảnh lên server thực qua multipart/form-data
    uploadAvatar: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post('/user/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Backend trả về URL CDN thực (Cloudinary, S3,...)
        return res.data?.result?.avatarUrl ?? res.data?.result;
    }
};