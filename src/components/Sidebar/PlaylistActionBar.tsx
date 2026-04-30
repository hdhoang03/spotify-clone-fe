// src/components/PlaylistDetail/PlaylistActionBar.tsx
import { Play, Shuffle, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMusic } from '../../contexts/MusicContent';

interface ActionBarProps {
    isOwner: boolean;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onPlayClick?: () => void;
}

const PlaylistActionBar = ({ isOwner, onEditClick, onDeleteClick, onPlayClick }: ActionBarProps) => {
    const [showDropdown, setShowDropdown] = useState(false);

    // LẤY TRẠNG THÁI SHUFFLE TỪ GLOBAL CONTEXT
    const { isShuffling, toggleShuffle } = useMusic();

    return (
        <div className="px-6 md:px-8 py-4 flex items-center gap-6 relative z-30">
            {/* Nút Play to */}
            <button
                onClick={onPlayClick} // Gắn sự kiện play vào đây
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg text-black"
            >
                <Play size={28} fill="currentColor" className="ml-1" />
            </button>

            {/* Nút Shuffle giờ đã liên kết với Player bên dưới */}
            <button
                onClick={toggleShuffle}
                className={`transition-colors relative ${isShuffling ? 'text-green-500' : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'}`}
            >
                <Shuffle size={28} />
                {isShuffling && <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1 absolute left-1/2 -translate-x-1/2" />}
            </button>

            {/* Menu 3 chấm */}
            {isOwner && (
                <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)} className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                        <MoreHorizontal size={32} />
                    </button>

                    {showDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                            <div className="absolute top-10 left-0 bg-white dark:bg-[#282828] rounded-md shadow-xl w-56 z-50 p-1 border border-zinc-200 dark:border-transparent">
                                <button
                                    onClick={() => { onEditClick(); setShowDropdown(false); }}
                                    className="w-full text-left px-4 py-3 text-sm text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-sm flex items-center gap-3"
                                >
                                    <Edit2 size={16} /> Chỉnh sửa chi tiết
                                </button>
                                <button
                                    onClick={() => { onDeleteClick(); setShowDropdown(false); }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-sm flex items-center gap-3"
                                >
                                    <Trash2 size={16} /> Xóa danh sách phát
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlaylistActionBar;