// Thanh tiến trình phát nhạc với thời gian hiện tại và tổng thời lượng
import React from 'react';

interface PlayerProgressBarProps {
    currentTime: number;
    duration: number;
    onTimeChange: (time: number) => void;
    formatTime: (time: number) => string;
}

const PlayerProgressBar = ({ currentTime, duration, onTimeChange, formatTime }: PlayerProgressBarProps) => {
    //Tính phần trăm tiến trình
    const percent = duration ? (currentTime / duration) * 100 : 0;
    return (
        <div className="w-full flex items-center justify-center gap-3 text-xs text-gray-400 font-medium group select-none">
            <span className="w-10 text-right min-w-[40px] tabular-nums">{
                formatTime(currentTime)}
            </span>
            <input 
                type="range" 
                min="0" 
                max={duration}
                value={currentTime}
                onChange={(e) => onTimeChange(Number(e.target.value))}

                style={{
                    background: `linear-gradient(to right, #22c55e ${percent}%, #4b5563 ${percent}%)`
                }}

                className={`
                    relative flex-1 h-1 rounded-lg cursor-pointer appearance-none outline-none
                    transition-all duration-200
                    /* Màu nền mặc định khi chưa load style (fallback) */
                    bg-gray-600 
                    
                    /* TÙY CHỈNH NÚT KÉO (THUMB) CHO CHROME/SAFARI/EDGE */
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:transition-opacity
                    
                    /* Mặc định ẩn nút kéo (opacity-0), chỉ hiện khi hover vào thanh nhạc (group-hover) */
                    [&::-webkit-slider-thumb]:opacity-0
                    group-hover:[&::-webkit-slider-thumb]:opacity-100

                    /* TÙY CHỈNH NÚT KÉO CHO FIREFOX */
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:border-none
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:opacity-0
                    group-hover:[&::-moz-range-thumb]:opacity-100
                `}
            />
            
            <span className="w-10 min-w-[40px] tabular-nums">
                {formatTime(duration)}
            </span>
        </div>
    );
};

export default PlayerProgressBar;