import { useState, useEffect } from 'react';
import api from '../services/api';

// Cache lưu trạng thái Like của bài hát trên Client để tránh query liên tục
const likeStatusCache = new Map<string, boolean>();

export const useLikeSong = (songId?: string, initialIsLiked: boolean = false) => {
    const [isLiked, setIsLiked] = useState<boolean>(() => {
        if (songId && likeStatusCache.has(songId)) {
            return likeStatusCache.get(songId)!;
        }
        return initialIsLiked;
    });

    // Lắng nghe sự kiện đồng bộ từ các Component khác
    useEffect(() => {
        const handleSync = (event: CustomEvent) => {
            if (event.detail.songId === songId) {
                setIsLiked(event.detail.isLiked);
                likeStatusCache.set(event.detail.songId, event.detail.isLiked);
            }
        };

        window.addEventListener('LIKE_STATUS_SYNC', handleSync as EventListener);
        return () => window.removeEventListener('LIKE_STATUS_SYNC', handleSync as EventListener);
    }, [songId]);

    // Kiểm tra trạng thái ban đầu
    useEffect(() => {
        if (!songId) return;

        // Nếu trạng thái đã có trong Cache, không gọi API nữa
        if (likeStatusCache.has(songId)) {
            setIsLiked(likeStatusCache.get(songId)!);
            return;
        }

        const checkLikeStatus = async () => {
            try {
                const res = await api.get(`/like/check/${songId}`);
                if (res.data.code === 1000) {
                    const result = res.data.result;
                    likeStatusCache.set(songId, result);
                    setIsLiked(result);
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
        likeStatusCache.set(songId, newState);

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
                    likeStatusCache.set(songId, res.data.result);
                    window.dispatchEvent(new CustomEvent('LIKE_STATUS_SYNC', {
                        detail: { songId, isLiked: res.data.result }
                    }));
                }
            }
        } catch (error) {
            console.error("Lỗi khi toggle Like:", error);
            // Revert lại trạng thái nếu API lỗi
            setIsLiked(!newState);
            likeStatusCache.set(songId, !newState);
            window.dispatchEvent(new CustomEvent('LIKE_STATUS_SYNC', {
                detail: { songId, isLiked: !newState }
            }));
        }
    };

    return { isLiked, toggleLike };
};