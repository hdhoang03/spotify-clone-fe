import { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, PlusCircle } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';
import TrackContextMenu from './TrackContextMenu';

interface TrackRowProps {
    index: number;
    coverUrl: string;
    title: string;
    artist: string;
    duration: number;
    streamCount?: number; // Thêm trường này (Optional)
    isPlaying?: boolean;
    onClick?: () => void;
    isArtistView?: boolean;
}

// Helper format số (123456 -> 123,456)
const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

const TrackRow = ({ index, coverUrl, title, artist, duration, streamCount, isPlaying, onClick, isArtistView = false }: TrackRowProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div 
            className="group flex items-center justify-between p-2 md:px-4 md:py-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* --- LEFT: Index & Info --- */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-6 text-center text-gray-500 font-medium text-sm hidden md:block">
                    {isHovered || isPlaying ? (
                        isPlaying ? <Pause size={16} className="text-green-500 mx-auto"/> : <Play size={16} className="text-white mx-auto"/>
                    ) : (
                        <span className="group-hover:hidden">{index + 1}</span>
                    )}
                </div>

                {/* Image & Text */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={coverUrl} alt={title} className="w-10 h-10 md:w-10 md:h-10 rounded shadow-md object-cover shrink-0" />
                    
                    <div className="flex flex-col min-w-0">
                        {/* Title */}
                        <span className={`font-bold truncate text-sm md:text-base ${isPlaying ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                            {title}
                        </span>
                        
                        {/* Mobile View: Artist + Stream Count */}
                        {/* <div className="flex md:hidden items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="truncate max-w-[150px]">{artist}</span>
                            {streamCount && (
                                <>
                                    <span className="font-medium text-xs">•</span>
                                    <span>{formatNumber(streamCount)}</span>
                                </>
                            )}
                        </div> */}
                        <div className="block md:hidden text-xs text-gray-500 dark:text-gray-400">
                            {isArtistView ? (
                                // CASE 1: Trang Artist -> Ẩn tên ca sĩ, hiện Stream Count
                                <span className="font-medium">
                                    {streamCount ? formatNumber(streamCount) : '0'}
                                </span>
                            ) : (
                                // CASE 2: Trang Profile/Playlist -> Hiện tên ca sĩ như cũ
                                <span className="truncate max-w-[200px] block">
                                    {artist}
                                </span>
                            )}
                        </div>

                        {/* Desktop View: Artist Only */}
                        <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400 truncate group-hover:text-black dark:group-hover:text-white transition">
                            {artist}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE: Stream Count (Desktop Only - Hiện cột riêng) --- */}
            {streamCount && (
                <div className="hidden md:flex flex-1 justify-end mr-8 text-sm text-gray-500 dark:text-gray-400 font-variant-numeric tabular-nums">
                    {formatNumber(streamCount)}
                </div>
            )}

            {/* --- RIGHT: Actions & Duration --- */}
            <div className="flex items-center gap-4 justify-end">
                {/* Hover Actions (Chỉ hiện khi hover trên Desktop) */}
                <div className={`hidden md:flex items-center gap-3 ${isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <button className="text-gray-400 hover:text-white" title="Save to Liked Songs" onClick={(e) => e.stopPropagation()}>
                        <Heart size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-white" title="Add to Playlist" onClick={(e) => e.stopPropagation()}>
                        <PlusCircle size={18} />
                    </button>
                </div>

                {/* Duration */}
                <div className="text-sm text-gray-500 dark:text-gray-400 font-variant-numeric w-10 text-right">
                    {duration ? formatTime(duration) : '--:--'}
                </div>

                {/* Menu Button (...) */}
                <div className="relative">
                    <button 
                        className={`text-gray-400 hover:text-black dark:hover:text-white transition p-1
                                    ${isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0 md:opacity-0 opacity-100' /* Mobile luôn hiện */}`}
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {isMenuOpen && (
                        <TrackContextMenu 
                            song={{ title, artist, coverUrl, id: '123' }} 
                            onClose={() => setIsMenuOpen(false)}
                            position={null} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackRow;