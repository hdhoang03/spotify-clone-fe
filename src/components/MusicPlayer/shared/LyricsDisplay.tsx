import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mic2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LyricLine {
    t: number;
    text: string;
}

interface LyricsDisplayProps {
    lyrics: LyricLine[];
    currentTime: number;
    isInstrumental?: boolean;
    /** expanded = modal view (full height, larger text) */
    expanded?: boolean;
    className?: string;
}

const LyricsDisplay = ({ lyrics, currentTime, isInstrumental, expanded = false, className = '' }: LyricsDisplayProps) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);

    // Tìm dòng lời đang active
    const activeIndex = useMemo(() => {
        if (!lyrics || lyrics.length === 0) return -1;
        let idx = -1;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime >= lyrics[i].t) {
                idx = i;
            } else {
                break;
            }
        }
        return idx;
    }, [lyrics, currentTime]);

    // Auto-scroll về dòng active — dùng getBoundingClientRect để tránh lỗi offsetTop
    useEffect(() => {
        if (activeLineRef.current && containerRef.current) {
            const container = containerRef.current;
            const activeLine = activeLineRef.current;

            const containerRect = container.getBoundingClientRect();
            const lineRect = activeLine.getBoundingClientRect();

            // Vị trí tương đối của dòng active so với container
            const relativeTop = lineRect.top - containerRect.top;
            // Scroll sao cho dòng active nằm ở 1/3 từ trên container
            const targetScrollTop = container.scrollTop + relativeTop - containerRect.height * 0.35;

            container.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth',
            });
        }
    }, [activeIndex]);

    if (isInstrumental) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Mic2 size={28} className="text-white/60" />
                    </div>
                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping" />
                </div>
                <p className="text-white/50 text-sm font-medium">{t('player.instrumental')}</p>
            </div>
        );
    }

    if (!lyrics || lyrics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <Mic2 size={28} className="text-white/30" />
                <p className="text-white/40 text-sm">{t('player.no_lyrics')}</p>
            </div>
        );
    }

    if (!Array.isArray(lyrics)) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-white/50 font-medium text-lg">{t('player.lyrics_unavailable')}</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`overflow-y-auto ${className || (expanded ? 'h-full' : 'max-h-60')}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            <div className={`flex flex-col gap-0.5 ${expanded ? 'py-8 px-2' : 'py-4 px-1'}`}>
                {/* Spacer đầu để dòng đầu có thể scroll tới giữa */}
                <div className="h-20 shrink-0" />

                {lyrics.map((line, index) => {
                    const isActive = index === activeIndex;
                    const isPast = index < activeIndex;

                    return (
                        <div
                            key={index}
                            ref={isActive ? activeLineRef : null}
                            className="py-1 px-1 rounded-lg"
                        >
                            <motion.p
                                animate={{
                                    opacity: isActive ? 1 : isPast ? 0.3 : 0.45,
                                    scale: isActive ? 1.02 : 1,
                                }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className={`
                                    origin-left leading-normal py-1 transition-colors duration-300
                                    ${expanded
                                        ? isActive
                                            ? 'text-2xl font-black text-white'
                                            : 'text-xl font-semibold text-white/50'
                                        : isActive
                                            ? 'text-lg font-black text-white'
                                            : 'text-base font-semibold text-white/50'
                                    }
                                `}
                                style={{
                                    textShadow: isActive ? '0 0 24px rgba(255,255,255,0.35)' : 'none',
                                }}
                            >
                                {line.text}
                            </motion.p>
                        </div>
                    );
                })}

                {/* Spacer cuối để dòng cuối có thể scroll lên giữa */}
                <div className="h-32 shrink-0" />
            </div>
        </div>
    );
};

export default React.memo(LyricsDisplay);
