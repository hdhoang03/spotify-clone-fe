import { useState } from 'react';
import { ArrowLeftToLine, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SidebarItem from './SidebarLibraryItem';
import SidebarHeader from './SidebarHeader';
import PlaylistModal from './PlaylistModal';
import { usePlaylists } from './usePlaylists';
import { useNavigate } from 'react-router-dom';

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

const Sidebar = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse, className = "" }: SidebarProps) => {
    // 1. Lấy dữ liệu thật
    const { playlists, isLoading, error, createNewPlaylist } = usePlaylists();

    // 2. Trạng thái Modal Tạo Playlist
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const navigate = useNavigate();

    // 3. Xử lý tạo Playlist
    const handleCreatePlaylist = async (formData: FormData) => {
        setIsCreating(true);
        try {
            await createNewPlaylist(formData);
            return true; // Thành công -> Báo cho Modal đóng
        } catch (err) {
            alert("Có lỗi xảy ra khi tạo playlist!");
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className={`flex h-full flex-col transition-all duration-300 ease-in-out bg-white border-r border-gray-200 dark:bg-[#121212] dark:border-white/5 ${className}`}>

            {/* Phần Header & Nút Tạo (+) */}
            <div className="flex items-center justify-between pr-4">
                <div className="flex-1">
                    <SidebarHeader isActive={activeTab === 'LIBRARY'} onClick={() => onTabChange?.('LIBRARY')} />
                </div>
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-1.5 mt-2 text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
                        title="Tạo danh sách phát"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>

            {/* Phần Danh sách */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar mt-2">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : error ? (
                    <p className="text-xs text-center text-red-500 py-4">{error}</p>
                ) : (
                    <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-1">
                        {playlists.map((playlist) => (
                            <motion.div key={playlist.id} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                                <SidebarItem
                                    isCollapsed={isCollapsed}
                                    variant="playlist"
                                    imageUrl={playlist.coverUrl}
                                    label={playlist.name}
                                    isActive={activeTab === `PLAYLIST_${playlist.id}`}
                                    onClick={() => {
                                        onTabChange?.(`PLAYLIST_${playlist.id}`); // Giữ lại nếu bạn cần quản lý state tab
                                        navigate(`/playlist/${playlist.id}`);     // Chuyển hướng đến trang chi tiết
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Nút Thu gọn */}
            <div className={`p-4 border-t border-gray-100 dark:border-white/5 shrink-0 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
                <button onClick={onToggleCollapse} className="p-2 rounded-full transition-all duration-300 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <ArrowLeftToLine size={20} className={isCollapsed ? 'rotate-180' : ''} />
                </button>
            </div>

            {/* Popup Tạo Playlist */}
            <PlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlaylist}
                isLoading={isCreating}
            />
        </div>
    );
};

export default Sidebar;