import { useState, useEffect, useCallback } from 'react';
import { playlistApi } from '../components/Sidebar/playlistApi';
import type { PlaylistResponse } from '../components/Sidebar/playlistApi';

export const usePlaylists = () => {
    const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
            // Lấy danh sách playlist của chính mình từ Backend
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
    }, []);

    // Hàm tạo playlist mới từ giao diện
    const createNewPlaylist = async (formData: FormData) => {
        try {
            const res = await playlistApi.createPlaylist(formData);
            if (res.data.code === 1000) {
                await fetchPlaylists(); // Render lại danh sách Sidebar lập tức
                return res.data.result;
            }
            throw new Error("Lỗi kết nối Server");
        } catch (error) {
            console.error("Lỗi khi tạo playlist:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [fetchPlaylists]);

    return {
        playlists,
        isLoading,
        error,
        refetchPlaylists: fetchPlaylists,
        createNewPlaylist
    };
};