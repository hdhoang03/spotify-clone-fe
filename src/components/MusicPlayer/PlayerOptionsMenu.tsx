import React, { useEffect, useRef } from 'react';
import { ListMusic, Volume2, Volume1, VolumeX, X, Clock } from 'lucide-react';

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

    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
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
            className={`absolute bottom-full right-0 mb-4 bg-white dark:bg-zinc-900 
            border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 z-50 
            animate-in slide-in-from-bottom-5 fade-in duration-200 cursor-default
            ${type === 'speed' ? 'w-64' : 'w-72'}`}
        > 
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    {type === 'speed' && <Clock size={16} className="text-green-500"/>}
                    {type === 'speed' ? 'Tốc độ phát' : 'Cài đặt & Danh sách'}
                </h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                >
                    <X size={16} className="text-gray-500" />
                </button>
            </div>

            <div className="space-y-4">
                {/* --- LOGIC CHO MOBILE (FULL) --- */}
                {type === 'full' && (
                    <>
                        {/* 1. Các nút chức năng thêm (Danh sách chờ, Lời nhạc) */}
                        <div className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 p-3
                                            rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100
                                            dark:hover:bg-zinc-700 transition group">
                                <ListMusic size={20} className="text-green-500 group-hover:text-green-500 transition" />
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Danh sách chờ</span>
                            </button>
                        </div>
                        
                        <hr className="border-gray-100 dark:border-zinc-800" />

                        {/* 2. Phần chỉnh Volume */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleMute && toggleMute(); }}
                                        className="hover:text-green-500 transition hover:scale-110"
                                    >
                                        <VolumeIcon />
                                    </button>
                                    <span>ÂM LƯỢNG</span>
                                </div>
                                <span>{isMuted ? 'Muted' : Math.round((volume || 0) * 100)}%</span>
                            </div>

                            <input 
                                type="range" min="0" max="1" step="0.01"
                                value={isMuted ? 0 : volume}
                                // CHẶN SỰ KIỆN LAN TRUYỀN ĐỂ KÉO ĐƯỢC MƯỢT
                                onClick={(e) => e.stopPropagation()} 
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    if(onVolumeChange) onVolumeChange(parseFloat(e.target.value))
                                }}
                                className="w-full h-1 bg-gray-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:h-1.5 transition-all" 
                            />
                        </div>
                        <hr className="border-gray-100 dark:border-zinc-800" />
                    </>
                )}

                {/* --- LOGIC CHỌN TỐC ĐỘ --- */}
                <div className="space-y-2">
                    {type === 'full' && <p className="text-xs font-bold text-gray-500 uppercase">Tốc độ phát</p>}
                    
                    <div className={`grid gap-2 ${type === 'speed' ? 'grid-cols-3' : 'grid-cols-4'}`}>
                        {speeds.map((s) => {
                            const isActive = Number(speed) === s;
                            return (
                                <button
                                    key={s}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSpeedChange(s);
                                        if (type === 'speed') onClose(); 
                                    }}
                                    className={`text-xs font-bold py-2 rounded-lg border transition relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-green-500 text-white border-green-500 shadow-md' 
                                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:border-green-500 hover:text-green-600'
                                        }
                                    `}
                                >
                                    {s}x
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