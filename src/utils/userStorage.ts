/**
 * userStorage.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Quy tắc bảo mật localStorage:
 *   localStorage là bộ nhớ CÔNG KHAI — mọi script trên trang đều đọc được.
 *   → Chỉ lưu dữ liệu tối giản cần cho UI: id, name, avatarUrl.
 *   → KHÔNG lưu: email, role, birthdate, phone, hay bất kỳ dữ liệu nhạy cảm nào.
 *   → KHÔNG dùng cache này để quyết định authorization (luôn verify từ server).
 * ──────────────────────────────────────────────────────────────────────────────
 */

import type { UICacheUser } from '../constants/profile';

/** Key duy nhất cho UI cache – tên rõ ràng, tránh nhầm với full user object */
const UI_CACHE_KEY = 'ui_cache';

/**
 * Keys cũ cần migrate sạch khi logout.
 * Xóa để không để lại dữ liệu thừa từ version trước.
 */
const LEGACY_KEYS = ['user', 'user_profile', 'token'];

/** Session keys – bị xóa khi logout, KHÔNG xóa settings/i18n
 *  Lưu ý: 'token' đã được chuyển sang httpOnly cookie — không còn trong localStorage
 */
export const SESSION_KEYS = [UI_CACHE_KEY, 'is_premium'] as const;

// ─── Read ────────────────────────────────────────────────────────────────────

/** Lấy UI cache từ localStorage. Trả null nếu không có hoặc lỗi parse. */
export const getUICache = (): UICacheUser | null => {
    try {
        const raw = localStorage.getItem(UI_CACHE_KEY);
        return raw ? (JSON.parse(raw) as UICacheUser) : null;
    } catch {
        return null;
    }
};

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Lưu UI cache – chỉ pick 3 fields an toàn từ bất kỳ object nào.
 * Dù truyền vào full UserProfile hay bất cứ thứ gì, chỉ 3 fields được lưu.
 */
export const setUICache = (user: { id: string; name: string; avatarUrl?: string }): void => {
    const safe: UICacheUser = {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
    };
    localStorage.setItem(UI_CACHE_KEY, JSON.stringify(safe));
};

// ─── Clear ───────────────────────────────────────────────────────────────────

/**
 * Xóa session khi logout:
 *   - Xóa token, ui_cache, is_premium
 *   - Xóa cả các key cũ (user, user_profile) để migration sạch
 *   - GIỮ NGUYÊN: springtunes_settings, i18nextLng (preferences người dùng)
 */
export const clearSession = (): void => {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
};

// ─── Token helpers ────────────────────────────────────────────────────────────

/**
 * @deprecated Token đã chuyển sang httpOnly Cookie — không còn lưu trong localStorage.
 * Hàm này luôn trả về null. Giữ lại để không bể gà gọi vãn còn sỵ dụng nó.
 */
export const getToken = (): string | null => null;

/** @deprecated Dùng getUICache() thay thế */
export const getUserFromStorage = getUICache;

/** @deprecated Dùng setUICache() thay thế */
export const setUserToStorage = setUICache;

/** @deprecated Dùng clearSession() thay thế */
export const clearUserFromStorage = clearSession;

/** @deprecated Dùng getToken() thay thế */
export const getTokenFromStorage = getToken;
