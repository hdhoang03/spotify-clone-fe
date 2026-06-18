import { useState, useEffect, useMemo } from 'react';
import { X, Unlock, Search, UserX, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useBlockedUsers } from '../hooks/useBlockedUsers';
import ConfirmModal from '../../Admin/ConfirmModal';
interface BlockedListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BlockedListModal = ({ isOpen, onClose }: BlockedListModalProps) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingUnblock, setPendingUnblock] = useState<{ id: string; name: string } | null>(null);

    // Gọi Custom Hook Blocked Users
    const {
        blockedUsers,
        isLoading,
        hasMore,
        page,
        fetchBlockedUsers,
        unblockUser
    } = useBlockedUsers();

    // Chạy khi mở Modal
    useEffect(() => {
        if (isOpen) {
            fetchBlockedUsers(1, true);
        } else {
            setSearchTerm('');
        }
    }, [isOpen, fetchBlockedUsers]);

    const handleUnblock = (userId: string, userName: string) => {
        setPendingUnblock({ id: userId, name: userName });
    };

    const confirmUnblock = async () => {
        if (!pendingUnblock) return;
        await unblockUser(pendingUnblock.id);
        setPendingUnblock(null);
    };

    const handleLoadMore = () => {
        fetchBlockedUsers(page + 1);
    };

    const filteredUsers = useMemo(() => {
        return blockedUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [blockedUsers, searchTerm]);

    const portal = !isOpen ? null : createPortal(
        <div className="fixed inset-0 z-[30] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-[#181818] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t('settings.blocked_list_title')}</h2>
                        <p className="text-sm text-zinc-500 mt-1">{t('settings.blocked_list_desc')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* SEARCH */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('settings.search_blocked')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-10 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                </div>

                {/* LIST */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isLoading && blockedUsers.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-green-500" size={32} />
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <div className="space-y-2">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                                            crossOrigin="anonymous"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{user.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUnblock(user.id, user.username)}
                                        className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2"
                                    >
                                        <Unlock size={14} />
                                        <span className="hidden sm:inline">{t('settings.unblock')}</span>
                                    </button>
                                </div>
                            ))}

                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="w-full py-3 mt-4 text-sm font-medium flex justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border-t border-dashed border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : t('settings.load_more')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 opacity-60 min-h-[200px]">
                            <UserX size={48} strokeWidth={1.5} />
                            <p>{searchTerm ? t('settings.no_results') : t('settings.empty_blocked_list')}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );

    return (
        <>
            {portal}
            <ConfirmModal
                isOpen={!!pendingUnblock}
                onClose={() => setPendingUnblock(null)}
                onConfirm={confirmUnblock}
                type="UNBLOCK"
                title={t('settings.unblock_confirm_title', { name: pendingUnblock?.name })}
                message={t('settings.unblock_confirm_desc')}
            />
        </>
    );
};

export default BlockedListModal;
