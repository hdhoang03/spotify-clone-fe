import { useState, useEffect, useCallback } from 'react';
import { playlistApi } from './playlistApi';
import { useTranslation } from 'react-i18next';
import type { PlaylistResponse } from './playlistApi';
import { usePlaylistStore } from '../../stores/usePlaylistStore';
import { normalizeSong } from '../HomePage/useHomeData';

export const usePlaylistDetail = (playlistId: string | undefined) => {
    const { t } = useTranslation();
    const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
    const [songs, setSongs] = useState<any[]>([]);

    const updatePlaylistStore = usePlaylistStore(state => state.updatePlaylist);

    // States cho Playlist
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States cho danh sách bài hát (Phân trang)
    const [isLoadingSongs, setIsLoadingSongs] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    // 1. Fetch thông tin chi tiết Playlist
    const fetchDetail = useCallback(async () => {
        if (!playlistId) return;

        // Chỉ hiện skeleton khi mới vào trang (chưa có data hoặc chuyển sang playlist khác)
        if (!playlist || playlist.id !== playlistId) {
            setIsLoading(true);
        }

        try {
            const response = await playlistApi.getPlaylistById(playlistId);
            if (response.data.code === 1000) {
                setPlaylist(response.data.result);
                // KHÔNG setSongs ở đây nữa vì backend không còn trả về mảng songs gộp chung
            }
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setPlaylist(null);
                setError(t('playlist.not_exist'));
            } else {
                setError(t('playlist.fetch_error'));
                console.error("Lỗi fetch playlist:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [playlistId]);

    // 2. Fetch danh sách bài hát có phân trang (hoặc tìm kiếm)
    const fetchSongs = useCallback(async (pageNum: number, isLoadMore = false, keyword = searchKeyword) => {
        if (!playlistId) return;
        setIsLoadingSongs(true);
        try {
            let res;
            if (keyword && keyword.trim() !== '') {
                // Khi search, ta lấy nhiều kết quả hơn (vd 50 bài)
                res = await playlistApi.searchSongs(playlistId, keyword, pageNum, 10);
            } else {
                res = await playlistApi.getPlaylistSongs(playlistId, pageNum, 20); // Lấy 20 bài 1 trang
            }

            if (res.data.code === 1000) {
                const newSongs = res.data.result.content.map(normalizeSong);
                setSongs(prev => isLoadMore ? [...prev, ...newSongs] : newSongs);
                setHasMore(!res.data.result.last); // Cờ 'last' từ Spring Boot Page
            }
        } catch (error) {
            console.error("Lỗi fetch songs:", error);
        } finally {
            setIsLoadingSongs(false);
        }
    }, [playlistId, searchKeyword]);

    // Gọi API khi vào trang (Chỉ gọi 1 lần khi đổi playlistId)
    useEffect(() => {
        if (playlistId) {
            fetchDetail();
            fetchSongs(1, false, '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistId]);

    // Hàm gọi khi bấm "Xem thêm"
    const loadMoreSongs = () => {
        if (!isLoadingSongs && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchSongs(nextPage, true);
        }
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = useCallback((keyword: string) => {
        setSearchKeyword(keyword);
        setPage(1);
        fetchSongs(1, false, keyword);
    }, [fetchSongs]);

    // Xử lý Cập nhật Playlist
    const handleUpdate = async (formData: FormData) => {
        if (!playlistId) return false;
        try {
            const res = await playlistApi.updatePlaylist(playlistId, formData);
            if (res.data.code === 1000) {
                await fetchDetail();

                // Update global store to reflect changes in sidebar
                updatePlaylistStore(playlistId, {
                    name: res.data.result?.name || formData.get('name') as string,
                    description: res.data.result?.description || formData.get('description') as string,
                    coverUrl: res.data.result?.coverUrl
                });

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
        handleUpdate,
        handleSearch
    };
};