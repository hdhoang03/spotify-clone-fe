import { useState, useEffect, useCallback } from 'react';
import { playlistApi } from './playlistApi';
import { usePlaylistStore } from '../../stores/usePlaylistStore'

export const usePlaylists = () => {
    const playlists = usePlaylistStore(state => state.playlists);
    const hasFetched = usePlaylistStore(state => state.hasFetched);
    const setPlaylists = usePlaylistStore(state => state.setPlaylists);
    const addPlaylist = usePlaylistStore(state => state.addPlaylist);

    const [isLoading, setIsLoading] = useState(!hasFetched);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaylists = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            setError("Vui lòng đăng nhập để xem thư viện.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await playlistApi.getMyPlaylists(1, 50);
            if (response.data.code === 1000) {
                setPlaylists(response.data.result.content || []);
            }
        } catch (err) {
            setError("Không thể tải thư viện playlist. Vui lòng thử lại sau.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [setPlaylists]); // Thêm setPlaylists vào dependency

    useEffect(() => {
        // 2. CHỈ FETCH KHI CHƯA FETCH LẦN NÀO, thay vì check length === 0
        if (!hasFetched) {
            fetchPlaylists();
        } else {
            setIsLoading(false);
        }
    }, [fetchPlaylists, hasFetched]);

    return {
        playlists,
        isLoading,
        error,
        refetchPlaylists: fetchPlaylists,
        createNewPlaylist: async (formData: FormData) => {
            try {
                const res = await playlistApi.createPlaylist(formData);
                if (res.data.code === 1000) {
                    addPlaylist(res.data.result);
                    return res.data.result;
                }
                throw new Error("Lỗi kết nối Server");
            } catch (error) {
                console.error("Lỗi khi tạo playlist:", error);
                throw error;
            }
        }
    };
};