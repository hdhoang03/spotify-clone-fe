import React, { useState } from 'react';
import { X, Music, User, Heart, ChevronDown } from 'lucide-react';

// Interface giữ nguyên
export interface NotificationItem {
    id: number;
    type: 'release' | 'follow' | 'system';
    title: string;
    message: string;
    avatarUrl?: string;
    time: string;
    isRead: boolean;
}

interface NotificationDropdownProps {
    onClose: () => void;
}

// 1. TẠO DATA GIẢ NHIỀU HƠN (để test tính năng load more)
const MOCK_NOTIFICATIONS: NotificationItem[] = [
    { id: 1, type: 'release', title: 'Sơn Tùng M-TP', message: 'vừa ra mắt bài hát mới: "Đừng làm trái tim anh đau"', avatarUrl: 'https://lyricstranslate.com/files/channels4_profile_294.jpg', time: '2 phút trước', isRead: false },
    { id: 2, type: 'follow', title: 'Hoang Developer', message: 'đã bắt đầu theo dõi bạn', time: '1 giờ trước', isRead: false },
    { id: 3, type: 'system', title: 'SpringTunes Premium', message: 'Gói dùng thử sắp hết hạn.', time: '1 ngày trước', isRead: true },
    { id: 4, type: 'system', title: 'Bảo trì', message: 'Hệ thống bảo trì lúc 2h sáng.', time: '2 ngày trước', isRead: true },
    // --- Các thông báo cũ hơn (sẽ bị ẩn lúc đầu) ---
    { id: 5, type: 'follow', title: 'User 123', message: 'đã thích playlist của bạn', time: '3 ngày trước', isRead: true },
    { id: 6, type: 'release', title: 'MCK', message: 'vừa ra mắt album mới', time: '4 ngày trước', isRead: true },
    { id: 7, type: 'system', title: 'Welcome', message: 'Chào mừng đến với SpringTunes!', time: '1 tuần trước', isRead: true },
    { id: 8, type: 'release', title: 'tlinh', message: 'đã đăng tải một podcast', time: '1 tuần trước', isRead: true },
    { id: 9, type: 'follow', title: 'Fan Cứng', message: 'đã theo dõi bạn', time: '2 tuần trước', isRead: true },
];

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
    // State lưu toàn bộ data (sau này fetch API sẽ set vào đây)
    const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
    
    // 2. STATE QUẢN LÝ SỐ LƯỢNG HIỂN THỊ (Mặc định 4)
    const [visibleCount, setVisibleCount] = useState(4);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const removeNotification = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // 3. HÀM LOAD MORE (Tăng thêm 5)
    const handleLoadMore = (e: React.MouseEvent) => {
        e.stopPropagation();
        setVisibleCount(prev => prev + 5);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'release': return <Music size={16} className="text-green-500" />;
            case 'follow': return <User size={16} className="text-blue-500" />;
            default: return <Heart size={16} className="text-red-500" />;
        }
    };

    // Lọc danh sách để hiển thị dựa trên visibleCount
    const displayedNotifications = notifications.slice(0, visibleCount);
    const hasMore = visibleCount < notifications.length;

    return (
        <>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="
                fixed top-[70px] left-4 right-4 
                md:absolute md:top-full md:right-0 md:left-auto md:w-96 md:mt-2
                bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 
                rounded-xl shadow-2xl overflow-hidden 
                animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50
            ">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <h3 className="font-bold text-gray-900 dark:text-white">Thông báo ({notifications.length})</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={markAllAsRead}
                            className="text-xs text-green-600 dark:text-green-400 font-medium hover:underline"
                        >
                            Đánh dấu đã đọc
                        </button>
                    </div>
                </div>

                {/* List Container */}
                <div className="
                    max-h-[350px] overflow-y-auto 
                    scrollbar-hide md:scrollbar-thin 
                    md:scrollbar-thumb-gray-300 md:dark:scrollbar-thumb-zinc-600
                ">
                    {displayedNotifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Bạn chưa có thông báo nào.
                        </div>
                    ) : (
                        <>
                            {displayedNotifications.map((item) => (
                                <div 
                                    key={item.id}
                                    className={`relative flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition cursor-pointer group ${!item.isRead ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
                                >
                                    {/* Avatar section */}
                                    <div className="relative flex-shrink-0 w-10 h-10">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                                            {item.avatarUrl ? (
                                                <img src={item.avatarUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {getIcon(item.type)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center border border-gray-100 dark:border-zinc-800">
                                            {getIcon(item.type)}
                                        </div>
                                    </div>

                                    {/* Content section */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-gray-100 leading-snug">
                                            <span className="font-bold">{item.title}</span> {item.message}
                                        </p>
                                        <span className="text-xs text-gray-400 mt-1 block">{item.time}</span>
                                    </div>

                                    <button 
                                        onClick={(e) => removeNotification(item.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition absolute right-2 top-2"
                                    >
                                        <X size={14} />
                                    </button>

                                    {!item.isRead && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></span>
                                    )}
                                </div>
                            ))}

                            {/* 4. NÚT XEM THÊM (Chỉ hiện nếu còn data) */}
                            {hasMore && (
                                <button 
                                    onClick={handleLoadMore}
                                    className="w-full py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition flex items-center justify-center gap-1 border-t border-gray-100 dark:border-white/5"
                                >
                                    Xem thông báo cũ hơn <ChevronDown size={14} />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationDropdown;