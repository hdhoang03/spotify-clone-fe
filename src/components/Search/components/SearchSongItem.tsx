import { Play, Pause, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLikeSong } from '../../../hooks/useLikeSong';
import ArtistLinks from '../../common/ArtistLinks';
import EqualizerBars from '../../common/EqualizerBars';
import { isSongDeleted } from '../utils/searchUtils';
import type { SearchSongResponse } from '../types/search.types';
import { useTranslation } from 'react-i18next';
import Toast from '../../common/Toast';
import type { ToastType } from '../../common/Toast';

interface Props {
    song: SearchSongResponse;
    index: number;
    currentSong: any;
    isPlaying: boolean;
    onPlay: (song: SearchSongResponse) => void;
}

const SearchSongItem = ({ song, index, currentSong, isPlaying, onPlay }: Props) => {
    const { t } = useTranslation();
    const { isLiked, toggleLike } = useLikeSong(song.id, song.isLiked);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const isCurrent = currentSong?.id === song.id;
    const isActiveAndPlaying = isCurrent && isPlaying;
    const isDeleted = isSongDeleted(song);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.035 }}
                onClick={() => {
                    if (isDeleted) {
                        setToast({ message: t('playlist.song_removed_from_platform'), type: 'warning' });
                        return;
                    }
                    onPlay(song);
                }}
                title={isDeleted ? t('playlist.content_unavailable') : undefined}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isDeleted
                        ? 'opacity-50 grayscale cursor-not-allowed'
                        : 'hover:bg-zinc-100 dark:hover:bg-white/[0.06] cursor-pointer active:scale-[0.99]'
                    }
                    ${isCurrent ? 'bg-zinc-100 dark:bg-white/[0.05]' : ''}
                `}
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Index / Equalizer indicator */}
                    <div className="w-6 flex items-center justify-center shrink-0 text-xs font-bold tabular-nums">
                        {isActiveAndPlaying ? (
                            <EqualizerBars />
                        ) : (
                            <span className={isCurrent ? 'text-primary-500' : 'text-zinc-400 dark:text-zinc-500'}>
                                {index + 1}
                            </span>
                        )}
                    </div>

                    {/* Cover art with play overlay */}
                    <div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <img
                            src={song.coverUrl || '/default-cover.jpg'}
                            alt={song.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {!isDeleted && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100
                            transition-opacity duration-200 flex items-center justify-center">
                                {isActiveAndPlaying
                                    ? <Pause size={15} className="text-white fill-white" />
                                    : <Play size={15} className="text-white fill-white ml-0.5" />
                                }
                            </div>
                        )}
                    </div>

                    {/* Song info */}
                    <div className="min-w-0 flex-1">
                        <p className={`font-semibold truncate text-sm leading-snug
                        ${isCurrent ? 'text-primary-500 dark:text-primary-400' : 'text-zinc-900 dark:text-white'}`}>
                            {song.title}
                        </p>
                        <ArtistLinks
                            song={{ artist: song.artistName, artistId: song.artistId, featuredArtists: song.featuredArtists }}
                            className="max-w-[220px] text-xs"
                        />
                    </div>
                </div>

                {/* Like button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const token = localStorage.getItem('token');
                        if (!token || token === 'null') {
                            window.dispatchEvent(new Event('open-auth-modal'));
                            return;
                        }
                        toggleLike();
                    }}
                    className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 ml-2
                    transition-all opacity-0 group-hover:opacity-100 shrink-0"
                >
                    <Heart
                        size={15}
                        className={isLiked ? 'text-primary-500 fill-primary-500' : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-white'}
                    />
                </button>
            </motion.div>
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

export default SearchSongItem;
