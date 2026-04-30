// pages/Artist/useArtist.ts
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api'

export interface ArtistData {
    id: string;
    name: string;
    bio: string;
    coverImage: string;
    avatarUrl: string;
    monthlyListeners: number;
    globalRank: number | null;
    isVerified?: boolean;
}

export const useArtist = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const [artistData, setArtistData] = useState<ArtistData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArtist = async () => {
            if (!id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get(`/artist/${id}`);
                if (response.data.code === 1000) {
                    const data = response.data.result;

                    // Map dữ liệu từ Backend sang Frontend
                    setArtistData({
                        id: data.id,
                        name: data.name,
                        bio: data.description || "Nghệ sĩ này chưa có tiểu sử.",
                        coverImage: data.avatarUrl, // Dùng avatar làm ảnh bìa tạm
                        avatarUrl: data.avatarUrl,
                        monthlyListeners: data.followerCount || 0,
                        globalRank: null, // Backend chưa hỗ trợ
                        isVerified: true // Mock data cho vui, backend chưa có
                    });
                } else {
                    setError("Không thể tải thông tin nghệ sĩ.");
                }
            } catch (err) {
                console.error("Lỗi fetch artist:", err);
                setError("Không tìm thấy nghệ sĩ này.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtist();
    }, [id]);

    return { id, artistData, isLoading, error };
};