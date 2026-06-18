import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useDragControls, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import PlayerProgressBar from '../shared/PlayerProgressBar';
import PlayerHeader from './PlayerHeader';
import SongDetails from './SongDetails';
import MainControls from './MainControls';
import ExtraInfo from './ExtraInfo';
import SongShareCard from '../shared/SongShareCard';
import { useNavigate } from 'react-router-dom';
import OptionsBottomSheet from '../../OptionsBottomSheet/OptionsBottomSheet';
import { useMusic } from '../../../contexts/MusicContent';
import { useTranslation } from 'react-i18next';
export type RepeatMode = 'off' | 'all' | 'one';

interface FullScreenPlayerProps {
    currentSong: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onCollapse: () => void;
    currentTime: number;
    duration: number;
    onTimeChange: (time: number) => void;
    formatTime: (time: number) => string;
    speed: number;
    onSpeedChange: (speed: number) => void;
    dominantColor: string;
    volume: number;
    onVolumeChange: (val: number) => void;
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
    playbackSource?: 'radio' | 'playlist' | null;
    isLoggedIn?: boolean;
}

const FullScreenPlayer = (props: FullScreenPlayerProps) => {
    const { t } = useTranslation();
    const { currentSong, dominantColor, onCollapse } = props;
    const controls = useDragControls();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const navigate = useNavigate();
    const { playlistName, playbackSource } = useMusic();

    // Motion values cho swipe gesture
    const dragY = useMotionValue(0);
    const dimOpacity = useTransform(dragY, [0, 300], [0, 0.5]);
    const contentScale = useTransform(dragY, [0, 300], [1, 0.93]);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);
    const touchStartX = useRef<number>(0);
    const isDragging = useRef(false);
    const isPointerDown = useRef(false);
    const VERTICAL_THRESHOLD = 12; // px dọc tối thiểu để bắt đầu drag
    const HORIZONTAL_MAX = 40;      // px ngang tối đa (nếu vượt thì là horizontal scroll)

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        // Không kích hoạt nếu có overlay khác đang mở
        if (isOptionsOpen || isShareOpen) return;

        // Giới hạn vùng bắt đầu kéo: Desktop (20% trên cùng), Mobile (50% trên cùng)
        const isDesktop = window.innerWidth >= 768;
        const maxDragAreaY = window.innerHeight * (isDesktop ? 0.2 : 0.5);
        if (e.clientY > maxDragAreaY) return;

        isPointerDown.current = true;
        touchStartY.current = e.clientY;
        touchStartX.current = e.clientX;
        isDragging.current = false;
        if (e.target instanceof Element) {
            e.target.setPointerCapture(e.pointerId);
        }
    }, [isOptionsOpen, isShareOpen]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!isPointerDown.current) return;
        const deltaY = e.clientY - touchStartY.current;
        const deltaX = Math.abs(e.clientX - touchStartX.current);

        // Nếu lệch ngang nhiều hơn dọc → user đang scroll ngang, bỏ qua
        if (!isDragging.current && deltaX > HORIZONTAL_MAX) return;

        // Bắt đầu drag khi kéo đủ xuống dưới
        if (!isDragging.current && deltaY > VERTICAL_THRESHOLD) {
            isDragging.current = true;
        }

        if (isDragging.current && deltaY > 0) {
            // Elastic resistance — kéo nhẹ dần
            const resistance = 1 - Math.min(deltaY / (window.innerHeight * 1.5), 0.5);
            dragY.set(deltaY * resistance);
        }
    }, [dragY]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        isPointerDown.current = false;
        if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }

        if (!isDragging.current) return;
        const deltaY = e.clientY - touchStartY.current;

        // Responsive threshold: Mobile cần kéo sâu hơn (30%), Desktop chỉ cần kéo một chút (15% hoặc 100px)
        const isDesktop = window.innerWidth >= 768;
        const threshold = isDesktop ? Math.min(100, window.innerHeight * 0.15) : window.innerHeight * 0.3;

        if (deltaY > threshold) {
            animate(dragY, window.innerHeight, { duration: 0.25, ease: 'easeOut' }).then(() => {
                onCollapse();
            });
        } else {
            // Snap về vị trí ban đầu mượt mà
            animate(dragY, 0, { type: 'spring', stiffness: 300, damping: 30 });
        }
        isDragging.current = false;
    }, [dragY, onCollapse]);

    // Ngăn body scroll khi fullscreen đang mở
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Phím ESC để thu nhỏ player
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isOptionsOpen && !isShareOpen) {
                onCollapse();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onCollapse, isOptionsOpen, isShareOpen]);

    const handleCloseOptions = useCallback(() => setIsOptionsOpen(false), []);
    const handleOpenOptions = useCallback(() => setIsOptionsOpen(true), []);
    const handleOpenShare = useCallback(() => setIsShareOpen(true), []);
    const handleOptionsShare = useCallback(() => { setIsShareOpen(true); }, []);
    const handleOptionsNavigate = useCallback((screen: string) => {
        if (screen === 'ARTIST') {
            setIsOptionsOpen(false);
            onCollapse();
            if (currentSong?.artistId) {
                setTimeout(() => navigate(`/artist/${currentSong.artistId}`), 300);
            }
        }
    }, [currentSong?.artistId, navigate, onCollapse]);

    const isLightColor = (hex: string) => {
        if (!hex || hex === 'transparent') return false;
        const c = hex.charAt(0) === '#' ? hex.substring(1) : hex;
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma > 140;
    };

    const isLight = isLightColor(dominantColor);

    return (
        <motion.div
            ref={containerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 text-white overflow-y-auto scrollbar-hide touch-pan-y"
            style={{
                background: `linear-gradient(160deg, ${dominantColor}CC 0%, #0d0d0d 55%, #000000 100%)`,
                y: dragY,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* Noise texture overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '128px 128px',
                }}
            />

            {/* Dim overlay — hiện dần khi kéo xuống */}
            <motion.div
                className="pointer-events-none fixed inset-0 z-[1] bg-black"
                style={{ opacity: dimOpacity }}
            />

            {/* Drag pill indicator */}
            <div className="pointer-events-none fixed top-3 left-1/2 -translate-x-1/2 z-20 w-10 h-1 bg-white/30 rounded-full md:hidden" />

            <PlayerHeader
                onCollapse={onCollapse}
                dragControls={controls}
                onShare={handleOpenShare}
                onMoreOptions={handleOpenOptions}
                isLight={isLight}
                playlistName={playlistName}
                playbackSource={playbackSource}
            />

            {/* Main Content */}
            <motion.div
                className="relative z-10 px-6 pb-10 max-w-2xl mx-auto flex flex-col"
                style={{ scale: contentScale }}
            >
                <SongDetails
                    songId={currentSong.id}
                    coverUrl={currentSong.coverUrl}
                    title={currentSong.title}
                    artist={currentSong.artist || currentSong.artistName || t('player.unknown_artist')}
                    song={currentSong}
                    isLiked={currentSong.isLiked}
                    dominantColor={dominantColor}
                    onCollapse={onCollapse}
                    isLoggedIn={props.isLoggedIn}
                />

                <div className="mt-8 mb-2">
                    <PlayerProgressBar
                        currentTime={props.currentTime}
                        duration={props.duration}
                        onTimeChange={props.onTimeChange}
                        formatTime={props.formatTime}
                    />
                </div>

                <MainControls
                    isPlaying={props.isPlaying}
                    onTogglePlay={props.onTogglePlay}
                    speed={props.speed}
                    isShuffling={props.isShuffling}
                    repeatMode={props.repeatMode}
                    onToggleShuffle={props.onToggleShuffle}
                    onToggleRepeat={props.onToggleRepeat}
                    onNext={props.onNext}
                    onPrev={props.onPrev}
                />

                <ExtraInfo
                    name={currentSong.artist || currentSong.artistName || t('player.unknown_artist')}
                    artistId={currentSong.artistId}
                    songId={currentSong.id}
                    songTitle={currentSong.title}
                    currentTime={props.currentTime}
                    onCollapse={onCollapse}
                    song={currentSong}
                />
            </motion.div>

            <SongShareCard
                song={currentSong}
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
            />
            <AnimatePresence>
                {isOptionsOpen && (
                    <OptionsBottomSheet
                        isOpen={isOptionsOpen}
                        onClose={handleCloseOptions}
                        onCollapse={onCollapse}
                        song={currentSong}
                        onShare={handleOptionsShare}
                        onNavigate={handleOptionsNavigate}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FullScreenPlayer;