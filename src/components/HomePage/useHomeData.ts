// src/components/HomePage/hooks/useHomeData.ts
import { useState, useEffect } from 'react';
import api from '../../services/api';

export const useHomeData = (activeTab: string) => {
    const [data, setData] = useState({
        recentlyPlayed: [] as any[],
        topLikedSongs: [] as any[],    // Từ LikeSongController
        topStreamedSongs: [] as any[], // Từ SongStreamService
        newAlbums: [] as any[],        // Dành cho AlbumService
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            try {
                // Gọi API song song. Dùng allSettled để 1 API tạch thì các API khác vẫn sống
                const [likedRes, streamRes, albumRes] = await Promise.allSettled([
                    api.get('/like/top?size=10'),  // Đã có trong LikeSongController
                    api.get('/stream/top'),        // Giả định API từ SongStreamService.getTopStreamSongs()
                    api.get('/album?size=10')      // Giả định API lấy Album
                ]);

                // Bóc tách dữ liệu an toàn
                const topLiked = likedRes.status === 'fulfilled' ? likedRes.value.data?.result?.content || [] : [];
                const topStreamed = streamRes.status === 'fulfilled' ? streamRes.value.data?.result || [] : [];
                const albums = albumRes.status === 'fulfilled' ? albumRes.value.data?.result?.content || [] : [];

                // MOCK DATA cho Phát gần đây (Chờ bạn code xong API)
                const mockRecentlyPlayed = [
                    {
                        songId: 'mock1',
                        songTitle: 'Tính năng sắp ra mắt',
                        artistName: 'Đang code Backend...',
                        coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop'
                    }
                ];

                setData({
                    recentlyPlayed: mockRecentlyPlayed,
                    topLikedSongs: topLiked,
                    topStreamedSongs: topStreamed,
                    newAlbums: albums,
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, [activeTab]);

    return { data, isLoading };
};