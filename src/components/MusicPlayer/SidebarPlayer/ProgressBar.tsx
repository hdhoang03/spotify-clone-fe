import { useState, useCallback } from 'react';

interface ProgressBarProps {
    currentTime: number;
    duration: number;
    onTimeChange: (t: number) => void;
    formatTime: (t: number) => string;
    isLight: boolean;
    subTextClass: string;
}

const ProgressBar = ({ currentTime, duration, onTimeChange, formatTime, isLight, subTextClass }: ProgressBarProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onTimeChange(pct * duration);
    }, [duration, onTimeChange]);

    return (
        <div className="mb-3 flex-shrink-0">
            <div
                className={`relative h-1 rounded-full cursor-pointer group ${isLight ? 'bg-black/15' : 'bg-white/15'}`}
                onClick={handleSeekClick}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
            >
                <div
                    className="h-full rounded-full bg-green-500 relative transition-all"
                    style={{ width: `${progressPct}%` }}
                >
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md
                        transition-transform ${isDragging ? 'scale-125' : 'scale-0 group-hover:scale-100'}`}
                    />
                </div>
            </div>
            <div className={`flex justify-between mt-1.5 text-[10px] font-medium ${subTextClass}`}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default ProgressBar;