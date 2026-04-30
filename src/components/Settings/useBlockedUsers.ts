// src/components/Settings/hooks/useBlockedUsers.ts
import { useState, useCallback } from 'react';
import api from '../../services/api';

export const useBlockedUsers = () => {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBlockedUsers = useCallback(async (pageNum: number, isReset = false) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/user/blocked?page=${pageNum}&size=10`);
            const data = res.data.result;

            if (isReset) {
                setBlockedUsers(data.content);
            } else {
                setBlockedUsers((prev) => [...prev, ...data.content]);
            }

            setHasMore(!data.last);
            setPage(pageNum);
        } catch (error) {
            console.error("Lỗi lấy danh sách chặn:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const unblockUser = async (userId: string) => {
        try {
            const res = await api.post(`/user/${userId}/block`);
            if (res.data.code === 1000) {
                // Gỡ chặn thành công thì xóa user đó khỏi danh sách state
                setBlockedUsers((prev) => prev.filter(u => u.id !== userId));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi bỏ chặn:", error);
            return false;
        }
    };

    return {
        blockedUsers,
        isLoading,
        hasMore,
        page,
        fetchBlockedUsers,
        unblockUser
    };
};