import { useState, useEffect } from 'react';
import { Play, Pause, Clock, Calendar, MoreHorizontal, Music2 } from 'lucide-react';
import TrackContextMenu from '../Profile/components/TrackContextMenu';
import { playlistApi } from './playlistApi';
import { useNavigate } from 'react-router-dom';
import EqualizerBars from '../common/EqualizerBars';
import ArtistLinks from '../common/ArtistLinks';
import { useTranslation } from 'react-i18next';

interface PlaylistTrackListProps {
    songs: any[];
    playlistId?: string;
    isOwner?: boolean;
    onPlaySong: (index: number) => void;
    onRemoveSuccess?: () => void;
    currentSongId?: string;
    globalIsPlaying?: boolean;
    onTogglePlay?: () => void;
}

const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const roundedSeconds = Math.round(seconds);
    const m = Math.floor(roundedSeconds / 60);
    const s = roundedSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const PlaylistTrackList = ({ songs, playlistId, isOwner = true, onPlaySong, onRemoveSuccess, currentSongId, globalIsPlaying, onTogglePlay }: PlaylistTrackListProps) => {
    const { t, i18n } = useTranslation();
    const [contextMenu, setContextMenu] = useState<{ song: any, x: number, y: number } | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleCloseOthers = (e: CustomEvent) => {
            if (contextMenu && contextMenu.song.id !== e.detail.songId) {
                setContextMenu(null);
            }
        };
        window.addEventListener('CLOSE_OTHER_CONTEXT_MENUS', handleCloseOthers as EventListener);
        return () => window.removeEventListener('CLOSE_OTHER_CONTEXT_MENUS', handleCloseOthers as EventListener);
    }, [contextMenu]);

    const renderDate = (song: any) => {
        const dateString = song.addedAt || song.createdAt || song.releaseDate;
        if (!dateString) return t('playlist.just_added');
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat(i18n.language, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(date);
        } catch {
            return t('playlist.just_added');
        }
    };

    const handleContextMenu = (e: React.MouseEvent, song: any) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ song, x: e.clientX, y: e.clientY });
        window.dispatchEvent(new CustomEvent('CLOSE_OTHER_CONTEXT_MENUS', { detail: { songId: song.id } }));
    };

    const handleOptionsClick = (e: React.MouseEvent, song: any) => {
        e.stopPropagation();
        if (contextMenu && contextMenu.song.id === song.id) {
            setContextMenu(null);
        } else {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setContextMenu({ song, x: rect.left, y: rect.top });
            window.dispatchEvent(new CustomEvent('CLOSE_OTHER_CONTEXT_MENUS', { detail: { songId: song.id } }));
        }
    };

    const handleRemoveSong = async (songId: string) => {
        if (!playlistId) return;
        try {
            const res = await playlistApi.removeSong(playlistId, songId);
            if (res.data.code === 1000) {
                alert(t('playlist.remove_song_success'));
                if (onRemoveSuccess) onRemoveSuccess();
            }
        } catch (error) {
            console.error("Lỗi xóa bài hát:", error);
            alert(t('playlist.remove_song_fail'));
        }
    };

    const navigate = useNavigate();

    // ─── Empty State ────────────────────────────────────────────────────────────
    if (songs.length === 0) {
        return (
            <div className="px-4 md:px-8 py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/[0.06]
                                border border-black/[0.04] dark:border-white/10
                                flex items-center justify-center">
                    <Music2 size={28} className="text-zinc-400 dark:text-zinc-500" />
                </div>
                <div>
                    <p className="text-zinc-900 dark:text-white font-semibold text-base">
                        {t('playlist.empty')}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 max-w-xs">
                        {t('playlist.empty_desc')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 relative z-10" onClick={() => setContextMenu(null)}>

            {/* ─── Header Cột ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[32px_minmax(120px,_4fr)_2fr_minmax(80px,_1fr)_40px] lg:grid-cols-[32px_minmax(120px,_4fr)_2fr_2fr_minmax(80px,_1fr)_40px]
                            gap-3 md:gap-4 px-2 md:px-4 py-2.5
                            text-[10.5px] font-bold uppercase tracking-[0.1em]
                            text-zinc-600 dark:text-zinc-300 mb-2
                            sticky top-16 z-20
                            bg-white/70 dark:bg-[#121212]/80 backdrop-blur-xl
                            border-b border-black/10 dark:border-white/10">
                <div className="text-center w-8 hidden md:block">#</div>
                <div className="md:hidden" />
                <div>{t('playlist.title_col')}</div>
                <div className="hidden md:block">{t('playlist.album_col')}</div>
                <div className="hidden lg:flex items-center gap-1.5">
                    {t('playlist.date_added_col')}
                </div>
                <div className="flex justify-end">
                    {t('playlist.duration_col')}
                </div>
                <div className="w-10" />
            </div>

            {/* ─── Danh sách bài hát ────────────────────────────────────────────── */}
            <div className="space-y-0.5">
                {songs.map((song, index) => {
                    // KIỂM TRA BÀI HÁT ĐANG PHÁT
                    const isActive = currentSongId === song.id;
                    const isDeleted = song.deleted || song.isDeleted || song.is_deleted;

                    return (
                        <div
                            key={`${song.id}-${index}`}
                            className={`
                                grid grid-cols-[auto_1fr_auto] md:grid-cols-[32px_minmax(120px,_4fr)_2fr_minmax(80px,_1fr)_40px]
                                lg:grid-cols-[32px_minmax(120px,_4fr)_2fr_2fr_minmax(80px,_1fr)_40px]
                                gap-3 md:gap-4 px-2 md:px-4 py-2 md:py-2.5 items-center text-sm
                                transition-all duration-200 cursor-pointer group rounded-xl
                                ${isDeleted ? 'opacity-50 grayscale cursor-not-allowed' : (isActive
                                    ? 'bg-green-50/70 dark:bg-green-500/[0.08] border-l-2 border-green-500 pl-[6px] md:pl-[14px]'
                                    : 'border-l-2 border-transparent hover:bg-zinc-50/80 dark:hover:bg-white/[0.05]')
                                }
                            `}
                            title={isDeleted ? t('playlist.content_unavailable') : undefined}
                            onContextMenu={(e) => handleContextMenu(e, song)}
                            onClick={() => { if (!isDeleted) onPlaySong(index) }}
                            onMouseEnter={() => !isDeleted && setHoveredIndex(index)}
                            onMouseLeave={() => !isDeleted && setHoveredIndex(null)}
                        >
                            {/* Cột 1: STT / Equalizer / Play / Pause */}
                            <div
                                className="text-center text-zinc-500 dark:text-zinc-400 relative w-8 hidden md:flex items-center justify-center"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isDeleted) return;
                                    if (isActive && onTogglePlay) {
                                        onTogglePlay();
                                    } else {
                                        onPlaySong(index);
                                    }
                                }}
                            >
                                {hoveredIndex === index ? (
                                    // Hover: hiện Play/Pause icon
                                    isActive && globalIsPlaying
                                        ? <Pause size={16} className="text-green-500" />
                                        : <Play size={16} fill="currentColor" className={isActive ? 'text-green-500' : 'text-black dark:text-white'} />
                                ) : isActive && globalIsPlaying ? (
                                    <EqualizerBars />
                                ) : isActive ? (
                                    // Active nhưng paused: Play màu xanh
                                    <Play size={16} fill="currentColor" className="text-green-500" />
                                ) : (
                                    // Bình thường: số thứ tự
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            {/* Cột 2: Ảnh + Tên bài hát */}
                            <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                    src={song.coverUrl || 'https://via.placeholder.com/40'}
                                    className="w-10 h-10 md:w-11 md:h-11 rounded-md object-cover shrink-0
                                               ring-1 ring-black/10 dark:ring-white/[0.08]"
                                    alt="cover"
                                />
                                <div className="truncate flex-1 min-w-0">
                                    <div className={`font-semibold truncate text-sm leading-snug
                                                     ${isActive ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`}>
                                        {song.title}
                                    </div>
                                    <div className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700
                                                    dark:group-hover:text-zinc-300 text-xs truncate mt-0.5
                                                    transition-colors duration-200">
                                        <ArtistLinks song={song} />
                                    </div>
                                </div>
                            </div>

                            {/* Cột 3: Album */}
                            <div className="hidden md:block text-zinc-500 dark:text-zinc-400 text-xs truncate
                                            hover:underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                                {song.albumName || t('playlist.single')}
                            </div>

                            {/* Cột 4: Ngày thêm */}
                            <div className="hidden lg:block text-zinc-500 dark:text-zinc-400 text-xs truncate">
                                {renderDate(song)}
                            </div>

                            {/* Cột 5: Thời gian */}
                            <div className="flex items-center justify-end text-zinc-500 dark:text-zinc-400 text-xs">
                                {formatDuration(song.duration)}
                            </div>

                            {/* Cột 6: Nút 3 chấm */}
                            <div className="flex justify-center">
                                <button
                                    className="track-menu-trigger opacity-100 md:opacity-0 md:group-hover:opacity-100
                                               p-1.5 rounded-md
                                               text-zinc-500 dark:text-zinc-400
                                               hover:bg-zinc-100 dark:hover:bg-white/10
                                               hover:text-zinc-900 dark:hover:text-white
                                               transition-all duration-150"
                                    onClick={(e) => handleOptionsClick(e, song)}
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {contextMenu && (
                <TrackContextMenu
                    song={contextMenu.song}
                    position={{ x: contextMenu.x, y: contextMenu.y }}
                    onClose={() => setContextMenu(null)}
                    isOwner={isOwner}
                    onRemoveFromPlaylist={() => {
                        handleRemoveSong(contextMenu.song.id);
                        setContextMenu(null);
                    }}
                    onNavigateToArtist={(artistId) => navigate(`/artist/${artistId}`)}
                    onNavigateToAlbum={(albumId) => navigate(`/album/${albumId}`)}
                />
            )}
        </div>
    );
};

export default PlaylistTrackList;