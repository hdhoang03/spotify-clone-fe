/**
 * userStorage.ts
 * Tiện ích đọc/ghi user từ localStorage với error handling đồng nhất.
 * Thay thế các chỗ dùng localStorage.getItem('user') + JSON.parse() rải rác.
 */

const USER_KEY = 'user';
const USER_PROFILE_KEY = 'user_profile'; // key cũ, giữ để tương thích

/** Lấy user từ localStorage, trả null nếu không có hoặc lỗi parse */
export const getUserFromStorage = (): any | null => {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

/** Lưu user vào localStorage (cả 2 key để tương thích code cũ) */
export const setUserToStorage = (user: any): void => {
    const serialized = JSON.stringify(user);
    localStorage.setItem(USER_KEY, serialized);
    localStorage.setItem(USER_PROFILE_KEY, serialized);
};

/** Xóa user khỏi localStorage */
export const clearUserFromStorage = (): void => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
};

/** Lấy access token từ localStorage */
export const getTokenFromStorage = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('access_token') || null;
};
