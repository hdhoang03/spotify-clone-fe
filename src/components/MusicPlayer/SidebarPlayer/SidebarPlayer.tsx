import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Mic2, Maximize2 } from 'lucide-react';
import type { RepeatMode } from '../FullScreenPlayer/FullScreenPlayer';
import { useMusic } from '../../../contexts/MusicContent';
import ArtistLinks from '../../common/ArtistLinks';
import EqualizerBars from '../../common/EqualizerBars';
import LyricsDisplay from '../shared/LyricsDisplay';
import { useNavigate } from 'react-router-dom';
import FullscreenLyrics from '../FullScreenPlayer/FullscreenLyrics';
import { useLyrics } from './useLyrics';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import { useTranslation } from 'react-i18next';

export interface SidebarPlayerProps {
    currentSong: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    currentTime: number;
    duration: number;
    onTimeChange: (t: number) => void;
    formatTime: (t: number) => string;
    speed: number;
    volume: number;
    onVolumeChange: (v: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
    isShuffling: boolean;
    repeatMode: RepeatMode;
    onToggleShuffle: () => void;
    onToggleRepeat: () => void;
    onNext: () => void;
    onPrev: () => void;
    isLiked?: boolean;
    onToggleLike?: () => void;
    dominantColor: string;
    isLoggedIn?: boolean;
}

const SidebarPlayer = ({
    currentSong, isPlaying, onTogglePlay,
    currentTime, duration, onTimeChange, formatTime,
    volume, onVolumeChange, toggleMute, isMuted,
    isShuffling, repeatMode, onToggleShuffle, onToggleRepeat,
    onNext, onPrev, isLiked, onToggleLike, dominantColor,
    isLoggedIn = true,
}: SidebarPlayerProps) => {
    const { setIsSidebarPlayerOpen, playlistName, playbackSource } = useMusic();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { lyrics, isInstrumental, isLyricsLoading } = useLyrics(currentSong?.id);
    const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);

    // Ép Sidebar Player luôn dùng Dark Theme sang trọng để đồng bộ với thanh Sidebar và tăng độ tương phản
    const isLight = false;
    const text = 'text-white';
    const subText = 'text-white/50';
    const iconBtn = 'text-white/70 hover:text-white hover:bg-white/10';
    const activeIconBtn = 'text-green-500';

    const handleClose = () => setIsSidebarPlayerOpen(false);

    const subLabel = playlistName
        ? playlistName
        : playbackSource === 'playlist' ? t('player.playing_from_playlist') : null;

    const hasLyrics = lyrics.length > 0 || isInstrumental;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 shadow-xl"
            style={{
                // Giảm opacity của dominantColor xuống 33% (55) ở đỉnh và 13% (22) ở giữa để nền luôn tối và sang trọng
                background: `linear-gradient(170deg, ${dominantColor}55 0%, ${dominantColor}22 40%, #0d0d0d 100%)`,
            }}
        >
            {/* Noise texture */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '128px 128px',
                }}
            />

            <div className="relative z-10 flex flex-col h-full px-5 pt-4 pb-12 overflow-y-auto scrollbar-hide">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-5 flex-shrink-0">
                    <button
                        onClick={handleClose}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${iconBtn}`}
                        title="Close sidebar player"
                    >
                        <ChevronDown size={18} />
                    </button>

                    <div className="text-center flex-1 px-2 overflow-hidden">
                        {subLabel ? (
                            <>
                                <p className={`text-[9px] font-semibold tracking-widest uppercase ${subText} mb-0.5`}>{t('player.playing')}</p>
                                <p className={`text-[11px] font-bold truncate ${text}`}>{subLabel}</p>
                            </>
                        ) : (
                            <p className={`text-[9px] font-semibold tracking-widest uppercase ${subText}`}>{t('player.now_playing')}</p>
                        )}
                    </div>

                    <div className="w-8 h-8 flex-shrink-0" />
                </div>

                {/* ── Album Art ── */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl mb-5 group flex-shrink-0">
                    <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isPlaying && (
                        <div className="absolute inset-0 flex items-end justify-start p-3">
                            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                                <EqualizerBars />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Song Info + Like ── */}
                <div className="flex items-start justify-between gap-2 mb-4 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <button
                            className={`text-base font-bold truncate w-full text-left leading-tight ${text} hover:underline`}
                            onClick={() => { if (currentSong.albumId) navigate(`/album/${currentSong.albumId}`); }}
                        >
                            {currentSong.title}
                        </button>
                        <div className={`text-xs mt-0.5 truncate ${subText}`}>
                            <ArtistLinks song={currentSong} spanClassName="hover:underline" />
                        </div>
                    </div>
                    {isLoggedIn && (
                        <button
                            onClick={onToggleLike}
                            className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all mt-0.5 ${iconBtn}`}
                        >
                            <Heart size={20} className={`transition-colors ${isLiked ? 'text-green-400 fill-green-400' : ''}`} />
                        </button>
                    )}
                </div>

                {/* ── Progress Bar ── */}
                <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    onTimeChange={onTimeChange}
                    formatTime={formatTime}
                    isLight={isLight}
                    subTextClass={subText}
                />

                {/* ── Main Controls ── */}
                <PlayerControls
                    isPlaying={isPlaying}
                    onTogglePlay={onTogglePlay}
                    isShuffling={isShuffling}
                    onToggleShuffle={onToggleShuffle}
                    repeatMode={repeatMode}
                    onToggleRepeat={onToggleRepeat}
                    onNext={onNext}
                    onPrev={onPrev}
                    iconBtnClass={iconBtn}
                    activeIconBtnClass={activeIconBtn}
                />

                {/* ── Volume ── */}
                <VolumeControl
                    volume={volume}
                    onVolumeChange={onVolumeChange}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    isLight={isLight}
                    iconBtnClass={iconBtn}
                />

                {/* ── Lyrics Section ── */}
                <div className="flex-1 min-h-0 flex flex-col relative">
                    {/* Thêm relative và z-10 để phân tách lớp hiển thị */}
                    <div className="relative z-10 flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Mic2 size={14} className={subText} />
                            <p className={`text-[10px] font-bold tracking-widest uppercase ${subText}`}>{t('player.lyrics')}</p>
                        </div>
                        {hasLyrics && !isLyricsLoading && (
                            <button
                                onClick={() => setIsLyricsExpanded(true)}
                                className={`p-1 rounded-full transition-all ${iconBtn}`}
                                title="Full screen lyrics"
                            >
                                <Maximize2 size={14} />
                            </button>
                        )}
                    </div>

                    <div className={`rounded-2xl overflow-hidden ${isLight ? 'bg-black/5' : 'bg-white/5'} border ${isLight ? 'border-black/5' : 'border-white/10'} flex-1 flex flex-col`}
                        style={{ minHeight: 270 }}
                    >
                        {isLyricsLoading ? (
                            <div className="flex items-center justify-center flex-1 py-10">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="px-4 py-3 flex-1 flex flex-col min-h-0">
                                <LyricsDisplay
                                    lyrics={lyrics}
                                    currentTime={currentTime}
                                    isInstrumental={isInstrumental}
                                    expanded={false}
                                    className="flex-1 h-full"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="h-[50vh] flex-shrink-0" />
            </div>

            {/* ====== FULLSCREEN LYRICS ====== */}
            <AnimatePresence>
                {isLyricsExpanded && (
                    <FullscreenLyrics
                        key="fullscreen-lyrics-portal"
                        songTitle={currentSong.title}
                        name={currentSong.artist}
                        song={currentSong}
                        lyrics={lyrics}
                        currentTime={currentTime}
                        isInstrumental={isInstrumental}
                        onClose={() => setIsLyricsExpanded(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SidebarPlayer;