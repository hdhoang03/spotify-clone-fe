// // src/hooks/usePlaylistDetail.ts
// import { useState, useEffect, useCallback } from 'react';
// import { playlistApi } from './playlistApi';
// import type { PlaylistResponse } from './playlistApi';

// export const usePlaylistDetail = (playlistId: string | undefined) => {
//     const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
//     const [songs, setSongs] = useState<any[]>([]); // Sẽ thay bằng SongResponse type
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const fetchDetail = useCallback(async () => {
//         if (!playlistId) return;
//         setIsLoading(true);
//         try {
//             const response = await playlistApi.getPlaylistById(playlistId);
//             if (response.data.code === 1000) {
//                 setPlaylist(response.data.result);
//                 setSongs(response.data.result.songs || []);
//             }
//         } catch (err: any) {
//             if (err?.response?.status === 404) {
//                 setPlaylist(null);
//                 setError("Playlist này không tồn tại hoặc đã bị xóa.");
//             } else {
//                 setError("Không thể tải thông tin Playlist.");
//                 console.error("Lỗi fetch playlist:", err);
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     }, [playlistId]);

//     useEffect(() => {
//         fetchDetail();
//     }, [fetchDetail]);

//     // Xử lý Cập nhật Playlist
//     const handleUpdate = async (formData: FormData) => {
//         if (!playlistId) return false;
//         try {
//             const res = await playlistApi.updatePlaylist(playlistId, formData);
//             if (res.data.code === 1000) {
//                 await fetchDetail(); // Refresh lại trang
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             console.error("Lỗi cập nhật:", error);
//             return false;
//         }
//     };

//     return { playlist, songs, isLoading, error, refetch: fetchDetail, handleUpdate };
// };

// src/hooks/usePlaylistDetail.ts
import { useState, useEffect, useCallback } from 'react';
import { playlistApi } from './playlistApi';
import type { PlaylistResponse } from './playlistApi';

export const usePlaylistDetail = (playlistId: string | undefined) => {
    const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
    const [songs, setSongs] = useState<any[]>([]);

    // States cho Playlist
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States cho danh sách bài hát (Phân trang)
    const [isLoadingSongs, setIsLoadingSongs] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 1. Fetch thông tin chi tiết Playlist
    const fetchDetail = useCallback(async () => {
        if (!playlistId) return;
        setIsLoading(true);
        try {
            const response = await playlistApi.getPlaylistById(playlistId);
            if (response.data.code === 1000) {
                setPlaylist(response.data.result);
                // KHÔNG setSongs ở đây nữa vì backend không còn trả về mảng songs gộp chung
            }
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setPlaylist(null);
                setError("Playlist này không tồn tại hoặc đã bị xóa.");
            } else {
                setError("Không thể tải thông tin Playlist.");
                console.error("Lỗi fetch playlist:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [playlistId]);

    // 2. Fetch danh sách bài hát có phân trang
    const fetchSongs = useCallback(async (pageNum: number, isLoadMore = false) => {
        if (!playlistId) return;
        setIsLoadingSongs(true);
        try {
            const res = await playlistApi.getPlaylistSongs(playlistId, pageNum, 20); // Lấy 20 bài 1 trang
            if (res.data.code === 1000) {
                const newSongs = res.data.result.content;
                setSongs(prev => isLoadMore ? [...prev, ...newSongs] : newSongs);
                setHasMore(!res.data.result.last); // Cờ 'last' từ Spring Boot Page
            }
        } catch (error) {
            console.error("Lỗi fetch songs:", error);
        } finally {
            setIsLoadingSongs(false);
        }
    }, [playlistId]);

    // Gọi API khi vào trang
    useEffect(() => {
        fetchDetail();
        fetchSongs(1);
    }, [fetchDetail, fetchSongs]);

    // Hàm gọi khi bấm "Xem thêm"
    const loadMoreSongs = () => {
        if (!isLoadingSongs && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchSongs(nextPage, true);
        }
    };

    // Xử lý Cập nhật Playlist
    const handleUpdate = async (formData: FormData) => {
        if (!playlistId) return false;
        try {
            const res = await playlistApi.updatePlaylist(playlistId, formData);
            if (res.data.code === 1000) {
                await fetchDetail();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            return false;
        }
    };

    const refetchAll = () => {
        fetchDetail();
        setPage(1);
        fetchSongs(1);
    };

    return {
        playlist,
        songs,
        isLoading,
        isLoadingSongs,
        error,
        hasMore,
        loadMoreSongs,
        refetch: refetchAll,
        handleUpdate
    };
};