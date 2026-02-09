// components/MusicPlayer/MiniPlayer.tsx
import { useState } from 'react';
import { Play, Pause, Heart, X, Clock } from 'lucide-react';
import PlayerOptionsMenu from './PlayerOptionsMenu';
import ScrollingText from './ScrollingText';

interface MiniPlayerProps {
    currentSong: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onExpand: () => void;
    onClose: () => void;
    progress: number;
    speed: number;
    onSpeedChange: (speed: number) => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
    dominantColor?: string;
}

const MiniPlayer = ({ 
    currentSong, isPlaying, onTogglePlay, onExpand, onClose, progress,
    speed, onSpeedChange, volume, onVolumeChange,
    toggleMute, isMuted, dominantColor
}: MiniPlayerProps) => {
    const [showOptions, setShowOptions] = useState(false);
    const isSpeedChanged = speed !== 1;
    
    // Fallback màu nếu chưa có (mặc định màu tối)
    const bgColor = dominantColor || '#18181b';

    // --- HÀM KIỂM TRA ĐỘ SÁNG CỦA MÀU NỀN ---
    const isLightColor = (hex: string) => {
        const c = hex.substring(1)
        const rgb = parseInt(c, 16);     // Chuyển hex sang dec
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >>  8) & 0xff;
        const b = (rgb >>  0) & 0xff;
        
        // Công thức tính độ sáng (Luma) chuẩn W3C
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 
        return luma > 140; // Nếu độ sáng > 140 thì coi là màu Sáng -> Chữ Đen
    };

    const isLight = isLightColor(bgColor);
    const textColorClass = isLight ? 'text-black' : 'text-white';
    const subTextColorClass = isLight ? 'text-zinc-700' : 'text-zinc-300';
    const iconBaseClass = isLight ? 'text-zinc-800 hover:text-black' : 'text-zinc-300 hover:text-white';
    const progressBarBg = isLight ? 'bg-black/10' : 'bg-white/20';
    const progressBarFill = isLight ? 'bg-black' : 'bg-white';

    return (
        <div 
            onClick={onExpand}
            className="fixed bottom-[70px] md:bottom-0 left-2 right-2 md:left-0 md:right-0 
                    backdrop-blur-md border border-white/10 md:border-none 
                    rounded-lg md:rounded-none p-2 flex items-center justify-between 
                    cursor-pointer z-40 shadow-xl transition-all duration-500 ease-in-out" // Thêm duration để chuyển màu mượt hơn
            style={{ 
                // Sử dụng Gradient nhẹ cùng tông màu để tạo chiều sâu nhưng vẫn giữ đúng màu chủ đạo
                background: `linear-gradient(to right, ${bgColor}EE, ${bgColor}FF)` 
            }}
        >
        {/* Left: Info */}
            <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                <img 
                    src={currentSong.coverUrl} 
                    alt="cover" 
                    className="w-10 h-10 rounded-md object-cover animate-spin-slow shadow-md" 
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                />
                
                <div className="flex flex-col overflow-hidden w-full justify-center">
                    <div className="md:hidden w-full"> 
                        <ScrollingText 
                            content={currentSong.title}
                            className={`text-sm font-bold ${textColorClass}`}
                        />
                        <ScrollingText 
                            content={currentSong.artist}
                            className={`text-xs ${subTextColorClass} block`}
                        /> 
                    </div>

                    <div className="hidden md:block w-full">
                        <p className={`text-sm font-bold truncate ${textColorClass}`}>{currentSong.title}</p>
                        <p className={`text-xs truncate ${subTextColorClass}`}>{currentSong.artist}</p>
                    </div>
                </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3 pr-2 relative">
                {showOptions && (
                    <div className="absolute bottom-full right-0 mb-2 mr-[-10px]">
                        <PlayerOptionsMenu 
                            type="full"
                            speed={speed}
                            onSpeedChange={onSpeedChange}
                            volume={volume}
                            onVolumeChange={onVolumeChange}
                            onClose={() => setShowOptions(false)}
                            toggleMute={toggleMute}
                            isMuted={isMuted}
                        />
                    </div>
                )}

                {/* Nút Clock */}
                <button 
                    className={`transition p-1 rounded-full ${
                        isSpeedChanged || showOptions
                        ? 'text-green-500 font-bold'
                        : iconBaseClass
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(!showOptions);
                    }}
                >
                    <Clock size={20} />
                </button>

                <button 
                    className={`transition p-1 ${iconBaseClass} hover:text-green-500`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Heart size={20} />
                </button>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                    className={`transition p-1 hover:scale-110 ${textColorClass}`}
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                {/* NÚT TẮT PLAYER */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className={`ml-2 p-1 transition ${isLight ? 'text-zinc-600 hover:text-red-600' : 'text-zinc-400 hover:text-red-500'}`}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Bottom Progress Bar */}
            <div className={`absolute bottom-0 left-2 right-2 md:left-0 md:right-0 h-[3px] rounded-full overflow-hidden ${progressBarBg}`}>
                <div 
                    className={`h-full rounded-full transition-all duration-300 ${progressBarFill}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default MiniPlayer;