import React, { useRef, useEffect, useState } from 'react';
import ArtistActionSheet from './ArtistActionSheet';
import { Play, Pause, Shuffle, MoreHorizontal, Ban, Flag, Share2, Copy } from 'lucide-react';

interface ArtistActionBarProps {
    isPlaying: boolean;
    isFollowing: boolean;
    isShuffling: boolean;        // Thêm prop
    onTogglePlay: () => void;
    onToggleFollow: () => void;
    onToggleShuffle: () => void; // Thêm prop logic shuffle
    artistName: string;
    artistImage: string;
    isSticky?: boolean;
}

const ArtistActionBar = ({ 
    isPlaying, 
    isFollowing, 
    isShuffling, 
    onTogglePlay, 
    onToggleFollow, 
    onToggleShuffle,
    artistName,
    artistImage,
    isSticky = false 
}: ArtistActionBarProps & { artistName: string, artistImage: string }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Đảm bảo ref này được sử dụng

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleMoreClick = () => {
        if (window.innerWidth < 768) {
            setIsSheetOpen(true);
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    return (
        <div 
            className={`flex items-center justify-between md:justify-start gap-4 md:gap-6 px-6 md:px-8 py-3 
                sticky top-0 z-40 transition-all duration-300 ease-in-out border-b
                ${isSticky 
                    /* SỬA 2: Thêm background đặc để che nội dung trôi bên dưới */
                    ? 'bg-white dark:bg-[#121212] dark:border-white/10' 
                    : 'bg-white/95 dark:bg-[#121212]/0 border-transparent' 
                }`}
        >
            
            {/* --- KHỐI TRÁI: Play Button + Tên Nghệ Sĩ (Ẩn/Hiện) --- */}
            <div className="flex items-center gap-4">
                <button onClick={onTogglePlay} className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500 text-black flex items-center justify-center transition hover:scale-105 shadow-lg active:scale-95 flex-shrink-0">
                    {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                </button>

                {/* Tên nghệ sĩ - Chỉ hiện khi isSticky = true */}
                <div className={`flex flex-col transition-all duration-500 overflow-hidden
                                ${isSticky ? 'opacity-100 translate-y-0 w-auto' : 'opacity-0 translate-y-4 w-0'}`}>
                    <span className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white truncate max-w-[150px] md:max-w-md">
                        {artistName}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-auto md:ml-0">
                
                {/* Nút Shuffle (Hiện trên cả Mobile và Desktop nhưng style khác nhau) */}
                <button 
                    onClick={onToggleShuffle}
                    className={`transition relative ${isShuffling ? "text-green-500" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
                >
                    {/* Icon nhỏ hơn trên mobile (20) và to hơn trên desktop (24) */}
                    <Shuffle className="w-5 h-5 md:w-6 md:h-6" />
                    
                    {/* Dấu chấm xanh khi active */}
                    {isShuffling && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                    )}
                </button>

                {/* Nút Follow */}
                <button onClick={onToggleFollow} className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-sm font-bold tracking-wider transition ${isFollowing ? 'border-green-500 text-green-500' : 'border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white'}`}>
                    {isFollowing ? 'Following' : 'Follow'}
                </button>

                {/* Nút More (3 chấm) */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={handleMoreClick}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition flex items-center"
                    >
                        <MoreHorizontal size={28} />
                    </button>

                    {/* Dropdown Menu (Desktop) */}
                    {isDropdownOpen && (
                        <div className="hidden md:block absolute right-0 top-full mt-2 rounded shadow-2xl p-1 w-56 z-50 
                                        bg-white dark:bg-[#282828] border border-zinc-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <MenuItem icon={<Ban size={16}/>} label="Don't play this artist" />
                                <MenuItem icon={<Flag size={16}/>} label="Report" />
                                <div className="h-[1px] bg-zinc-200 dark:bg-white/10 my-1"/>
                                <MenuItem icon={<Share2 size={16}/>} label="Share" />
                                <MenuItem icon={<Copy size={16}/>} label="Copy link to artist" />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Sheet (Mobile) - Nằm ngoài layout chính để không ảnh hưởng vị trí */}
            <ArtistActionSheet 
                isOpen={isSheetOpen} 
                onClose={() => setIsSheetOpen(false)}
                artistName={artistName}
                artistImage={artistImage}
            />
        </div>
    );
};

const MenuItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm text-left transition-colors
                      text-zinc-700 dark:text-white/90 
                      hover:bg-zinc-100 dark:hover:bg-[#3e3e3e]">
        {icon} <span>{label}</span>
    </button>
);

export default ArtistActionBar;