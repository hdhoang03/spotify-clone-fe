import { useState, useEffect } from 'react';
import api from '../../services/api';
import { likeApi } from '../../services/likeApi';
import type { SongInfo } from './types';

import { getUICache } from '../../utils/userStorage';

export const useSystemSongs = () => {
    const [systemSongs, setSystemSongs] = useState<SongInfo[]>([]);
    const [likedSongs, setLikedSongs] = useState<string[]>([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                // Fetch up to 150 songs from the system to provide context for AI recommendations
                const res = await api.get('/song/allSongs', { params: { size: 150 } });
                const songsData = res.data.result?.content || [];
                
                const formattedSongs: SongInfo[] = songsData.map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    artist: s.artistName || s.artist?.name || s.artist || 'Unknown',
                    artistId: s.artistId || s.artist?.id || '',
                    albumId: s.albumId || '',
                    albumName: s.albumName || '',
                    coverUrl: s.coverUrl || '',
                    duration: s.duration || 0,
                    audioUrl: s.audioUrl || '',
                    isLiked: s.isLiked ?? false,
                    featuredArtists: s.featuredArtists || [],
                    lyrics: s.lyrics || ''
                }));
                
                setSystemSongs(formattedSongs);
            } catch (err) {
                console.error('Failed to fetch system songs for AI context', err);
            }
        };

        const fetchLikedSongs = async () => {
            // Chỉ fetch liked songs nếu user đã đăng nhập (tránh lỗi 401)
            if (!getUICache()) return;

            try {
                const res = await likeApi.getMyLikedSongs(1, 50);
                if (res.data.code === 1000) {
                    const data = res.data.result.content;
                    const likedTitles = data.map((item: any) => `"${item.song?.title}" - ${item.song?.artistName || item.song?.artist?.name || 'Unknown'}`);
                    setLikedSongs(likedTitles);
                }
            } catch (error) {
                console.error('Failed to fetch liked songs for AI context', error);
            }
        };

        fetchSongs();
        fetchLikedSongs();
    }, []);

    return { systemSongs, likedSongs };
};
