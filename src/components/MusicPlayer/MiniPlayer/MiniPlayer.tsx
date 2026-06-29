import { useState, useEffect } from 'react';
import { Play, Pause, Heart, X, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PlayerOptionsMenu from './PlayerOptionsMenu';
import ScrollingText from './ScrollingText';

interface MiniPlayerProps {
    currentSong: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onExpand: () => void;
    onClose: () => void;
    progress: number;
    speed: number;
    onSpeedChange: (speed: number) => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
    dominantColor?: string;
    isLiked?: boolean;
    onToggleLike?: () => void;
    isLoggedIn?: boolean;
}

// Waveform equalizer shown on album art when playingg
const MiniEqualizer = () => (
    <div className="absolute inset-0 flex items-center justify-center gap-[3px] bg-black/30 backdrop-blur-[1px]">
        <span className="w-[3px] bg-white rounded-sm eq-bar-1" />
        <span className="w-[3px] bg-white rounded-sm eq-bar-2" />
        <span className="w-[3px] bg-white rounded-sm eq-bar-3" />
    </div>
);

const MiniPlayer = ({
    currentSong, isPlaying, onTogglePlay, onExpand, onClose, progress,
    speed, onSpeedChange, volume, onVolumeChange,
    toggleMute, isMuted, dominantColor,
    isLiked, onToggleLike, isLoggedIn = true
}: MiniPlayerProps) => {
    const { t } = useTranslation();
    const [showOptions, setShowOptions] = useState(false);
    const [showSidebarHint, setShowSidebarHint] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('springtunes_seen_sidebar_hint') === 'true';
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setShowSidebarHint(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const dismissSidebarHint = () => {
        setShowSidebarHint(false);
        try {
            localStorage.setItem('springtunes_seen_sidebar_hint', 'true');
        } catch { /* noop */ }
    };
    const isSpeedChanged = speed !== 1;
    const bgColor = dominantColor || '#18181b';

    const artistDisplay = [currentSong.artist, ...(currentSong.featuredArtists?.map((a: any) => a.name) || [])].filter(Boolean).join(', ');

    const isLightColor = (hex: string) => {
        const c = hex.substring(1);
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma > 140;
    };

    const isLight = isLightColor(bgColor);
    const textColorClass = isLight ? 'text-black' : 'text-white';
    const subTextColorClass = isLight ? 'text-zinc-700' : 'text-zinc-300';
    const iconBaseClass = isLight ? 'text-zinc-800 hover:text-black' : 'text-zinc-200 hover:text-white';

    return (
        <div
            onClick={onExpand}
            className="fixed bottom-[80px] md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[620px]
                       backdrop-blur-2xl border rounded-2xl p-3 pr-4
                       flex items-center justify-between cursor-pointer z-40
                       shadow-[0_12px_40px_rgba(0,0,0,0.3)]
                       hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)]
                       hover:scale-[1.008]
                       transition-all duration-500 ease-out group"
            style={{
                background: `linear-gradient(135deg, ${bgColor}F0, ${bgColor}A0)`,
                borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
            }}
        >
            {/* Left: Cover + Info */}
            <div className="flex items-center gap-3.5 overflow-hidden flex-1 min-w-0">
                {/* Cover art with equalizer overlay */}
                <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    <img
                        src={currentSong.coverUrl}
                        alt="cover"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {isPlaying && <MiniEqualizer />}
                </div>

                {/* Song info */}
                <div className="flex flex-col overflow-hidden w-full justify-center">
                    <div className="md:hidden w-full">
                        <ScrollingText
                            content={currentSong.title}
                            className={`text-sm font-bold tracking-tight ${textColorClass}`}
                        />
                        <ScrollingText
                            content={artistDisplay}
                            className={`text-[11px] font-medium mt-0.5 ${subTextColorClass} block`}
                        />
                    </div>

                    <div className="hidden md:block w-full">
                        <p className={`text-sm font-bold tracking-tight truncate ${textColorClass}`}>
                            {currentSong.title}
                        </p>
                        <p className={`text-xs font-medium mt-0.5 truncate ${subTextColorClass}`}>
                            {artistDisplay}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 sm:gap-3 pr-1 relative">
                {showOptions && (
                    <div className="absolute bottom-full right-0 mb-4 mr-[-10px]">
                        <PlayerOptionsMenu
                            type="full"
                            speed={speed}
                            onSpeedChange={onSpeedChange}
                            volume={volume}
                            onVolumeChange={onVolumeChange}
                            onClose={() => setShowOptions(false)}
                            toggleMute={toggleMute}
                            isMuted={isMuted}
                        />
                    </div>
                )}

                {/* Speed / Options button */}
                <button
                    className={`transition-all p-1.5 rounded-full text-xs font-bold
                        ${isSpeedChanged || showOptions
                            ? 'text-primary-500 bg-primary-500/15 border border-primary-500/30'
                            : `${iconBaseClass} hover:bg-white/10`
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(!showOptions);
                    }}
                >
                    <Clock size={17} />
                </button>

                {/* Like button */}
                {isLoggedIn && (
                    <button
                        className={`transition-all p-1.5 rounded-full hover:bg-white/10 hover:scale-110 active:scale-95 ${iconBaseClass}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleLike) onToggleLike();
                        }}
                    >
                        <Heart
                            size={17}
                            className={`transition-colors ${isLiked ? 'text-primary-400 fill-primary-400' : ''}`}
                        />
                    </button>
                )}

                {/* Play/Pause button */}
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                        className={`relative transition-all p-2 rounded-full flex items-center justify-center
                            hover:scale-110 active:scale-95
                            ${isLight ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/15 hover:bg-white/25 text-white'}`}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                </div>

                {/* Divider */}
                <div className={`w-px h-5 mx-0.5 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />

                {/* Close button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className={`p-1.5 rounded-full transition-all
                        ${isLight
                            ? 'text-zinc-500 hover:text-red-600 hover:bg-red-500/10'
                            : 'text-zinc-400 hover:text-red-400 hover:bg-red-400/10'
                        }`}
                >
                    <X size={17} />
                </button>
            </div>

            {/* Gradient progress bar — Spotify-green */}
            <div className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-t-full overflow-hidden bg-white/10">
                <div
                    className="h-full rounded-full transition-all ease-linear duration-500"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, #1ed760, #22d46a)',
                    }}
                />
            </div>
            {/* Onboarding Tooltip for Desktop */}
            {showSidebarHint && (
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="hidden md:flex absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 
                               bg-zinc-950/95 dark:bg-zinc-900/95 text-white text-[12px] font-medium 
                               px-4 py-2.5 rounded-xl border border-white/10 shadow-2xl 
                               items-center gap-2.5 backdrop-blur-md select-none z-50 w-max max-w-sm
                               transition-all duration-300"
                >
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        <span>{t('player.sidebar_drag_hint')}</span>
                    </div>
                    <button 
                        onClick={dismissSidebarHint}
                        className="text-white/40 hover:text-white p-0.5 rounded transition-colors ml-1"
                    >
                        <X size={12} />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-950/95 dark:border-t-zinc-900/95" />
                </div>
            )}
        </div>
    );
};

export default MiniPlayer;