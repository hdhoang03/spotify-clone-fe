import { useState, useEffect } from 'react';
import api from '../../services/api';

export const normalizeSong = (song: any): any => ({
    id: song.id || song.songId,
    title: song.title || song.songTitle,
    artist: song.artistName || song.artist?.name || song.artist || 'Nghệ sĩ SpringTunes',
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
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            const isLoggedIn = !!localStorage.getItem('token');

            try {
                const followingSuffix = isLoggedIn && isFollowingMode ? '?following=true' : '';
                const artistEndpoint = (isLoggedIn && isFollowingMode) ? '/user/artist/me' : '/artist/all';

                const [streamRes, albumRes, artistRes, likedRes] = await Promise.allSettled([
                    api.get(`/stream/top${followingSuffix}`),
                    api.get(`/albums/all${followingSuffix}`),
                    api.get(`${artistEndpoint}${followingSuffix}`),
                    api.get(`/like/top${followingSuffix}`)
                ]);

                const rawStreamed = streamRes.status === 'fulfilled' ? streamRes.value.data?.result || [] : [];
                const albums = albumRes.status === 'fulfilled' ? albumRes.value.data?.result?.content || [] : [];
                const artists = artistRes.status === 'fulfilled' ? artistRes.value.data?.result?.content || [] : [];
                const rawLiked = likedRes.status === 'fulfilled' ? likedRes.value.data?.result?.content || [] : [];

                setData({
                    topStreamedSongs: rawStreamed.map(normalizeSong),
                    topLikedSongs: rawLiked.map(normalizeSong),
                    newAlbums: albums,
                    artists: artists,
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