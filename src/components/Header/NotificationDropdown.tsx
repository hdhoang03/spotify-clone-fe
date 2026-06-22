import React, { useState, useEffect } from 'react';
import { Music, User, Bell, Trash2, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { NotificationService } from '../../services/notificationServiceApi';
import { useNavigate } from 'react-router-dom';
import type { NotificationItem } from '../../services/notificationServiceApi';
import UnreadBadge from '../common/UnreadBadge';
import { formatRelativeTime } from '../../utils/formatTime';
import { useTranslation } from 'react-i18next';

interface NotificationDropdownProps {
    onClose: () => void;
    onUpdateUnreadCount: () => void;
    externalUnreadCount?: number; // Số từ Header (nguồn thật), đồng bộ với badge chuông
}

// Trả về màu nền badge và icon tương ứng theo loại thông báo
const getTypeStyle = (type: string): { icon: React.ReactNode; badgeBg: string } => {
    switch (type) {
        case 'NEW_SONG':
            return {
                icon: <Music size={12} className="text-white" />,
                badgeBg: 'bg-green-500',
            };
        case 'NEW_FOLLOWER':
            return {
                icon: <User size={12} className="text-white" />,
                badgeBg: 'bg-blue-500',
            };
        default:
            return {
                icon: <Bell size={12} className="text-white" />,
                badgeBg: 'bg-purple-500',
            };
    }
};

// Trích UUID (v4) từ một chuỗi bất kỳ
const extractUUID = (str: string): string | null => {
    const match = str.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return match ? match[0] : null;
};

// Xây dựng URL điều hướng thông minh từ type và targetUrl
const resolveNavUrl = (item: NotificationItem): string | null => {
    if (item.type === 'NEW_FOLLOWER' && item.targetUrl) {
        // Luôn trích UUID ra để tránh URL sai dù backend gửi dạng gì
        // VD: "bf10b803-..." → /user/bf10b803-.../profile
        // VD: "profile/bf10b803-..." → /user/bf10b803-.../profile
        const userId = extractUUID(item.targetUrl) ?? item.targetUrl;
        return `/user/${userId}/profile`;
    }
    if (item.targetUrl) {
        return item.targetUrl;
    }
    return null;
};


const NotificationDropdown = ({ onClose, onUpdateUnreadCount, externalUnreadCount }: NotificationDropdownProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    useEffect(() => {
        const handleNewNotification = () => {
            if (page === 1) {
                fetchNotifications(1);
            } else {
                setPage(1);
            }
        };
        window.addEventListener('new-notification', handleNewNotification);
        return () => window.removeEventListener('new-notification', handleNewNotification);
    }, [page]);

    const fetchNotifications = async (currentPage: number) => {
        try {
            setIsLoading(true);
            const data = await NotificationService.getMyNotifications(currentPage, 5);
            if (currentPage === 1) {
                setNotifications(data.content);
            } else {
                setNotifications(prev => [...prev, ...data.content]);
            }
            setHasMore(!data.last);
        } catch (error) {
            console.error('Lỗi tải thông báo', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading && hasMore) setPage(prev => prev + 1);
    };

    const handleMarkAllAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await NotificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            onUpdateUnreadCount();
        } catch (error) {
            console.error(error);
        }
    };

    // Click vào card → đánh dấu đã đọc + điều hướng
    const handleCardClick = async (item: NotificationItem) => {
        if (!item.isRead) {
            try {
                await NotificationService.markAsRead(item.id);
                setNotifications(prev =>
                    prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
                );
                onUpdateUnreadCount();
            } catch (error) {
                console.error(error);
            }
        }
        const url = resolveNavUrl(item);
        onClose();
        if (url) navigate(url);
    };

    // Click icon tròn → toggle read/unread
    const handleToggleStatus = async (item: NotificationItem, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const newStatus = await NotificationService.markAsRead(item.id);
            setNotifications(prev =>
                prev.map(n => (n.id === item.id ? { ...n, isRead: newStatus } : n))
            );
            onUpdateUnreadCount();
        } catch (error) {
            console.error(error);
        }
    };

    // Xóa thông báo
    const handleDelete = async (item: NotificationItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingId(item.id);
        try {
            await NotificationService.deleteNotification(item.id);
            setNotifications(prev => prev.filter(n => n.id !== item.id));
            // Nếu đây là thông báo chưa đọc, cập nhật lại badge
            if (!item.isRead) onUpdateUnreadCount();
        } catch (error) {
            console.error('Lỗi xóa thông báo', error);
        } finally {
            setDeletingId(null);
        }
    };

    // Dùng externalUnreadCount (từ API qua Header) nếu có, fallback local count
    const displayUnreadCount = externalUnreadCount ?? notifications.filter(n => !n.isRead).length;

    return (
        <div className="fixed md:absolute z-50 right-2 md:right-0 top-[70px] md:top-full md:mt-2 w-[calc(100vw-1rem)] sm:w-[22rem] md:w-96">
            {/* Container chính */}
            <div className="bg-white dark:bg-zinc-900 border dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('notification.title')}</h3>
                        <UnreadBadge count={displayUnreadCount} />
                    </div>
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-green-600 dark:text-green-400 font-medium hover:underline transition"
                    >
                        {t('notification.read_all')}
                    </button>
                </div>

                {/* Danh sách thông báo */}
                <div className="max-h-[420px] overflow-y-auto">
                    {notifications.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                            <Bell size={32} className="opacity-30" />
                            <p className="text-sm">{t('notification.empty')}</p>
                        </div>
                    ) : (
                        <ul>
                            {notifications.map(item => {
                                const { icon, badgeBg } = getTypeStyle(item.type);
                                const isDeleting = deletingId === item.id;

                                return (
                                    <li
                                        key={item.id}
                                        onClick={() => handleCardClick(item)}
                                        className={`
                                            group relative flex items-start gap-3 px-4 py-3 cursor-pointer
                                            transition-all duration-200
                                            hover:bg-gray-50 dark:hover:bg-zinc-800/60
                                            ${!item.isRead ? 'bg-green-50/60 dark:bg-green-950/20' : ''}
                                            ${isDeleting ? 'opacity-40 pointer-events-none' : ''}
                                        `}
                                    >
                                        {/* Chỉ báo chưa đọc */}
                                        {!item.isRead && (
                                            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                        )}

                                        {/* Avatar + badge loại */}
                                        <div className="relative flex-shrink-0 w-11 h-11">
                                            <img
                                                src={item.thumbnail || '/default-avatar.png'}
                                                alt=""
                                                className="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                                                onError={e => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
                                            />
                                            <span className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${badgeBg} rounded-full flex items-center justify-center shadow ring-2 ring-white dark:ring-zinc-900`}>
                                                {icon}
                                            </span>
                                        </div>

                                        {/* Nội dung */}
                                        <div className="flex-1 min-w-0 pr-14">
                                            <p className={`text-sm leading-snug ${!item.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                {item.message}
                                            </p>
                                            <span className="text-[11px] text-gray-400 mt-1 block">
                                                {formatRelativeTime(item.createdAt)}
                                            </span>
                                        </div>

                                        {/* Nhóm nút hành động — luôn chiếm chỗ, hiện dần khi hover */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                            {/* Toggle read */}
                                            <button
                                                onClick={e => handleToggleStatus(item, e)}
                                                title={item.isRead ? t('notification.mark_as_unread') : t('notification.mark_as_read')}
                                                className="p-1.5 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                                            >
                                                {item.isRead
                                                    ? <CheckCircle2 size={16} />
                                                    : <Circle size={16} className="fill-green-500 text-green-500" />
                                                }
                                            </button>

                                            {/* Xóa */}
                                            <button
                                                onClick={e => handleDelete(item, e)}
                                                title={t('notification.delete')}
                                                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* Nút xem thêm */}
                    {hasMore && (
                        <button
                            onClick={handleLoadMore}
                            className="w-full py-3 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition flex items-center justify-center gap-1 border-t border-gray-100 dark:border-white/5"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-1.5">
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    {t("notification.loading")}
                                </span>
                            ) : (
                                <>{t("notification.load_more")} <ChevronDown size={14} /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;