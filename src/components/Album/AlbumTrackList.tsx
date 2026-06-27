import { useState } from 'react';
import { Play, Pause, Clock, Music } from 'lucide-react';
import EqualizerBars from '../common/EqualizerBars';
import type { SongResponse } from '../../types/backend.d';
import { useTranslation } from 'react-i18next';
import Toast from '../common/Toast';
import type { ToastType } from '../common/Toast';

interface AlbumTrackListProps {
    songs: SongResponse[];
    currentSongId?: string;
    globalIsPlaying?: boolean;
    onPlaySong: (index: number) => void;
    onTogglePlay?: () => void;
}

const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${m}:${s}`;
};

const AlbumTrackList = ({
    songs,
    currentSongId,
    globalIsPlaying,
    onPlaySong,
    onTogglePlay,
}: AlbumTrackListProps) => {
    const { t } = useTranslation();
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    if (songs.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center gap-3 text-zinc-400">
                <Music size={48} />
                <p className="text-sm">{t('album.no_songs')}</p>
            </div>
        );
    }

    return (
        <>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-white/[0.06]">
                        <th className="py-3 w-12 text-center">#</th>
                        <th className="py-3 pl-2">{t('album.songs')}</th>
                        <th className="hidden md:table-cell py-3">{t('album.artist')}</th>
                        <th className="py-3 pr-4 text-right">
                            <Clock size={14} className="ml-auto" />
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                    {songs.map((song, idx) => {
                        const isActive = song.id === currentSongId;
                        const isHovered = hoveredIdx === idx;
                        const isDeleted = song.is_deleted;

                        return (
                            <tr
                                key={song.id}
                                title={isDeleted ? t('playlist.content_unavailable') : undefined}
                                onClick={() => {
                                    if (isDeleted) {
                                        setToast({ message: t('playlist.song_removed_from_platform'), type: 'warning' });
                                        return;
                                    }
                                    if (isActive && onTogglePlay) onTogglePlay();
                                    else onPlaySong(idx);
                                }}
                                onMouseEnter={() => !isDeleted && setHoveredIdx(idx)}
                                onMouseLeave={() => !isDeleted && setHoveredIdx(null)}
                                className={`group transition-colors rounded-lg ${isDeleted ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                            >
                                {/* Cột STT / Equalizer / Play / Pause */}
                                <td className="py-3 w-12 text-center">
                                    {isHovered ? (
                                        isActive && globalIsPlaying
                                            ? <Pause size={16} className="mx-auto text-green-500" />
                                            : <Play size={16} fill="currentColor" className={`mx-auto ${isActive ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`} />
                                    ) : isActive && globalIsPlaying ? (
                                        <span className="flex justify-center"><EqualizerBars /></span>
                                    ) : (
                                        <span className={`text-sm ${isActive ? 'text-green-500' : 'text-zinc-400'}`}>
                                            {idx + 1}
                                        </span>
                                    )}
                                </td>

                                {/* Cột tên bài hát */}
                                <td className="py-3 pl-2">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={song.coverUrl}
                                            alt={song.title}
                                            className="w-10 h-10 rounded object-cover flex-shrink-0 shadow-sm"
                                            draggable={false}
                                        />
                                        <div className="min-w-0">
                                            <p className={`font-semibold truncate text-sm ${isActive ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`}>
                                                {song.title}
                                            </p>
                                            <p className="text-xs text-zinc-500 truncate md:hidden mt-0.5">
                                                {song.artist}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Cột nghệ sĩ (desktop) */}
                                <td className="hidden md:table-cell py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                    {song.artist}
                                </td>

                                {/* Cột thời lượng */}
                                <td className="py-3 pr-4 text-right text-sm text-zinc-500 tabular-nums">
                                    {formatDuration(song.duration)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3500}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default AlbumTrackList;
