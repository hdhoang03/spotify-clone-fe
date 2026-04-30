import { useState, useEffect } from 'react';
// Import api instance bạn đã cấu hình từ file api.ts
import api from '../../services/api';

// --- 1. ĐỊNH NGHĨA TYPES (Dựa trên Java DTO) ---
export interface SearchSongResponse {
    id: string;
    title: string;
    coverUrl: string;
    audioUrl: string;
    artistName: string;
    artistId: string;
}

export interface ArtistResponse {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    followerCount: number;
    songCount: number;
    country: string;
}

export interface AlbumResponse {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    songCount: number;
    artistName: string;
    releaseDate: string;
}

export interface SearchResponseData {
    songs: SearchSongResponse[];
    artists: ArtistResponse[];
    albums: AlbumResponse[];
    users: UserSummaryResponse[];
    categories?: any[]; // Nếu bạn có trả về categories
}

export interface UserSummaryResponse {
    id: string;
    username: string;
    avatarUrl: string;
}

// --- 2. CUSTOM HOOK ---
export const useSearchApi = (keyword: string) => {
    const [data, setData] = useState<SearchResponseData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Nếu keyword rỗng hoặc toàn dấu cách, reset data và không gọi API
        if (!keyword.trim()) {
            setData(null);
            return;
        }

        // Kỹ thuật Debounce: Đợi 500ms sau khi người dùng ngừng gõ mới gọi API
        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
                // Base response của bạn có dạng { code: 1000, result: { ... } }
                if (response.data.code === 1000) {
                    setData(response.data.result);
                }
            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
                setError("Có lỗi xảy ra khi tìm kiếm.");
            } finally {
                setIsLoading(false);
            }
        }, 500);

        // Cleanup function: Xóa timeout cũ nếu người dùng tiếp tục gõ
        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    return { data, isLoading, error };
};