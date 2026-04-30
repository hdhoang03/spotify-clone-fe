// // src/components/Settings/components/BlockedListModal.tsx
// import { useState, useMemo } from 'react';
// import { X, Unlock, Search, UserX } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { createPortal } from 'react-dom';

// // 1. MOCK DATA LỚN (Giả lập 100 người)
// const MOCK_LARGE_DATA = Array.from({ length: 50 }).map((_, i) => ({
//     id: i,
//     name: i % 2 === 0 ? `User ${i} (MCK Fan)` : `Anti Fan ${i}`,
//     avatar: i % 3 === 0 ? "https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952" : "",
//     blockedAt: "20/05/2025"
// }));

// interface BlockedListModalProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// const BlockedListModal = ({ isOpen, onClose }: BlockedListModalProps) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [visibleCount, setVisibleCount] = useState(10); // Chỉ hiện 10 người đầu tiên

//     // 2. Logic Lọc & Tìm kiếm
//     const filteredUsers = useMemo(() => {
//         return MOCK_LARGE_DATA.filter(user =>
//             user.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//     }, [searchTerm]);

//     // 3. Logic "Pagination" (Cắt mảng dựa trên visibleCount)
//     const currentUsers = filteredUsers.slice(0, visibleCount);
//     const hasMore = visibleCount < filteredUsers.length;

//     const handleLoadMore = () => {
//         setVisibleCount(prev => prev + 10);
//     };

//     if (!isOpen) return null;

//     return createPortal(
//         <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
//             {/* Backdrop */}
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
//                 // SỬA: Tăng kích thước Modal (max-w-2xl) và chiều cao (h-[85vh])
//                 className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800"
//             >
//                 {/* --- HEADER --- */}
//                 <div className="flex flex-col gap-4 p-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             {/* SỬA LỖI MÀU CHỮ: Thêm text-zinc-900 */}
//                             <h3 className="font-bold text-2xl text-zinc-900 dark:text-white">Danh sách chặn</h3>
//                             <p className="text-sm text-zinc-500 mt-1">
//                                 {filteredUsers.length} người đang bị chặn
//                             </p>
//                         </div>
//                         <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-zinc-900 dark:text-white">
//                             <X size={20} />
//                         </button>
//                     </div>

//                     {/* SEARCH BAR */}
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
//                         <input
//                             type="text"
//                             placeholder="Tìm kiếm người dùng..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             // SỬA MÀU INPUT: Rõ ràng cho cả 2 theme
//                             className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
//                         />
//                     </div>
//                 </div>

//                 {/* --- BODY (SCROLLABLE) --- */}
//                 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//                     {currentUsers.length > 0 ? (
//                         <div className="space-y-2">
//                             {currentUsers.map(user => (
//                                 <div key={user.id} className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors group">
//                                     <div className="flex items-center gap-4">
//                                         {/* Avatar */}
//                                         <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
//                                             {user.avatar ? (
//                                                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
//                                             ) : (
//                                                 <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-lg">
//                                                     {user.name.charAt(0)}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Info */}
//                                         <div>
//                                             {/* SỬA MÀU TÊN */}
//                                             <p className="font-bold text-zinc-900 dark:text-white text-base">{user.name}</p>
//                                             <p className="text-xs text-zinc-500">Chặn ngày: {user.blockedAt}</p>
//                                         </div>
//                                     </div>

//                                     <button className="px-4 py-2 text-sm font-bold border border-zinc-300 dark:border-zinc-600 rounded-full hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 dark:text-zinc-300 text-zinc-700 transition-colors flex items-center gap-2">
//                                         <Unlock size={14} />
//                                         <span className="hidden sm:inline">Bỏ chặn</span>
//                                     </button>
//                                 </div>
//                             ))}

//                             {/* LOAD MORE BUTTON */}
//                             {hasMore && (
//                                 <button
//                                     onClick={handleLoadMore}
//                                     className="w-full py-3 mt-4 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border-t border-dashed border-zinc-200 dark:border-zinc-700"
//                                 >
//                                     Xem thêm {filteredUsers.length - visibleCount} người nữa...
//                                 </button>
//                             )}
//                         </div>
//                     ) : (
//                         // Empty State
//                         <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 opacity-60">
//                             <UserX size={48} strokeWidth={1.5} />
//                             <p>Không tìm thấy người dùng nào</p>
//                         </div>
//                     )}
//                 </div>
//             </motion.div>
//         </div>,
//         document.body
//     );
// };

// export default BlockedListModal;

// src/components/Settings/components/BlockedListModal.tsx
import { useState, useEffect, useMemo } from 'react';
import { X, Unlock, Search, UserX, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useBlockedUsers } from './useBlockedUsers';
interface BlockedListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BlockedListModal = ({ isOpen, onClose }: BlockedListModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleUnblock = async (userId: string, userName: string) => {
        if (!window.confirm(`Bạn có chắc muốn bỏ chặn ${userName}?`)) return;
        await unblockUser(userId); // Gọi logic gỡ chặn từ hook
    };

    const handleLoadMore = () => {
        fetchBlockedUsers(page + 1);
    };

    const filteredUsers = useMemo(() => {
        return blockedUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [blockedUsers, searchTerm]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-[#181818] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Danh sách chặn</h2>
                        <p className="text-sm text-zinc-500 mt-1">Quản lý những tài khoản đã bị giới hạn</p>
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
                            placeholder="Tìm kiếm trong danh sách..."
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
                                        <span className="hidden sm:inline">Bỏ chặn</span>
                                    </button>
                                </div>
                            ))}

                            {hasMore && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="w-full py-3 mt-4 text-sm font-medium flex justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors border-t border-dashed border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Tải thêm...'}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4 opacity-60 min-h-[200px]">
                            <UserX size={48} strokeWidth={1.5} />
                            <p>{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có ai trong danh sách chặn'}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default BlockedListModal;