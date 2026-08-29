// src/hooks/usePremiumStatus.ts
/**
 * ⚠️  BẢO MẬT – is_premium trong localStorage:
 *   - Chỉ là UI hint (để render nhanh khi load trang) – CÓ THỂ BỊ GIẢ MẠO
 *   - KHÔNG được dùng để guard routes hoặc ẩn/hiện tính năng premium
 *   - Mọi quyết định authorization phải dựa vào kết quả verify từ server (hook này đã làm)
 */
import { useState, useEffect } from 'react';
import api from '../services/api';

/** Đọc hint từ localStorage – chỉ dùng để render UI ban đầu nhanh hơn */
const getStoredPremiumHint = (): boolean | null => {
    const val = localStorage.getItem('is_premium');
    return val !== null ? val === 'true' : null;
};

let cachedPremium: boolean | null = getStoredPremiumHint(); // module-level cache
let hasFetchedThisSession = false;

export const usePremiumStatus = () => {
    // Initial state from cache if available
    const [isPremium, setIsPremium] = useState<boolean>(cachedPremium ?? false);
    const [isLoading, setIsLoading] = useState<boolean>(!hasFetchedThisSession);

    useEffect(() => {
        // If we already verified with server this session, just use cache
        if (hasFetchedThisSession && cachedPremium !== null) {
            setIsPremium(cachedPremium);
            setIsLoading(false);
            return;
        }

        // Mark as fetching to prevent duplicate calls from other components mounting simultaneously
        hasFetchedThisSession = true;

        api.get('/user/my-premium')
            .then(res => {
                if (res.data.code === 1000) {
                    const val = Boolean(res.data.result);
                    cachedPremium = val;
                    localStorage.setItem('is_premium', String(val));
                    setIsPremium(val);
                }
            })
            .catch(() => {
                setIsPremium(false);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Lắng nghe event 'premium-updated' bắn từ PlanCard sau khi thanh toán thành công
    // hoặc đăng nhập/đăng xuất
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<{ isPremium: boolean }>).detail;
            if (detail && typeof detail.isPremium === 'boolean') {
                cachedPremium = detail.isPremium;
                localStorage.setItem('is_premium', String(detail.isPremium));
                setIsPremium(detail.isPremium);
            } else {
                // Event user-update (đăng xuất/đăng nhập)
                hasFetchedThisSession = false;
                cachedPremium = null;
                localStorage.removeItem('is_premium');
            }
        };
        window.addEventListener('premium-updated', handler);
        window.addEventListener('user-update', handler);
        window.addEventListener('user-logout', handler);
        return () => {
            window.removeEventListener('premium-updated', handler);
            window.removeEventListener('user-update', handler);
            window.removeEventListener('user-logout', handler);
        };
    }, []);

    // Hàm để invalidate cache (gọi sau khi thanh toán thành công)
    const refetchPremium = async () => {
        cachedPremium = null;
        setIsLoading(true);
        try {
            const res = await api.get('/user/my-premium');
            if (res.data.code === 1000) {
                const val = Boolean(res.data.result);
                cachedPremium = val;
                localStorage.setItem('is_premium', String(val));
                setIsPremium(val);
            }
        } catch {
            setIsPremium(false);
        } finally {
            setIsLoading(false);
        }
    };

    return { isPremium, isLoading, refetchPremium };
};
