
// src/components/Settings/hooks/usePrivacySettings.ts
import { useState } from 'react';
import api from '../../services/api';
export const usePrivacySettings = () => {
    const [isPublicProfile, setIsPublicProfile] = useState(true);
    const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

    const togglePrivacy = async () => {
        setIsUpdatingPrivacy(true);
        // Cập nhật UI trước cho mượt (Optimistic UI)
        setIsPublicProfile((prev) => !prev);

        try {
            const res = await api.put('/user/profile/privacy');
            if (res.data.code === 1000) {
                // Xác nhận lại trạng thái thật từ Backend trả về
                setIsPublicProfile(res.data.result);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi cập nhật quyền riêng tư", error);
            // Revert lại trạng thái cũ nếu API lỗi
            setIsPublicProfile((prev) => !prev);
            return false;
        } finally {
            setIsUpdatingPrivacy(false);
        }
    };

    return {
        isPublicProfile,
        setIsPublicProfile, // Expose hàm này để đồng bộ với dữ liệu user ban đầu
        isUpdatingPrivacy,
        togglePrivacy
    };
};