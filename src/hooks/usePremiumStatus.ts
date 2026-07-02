// src/hooks/usePremiumStatus.ts
import { useState, useEffect } from 'react';
import api from '../services/api';

const getStoredPremium = (): boolean | null => {
    const val = localStorage.getItem('is_premium');
    return val !== null ? val === 'true' : null;
};

let cachedPremium: boolean | null = getStoredPremium(); // module-level cache để tránh gọi API nhiều lần

export const usePremiumStatus = () => {
    const [isPremium, setIsPremium] = useState<boolean>(cachedPremium ?? false);
    const [isLoading, setIsLoading] = useState<boolean>(cachedPremium === null);

    useEffect(() => {
        if (cachedPremium !== null) {
            setIsPremium(cachedPremium);
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

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
    // → cập nhật state cho TẤT CẢ component đang dùng hook này (PlayerOptionsMenu, ...)
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<{ isPremium: boolean }>).detail;
            cachedPremium = detail.isPremium; // Cập nhật cache module
            localStorage.setItem('is_premium', String(detail.isPremium));
            setIsPremium(detail.isPremium);
        };
        window.addEventListener('premium-updated', handler);
        return () => window.removeEventListener('premium-updated', handler);
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
