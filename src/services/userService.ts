// src/services/userService.ts
import type { UserProfile } from '../constants/profile';

// Mock data mặc định nếu chưa có gì trong localStorage
const DEFAULT_USER: UserProfile = {
    id: 'user_01',
    name: 'Hoang',
    email: 'dev@springtunes.com',
    avatarUrl: '',
    birthdate: '1999-01-01',
    publicPlaylistsCount: 5,
    followingCount: 12,
    followersCount: 100
};

// Giả lập độ trễ mạng (500ms)
const DELAY_MS = 500;

export const UserService = {
    // 1. GET: Lấy thông tin user
    getProfile: async (): Promise<UserProfile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const saved = localStorage.getItem('user_profile');
                resolve(saved ? JSON.parse(saved) : DEFAULT_USER);
            }, DELAY_MS);
        });
    },

    // 2. UPDATE: Cập nhật thông tin (Tên, Ngày sinh...)
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const saved = localStorage.getItem('user_profile');
                const currentUser = saved ? JSON.parse(saved) : DEFAULT_USER;

                const updatedUser = { ...currentUser, ...data };
                localStorage.setItem('user_profile', JSON.stringify(updatedUser));

                resolve(updatedUser);
            }, DELAY_MS);
        });
    },

    // 3. UPLOAD: Giả lập upload ảnh
    uploadAvatar: async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Ở thực tế: Gửi file lên Server -> Server trả về URL 'https://...'
                // Ở đây: Dùng URL ảo của trình duyệt
                const fakeUrl = URL.createObjectURL(file);
                resolve(fakeUrl);
            }, 1000); // Upload lâu hơn chút (1s)
        });
    }
};