// src/hooks/useUserProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services/userService';
import type { UserProfile } from '../constants/profile';

// Event bus đơn giản để báo hiệu update
const USER_UPDATE_EVENT = 'user-profile-updated';

export const useUserProfile = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm load dữ liệu
    const fetchUser = useCallback(async () => {
        try {
            const data = await UserService.getProfile();
            setUser(data);
        } catch (error) {
            console.error("Failed to load user", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect 1: Load lần đầu
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Effect 2: Lắng nghe sự kiện update từ nơi khác
    useEffect(() => {
        const handleUpdate = () => {
            fetchUser(); // Load lại data mới nhất từ "Server" (localStorage)
        };
        window.addEventListener(USER_UPDATE_EVENT, handleUpdate);
        return () => window.removeEventListener(USER_UPDATE_EVENT, handleUpdate);
    }, [fetchUser]);

    // Hàm update dùng chung cho cả app
    const updateInfo = async (data: Partial<UserProfile>) => {
        setIsLoading(true);
        try {
            await UserService.updateProfile(data);
            // Bắn pháo hiệu báo các component khác update đi!
            window.dispatchEvent(new Event(USER_UPDATE_EVENT));
            return true;
        } catch (e) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm upload avatar riêng
    const updateAvatar = async (file: File) => {
        setIsLoading(true);
        try {
            const newUrl = await UserService.uploadAvatar(file);
            await updateInfo({ avatarUrl: newUrl }); // Update URL vào profile
            return true;
        } catch (e) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { user, isLoading, updateInfo, updateAvatar };
};