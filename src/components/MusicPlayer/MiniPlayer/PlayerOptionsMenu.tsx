import { useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX, X, Clock, Crown } from 'lucide-react';
import { usePremiumStatus } from '../../../hooks/usePremiumStatus';
import { useTranslation } from 'react-i18next';

interface PlayerOptionsMenuProps {
    speed: number;
    onSpeedChange: (speed: number) => void;
    onClose: () => void;
    type: 'speed' | 'full';
    volume?: number;
    onVolumeChange?: (volume: number) => void;
    toggleMute?: () => void;
    isMuted?: boolean;
}

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlayerOptionsMenu = ({
    speed = 1, onSpeedChange, onClose,
    type, volume = 1, onVolumeChange,
    toggleMute, isMuted
}: PlayerOptionsMenuProps) => {
    const { t } = useTranslation();
    const { isPremium } = usePremiumStatus();

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        // Đổi từ 'mousedown' sang 'click' để không xung đột với onClick của nút Clock bên ngoài.
        // Khi click vào nút Clock, e.stopPropagation() sẽ ngăn sự kiện lan tới document.
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('touchend', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('touchend', handleClickOutside);
        };
    }, [onClose]);

    const VolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX size={16} />;
        if (volume && volume <= 0.5) return <Volume1 size={16} />;
        return <Volume2 size={16} />;
    };

    return (
        <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-full right-0 mb-4 
            backdrop-blur-2xl bg-white/85 dark:bg-[#18181b]/85
            border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] p-4 z-50 
            animate-in slide-in-from-bottom-2 fade-in zoom-in-95 duration-200 ease-out cursor-default
            ${type === 'speed' ? 'w-64' : 'w-72'}`}
        >

            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    {type === 'speed' && <Clock size={16} className="text-primary-500" />}
                    {type === 'speed' ? t('player.speed') : t('player.settings')}
                </h3>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={16} className="text-zinc-500 dark:text-zinc-400" />
                </button>
            </div>

            <div className="space-y-5">
                {/* --- LOGIC CHO MOBILE (FULL) --- */}
                {type === 'full' && (
                    <>
                        {/* Phần chỉnh Volume */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleMute && toggleMute(); }}
                                        className="hover:text-primary-500 transition-colors hover:scale-110"
                                    >
                                        <VolumeIcon />
                                    </button>
                                    <span className="tracking-wider text-[10px]">{t('player.volume')}</span>
                                </div>
                                <span className="tabular-nums">{isMuted ? '0' : Math.round((volume || 0) * 100)}%</span>
                            </div>

                            <div className="relative flex items-center h-4 group cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="range" min="0" max="1" step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        if (onVolumeChange) onVolumeChange(parseFloat(e.target.value))
                                    }}
                                    className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer 
                                            accent-primary-500 hover:accent-primary-400 focus:outline-none
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                                            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                                            transition-all"
                                />
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-black/5 dark:bg-white/5" />
                    </>
                )}

                {/* --- LOGIC CHỌN TỐC ĐỘ --- */}
                <div className="space-y-3">
                    {type === 'full' && <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">{t('player.speed')}</p>}

                    <div className={`grid gap-2 ${type === 'speed' ? 'grid-cols-3' : 'grid-cols-4'}`}>
                        {speeds.map((s) => {
                            const isActive = Number(speed) === s;
                            const isPremiumOnly = s === 2; // Tốc độ 2x chỉ dành cho Premium
                            const isLocked = isPremiumOnly && !isPremium;
                            return (
                                <button
                                    key={s}
                                    title={isLocked ? t('player.premium_speed') : undefined}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isLocked) return; // Chặn nếu chưa Premium
                                        onSpeedChange(s);
                                        if (type === 'speed') onClose();
                                    }}
                                    className={`text-xs font-medium py-2 rounded-xl transition-all duration-200 relative
                                        ${isLocked
                                            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 cursor-not-allowed'
                                            : isActive
                                                ? 'bg-primary-500 text-white shadow-[0_2px_10px_rgba(34,197,94,0.3)] scale-105'
                                                : 'bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105'
                                        }
                                    `}
                                >
                                    {isLocked ? (
                                        <span className="flex items-center justify-center gap-1">
                                            <Crown size={10} className="text-yellow-500" />
                                            {s}x
                                        </span>
                                    ) : `${s}x`}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerOptionsMenu;