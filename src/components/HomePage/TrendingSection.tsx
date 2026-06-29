import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { useMusic } from '../../contexts/MusicContent';
import { useTranslation } from 'react-i18next';
import EqualizerBars from '../common/EqualizerBars';

interface TrendingSectionProps {
    songs: any[];
    onPlay: (song: any) => void;
}

// Top-3 rank medal colors
const rankMedal = [
    { bg: 'bg-amber-400/15 dark:bg-amber-400/10', text: 'text-amber-500', border: 'border-amber-400/30' },
    { bg: 'bg-zinc-300/15 dark:bg-zinc-300/10', text: 'text-zinc-400 dark:text-zinc-300', border: 'border-zinc-300/30' },
    { bg: 'bg-orange-600/15 dark:bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
];

const formatLikeCount = (count: number | null) => {
    if (!count) return null;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
};

/** Reusable single song row */
const SongRow = ({
    song,
    index,
    hoveredId,
    setHoveredId,
    onPlay,
    currentSong,
    isPlaying,
}: {
    song: any;
    index: number;
    hoveredId: string | null;
    setHoveredId: (id: string | null) => void;
    onPlay: (song: any) => void;
    currentSong: any;
    isPlaying: boolean;
}) => {
    const isHovered = hoveredId === song.id;
    const isCurrent = currentSong?.id === song.id;
    const isActiveAndPlaying = isCurrent && isPlaying;
    const liked = formatLikeCount(song.likeCount);
    const medal = rankMedal[index] ?? null;

    return (
        <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`
                group relative flex items-center gap-4 pr-3 py-2 rounded-xl cursor-pointer
                transition-all duration-200 select-none
                ${isCurrent
                    ? 'bg-primary-500/10 dark:bg-primary-500/[0.08]'
                    : 'hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                }
            `}
            onMouseEnter={() => setHoveredId(song.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onPlay(song)}
        >
            {/* Left: Rank / Play / Equalizer */}
            <div className="pl-2 w-6 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait">
                    {isActiveAndPlaying ? (
                        <motion.div key="eq"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                            <EqualizerBars />
                        </motion.div>
                    ) : isHovered ? (
                        <motion.div key="play"
                            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.12 }}
                            className="text-zinc-900 dark:text-white">
                            {isCurrent
                                ? <Pause size={15} fill="currentColor" className="text-primary-500" />
                                : <Play size={15} fill="currentColor" />}
                        </motion.div>
                    ) : index < 3 ? (
                        <motion.div key="medal"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black border
                                ${medal.bg} ${medal.text} ${medal.border}`}>
                            {index + 1}
                        </motion.div>
                    ) : (
                        <motion.span key="num"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-xs font-bold tabular-nums text-zinc-400 dark:text-zinc-500">
                            {index + 1}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Cover art */}
            <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                <img
                    src={song.coverUrl || '/default-cover.png'}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                {isActiveAndPlaying && <div className="absolute inset-0 bg-primary-500/10" />}
            </div>

            {/* Title & artist */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate leading-snug transition-colors duration-150
                    ${isCurrent ? 'text-primary-500 dark:text-primary-400' : 'text-zinc-900 dark:text-white'}`}>
                    {song.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {song.artist}
                </p>
            </div>

            {/* Right: like count only */}
            {liked && (
                <div className="flex items-center gap-1 text-rose-400 dark:text-rose-500 text-[10px] font-bold shrink-0">
                    <Heart size={10} className="fill-current" />
                    <span>{liked}</span>
                </div>
            )}
        </motion.div>
    );
};

const TrendingSection = ({ songs, onPlay }: TrendingSectionProps) => {
    const { t } = useTranslation();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const { currentSong, isPlaying } = useMusic();

    if (!songs || songs.length === 0) return null;

    // Mobile: limit to 5 unless expanded. md+ always shows all.
    const mobileSongs = isExpanded ? songs : songs.slice(0, 5);

    const rowProps = { hoveredId, setHoveredId, onPlay, currentSong, isPlaying };

    return (
        <section className="mb-10 px-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <span className="block w-1 h-5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <h2 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {t('home.most_liked')}
                </h2>
            </div>

            {/* Mobile list: single col, limited (hidden on md+) */}
            <div className="flex flex-col gap-0.5 md:hidden">
                {mobileSongs.map((song, index) => (
                    <SongRow key={song.id} song={song} index={index} {...rowProps} />
                ))}
            </div>

            {/* Tablet / Desktop: full 2-col grid (hidden on mobile) */}
            <div className="hidden md:grid md:grid-cols-2 gap-0.5">
                {songs.map((song, index) => (
                    <SongRow key={song.id} song={song} index={index} {...rowProps} />
                ))}
            </div>

            {/* See more/less — mobile only, same style as Profile page */}
            {songs.length > 5 && (
                <div className="mt-4 flex justify-start md:hidden">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
                    >
                        {isExpanded ? t('profile.see_less') : t('profile.see_more')}
                    </button>
                </div>
            )}
        </section>
    );
};

export default TrendingSection;
