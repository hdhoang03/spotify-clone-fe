import { useState } from 'react';
import api from '../../services/api';

export const useAccountSettings = () => {
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // 1. API Cập nhật Profile (Tên, Avatar)
    const updateProfile = async (name: string, file: File | null, isRemoved?: boolean) => {
        setIsSavingProfile(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            if (file) formData.append('avatar', file);
            if (isRemoved) formData.append('isRemoved', 'true');

            const res = await api.put('/user/profile/update', formData);
            if (res.data.code === 1000) {
                return res.data.result;
            }
            return false;
        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
            return false;
        } finally {
            setIsSavingProfile(false);
        }
    };

    // 2. API Đổi mật khẩu
    const changePassword = async (oldPassword: string, newPassword: string) => {
        if (!oldPassword || !newPassword) {
            setPasswordMessage({ text: 'Vui lòng nhập đầy đủ mật khẩu!', type: 'error' });
            return false;
        }

        setIsChangingPassword(true);
        setPasswordMessage(null);
        try {
            const res = await api.post('/auth/change-password', { oldPassword, newPassword });
            if (res.data.code === 1000) {
                setPasswordMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
                return true;
            }
            return false;
        } catch (error: any) {
            setPasswordMessage({
                text: error.response?.data?.message || 'Mật khẩu cũ không chính xác!',
                type: 'error'
            });
            return false;
        } finally {
            setIsChangingPassword(false);
        }
    };

    return {
        isSavingProfile,
        isChangingPassword,
        passwordMessage,
        setPasswordMessage,
        updateProfile,
        changePassword
    };
};