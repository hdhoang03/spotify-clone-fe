import React from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { DragControls } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface PlayerHeaderProps {
    onCollapse: () => void;
    onShare: () => void;
    onMoreOptions: () => void;
    dragControls: DragControls;
    isLight?: boolean;
    /** Tên nguồn phát từ context: "Playlist X", "Tìm kiếm", "Đang phát ngẫu nhiên" */
    playlistName?: string | null;
    playbackSource?: 'radio' | 'playlist' | null;
}

const PlayerHeader = ({
    onCollapse,
    dragControls,
    onMoreOptions,
    isLight = false,
    playlistName,
    playbackSource,
}: PlayerHeaderProps) => {
    const { t } = useTranslation();
    const iconHoverBg = isLight ? 'hover:bg-black/10 active:bg-black/20' : 'hover:bg-white/10 active:bg-white/20';
    const textColorClass = isLight ? 'text-zinc-800' : 'text-white';
    const subTextColorClass = isLight ? 'text-zinc-500' : 'text-white/40';
    const iconColorClass = isLight ? 'text-zinc-800' : 'text-white';
    const dragBarClass = isLight ? 'bg-black/20' : 'bg-white/25';

    // Tính sub-label (dòng nhỏ trên)
    const subLabel = playlistName
        ? playlistName
        : playbackSource === 'playlist'
            ? t('player.playing_from_playlist')
            : null;

    return (
        <div
            className={`top-0 z-10 flex justify-between items-center px-4 pt-12 pb-4 md:pt-6 cursor-grab active:cursor-grabbing select-none ${textColorClass}`}
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: 'none' }}
        >
            {/* Drag handle bar — mobile only */}
            <div className={`absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 ${dragBarClass} rounded-full md:hidden`} />

            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onCollapse}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${iconColorClass} ${iconHoverBg}`}
                title={t('player.collapse_esc')}
            >
                <ChevronDown size={22} strokeWidth={2.5} />
            </button>

            {/* Center — context label */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none max-w-[55%]">
                {subLabel ? (
                    <>
                        <p className={`text-[9px] font-semibold tracking-[0.15em] uppercase ${subTextColorClass} mb-0.5`}>
                            {t('player.playing')}
                        </p>
                        <p className={`text-[12px] font-bold truncate ${textColorClass}`}>
                            {subLabel}
                        </p>
                    </>
                ) : (
                    // Fallback: chỉ hiện "Đang phát" nhẹ
                    <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${subTextColorClass}`}>
                        {t('player.playing')}
                    </p>
                )}
            </div>

            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onMoreOptions}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 text-white hover:bg-white/10 active:bg-white/20"
                title={t('player.options')}
            >
                <MoreHorizontal size={22} strokeWidth={2} />
            </button>
        </div>
    );
};

export default React.memo(PlayerHeader);