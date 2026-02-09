import React from 'react';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1, Clock } from 'lucide-react';

type RepeatMode = 'off' | 'all' | 'one';

interface MainControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    speed: number;
    isShuffling: boolean;
    repeatMode: RepeatMode;
    onToggleShuffle: () => void;
    onToggleRepeat: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const MainControls = ({ isPlaying, onTogglePlay, speed, isShuffling, repeatMode, onToggleShuffle, onToggleRepeat, onNext, onPrev }: MainControlsProps) => {
    
    const getActiveColor = (isActive: boolean) => isActive ? "text-green-500" : "text-gray-400 hover:text-white";

return (
        <>
            <div className="flex justify-between items-center mt-4">
                {/* Nút Shuffle */}
                <button 
                    onClick={onToggleShuffle}
                    className={`${getActiveColor(isShuffling)} transition`}
                    title="Trộn bài"
                >
                    <Shuffle size={24}/>
                    {/* Dấu chấm nhỏ để báo hiệu đang bật (tùy chọn UI) */}
                    {isShuffling && <div className="mx-auto w-1 h-1 bg-green-500 rounded-full mt-1" />}
                </button>

                <button onClick={onPrev} className="text-white hover:text-gray-300">
                    <SkipBack size={32} fill="currentColor"/>
                </button>
                
                {/* Play/Pause */}
                <button 
                    onClick={onTogglePlay}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition"
                >
                    {isPlaying ? <Pause size={32} fill="black"/> : <Play size={32} fill="black" className="ml-1"/>}
                </button>
                
                <button onClick={onNext} className="text-white hover:text-gray-300">
                    <SkipForward size={32} fill="currentColor"/>
                </button>
                
                {/* Nút Repeat: Xử lý hiển thị 3 trạng thái */}
                <button 
                    onClick={onToggleRepeat}
                    className={`${getActiveColor(repeatMode !== 'off')} transition relative`}
                    title="Lặp lại"
                >
                    {/* Nếu repeatMode là 'one' thì hiện icon số 1, còn lại hiện icon thường */}
                    {repeatMode === 'one' ? <Repeat1 size={24} /> : <Repeat size={24}/>}
                    
                    {/* Dấu chấm nhỏ báo hiệu */}
                    {repeatMode !== 'off' && <div className="mx-auto w-1 h-1 bg-green-500 rounded-full mt-1" />}
                </button>
            </div>

            {/* Speed Control */}
            <div className="flex justify-between items-center mt-6">
                 <div className="relative group">
                     <button className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
                         <Clock size={14} /> 
                         {speed}x
                     </button>
                 </div>
                 <div className="w-1/2"></div>
            </div>
        </>
    );
};

export default React.memo(MainControls);