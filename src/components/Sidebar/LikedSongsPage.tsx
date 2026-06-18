// src/components/Library/LikedSongsPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { likeApi } from '../../services/likeApi';
import { useMusic } from '../../contexts/MusicContent';
import { normalizeSong } from '../HomePage/useHomeData';
import PlaylistTrackList from '../Sidebar/PlaylistTrackList';
import PlaybackActionBar from '../common/PlaybackActionBar';
import { useTranslation } from 'react-i18next';

/* ─── Skeleton loading cho Hero ──────────────────────────────────── */
const HeroSkeleton = () => (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 pt-10 md:pt-20 relative z-10 animate-pulse">
        <div className="w-56 h-56 md:w-60 md:h-60 rounded-xl bg-zinc-200 dark:bg-white/10 flex-shrink-0" />
        <div className="flex flex-col gap-3 w-full">
            <div className="h-3 w-14 rounded bg-zinc-200 dark:bg-white/10" />
            <div className="h-12 w-72 rounded-lg bg-zinc-200 dark:bg-white/10" />
            <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-white/10" />
        </div>
    </div>
);

/* ─── Cover "Liked Songs" với Tilt 3D (xanh lá đặc trưng) ──────── */
const LikedSongsCover = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({
        rotateX: 0, rotateY: 0,
        spotX: 50, spotY: 50,
        hovered: false,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setTilt({
            rotateX: ((y - height / 2) / (height / 2)) * -7,
            rotateY: ((x - width / 2) / (width / 2)) * 7,
            spotX: (x / width) * 100,
            spotY: (y / height) * 100,
            hovered: true,
        });
    };

    const handleMouseLeave = () =>
        setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50, hovered: false });

    return (
        /* Perspective wrapper — giống TiltCover */
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '800px' }}
            className="flex-shrink-0"
        >
            <div
                style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${tilt.hovered ? 'scale(1.04)' : 'scale(1)'}`,
                    transition: tilt.hovered
                        ? 'transform 0.1s ease-out'
                        : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    /* Drop-shadow ambient xanh lá */
                    filter: tilt.hovered
                        ? 'drop-shadow(0 28px 48px rgba(34,197,94,0.45))'
                        : 'drop-shadow(0 20px 36px rgba(34,197,94,0.30))',
                }}
                className="relative w-56 h-56 md:w-60 md:h-60 rounded-xl overflow-hidden shadow-2xl"
            >
                {/* Gradient nền xanh lá — đặc trưng brand */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(145deg, #4ade80 0%, #16a34a 45%, #065f46 100%)',
                    }}
                />

                {/* Ánh sáng góc trên trái */}
                <div
                    className="absolute inset-0 opacity-35"
                    style={{
                        background: 'radial-gradient(ellipse at 18% 18%, rgba(255,255,255,0.5) 0%, transparent 55%)',
                    }}
                />

                {/* Dot pattern tinh tế */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1.2px, transparent 1.2px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Heart icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Heart
                        size={96}
                        fill="white"
                        strokeWidth={0}
                        className="text-white"
                        style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.25))' }}
                    />
                </div>

                {/* Spotlight theo chuột — giống TiltCover */}
                <div
                    style={{
                        background: `radial-gradient(circle at ${tilt.spotX}% ${tilt.spotY}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
                        opacity: tilt.hovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    className="absolute inset-0 pointer-events-none z-10"
                />

                {/* Glow border nhẹ khi hover — giống TiltCover */}
                <div
                    style={{
                        boxShadow: tilt.hovered
                            ? 'inset 0 0 0 1px rgba(255,255,255,0.22)'
                            : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                        transition: 'box-shadow 0.3s ease',
                    }}
                    className="absolute inset-0 rounded-xl pointer-events-none z-10"
                />
            </div>
        </div>
    );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const LikedSongsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { playPlaylist, currentSong, isPlaying, togglePlay } = useMusic();

    const [songs, setSongs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalSongs, setTotalSongs] = useState(0);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const res = await likeApi.getMyLikedSongs(1, 50);
                if (res.data.code === 1000) {
                    const data = res.data.result;
                    setTotalSongs(data.totalElements);
                    const formattedSongs = data.content.map((item: any) => ({
                        ...normalizeSong(item.song),
                        addedAt: item.likedAt,
                        isLiked: true,
                    }));
                    setSongs(formattedSongs);
                }
            } catch (error) {
                console.error('Lỗi tải bài hát yêu thích', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLikedSongs();
    }, []);

    const handlePlayPlaylist = () => {
        if (songs.length > 0) playPlaylist(songs, 0, 'Bài hát đã thích');
    };

    const handlePlaySongAtIndex = (index: number) => {
        if (songs.length > 0) playPlaylist(songs, index, 'Bài hát đã thích');
    };

    const isThisPlaylistActive = songs?.some((s) => s.id === currentSong?.id);

    return (
        <div className="min-h-screen bg-white dark:bg-[#121212] relative overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">

            {/* Ambient gradient xanh lá nhẹ — light mode */}
            <div
                className="absolute top-0 left-0 w-full h-[440px] pointer-events-none dark:hidden"
                style={{
                    background: 'linear-gradient(to bottom, rgba(34,197,94,0.12) 0%, rgba(16,185,129,0.05) 55%, transparent 100%)',
                }}
            />
            {/* Ambient gradient xanh lá — dark mode đậm hơn */}
            <div
                className="absolute top-0 left-0 w-full h-[440px] pointer-events-none hidden dark:block"
                style={{
                    background: 'linear-gradient(to bottom, rgba(22,163,74,0.28) 0%, rgba(6,95,70,0.12) 60%, transparent 100%)',
                }}
            />

            {/* Nút Back (mobile) */}
            <div className="p-4 md:hidden relative z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-black/10 dark:bg-white/10 rounded-full hover:scale-105 transition backdrop-blur-sm"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Hero Section */}
            {isLoading ? (
                <HeroSkeleton />
            ) : (
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 pt-10 md:pt-20 relative z-10">
                    <LikedSongsCover />

                    <div className="flex flex-col gap-2 w-full text-left">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                            Playlist
                        </span>
                        <h1 className="text-4xl md:text-7xl font-extrabold leading-tight text-zinc-900 dark:text-white">
                            {t('playlist.liked_songs')}
                        </h1>
                        <div className="flex items-center gap-1.5 text-sm font-medium mt-2 text-zinc-600 dark:text-zinc-300">
                            <span className="font-bold text-zinc-800 dark:text-white">{t('profile.your_profile')}</span>
                            <span className="opacity-50">•</span>
                            <span className="opacity-75">{totalSongs} {t('playlist.songs')}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Bar */}
            {!isLoading && (
                <PlaybackActionBar
                    isPlaying={isThisPlaylistActive && isPlaying}
                    onPlayClick={handlePlayPlaylist}
                    onTogglePlay={togglePlay}
                />
            )}

            {/* Track List */}
            {!isLoading && (
                <PlaylistTrackList
                    songs={songs}
                    isOwner={true}
                    onPlaySong={handlePlaySongAtIndex}
                    currentSongId={currentSong?.id}
                    globalIsPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                />
            )}

            <div className="pb-32" />
        </div>
    );
};

export default LikedSongsPage;