import type { UserProfile } from '../constants/profile';

export const UserService = {
    // 1. GET: Lấy thông tin - Bỏ delay ảo, trả về ngay lập tức
    getProfile: async (): Promise<UserProfile | null> => {
        // Lấy trực tiếp từ localStorage, không cần chờ 500ms
        const saved = localStorage.getItem('user'); // Dùng thống nhất key 'user'
        if (saved) {
            return JSON.parse(saved);
        }
        return null;
    },

    // 2. UPDATE: Cập nhật thông tin & BẮN SỰ KIỆN ĐỒNG BỘ
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        return new Promise((resolve) => {
            // Giữ delay nhỏ ở đây để tạo cảm giác "đang lưu" cho UX (tùy chọn)
            setTimeout(() => {
                const saved = localStorage.getItem('user');
                const currentUser = saved ? JSON.parse(saved) : {};

                // Gộp thông tin cũ và mới
                const updatedUser = { ...currentUser, ...data };

                // Lưu lại vào cả 2 key để đảm bảo tương thích
                localStorage.setItem('user', JSON.stringify(updatedUser));
                localStorage.setItem('user_profile', JSON.stringify(updatedUser));

                // --- QUAN TRỌNG NHẤT ---
                // Bắn sự kiện để Header (Avatar) và Sidebar cập nhật ngay lập tức
                window.dispatchEvent(new Event('user-update')); 
                // ------------------------

                resolve(updatedUser);
            }, 300); // Delay 300ms cho mượt
        });
    },

    // 3. UPLOAD: Giả lập upload ảnh
    uploadAvatar: async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Tạo URL ảo từ file người dùng chọn
                const fakeUrl = URL.createObjectURL(file);
                resolve(fakeUrl);
            }, 1000); // Giả lập mạng chậm khi upload ảnh
        });
    }
};