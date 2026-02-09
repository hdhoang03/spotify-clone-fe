// Quản lý âm lượng của trình phát nhạc với biểu tượng và thanh trượt
import React, { useState } from 'react';
import { Mic2, ListMusic, Volume2, Volume1, VolumeX, MoreHorizontal, Clock } from 'lucide-react';
import PlayerOptionsMenu from './PlayerOptionsMenu';

interface PlayerVolumeProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
    speed: number;    
    onSpeedChange: (speed: number) => void;
}

const PlayerVolume = ({ speed, onSpeedChange, volume, onVolumeChange, toggleMute, isMuted }: PlayerVolumeProps) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [menuType, setMenuType] = React.useState<'speed' | 'full'>('speed');

    const toggleMenu = (type: 'speed' | 'full') => {
        if (isMenuOpen && menuType === type) {
            setIsMenuOpen(false);
        } else {
            setMenuType(type);
            setIsMenuOpen(true);
        }
    }; 

    const VolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX size={20} className="text-gray-400" />;
        if (volume > 0 && volume <= 0.5) return <Volume1 size={20} className="text-gray-400" />;
        return <Volume2 size={20} className="text-gray-400" />;
    };

    const isSpeedChanged = speed !== 1; // Kiểm tra nếu tốc độ khác 1x
    return (
        <div className="flex items-center justify-end w-[30%] gap-3 relative">
            
            {/* --- GIAO DIỆN DESKTOP (PC) --- */}
            <div className="hidden lg:flex items-center gap-3">
                <button 
                    className={`flex items-center gap-1.5 transition px-2 py-1 rounded-md
                        ${isSpeedChanged 
                            ? 'text-green-400 bg-white/10' // Màu xanh sáng hơn trên nền tối
                            : 'text-white/60 hover:text-white' // Màu trắng mờ
                        }`}
                    title="Tốc độ phát"
                    onClick={() => toggleMenu('speed')} 
                >
                    <Clock size={18} />
                    {/* {isSpeedChanged && <span className="text-xs font-bold">{speed}x</span>} */}
                </button>

                <button className="text-white/60 hover:text-white transition" title="Lời bài hát">
                    <Mic2 size={18} />
                </button>
                <button className="text-white/60 hover:text-white transition" title="Danh sách chờ">
                    <ListMusic size={18} />
                </button>
                
                <div className="flex items-center gap-2 w-24 xl:w-32 group">
                    <button onClick={toggleMute} className="hover:scale-110 transition p-1">
                        <VolumeIcon />
                    </button>
                    
                    <input 
                        type="range" 
                        min="0" 
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-300 dark:bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-green-500 hover:h-1.5 transition-all" 
                    />
                </div>
            </div>

            {/* --- GIAO DIỆN MOBILE --- */}
            <div className="lg:hidden">
                <button 
                    onClick={() => toggleMenu('full')}
                    className={`p-2 rounded-full transition ${
                        isMenuOpen
                        ? 'bg-green-500 text-black'
                        : 'text-white/80 hover:text-white'
                    }`}
                >
                    <MoreHorizontal size={24} />
                </button>
            </div>

            {isMenuOpen && (
                <PlayerOptionsMenu 
                    speed={speed} 
                    onSpeedChange={onSpeedChange}
                    onClose={() => setIsMenuOpen(false)}
                    type={menuType}
                    volume={volume}
                    onVolumeChange={onVolumeChange}
                />
            )}
        </div>
    );
};

export default PlayerVolume;