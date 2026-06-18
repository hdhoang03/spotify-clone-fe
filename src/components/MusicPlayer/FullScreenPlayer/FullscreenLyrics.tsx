// components/Lyrics/FullscreenLyrics.tsx
import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import LyricsDisplay from '../shared/LyricsDisplay';

interface FullscreenLyricsProps {
    songTitle: string;
    name: string;
    lyrics: any[];
    currentTime: number;
    isInstrumental: boolean;
    onClose: () => void;
    song?: any;
    onCollapse?: () => void;
}

import ArtistLinks from '../../common/ArtistLinks';
import { useTranslation } from 'react-i18next';

const FullscreenLyrics = ({ songTitle, name, song, lyrics, currentTime, isInstrumental, onClose, onCollapse }: FullscreenLyricsProps) => {
    const { t } = useTranslation();
    const dragY = useMotionValue(0);
    const opacity = useTransform(dragY, [0, 250], [1, 0.55]);
    const scale = useTransform(dragY, [0, 250], [1, 0.95]);

    // Custom pointer-based swipe gesture — hoạt động toàn màn hình
    const touchStartY = useRef<number>(0);
    const touchStartX = useRef<number>(0);
    const isDragging = useRef(false);
    const isPointerDown = useRef(false);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        e.stopPropagation(); // Ngăn FullScreenPlayer nhận sự kiện kéo
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
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        e.stopPropagation();
        if (!isPointerDown.current) return;
        const deltaY = e.clientY - touchStartY.current;
        const deltaX = Math.abs(e.clientX - touchStartX.current);

        // Nếu scroll ngang nhiều hơn dọc → bỏ qua
        if (!isDragging.current && deltaX > 40) return;

        // Bắt đầu drag khi kéo xuống đủ
        if (!isDragging.current && deltaY > 10) {
            isDragging.current = true;
        }

        if (isDragging.current && deltaY > 0) {
            const resistance = 1 - Math.min(deltaY / (window.innerHeight * 1.5), 0.45);
            dragY.set(deltaY * resistance);
        }
    }, [dragY]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        e.stopPropagation();
        isPointerDown.current = false;
        if (e.target instanceof Element && e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }

        if (!isDragging.current) return;
        const deltaY = e.clientY - touchStartY.current;

        // Responsive threshold: Mobile cần kéo sâu hơn (25%), Desktop chỉ cần kéo một chút (10% hoặc 80px)
        const isDesktop = window.innerWidth >= 768;
        const threshold = isDesktop ? Math.min(80, window.innerHeight * 0.1) : window.innerHeight * 0.25;

        if (deltaY > threshold) {
            // Animate mượt mà xuống dưới rồi mới unmount
            animate(dragY, window.innerHeight, { duration: 0.25, ease: 'easeOut' }).then(() => {
                onClose();
            });
        } else {
            // Animate mượt mà trở lại vị trí cũ thay vì giật cục (set(0))
            animate(dragY, 0, { type: 'spring', stiffness: 300, damping: 30 });
        }
        isDragging.current = false;
    }, [dragY, onClose]);

    // ESC đóng lyrics, chặn event leo lên FullScreenPlayer
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopImmediatePropagation();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKey, true);
        return () => window.removeEventListener('keydown', handleKey, true);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex flex-col touch-pan-y"
            style={{
                background: 'linear-gradient(to bottom, #1a1a2e 0%, #0d0d0d 100%)',
                y: dragY,
                opacity,
                scale,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* Drag pill */}
            <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 w-9 h-1 bg-white/20 rounded-full md:hidden z-10" />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-8 pb-4 shrink-0 gap-4">
                <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-1">{t('player.lyrics')}</p>
                    <h2 className="text-xl font-black text-white truncate">{songTitle}</h2>
                    <p className="text-sm text-white/50 truncate pointer-events-auto">
                        {song ? <ArtistLinks song={song} spanClassName="hover:text-white" onNavigate={onCollapse} /> : (name || t('player.unknown_artist'))}
                    </p>
                </div>
                <button
                    onPointerDown={(e) => e.stopPropagation()} // Không trigger swipe từ nút
                    onClick={onClose}
                    className="mt-1 w-10 h-10 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-90"
                    title={t('player.go_back_esc')}
                >
                    <ChevronDown size={20} className="text-white" />
                </button>
            </div>

            <div className="flex-1 min-h-0 px-10 relative overflow-hidden">
                <LyricsDisplay
                    lyrics={lyrics}
                    currentTime={currentTime}
                    isInstrumental={isInstrumental}
                    expanded={true}
                />
            </div>
        </motion.div>
    );
};

export default FullscreenLyrics;