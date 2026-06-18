/**
 * PlaybackActionBar — Reusable action bar dùng chung cho Playlist, Liked Songs, v.v.
 *
 * Props:
 *  - isPlaying      : bài hiện tại có đang phát trong context này không
 *  - onPlayClick    : phát từ đầu / phát cả list
 *  - onTogglePlay   : pause/resume
 *  - menuItems      : (optional) mảng action hiện trong dropdown 3 chấm
 *                     Nếu không truyền thì nút 3 chấm bị ẩn
 */

import { Play, Pause, Shuffle, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useMusic } from '../../contexts/MusicContent';

export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

interface PlaybackActionBarProps {
    isPlaying?: boolean;
    onPlayClick?: () => void;
    onTogglePlay?: () => void;
    menuItems?: ActionMenuItem[];
}

const PlaybackActionBar = ({ isPlaying, onPlayClick, onTogglePlay, menuItems }: PlaybackActionBarProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { isShuffling, toggleShuffle } = useMusic();

    const hasMenu = menuItems && menuItems.length > 0;

    return (
        <div className="px-6 md:px-8 py-4 flex items-center gap-6 relative z-30">
            {/* Nút Play/Pause lớn */}
            <button
                onClick={isPlaying && onTogglePlay ? onTogglePlay : onPlayClick}
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg text-black"
            >
                {isPlaying
                    ? <Pause size={28} fill="currentColor" />
                    : <Play size={28} fill="currentColor" className="ml-1" />
                }
            </button>

            {/* Nút Shuffle */}
            <button
                onClick={toggleShuffle}
                className={`transition-colors relative ${isShuffling
                    ? 'text-green-500'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
            >
                <Shuffle size={28} />
                {isShuffling && (
                    <div className="w-1 h-1 bg-green-500 rounded-full absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
                )}
            </button>

            {/* Dropdown menu 3 chấm — chỉ hiện khi có menuItems */}
            {hasMenu && (
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(prev => !prev)}
                        className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <MoreHorizontal size={32} />
                    </button>

                    {showDropdown && (
                        <>
                            {/* Overlay đóng dropdown khi click ngoài */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                            <div className="absolute top-10 left-0 bg-white dark:bg-[#282828] rounded-md shadow-xl w-56 z-50 p-1 border border-zinc-200 dark:border-transparent">
                                {menuItems!.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { item.onClick(); setShowDropdown(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm rounded-sm flex items-center gap-3 transition-colors ${
                                            item.variant === 'danger'
                                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
                                                : 'text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlaybackActionBar;
