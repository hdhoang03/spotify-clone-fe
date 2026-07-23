import { useState } from 'react';
import { ArrowLeftToLine, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import SidebarItem from './SidebarLibraryItem';
import SidebarHeader from './SidebarHeader';
import PlaylistModal from './PlaylistModal';
import { usePlaylists } from './usePlaylists';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    className?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

// const listVariants: Variants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
// };

const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
            type: "spring", // Chuyển từ linear sang spring
            stiffness: 250,
            damping: 25
        }
    }
};

const Sidebar = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse, className = "" }: SidebarProps) => {
    const { playlists, isLoading, error, createNewPlaylist } = usePlaylists();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCreatePlaylist = async (formData: FormData) => {
        setIsCreating(true);
        try {
            await createNewPlaylist(formData);
            return true; // Thành công -> Báo cho Modal đóng
        } catch (err) {
            alert(t('sidebar.create_error'));
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className={`flex h-full flex-col transition-all duration-500 ease-in-out bg-zinc-50/90 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-lg border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden ${className}`}>

            {/* Phần Header & Nút Tạo (+) */}
            <div className="flex items-center justify-between">
                <div className="flex-1 overflow-hidden">
                    <SidebarHeader isActive={activeTab === 'LIBRARY'} onClick={() => onTabChange?.('LIBRARY')} isCollapsed={isCollapsed} />
                </div>
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-1.5 mt-2 text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all mr-3"
                        title={t('sidebar.create_playlist')}
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
                            <motion.div key={playlist.id}
                                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                            >
                                <SidebarItem
                                    isCollapsed={isCollapsed}
                                    variant="playlist"
                                    imageUrl={playlist.coverUrl}
                                    label={playlist.name}
                                    description={`${playlist.songCount || 0} ${t('playlist.songs')}`}
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
            <div className={`p-4 border-t border-black/5 dark:border-white/5 shrink-0 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
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