// src/components/Settings/hooks/usePrivacySettings.ts
import { useState, useEffect } from 'react';
import api from '../../../services/api';

export const usePrivacySettings = () => {
    // Khởi tạo null = đang loading, tránh hiển thị sai trước khi fetch xong
    const [isPublicProfile, setIsPublicProfile] = useState<boolean>(true);
    const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);
    const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(true);

    // Fetch trạng thái thực từ API khi mount, thay vì chỉ tin vào localStorage
    useEffect(() => {
        const fetchPrivacyStatus = async () => {
            try {
                const res = await api.get('/user/my');
                if (res.data.code === 1000) {
                    const userData = res.data.result;
                    // Backend trả về field isPublicProfile (Spring Jackson camelCase)
                    const value = userData.isPublicProfile ?? userData.publicProfile ?? true;
                    setIsPublicProfile(Boolean(value));
                    // Đồng bộ lại localStorage để các nơi khác đọc nhất quán
                    try {
                        const stored = localStorage.getItem('user');
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            localStorage.setItem('user', JSON.stringify({ ...parsed, isPublicProfile: Boolean(value) }));
                        }
                    } catch {}
                }
            } catch (error) {
                // Fallback: đọc từ localStorage nếu API lỗi
                try {
                    const stored = localStorage.getItem('user');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        const value = parsed.isPublicProfile ?? parsed.publicProfile ?? true;
                        setIsPublicProfile(Boolean(value));
                    }
                } catch {}
                console.error('Lỗi lấy trạng thái quyền riêng tư', error);
            } finally {
                setIsLoadingPrivacy(false);
            }
        };
        fetchPrivacyStatus();
    }, []);

    const togglePrivacy = async () => {
        setIsUpdatingPrivacy(true);
        // Optimistic UI update
        const prevValue = isPublicProfile;
        setIsPublicProfile((prev) => !prev);

        try {
            const res = await api.put('/user/profile/privacy');
            if (res.data.code === 1000) {
                // Xác nhận lại trạng thái thật từ Backend
                const confirmed = Boolean(res.data.result);
                setIsPublicProfile(confirmed);
                // Đồng bộ localStorage
                try {
                    const stored = localStorage.getItem('user');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        localStorage.setItem('user', JSON.stringify({ ...parsed, isPublicProfile: confirmed }));
                    }
                } catch {}
                return true;
            }
            // Revert nếu code không phải 1000
            setIsPublicProfile(prevValue);
            return false;
        } catch (error) {
            console.error('Lỗi cập nhật quyền riêng tư', error);
            setIsPublicProfile(prevValue); // Revert
            return false;
        } finally {
            setIsUpdatingPrivacy(false);
        }
    };

    return {
        isPublicProfile,
        setIsPublicProfile,
        isUpdatingPrivacy,
        isLoadingPrivacy,
        togglePrivacy
    };
};
