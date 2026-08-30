import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getUICache } from '../../utils/userStorage';

export const normalizeSong = (song: any): any => ({
    id: song.id || song.songId,
    title: song.title || song.songTitle,
    artist: song.artistName || song.artist?.name || song.artist || 'Nghệ sĩ Springtunes',
    artistId: song.artistId || song.artist?.id || '',
    artistAvatar: song.artistAvatar || song.artist?.avatarUrl || null,
    featuredArtists: song.featuredArtists || [],
    albumId: song.albumId || null,
    albumName: song.albumName || null,
    coverUrl: song.coverUrl || '',
    duration: song.duration || 0,
    audioUrl: song.audioUrl || '',
    isLiked: song.isLiked ?? false,
    addedAt: song.addedAt ?? null,
    likeCount: song.likeCount ?? song.streamCount ?? null, // từ TopLikeSongResponse
    deleted: song.deleted || song.isDeleted || song.is_deleted || false,
});

export const useHomeData = (activeTab: string, isFollowingMode: boolean) => {
    const [data, setData] = useState({
        topLikedSongs: [] as any[],
        topStreamedSongs: [] as any[],
        newAlbums: [] as any[],
        artists: [] as any[],
        myLikedSongs: [] as any[],
        allSongs: [] as any[],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            const isLoggedIn = !!getUICache();

            try {
                const followingSuffix = isLoggedIn && isFollowingMode ? '?following=true' : '';
                const artistEndpoint = (isLoggedIn && isFollowingMode) ? '/user/artist/me' : '/artist/all';

                const apiCalls = [
                    api.get(`/stream/top${followingSuffix}`),
                    api.get(`/albums/all${followingSuffix}`),
                    api.get(`${artistEndpoint}${followingSuffix}`),
                    api.get(`/like/top${followingSuffix}`),
                    api.get('/song/allSongs', { params: { size: 100 } })
                ];

                if (isLoggedIn) {
                    apiCalls.push(api.get('/like/my', { params: { size: 100 } }));
                }

                const results = await Promise.allSettled(apiCalls);

                const rawStreamed = results[0].status === 'fulfilled' ? results[0].value.data?.result || [] : [];
                const albums = results[1].status === 'fulfilled' ? results[1].value.data?.result?.content || [] : [];
                const artists = results[2].status === 'fulfilled' ? results[2].value.data?.result?.content || [] : [];
                const rawLiked = results[3].status === 'fulfilled' ? results[3].value.data?.result?.content || [] : [];
                const rawAllSongs = results[4].status === 'fulfilled' ? results[4].value.data?.result?.content || [] : [];

                let rawMyLiked: any[] = [];
                if (isLoggedIn && results.length > 5 && results[5].status === 'fulfilled') {
                    const myLikedData = results[5].value.data?.result?.content || [];
                    // Extract song objects from like objects
                    rawMyLiked = myLikedData.map((item: any) => item.song).filter(Boolean);
                }

                setData({
                    topStreamedSongs: rawStreamed.map(normalizeSong),
                    topLikedSongs: rawLiked.map(normalizeSong),
                    newAlbums: albums,
                    artists: artists,
                    allSongs: rawAllSongs.map(normalizeSong),
                    myLikedSongs: rawMyLiked.map(normalizeSong),
                });
            } catch (error) {
                console.error('Lỗi tải dữ liệu trang chủ:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, [activeTab, isFollowingMode]);

    return { data, isLoading };
};