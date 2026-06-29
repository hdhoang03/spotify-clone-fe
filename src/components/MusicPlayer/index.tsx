import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { ListMusic, GripHorizontal } from 'lucide-react';
import { useLikeSong } from '../../hooks/useLikeSong';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import MiniPlayer from './MiniPlayer/MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer/FullScreenPlayer';
import SidebarPlayer from './SidebarPlayer/SidebarPlayer';
import { useMusic } from '../../contexts/MusicContent';
import ArtistLinks from '../common/ArtistLinks';
import api from '../../services/api';

import { useDominantColor } from './hooks/useDominantColor';
import { useFloatingDrag } from './hooks/useFloatingDrag';

const readAutoplay = (): boolean => {
    try {
        const saved = localStorage.getItem('springtunes_settings');
        if (saved) return JSON.parse(saved).autoplay ?? true;
    } catch { /* noop */ }
    return true;
};

const isSongDeleted = (song: any): boolean => {
    return song?.deleted || song?.isDeleted || song?.is_deleted || false;
};

const getNextValidIndex = (
    playlist: any[],
    currentIndex: number,
    direction: 1 | -1,
    repeatMode: string,
    isShuffling: boolean
): number => {
    if (playlist.length === 0) return -1;

    const hasAnyValid = playlist.some(s => !isSongDeleted(s));
    if (!hasAnyValid) return -1;

    let nextIdx = currentIndex;

    if (isShuffling) {
        const validIndices = playlist
            .map((s, i) => ({ s, i }))
            .filter(item => !isSongDeleted(item.s) && item.i !== currentIndex)
            .map(item => item.i);

        if (validIndices.length > 0) {
            return validIndices[Math.floor(Math.random() * validIndices.length)];
        }
        return currentIndex;
    }

    let attempts = 0;
    while (attempts < playlist.length) {
        nextIdx += direction;
        attempts++;

        if (nextIdx > playlist.length - 1) {
            if (repeatMode === 'all') {
                nextIdx = 0;
            } else {
                return -1;
            }
        } else if (nextIdx < 0) {
            if (repeatMode === 'all') {
                nextIdx = playlist.length - 1;
            } else {
                return -1;
            }
        }

        if (!isSongDeleted(playlist[nextIdx])) {
            return nextIdx;
        }
    }

    return -1;
};

const MusicPlayer = () => {
    const {
        currentSong, playlist, playPlaylist, playbackSource, playRadio,
        setIsPlaying, updateCurrentSong,
        isSidebarPlayerOpen, setIsSidebarPlayerOpen,
        isFullScreenPlayerOpen, setIsFullScreenPlayerOpen
    } = useMusic();

    const dominantColor = useDominantColor(currentSong?.coverUrl, currentSong?.id);
    const [isVisible, setIsVisible] = useState(true);
    const { isLiked, toggleLike } = useLikeSong(currentSong?.id);
    const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));

    useEffect(() => {
        const handleUserUpdate = () => {
            setIsLoggedIn(Boolean(localStorage.getItem('token')));
        };
        window.addEventListener('user-update', handleUserUpdate);
        return () => window.removeEventListener('user-update', handleUserUpdate);
    }, []);

    const player = useAudioPlayer(undefined, !isLoggedIn);

    const {
        dragX,
        dragY,
        wasDragged,
        constraints,
        handleDragStart,
        handleDrag,
        handleDragEnd
    } = useFloatingDrag();

    // --- MINI-PLAYER FULL: drag snap sang phải → SidebarPlayer ---
    const miniDragX = useMotionValue(0);
    const miniWasDragged = useRef(false);

    useEffect(() => {
        if (!isSidebarPlayerOpen) {
            miniDragX.set(0);
        }
    }, [isSidebarPlayerOpen, miniDragX]);

    const handleMiniDragEnd = useCallback((_: any, info: { offset: { x: number } }) => {
        const isDesktop = window.innerWidth >= 768;
        if (isDesktop && info.offset.x > 120) {
            // Snap sang phải → mở Sidebar Player
            // KHÔNG set isVisible = false vì render condition đã handle
            setIsSidebarPlayerOpen(true);
            try {
                localStorage.setItem('springtunes_seen_sidebar_hint', 'true');
            } catch { /* noop */ }
        }
        // Không có snap trái trên desktop (chỉ đàn hồi về)
        miniDragX.set(0);
    }, [setIsSidebarPlayerOpen, miniDragX]);

    // --- NEXT / PREV ---
    const handleNext = useCallback(() => {
        if (!currentSong || playlist.length === 0) return;
        const idx = playlist.findIndex(s => s.id === currentSong.id);
        const nextIdx = getNextValidIndex(playlist, idx, 1, player.repeatMode, player.isShuffling);
        if (nextIdx !== -1) {
            playbackSource === 'radio' ? playRadio(playlist, nextIdx) : playPlaylist(playlist, nextIdx);
        } else {
            player.audioRef.current?.pause();
            setIsPlaying(false);
        }
    }, [currentSong, playlist, player, playbackSource, playPlaylist, playRadio, setIsPlaying]);

    const handlePrev = useCallback(() => {
        if (!currentSong || playlist.length === 0) return;
        const idx = playlist.findIndex(s => s.id === currentSong.id);
        const prevIdx = getNextValidIndex(playlist, idx, -1, player.repeatMode, player.isShuffling);
        if (prevIdx !== -1) {
            playPlaylist(playlist, prevIdx);
        }
    }, [currentSong, playlist, player, playPlaylist]);

    const handleSongEnded = useCallback(() => {
        if (player.repeatMode === 'one') return;
        const autoplay = readAutoplay();
        if (playbackSource === 'radio') {
            if (autoplay) handleNext();
            else { player.audioRef.current?.pause(); setIsPlaying(false); }
            return;
        }
        const idx = playlist.findIndex(s => s.id === currentSong?.id);
        const nextIdx = getNextValidIndex(playlist, idx, 1, player.repeatMode, player.isShuffling);
        if (nextIdx !== -1) {
            playPlaylist(playlist, nextIdx);
        } else {
            const isAtEnd = idx >= playlist.length - 1;
            if (isAtEnd && !player.isShuffling && player.repeatMode !== 'all' && autoplay) {
                const validIndices = playlist
                    .map((s, i) => ({ s, i }))
                    .filter(item => !isSongDeleted(item.s) && item.i !== idx)
                    .map(item => item.i);
                if (validIndices.length > 0) {
                    const randIdx = validIndices[Math.floor(Math.random() * validIndices.length)];
                    playPlaylist(playlist, randIdx);
                } else {
                    player.audioRef.current?.pause();
                    setIsPlaying(false);
                }
            } else {
                player.audioRef.current?.pause();
                setIsPlaying(false);
            }
        }
    }, [currentSong, playlist, player, playbackSource, playPlaylist, setIsPlaying, handleNext]);

    // --- EFFECTS ---
    useEffect(() => {
        if (!currentSong) return;
        player.setInitialDuration(currentSong.duration || 0);
        if (player.audioRef.current) {
            player.audioRef.current.play().catch(() => setIsPlaying(false));
        } else if (!player.isPlaying) {
            player.togglePlay();
        }
        if (!currentSong.featuredArtists || currentSong.featuredArtists.length === 0) {
            api.get(`/song/${currentSong.id}`).then(res => {
                if (res.data?.result?.featuredArtists?.length > 0)
                    updateCurrentSong({ featuredArtists: res.data.result.featuredArtists });
            }).catch(() => { });
        }
    }, [currentSong?.id]);
    const [sidebarSlot, setSidebarSlot] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setSidebarSlot(document.getElementById('sidebar-player-slot'));
    }, [isSidebarPlayerOpen]);

    if (!currentSong) return null;

    const progressPercent = player.duration ? (player.currentTime / player.duration) * 100 : 0;

    const isLightColor = (hex: string) => {
        if (!hex || hex === 'transparent') return false;
        const c = hex.charAt(0) === '#' ? hex.substring(1) : hex;
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140;
    };
    const isLight = isLightColor(dominantColor);
    const textPrimary = isLight ? 'text-zinc-800' : 'text-white';
    const textSecondary = isLight ? 'text-zinc-600' : 'text-white/60';
    const bgElement = isLight ? 'bg-black/60' : 'bg-white/70';
    const bgTrack = isLight ? 'bg-black/10' : 'bg-white/10';
    const iconColor = isLight ? 'text-zinc-800/50' : 'text-white/30';

    const sharedPlayerProps = {
        currentSong,
        isPlaying: player.isPlaying,
        onTogglePlay: player.togglePlay,
        currentTime: player.currentTime,
        duration: player.duration,
        onTimeChange: player.handleTimeChange,
        formatTime: player.formatTime,
        speed: player.speed,
        onSpeedChange: player.handleSpeedChange,
        volume: player.volume,
        onVolumeChange: player.handleVolumeChange,
        toggleMute: player.toggleMute,
        isMuted: player.isMuted,
        isShuffling: player.isShuffling,
        repeatMode: player.repeatMode,
        onToggleShuffle: player.toggleShuffle,
        onToggleRepeat: player.toggleRepeat,
        onNext: handleNext,
        onPrev: handlePrev,
        isLiked,
        onToggleLike: toggleLike,
        isLoggedIn,
        dominantColor,
        playbackSource,
    };

    return (
        <>
            <audio
                ref={player.audioRef}
                src={currentSong.audioUrl}
                crossOrigin="anonymous"
                onLoadedMetadata={player.onLoadedMetadata}
                onTimeUpdate={player.onTimeUpdate}
                onEnded={handleSongEnded}
                autoPlay={true}
            />

            {/* ── SidebarPlayer Portal → render vào slot bên phải trong MainLayout ── */}
            {isSidebarPlayerOpen && sidebarSlot && createPortal(
                <SidebarPlayer {...sharedPlayerProps} />,
                sidebarSlot
            )}

            {/* ── Miniplayer thu nhỏ (floating, kéo tự do, KHÔNG snap sidebar) ── */}
            <AnimatePresence mode="wait">
                {!isVisible && !isSidebarPlayerOpen && (
                    <motion.div
                        key="floating-player-bar"
                        drag
                        dragConstraints={constraints}
                        dragMomentum={false}
                        dragElastic={0.06}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85, y: 40 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        onDragStart={handleDragStart}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        whileDrag={{ scale: 1.05 }}
                        onClick={() => {
                            if (!wasDragged.current) setIsVisible(true);
                            wasDragged.current = false;
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl select-none backdrop-blur-xl shadow-2xl"
                        style={{
                            x: dragX, y: dragY,
                            position: 'fixed', bottom: '5rem', left: '50%', translateX: '-50%', zIndex: 70,
                            background: `linear-gradient(135deg, ${dominantColor}E6, ${dominantColor}99)`,
                            boxShadow: `0 8px 32px ${dominantColor}55, 0 2px 8px rgba(0,0,0,0.15)`,
                            border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}`,
                            cursor: 'grab',
                        }}
                    >
                        <GripHorizontal size={12} className={`absolute top-1 left-1/2 -translate-x-1/2 ${iconColor}`} />
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                            {player.isPlaying && (
                                <motion.div
                                    className={`absolute inset-0 rounded-lg border-2 ${isLight ? 'border-black/20' : 'border-white/40'}`}
                                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            )}
                        </div>
                        <div className="flex flex-col items-start min-w-0 max-w-[140px]">
                            <span className={`${textPrimary} text-xs font-bold truncate w-full leading-tight tracking-tight`}>{currentSong.title}</span>
                            <span className={`${textSecondary} text-[10px] font-medium truncate w-full leading-tight`}>
                                <ArtistLinks song={currentSong} spanClassName="hover:underline pointer-events-auto" />
                            </span>
                        </div>
                        <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-t-full overflow-hidden ${bgTrack}`}>
                            <motion.div className={`h-full rounded-full ${bgElement}`} style={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
                        </div>
                        <div className="flex-shrink-0 ml-1">
                            {player.isPlaying ? (
                                <div className="flex gap-[3px] items-end h-4">
                                    {[0, 1, 2].map(i => (
                                        <motion.div key={i} className={`w-[3px] rounded-full ${bgElement}`}
                                            animate={{ scaleY: [0.4, 1, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                            style={{ height: '100%', transformOrigin: 'bottom' }}
                                        />
                                    ))}
                                </div>
                            ) : <ListMusic size={16} className={textSecondary} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FullScreenPlayer ── */}
            <AnimatePresence>
                {isFullScreenPlayerOpen && isVisible && !isSidebarPlayerOpen && (
                    <FullScreenPlayer
                        key="full-player"
                        {...sharedPlayerProps}
                        onCollapse={() => setIsFullScreenPlayerOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── MiniPlayer Desktop (drag-snap sang phải → SidebarPlayer) ── */}
            {isVisible && !isFullScreenPlayerOpen && !isSidebarPlayerOpen && (
                <motion.div
                    key="mini-player-desktop"
                    className="hidden md:block relative z-50"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.3}
                    dragMomentum={false}
                    style={{ x: miniDragX }}
                    onDragStart={() => { miniWasDragged.current = false; }}
                    onDrag={() => { miniWasDragged.current = true; }}
                    onDragEnd={handleMiniDragEnd}
                    onClickCapture={(e) => {
                        if (miniWasDragged.current) {
                            e.stopPropagation();
                            miniWasDragged.current = false;
                        }
                    }}
                    title="Drag to right to open sidebar player"
                >
                    <MiniPlayer
                        currentSong={currentSong}
                        isPlaying={player.isPlaying}
                        onTogglePlay={player.togglePlay}
                        onExpand={() => setIsFullScreenPlayerOpen(true)}
                        progress={progressPercent}
                        onClose={() => setIsVisible(false)}
                        speed={player.speed}
                        onSpeedChange={player.handleSpeedChange}
                        volume={player.volume}
                        onVolumeChange={player.handleVolumeChange}
                        toggleMute={player.toggleMute}
                        isMuted={player.isMuted}
                        dominantColor={dominantColor}
                        isLiked={isLiked}
                        onToggleLike={toggleLike}
                        isLoggedIn={isLoggedIn}
                    />
                </motion.div>
            )}

            {/* ── MiniPlayer Mobile (không có snap, không dùng AnimatePresence) ── */}
            {isVisible && !isFullScreenPlayerOpen && !isSidebarPlayerOpen && (
                <div className="md:hidden relative z-50">
                    <MiniPlayer
                        currentSong={currentSong}
                        isPlaying={player.isPlaying}
                        onTogglePlay={player.togglePlay}
                        onExpand={() => setIsFullScreenPlayerOpen(true)}
                        progress={progressPercent}
                        onClose={() => setIsVisible(false)}
                        speed={player.speed}
                        onSpeedChange={player.handleSpeedChange}
                        volume={player.volume}
                        onVolumeChange={player.handleVolumeChange}
                        toggleMute={player.toggleMute}
                        isMuted={player.isMuted}
                        dominantColor={dominantColor}
                        isLiked={isLiked}
                        onToggleLike={toggleLike}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            )}
        </>
    );
};

export default MusicPlayer;