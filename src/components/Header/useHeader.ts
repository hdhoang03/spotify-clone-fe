// import { useState, useRef, useEffect } from 'react';

// const DEFAULT_USER_TEMPLATE = {
//     id: 'user_temp',
//     name: 'User',
//     email: 'user@springtunes.com',
//     avatarUrl: '',
//     birthdate: '2000-01-01',
//     publicPlaylistsCount: 7,
//     followingCount: 12,
//     followersCount: 6
// };

// export const useHeader = (onLoginSuccessAction?: (data: any) => void, onNavigate?: (tab: string) => void) => {
//     const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//     const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//     const menuRef = useRef<HTMLDivElement>(null);
//     const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//     const notificationRef = useRef<HTMLDivElement>(null);
//     const [user, setUser] = useState<any | null>(null); // Dùng any để tránh lỗi type ban đầu

//     // Xử lý click ra ngoài để đóng menu
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//                 setIsProfileMenuOpen(false);
//             }
//             if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//                 setIsNotificationOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     // --- LOGIC ĐĂNG XUẤT ---
//     const handleLogout = () => {
//         setUser(null);
//         setIsProfileMenuOpen(false);
        
//         // 1. Xóa sạch storage
//         localStorage.removeItem('user');
//         localStorage.removeItem('user_profile'); 
        
//         // 2. QUAN TRỌNG: Bắn sự kiện 'user-update' để MainLayout biết mà ẩn Sidebar
//         window.dispatchEvent(new Event('user-update')); 
        
//         if (onNavigate) onNavigate('HOME');
//     };

//     // --- LOGIC ĐĂNG NHẬP THÀNH CÔNG ---
//     // Dùng any cho partialUserData để nhận dữ liệu từ AuthModal mà không bị lỗi Type
//     const handleLoginSuccess = (partialUserData: any) => {
//         // 1. GỘP DỮ LIỆU: Đảm bảo user có đủ trường thông tin của UserProfile
//         const fullUserData = {
//             ...DEFAULT_USER_TEMPLATE, // Lấy khung mặc định
//             ...partialUserData,       // Ghi đè dữ liệu thật (id, email, name)
//             id: partialUserData.id || `user_${Date.now()}` // Đảm bảo luôn có ID
//         };

//         // 2. Lưu và Cập nhật State
//         setUser(fullUserData);
//         setIsAuthModalOpen(false);
//         localStorage.setItem('user', JSON.stringify(fullUserData));
//         localStorage.setItem('user_profile', JSON.stringify(fullUserData));

//         // 3. QUAN TRỌNG: Bắn sự kiện để MainLayout nhận được tin báo "Có user rồi, hiện Sidebar đi!"
//         window.dispatchEvent(new Event('user-update'));

//         onLoginSuccessAction?.(fullUserData);
//     };

//     // --- LOGIC KHỞI TẠO ---
//     useEffect(() => {
//         const loadUserFromStorage = () => {
//             try {
//                 const storedUser = localStorage.getItem('user');
//                 setUser(storedUser ? JSON.parse(storedUser) : null);
//             } catch (error) {
//                 console.error("Lỗi parse user:", error);
//                 setUser(null);
//             }
//         };

//         loadUserFromStorage();

//         // Lắng nghe sự kiện chính mình bắn ra (để đồng bộ các tab hoặc component khác)
//         const handleUserUpdate = () => loadUserFromStorage();
//         window.addEventListener('user-update', handleUserUpdate);

//         return () => window.removeEventListener('user-update', handleUserUpdate);
//     }, []);

//     return {
//         user,
//         isAuthModalOpen,
//         isProfileMenuOpen,
//         menuRef,
//         isNotificationOpen,
//         notificationRef,
//         setIsNotificationOpen,
//         setIsAuthModalOpen,
//         setIsProfileMenuOpen,
//         handleLogout,
//         handleLoginSuccess,
//     };
// };

import { useState, useRef, useEffect } from 'react';
import type { UserResponse } from '../../types/backend'; // Import Type chuẩn
import { CURRENT_USER } from '../../constants/mockData'; // Import Mock Data chuẩn

export const useHeader = (onLoginSuccessAction?: (data: UserResponse) => void, onNavigate?: (tab: string) => void) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    
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
    const handleLogout = () => {
        setUser(null);
        setIsProfileMenuOpen(false);
        
        // 1. Xóa sạch storage
        localStorage.removeItem('user');
        localStorage.removeItem('user_profile'); 
        
        // 2. Bắn sự kiện 'user-update' để MainLayout biết mà ẩn Sidebar
        window.dispatchEvent(new Event('user-update')); 
        
        if (onNavigate) onNavigate('HOME');
    };

    // --- LOGIC ĐĂNG NHẬP THÀNH CÔNG ---
    const handleLoginSuccess = (partialUserData: any) => {
        // 1. GỘP DỮ LIỆU: 
        // Lấy khung Mock chuẩn (có Role ADMIN) ghi đè lên dữ liệu nhập từ form (tên, email)
        const fullUserData: UserResponse = {
            ...CURRENT_USER,      // Có sẵn Role ADMIN, permissions, avatar...
            ...partialUserData,   // Ghi đè email/tên người dùng nhập
            id: partialUserData.id || CURRENT_USER.id // Giữ ID ổn định
        };

        // 2. Lưu và Cập nhật State
        setUser(fullUserData);
        setIsAuthModalOpen(false);
        
        // Lưu vào localStorage (Lưu cả 2 key để tương thích code cũ nếu còn sót)
        localStorage.setItem('user', JSON.stringify(fullUserData));
        localStorage.setItem('user_profile', JSON.stringify(fullUserData));

        // 3. QUAN TRỌNG: Bắn sự kiện để MainLayout cập nhật Sidebar/Menu
        window.dispatchEvent(new Event('user-update'));

        onLoginSuccessAction?.(fullUserData);
    };

    // --- LOGIC KHỞI TẠO ---
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