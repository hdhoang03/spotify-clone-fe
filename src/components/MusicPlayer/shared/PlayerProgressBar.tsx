// Thanh tiến trình phát nhạc với thời gian hiện tại và tổng thời lượng
import { useState } from 'react';

interface PlayerProgressBarProps {
    currentTime: number;
    duration: number;
    onTimeChange: (time: number) => void;
    formatTime: (time: number) => string;
}

const PlayerProgressBar = ({ currentTime, duration, onTimeChange, formatTime }: PlayerProgressBarProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const percent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full flex items-center gap-3 select-none group">
            {/* Current time */}
            <span className="w-10 text-right min-w-[40px] tabular-nums text-xs text-white/40 font-medium
                transition-colors duration-200 group-hover:text-white/70">
                {formatTime(currentTime)}
            </span>

            {/* Progress track */}
            <div className="relative flex-1 flex items-center h-5">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => onTimeChange(Number(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    style={{
                        background: `linear-gradient(to right,
                            #1ed760 0%,
                            #22d46a ${percent}%,
                            rgba(255,255,255,0.12) ${percent}%,
                            rgba(255,255,255,0.12) 100%
                        )`
                    }}
                    className={`
                        w-full rounded-full cursor-pointer appearance-none outline-none
                        transition-all duration-200 ease-out
                        ${isDragging ? 'h-[6px]' : 'h-1 group-hover:h-[5px]'}

                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        ${isDragging
                            ? '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(30,215,96,0.6)]'
                            : '[&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 group-hover:[&::-webkit-slider-thumb]:w-4 group-hover:[&::-webkit-slider-thumb]:h-4 group-hover:[&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                        }

                        [&::-moz-range-thumb]:border-none
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:opacity-0
                        group-hover:[&::-moz-range-thumb]:opacity-100
                        [&::-moz-range-thumb]:w-4
                        [&::-moz-range-thumb]:h-4
                    `}
                />
            </div>

            {/* Total duration */}
            <span className="w-10 min-w-[40px] tabular-nums text-xs text-white/40 font-medium
                transition-colors duration-200 group-hover:text-white/70">
                {formatTime(duration)}
            </span>
        </div>
    );
};

export default PlayerProgressBar;