import api from './api';
import type { UserProfile } from '../constants/profile';
import { setUICache, getUICache } from '../utils/userStorage';

export const UserService = {
    // 1. GET: Lấy thông tin user thực từ server (không tin localStorage)
    getProfile: async (): Promise<UserProfile | null> => {
        // Nếu không có ui_cache, chắc chắn là khách (Guest)
        // -> Trả về null luôn để tránh gọi API /user/my vô ích gây lỗi 401 đỏ console.
        if (!getUICache()) {
            return null;
        }

        // Auth trạng thái được xác định bởi httpOnly cookie — không cần kiểm tra localStorage.token nữa
        // Nếu không có cookie hợp lệ, server sẽ trả 401 → được bắt ở catch block phía dưới
        try {
            const res = await api.get('/user/my');
            const user: UserProfile = res.data?.result ?? null;

            if (user) {
                // ✅ Chỉ cache 3 field tối giản cho UI (avatar, tên) – không lưu email/role
                setUICache(user);
            }
            return user;
        } catch (err: any) {
            const status = err?.response?.status;

            // Token không hợp lệ / hết hạn (401/403) → trả về null
            // Việc clearSession() + user-logout đã được api.ts interceptor xử lý rồi
            // Không dispatch lại ở đây để tránh double-trigger gây reload vòng lặp
            if (status === 401 || status === 403) {
                return null;
            }

            // Lỗi mạng tạm thời (ERR_NETWORK, 5xx, ...) → fallback về UI cache
            // Cache này chỉ có id/name/avatarUrl nên an toàn hơn trước
            console.error('[UserService] Lỗi mạng, dùng UI cache tạm:', err);
            const cached = getUICache();
            // Trả về partial profile – caller cần handle null cho các field nhạy cảm
            return cached as unknown as UserProfile | null;
        }
    },

    // 2. UPDATE: Gửi lên server và đồng bộ lại UI cache
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const res = await api.patch('/user/my', data);
        const updatedUser: UserProfile = res.data?.result;

        // ✅ Chỉ cập nhật UI cache sau khi server xác nhận thành công
        setUICache(updatedUser);

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