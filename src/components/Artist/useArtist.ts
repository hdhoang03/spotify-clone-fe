import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'
import { useMusic } from '../../contexts/MusicContent';

export interface ArtistData {
    id: string;
    name: string;
    bio: string;
    coverImage: string;
    avatarUrl: string;
    isVerified?: boolean;
    followerCount: number;
    isFollowed?: boolean;
    songCount?: number;
    country?: string;
    socialAccounts?: Record<string, string>;
}

export const useArtist = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const navigate = useNavigate();
    const { playRadio } = useMusic();
    const [artistData, setArtistData] = useState<ArtistData | null>(null);
    const [popularTracks, setPopularTracks] = useState<any[]>([]);
    const [discography, setDiscography] = useState<any[]>([]);
    const [relatedArtists, setRelatedArtists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArtistInfoAndSongs = async () => {
            if (!id) return;
            setIsLoading(true);
            setError(null);

            try {
                const [artistRes, songsRes, albumsRes, relatedRes] = await Promise.all([
                    api.get(`/artist/${id}`),
                    api.get(`/song/artist/${id}`),
                    api.get(`/artist/albums/${id}`).catch(err => {
                        console.warn("Nghệ sĩ này chưa có album hoặc lỗi tải album:", err);
                        return { data: { code: 1000, result: [] } }; // Trả về mảng rỗng để không làm crash Promise.all
                    }),
                    api.get(`/artist/all?size=20`).catch(() => ({ data: { code: 1000, result: { content: [] } } }))
                ]);

                let currentArtistName = "";

                // 1. Xử lý thông tin Artist
                if (artistRes.data.code === 1000) {
                    const data = artistRes.data.result;
                    currentArtistName = data.name;

                    setArtistData({
                        id: data.id,
                        name: data.name,
                        bio: data.description || "Nghệ sĩ này chưa có tiểu sử.",
                        coverImage: data.avatarUrl,
                        avatarUrl: data.avatarUrl,
                        isVerified: true,
                        followerCount: data.followerCount || 0,
                        isFollowed: data.isFollowed ?? false,
                        songCount: data.songCount || 0,
                        country: data.country || undefined,
                        socialAccounts: data.socialAccounts || undefined
                    });
                }

                // 2. Xử lý bài hát (Popular Tracks)
                if (songsRes.data.code === 1000) {
                    const songs = songsRes.data.result || [];
                    const mappedTracks = songs.map((song: any) => ({
                        id: song.id,
                        title: song.title,
                        coverUrl: song.coverUrl,
                        artist: song.artist || song.artistName || currentArtistName,
                        artistId: song.artistId,
                        artistAvatar: song.artistAvatar || song.artist?.avatarUrl || null,
                        albumId: song.albumId || null,
                        albumName: song.albumName || null,
                        duration: song.duration,
                        streamCount: song.streamCount || 0,
                        audioUrl: song.audioUrl,
                        featuredArtists: song.featuredArtists || []
                    }));
                    setPopularTracks(mappedTracks);

                    // Albums thật từ API
                    const albums = albumsRes.data.code === 1000 ? (albumsRes.data.result || []) : [];
                    const mappedAlbums = albums.map((album: any) => ({
                        id: album.id,
                        title: album.name,
                        subTitle: album.releaseDate
                            ? `Album · ${new Date(album.releaseDate).getFullYear()}`
                            : 'Album',
                        imageUrl: album.albumUrl || album.avatarUrl || album.coverUrl,
                        type: 'album' as const,
                        onClick: () => navigate(`/albums/${album.id}`),
                    }));

                    // Singles: bài không thuộc album nào
                    const mappedSingles = songs
                        .filter((song: any) => !song.albumId)
                        .map((song: any) => ({
                            id: song.id,
                            title: song.title,
                            subTitle: 'Single',
                            imageUrl: song.coverUrl,
                            type: 'single' as const,
                            artist: song.artist || song.artistName || currentArtistName,
                            artistId: song.artistId,
                            artistAvatar: song.artistAvatar || song.artist?.avatarUrl || null,
                            audioUrl: song.audioUrl,
                            featuredArtists: song.featuredArtists || [],
                            onClick: () => {
                                if (song.audioUrl) {
                                    playRadio([{
                                        id: song.id,
                                        title: song.title,
                                        artist: song.artist || song.artistName || currentArtistName,
                                        artistId: song.artistId,
                                        coverUrl: song.coverUrl,
                                        duration: song.duration,
                                        audioUrl: song.audioUrl,
                                        featuredArtists: song.featuredArtists || []
                                    }], 0, `${currentArtistName} - Single`);
                                } else {
                                    navigate(`/song/${song.id}`);
                                }
                            }
                        }));

                    setDiscography([...mappedAlbums, ...mappedSingles]);
                }

                // 3. Xử lý Related Artists (Fallback lấy từ danh sách /artist/all)
                if (relatedRes && relatedRes.data.code === 1000) {
                    const allArtists = relatedRes.data.result?.content || [];
                    const filtered = allArtists.filter((a: any) => a.id !== id).slice(0, 8);
                    
                    const mappedRelated = filtered.map((a: any) => ({
                        id: a.id,
                        title: a.name,
                        subTitle: 'Nghệ sĩ',
                        imageUrl: a.avatarUrl || a.coverImage,
                        rounded: true,
                        onClick: () => navigate(`/artist/${a.id}`)
                    }));
                    setRelatedArtists(mappedRelated);
                }

            } catch (err) {
                console.error("Lỗi fetch artist data:", err);
                setError("Không thể tải dữ liệu nghệ sĩ.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtistInfoAndSongs();
    }, [id]);

    const toggleFollow = async () => {
        if (!id || !artistData) return;

        try {
            const response = await api.post(`/follow/${id}`);
            if (response.data.code === 1000) {
                const isFollowedNow = response.data.result;

                // Cập nhật State trực tiếp giúp UI thay đổi không cần reload
                setArtistData(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        isFollowed: isFollowedNow,
                        followerCount: isFollowedNow
                            ? prev.followerCount + 1
                            : Math.max(0, prev.followerCount - 1)
                    };
                });
            }
        } catch (error) {
            console.error("Lỗi khi xử lý theo dõi nghệ sĩ:", error);
            alert("Không thể thực hiện hành động theo dõi lúc này.");
        }
    };

    // Trả thêm popularTracks, discography và relatedArtists ra ngoài
    return { id, artistData, popularTracks, discography, relatedArtists, isLoading, error, toggleFollow };
};