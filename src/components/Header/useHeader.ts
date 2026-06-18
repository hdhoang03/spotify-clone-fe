import { useState, useRef, useEffect } from 'react';
import type { UserResponse } from '../../types/backend';
import { NotificationService } from '../../services/notificationServiceApi';
import { AuthService } from '../../services/authService';


export const useHeader = (onLoginSuccessAction?: (data: UserResponse) => void, onNavigate?: (tab: string) => void) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    // Sử dụng UserResponse thay vì any
    const [user, setUser] = useState<UserResponse | null>(null);

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

    // --- LOGIC ĐĂNG XUẤT ---
    const handleLogout = async () => {
        setUser(null);
        setIsProfileMenuOpen(false);

        // Bắn sự kiện để UI ẩn sidebar ngay lập tức
        window.dispatchEvent(new Event('user-update'));
        if (onNavigate) onNavigate('HOME');

        // Gọi AuthService.logout() để invalidate token trên server và xóa sạch localStorage
        try {
            await AuthService.logout();
        } catch (e) {
            // Dù server lỗi vẫn đảm bảo storage được xóa
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('user_profile');
            window.location.reload();
        }
    };

    // --- LOGIC ĐĂNG NHẬP THÀNH CÔNG ---
    const handleLoginSuccess = (partialUserData: any) => {
        // Dùng trực tiếp dữ liệu từ API (/user/my) - KHÔNG merge với CURRENT_USER mock
        // vì CURRENT_USER có role ADMIN sẽ làm mọi tài khoản thành admin
        const fullUserData: UserResponse = {
            ...partialUserData,
            id: partialUserData.id
        };

        // Lưu và Cập nhật State
        setUser(fullUserData);
        setIsAuthModalOpen(false);

        localStorage.setItem('user', JSON.stringify(fullUserData));
        localStorage.setItem('user_profile', JSON.stringify(fullUserData));

        // Bắn sự kiện để MainLayout cập nhật Sidebar/Menu
        window.dispatchEvent(new Event('user-update'));

        onLoginSuccessAction?.(fullUserData);

        // Kiểm tra xem có yêu cầu chuyển hướng phát nhạc sau khi đăng nhập hay không
        const redirectUrl = sessionStorage.getItem('post_login_redirect');
        if (redirectUrl) {
            sessionStorage.removeItem('post_login_redirect');
            window.location.href = redirectUrl;
        }
    };

    // --- LOGIC KHỞI TẠO ---

    useEffect(() => {
        const loadUserFromStorage = () => { /* code cũ của bạn */ };
        loadUserFromStorage();

        // Lắng nghe lệnh mở cửa sổ Đăng nhập từ mọi nơi trong App
        const handleOpenAuth = () => setIsAuthModalOpen(true);
        window.addEventListener('open-auth-modal', handleOpenAuth);

        // Cleanup
        return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
    }, []);

    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Lỗi parse user:", error);
                setUser(null);
            }
        };

        loadUserFromStorage();

        // Lắng nghe sự kiện chính mình bắn ra (để đồng bộ các tab hoặc component khác)
        const handleUserUpdate = () => loadUserFromStorage();
        window.addEventListener('user-update', handleUserUpdate);

        return () => window.removeEventListener('user-update', handleUserUpdate);
    }, []);

    // Nhận currentUser là tham số để tránh stale closure
    const fetchUnreadCount = async (currentUser = user) => {
        try {
            if (currentUser) {
                const count = await NotificationService.getUnreadCount();
                setUnreadCount(count);
            }
        } catch (error) {
            console.error("Lỗi lấy số thông báo", error);
        }
    };

    // Gọi API ngay khi user thay đổi + polling mỗi 30 giây
    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        fetchUnreadCount(user); // Truyền user trực tiếp để tránh stale closure

        const interval = setInterval(() => fetchUnreadCount(user), 30000);
        return () => clearInterval(interval);
    }, [user]);

    return {
        user,
        isAuthModalOpen,
        isProfileMenuOpen,
        menuRef,
        isNotificationOpen,
        notificationRef,
        unreadCount,
        setIsNotificationOpen,
        setIsAuthModalOpen,
        setIsProfileMenuOpen,
        handleLogout,
        handleLoginSuccess,
        fetchUnreadCount,
    };
};