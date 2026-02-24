import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';
import AuthModal from '../Auth';
import ProfileDropdown from './ProfileDropdown';
import { useHeader } from './useHeader';
import NotificationDropdown from './NotificationDropdown';
import DesktopNavigation from './DesktopNavigation';
import LogoutModal from '../Auth/LogoutModal';

interface HeaderProps {
    onNaviagate: (tab: string) => void;
    onMenuClick: () => void;
    activeTab: string;
}

const Header = ({ onMenuClick, onNaviagate, activeTab }: HeaderProps) => {
    const navigate = useNavigate();
    
    // Sử dụng hook useHeader đã sửa ở trên
    const {
        user,
        isAuthModalOpen,
        isProfileMenuOpen,
        menuRef,
        isNotificationOpen,
        setIsNotificationOpen,
        notificationRef,
        setIsAuthModalOpen,
        setIsProfileMenuOpen,
        handleLoginSuccess,
        // handleLogout // Chúng ta dùng logic logout riêng bên dưới cho Modal
    } = useHeader(undefined, onNaviagate);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleConfirmLogout = () => {
        // 1. Xóa dữ liệu
        localStorage.removeItem('user');
        localStorage.removeItem('user_profile');
        
        // 2. Bắn sự kiện cập nhật (Để MainLayout ẩn Sidebar ngay)
        window.dispatchEvent(new Event('user-update')); 

        setIsProfileMenuOpen(false);
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    return (
        <>
            <header className="h-16 w-full bg-white dark:bg-black/90 text-black dark:text-white
                        backdrop-blur-md flex items-center justify-between px-4 border-b border-gray-200
                        dark:border-white/10 sticky top-0 z-50 transition-colors duration-300">

                {/* Left Section */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="md:hidden flex items-center gap-2">
                        <span onClick={handleGoHome} className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent cursor-pointer">
                            SpringTunes
                        </span>
                    </div>

                    {/* SỬA: hidden md:block -> hidden sm:block (Hiện từ Tablet trở lên) */}
                    {user && (
                        <button
                            onClick={onMenuClick}
                            className="hidden sm:block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            <Menu size={24} />
                        </button>
                    )}

                    <span onClick={handleGoHome} className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 ml-2 hidden md:block bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                        SpringTunes
                    </span>
                </div>

                <div className="flex-1 flex justify-center px-4">
                    <DesktopNavigation activeTab={activeTab} onTabChange={onNaviagate} />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="relative" ref={notificationRef}>
                            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400">
                                <Bell size={24} />
                                {isNotificationOpen && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
                            </button>
                            {isNotificationOpen && <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />}
                        </div>
                    )}

                    <div className="hidden md:block"><ThemeToggle /></div>

                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
                            {isProfileMenuOpen && (
                                <ProfileDropdown
                                    user={user}
                                    onLogout={() => { setIsProfileMenuOpen(false); setIsLogoutModalOpen(true); }}
                                    onClose={() => setIsProfileMenuOpen(false)}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="md:hidden"><ThemeToggle /></div>
                            <button onClick={() => setIsAuthModalOpen(true)} className="bg-green-500 text-white font-bold px-6 py-2 rounded-full text-sm hover:scale-105 transition shadow-lg">
                                Đăng nhập
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
            <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />
        </>
    );
};

export default Header;