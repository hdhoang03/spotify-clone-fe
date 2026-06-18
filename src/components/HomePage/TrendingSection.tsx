import { motion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';
import { useState } from 'react';
import { useMusic } from '../../contexts/MusicContent';
import { useTranslation } from 'react-i18next';

interface TrendingSectionProps {
    songs: any[];
    onPlay: (song: any) => void;
}

// Rank badge colors + ambient glow
const rankStyles = [
    { text: 'text-amber-400', glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]' },
    { text: 'text-slate-300', glow: 'drop-shadow-[0_0_6px_rgba(148,163,184,0.5)]' },
    { text: 'text-orange-600', glow: 'drop-shadow-[0_0_6px_rgba(194,120,72,0.5)]' },
];

const artShadows = [
    'shadow-[0_4px_12px_rgba(251,191,36,0.18)]',
    'shadow-[0_4px_12px_rgba(148,163,184,0.15)]',
    'shadow-[0_4px_12px_rgba(194,120,72,0.15)]',
];

// Mini equalizer bars (shown when song is playing)
const EqualizerIcon = () => (
    <span className="flex items-end gap-[2px] h-4 w-4">
        <span className="w-[3px] bg-green-500 rounded-sm eq-bar-1" style={{ height: 4 }} />
        <span className="w-[3px] bg-green-500 rounded-sm eq-bar-2" style={{ height: 10 }} />
        <span className="w-[3px] bg-green-500 rounded-sm eq-bar-3" style={{ height: 6 }} />
    </span>
);

const TrendingSection = ({ songs, onPlay }: TrendingSectionProps) => {
    const { t } = useTranslation();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const { currentSong, isPlaying } = useMusic();

    if (!songs || songs.length === 0) return null;

    const formatLikeCount = (count: number | null) => {
        if (!count) return null;
        if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
        if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <section className="mb-14 px-2 pt-6">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {t('home.most_liked')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {songs.map((song, index) => {
                    const isHovered = hoveredId === song.id;
                    const isCurrent = currentSong?.id === song.id;
                    const liked = formatLikeCount(song.likeCount);
                    const rank = rankStyles[index] ?? null;

                    return (
                        <motion.div
                            key={song.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className={`
                                group flex items-center gap-4 px-3 py-2.5 rounded-2xl cursor-pointer
                                border transition-all duration-300
                                ${isCurrent
                                    ? 'bg-green-500/[0.08] dark:bg-green-500/10 border-green-500/20 dark:border-green-500/15'
                                    : isHovered
                                        ? 'bg-black/5 dark:bg-white/[0.08] border-black/[0.08] dark:border-white/[0.08] shadow-sm'
                                        : 'bg-transparent border-transparent'
                                }
                            `}
                            onMouseEnter={() => setHoveredId(song.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => onPlay(song)}
                        >
                            {/* Rank / Play / Equalizer toggle */}
                            <div className="w-5 flex items-center justify-center shrink-0">
                                {isCurrent && isPlaying ? (
                                    <EqualizerIcon />
                                ) : isHovered ? (
                                    <motion.span
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-green-500"
                                    >
                                        <Play size={16} fill="currentColor" />
                                    </motion.span>
                                ) : (
                                    <span
                                        className={`text-sm font-black tabular-nums transition-all duration-200
                                            ${index < 3
                                                ? `text-base ${rank.text} ${rank.glow}`
                                                : 'text-zinc-400 dark:text-zinc-500'
                                            }`}
                                    >
                                        {index + 1}
                                    </span>
                                )}
                            </div>

                            {/* Album art */}
                            <div
                                className={`relative w-12 h-12 shrink-0 rounded-xl overflow-hidden shadow-md
                                    ring-1 ring-black/5 dark:ring-white/10
                                    ${index < 3 ? artShadows[index] : ''}`}
                            >
                                <img
                                    src={song.coverUrl || '/default-cover.png'}
                                    alt={song.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                            </div>

                            {/* Title & artist */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate leading-tight transition-colors duration-200
                                    ${isCurrent ? 'text-green-500 dark:text-green-400' : 'text-zinc-900 dark:text-white'}`}>
                                    {song.title}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                    {song.artist}
                                </p>
                            </div>

                            {/* Like count badge */}
                            {liked && (
                                <div className="flex items-center gap-1 shrink-0 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400
                                    text-[11px] font-bold px-2 py-1 rounded-full border border-rose-200/50 dark:border-rose-500/20">
                                    <Heart size={10} className="fill-current" />
                                    <span>{liked}</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default TrendingSection;
