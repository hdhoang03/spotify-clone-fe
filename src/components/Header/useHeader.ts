import { useState, useRef, useEffect } from 'react';

interface UserInfo {
    name: string;
    email: string;
    avatarUrl?: string;
}

export const useHeader = (onLoginSuccessAction?: (data: any) => void, onNavigate?: (tab: string) => void) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<UserInfo | null>(null);

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }

            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setUser(null);
        setIsProfileMenuOpen(false);

        localStorage.removeItem('user');

        if (onNavigate) {
            onNavigate('HOME');
        }
    };

    const handleLoginSuccess = (userData: UserInfo) => {
        setUser(userData);
        setIsAuthModalOpen(false);
        localStorage.setItem('user', JSON.stringify(userData));
        onLoginSuccessAction?.(userData);
    };

    useEffect(() => {
        // Hàm đọc dữ liệu từ LocalStorage
        const loadUserFromStorage = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Lỗi đọc user từ storage", error);
            }
        };

        // 1. Gọi lần đầu khi mount
        loadUserFromStorage();

        // 2. Lắng nghe sự kiện 'user-update' từ ProfilePage bắn sang
        const handleUserUpdateEvent = () => {
            loadUserFromStorage(); // Đọc lại dữ liệu mới ngay lập tức
        };

        window.addEventListener('user-update', handleUserUpdateEvent);

        // Cleanup function (dọn dẹp khi component unmount)
        return () => {
            window.removeEventListener('user-update', handleUserUpdateEvent);
        };
    }, []);

    return {
        user,
        isAuthModalOpen,
        isProfileMenuOpen,
        menuRef,
        isNotificationOpen,
        notificationRef,
        setIsNotificationOpen,
        setIsAuthModalOpen,
        setIsProfileMenuOpen,
        handleLogout,
        handleLoginSuccess,
    };
};