// Bộ điều khiển chứa các nút bấm play, pause, next, previous, shuffle, repeat
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';

// Định nghĩa dữ liệu đầu vào (Props) - Giống DTO
interface PlayerControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
}

const PlayerControls = ({ isPlaying, onTogglePlay }: PlayerControlsProps) => {
    return (
        <div className="flex items-center gap-6 mb-1">
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition" title="Trộn bài">
                <Shuffle size={18} />
            </button>
            
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition">
                <SkipBack size={24} fill="currentColor" />
            </button>
            
            <button 
                onClick={onTogglePlay}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg
                bg-black text-white dark:bg-white dark:text-black"
            >
                {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-0.5"/>}
            </button>
            
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition">
                <SkipForward size={24} fill="currentColor" />
            </button>
            
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition" title="Lặp lại">
                <Repeat size={18} />
            </button>
        </div>
    );
};

export default PlayerControls;