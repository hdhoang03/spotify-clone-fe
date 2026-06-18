import { useState, useEffect } from 'react';
import api from '../services/api';

export const useLikeSong = (songId?: string, initialIsLiked: boolean = false) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    // Lắng nghe sự kiện đồng bộ từ các Component khác
    useEffect(() => {
        const handleSync = (event: CustomEvent) => {
            // Nếu bài hát được like ở nơi khác trùng ID với bài hát hiện tại, cập nhật state
            if (event.detail.songId === songId) {
                setIsLiked(event.detail.isLiked);
            }
        };

        window.addEventListener('LIKE_STATUS_SYNC', handleSync as EventListener);
        return () => window.removeEventListener('LIKE_STATUS_SYNC', handleSync as EventListener);
    }, [songId]);

    // Kiểm tra trạng thái ban đầu
    useEffect(() => {
        if (!songId) return;
        const checkLikeStatus = async () => {
            try {
                const res = await api.get(`/like/check/${songId}`);
                if (res.data.code === 1000) {
                    setIsLiked(res.data.result);
                }
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái Like:", error);
            }
        };
        checkLikeStatus();
    }, [songId]);

    // Hàm Toggle
    const toggleLike = async () => {
        if (!songId) return;

        // Optimistic UI update (Cập nhật UI trước cho mượt)
        const newState = !isLiked;
        setIsLiked(newState);

        // Bắn sự kiện ra toàn bộ App để đồng bộ màu (Search, Player, Menu...)
        window.dispatchEvent(new CustomEvent('LIKE_STATUS_SYNC', {
            detail: { songId, isLiked: newState }
        }));

        try {
            const res = await api.post(`/like/${songId}/toggle`);
            if (res.data.code === 1000) {
                // Đảm bảo trạng thái khớp với Server
                if (res.data.result !== newState) {
                    setIsLiked(res.data.result);
                    window.dispatchEvent(new CustomEvent('LIKE_STATUS_SYNC', {
                        detail: { songId, isLiked: res.data.result }
                    }));
                }
            }
        } catch (error) {
            console.error("Lỗi khi toggle Like:", error);
            // Revert lại trạng thái nếu API lỗi
            setIsLiked(!newState);
            window.dispatchEvent(new CustomEvent('LIKE_STATUS_SYNC', {
                detail: { songId, isLiked: !newState }
            }));
        }
    };

    return { isLiked, toggleLike };
};