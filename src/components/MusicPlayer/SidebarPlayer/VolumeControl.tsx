import { Volume2, VolumeX } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (v: number) => void;
    isMuted: boolean;
    toggleMute: () => void;
    isLight: boolean;
    iconBtnClass: string;
}

const VolumeControl = ({ volume, onVolumeChange, isMuted, toggleMute, isLight, iconBtnClass }: VolumeControlProps) => {
    const barRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleVolumeUpdate = (clientX: number) => {
        if (!barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        onVolumeChange(pct);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleVolumeUpdate(e.clientX);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            handleVolumeUpdate(moveEvent.clientX);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const touch = e.touches[0];
        handleVolumeUpdate(touch.clientX);

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const touch = moveEvent.touches[0];
            handleVolumeUpdate(touch.clientX);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    };

    return (
        <div className="flex items-center gap-2 mb-5 flex-shrink-0">
            <button onClick={toggleMute} className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all ${iconBtnClass}`}>
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div
                ref={barRef}
                className="relative flex-1 h-4 flex items-center cursor-pointer group"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className={`w-full h-1 rounded-full ${isLight ? 'bg-black/15' : 'bg-white/15'}`}>
                    <div className="h-full rounded-full bg-primary-500 relative" style={{ width: `${isMuted ? 0 : volume * 100}%` }}>
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-transform
                            ${isDragging ? 'scale-125' : 'scale-0 group-hover:scale-100'}`} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolumeControl;