import { ArrowLeftToLine, Heart, PlusSquare, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SidebarItem from './SidebarLibraryItem';
import SidebarHeader from './SidebarHeader';
import { usePlaylists } from '../../hooks/usePlaylists';

interface SidebarProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    className?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Sidebar = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse, className = "" }: SidebarProps) => {
    const { playlists, isLoading, error } = usePlaylists();

    return (
        <div className={`
            flex h-full flex-col 
            transition-all duration-300 ease-in-out
            bg-white border-r border-gray-200 
            dark:bg-black/90 dark:border-white/10 
            pt-2
            w-full
            ${className}
        `}>
            {/* --- PHẦN 1: HEADER (Giữ nguyên thiết kế cũ) --- */}
            <div className={`
                flex items-center mb-2 px-4 shrink-0
                ${isCollapsed ? 'justify-center py-2' : ''}
            `}>
                {!isCollapsed && (
                    <SidebarHeader
                        isActive={activeTab === 'LIBRARY'}
                        onClick={() => onTabChange?.('LIBRARY')}
                    />
                )}

                {/* Khi thu gọn: Chỉ hiện icon Library nhỏ gọn */}
                {isCollapsed && (
                    <button
                        onClick={() => onTabChange?.('LIBRARY')}
                        className={`p-3 rounded-lg transition-colors
                            ${activeTab === 'LIBRARY'
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-green-600 dark:text-green-500'
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                            }`}
                    >
                        <Library size={24} strokeWidth={activeTab === 'LIBRARY' ? 3 : 2} />
                    </button>
                )}
            </div>

            {/* --- PHẦN 2: DANH SÁCH (Cuộn ở giữa) --- */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar pb-2 ${isCollapsed ? 'px-2' : 'px-3'}`}>

                {/* Item Tĩnh */}
                <SidebarItem
                    variant="playlist"
                    isCollapsed={isCollapsed}
                    icon={<div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover/item:text-black dark:group-hover/item:text-white transition-colors"><PlusSquare size={24} /></div>}
                    label="Tạo playlist mới"
                    onClick={() => console.log("Create")}
                />

                <SidebarItem
                    variant="playlist"
                    isCollapsed={isCollapsed}
                    isActive={activeTab === 'LIKED_SONGS'}
                    icon={<div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white shadow-lg"><Heart size={20} fill="currentColor" /></div>}
                    label="Bài hát đã thích"
                    onClick={() => onTabChange?.('LIKED_SONGS')}
                />

                <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-4 mx-3" />

                {/* Playlist từ API */}
                {!isLoading && !error && (
                    <motion.div variants={listVariants} initial="hidden" animate="visible">
                        {playlists.map((playlist) => (
                            <motion.div key={playlist.id} variants={itemVariants}>
                                <SidebarItem
                                    variant="playlist"
                                    isCollapsed={isCollapsed}
                                    imageUrl={playlist.imageUrl}
                                    label={playlist.name}
                                    isActive={activeTab === `PLAYLIST_${playlist.id}`}
                                    onClick={() => onTabChange?.(`PLAYLIST_${playlist.id}`)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* --- PHẦN 3: FOOTER (Nút thu gọn nằm tách biệt ở đây) --- */}
            <div className={`
                p-4 border-t border-gray-100 dark:border-white/5 shrink-0
                flex ${isCollapsed ? 'justify-center' : 'justify-end'}
            `}>
                <button
                    onClick={onToggleCollapse}
                    className={`
                        p-2 rounded-full transition-all duration-300
                        text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white
                        hover:bg-zinc-100 dark:hover:bg-zinc-800
                        ${isCollapsed ? 'rotate-180' : ''} /* Hiệu ứng xoay mũi tên */
                    `}
                    title={isCollapsed ? "Mở rộng thư viện" : "Thu gọn thư viện"}
                >
                    {/* Chỉ cần dùng 1 icon và xoay nó */}
                    <ArrowLeftToLine size={20} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;