import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Thêm hook điều hướng
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';
import AuthModal from '../Auth';
import ProfileDropdown from './ProfileDropdown';
import { useHeader } from './useHeader';
import NotificationDropdown from './NotificationDropdown';
import DesktopNavigation from './DesktopNavigation';
import { useUserProfile } from '../../hooks/useUserProfile';
import LogoutModal from '../Auth/LogoutModal';

interface HeaderProps {
    onNaviagate: (tab: string) => void;
    onMenuClick: () => void;
    activeTab: string;
}

const Header = ({ onMenuClick, onNaviagate, activeTab }: HeaderProps) => {
    const navigate = useNavigate(); // Khởi tạo navigate
    const { user: syncedUser } = useUserProfile();
    const {
        user: authUser,
        isAuthModalOpen,
        isProfileMenuOpen,
        menuRef,
        isNotificationOpen,
        setIsNotificationOpen,
        notificationRef,
        setIsAuthModalOpen,
        setIsProfileMenuOpen,
        handleLoginSuccess,
        handleLogout,
    } = useHeader(undefined, onNaviagate);

    const user = syncedUser || authUser;

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    // Hàm xử lý về trang chủ
    const handleGoHome = () => {
        navigate('/');
        // Nếu bạn muốn reset tab đang chọn trong state cha:
        // onNaviagate('home'); 
    };

    const handleConfirmLogout = () => {
        // Xóa dữ liệu (như bài trước mình hướng dẫn)
        localStorage.removeItem('user');
        localStorage.removeItem('user_profile');

        window.dispatchEvent(new Event('user-profile-updated'));

        // Gọi hàm logout của hook cũ nếu cần
        if (handleLogout) handleLogout();

        setIsProfileMenuOpen(false);
        setIsLogoutModalOpen(false); // Đóng modal
        navigate('/'); // Về trang chủ
    };

    return (
        <>
            <header className="h-16 w-full bg-white dark:bg-black/90 text-black dark:text-white
                        backdrop-blur-md flex items-center justify-between px-4 border-b border-gray-200
                        dark:border-white/10 sticky top-0 z-50 transition-colors duration-300">

                {/* Left Section */}
                <div className="flex items-center gap-4 shrink-0">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex items-center gap-2">
                        <span
                            onClick={handleGoHome}
                            className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent cursor-pointer"
                        >
                            SpringTunes
                        </span>
                    </div>

                    {/* Desktop Menu Button */}
                    {user && (
                        <button
                            onClick={onMenuClick}
                            className="hidden md:block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            <Menu size={24} />
                        </button>
                    )}

                    {/* Desktop Logo */}
                    <span
                        onClick={handleGoHome}
                        className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 ml-2 hidden md:block bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        SpringTunes
                    </span>
                </div>

                <div className="flex-1 flex justify-center px-4">
                    <DesktopNavigation activeTab={activeTab} onTabChange={onNaviagate} />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    {user && (
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={`relative p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 ${isNotificationOpen
                                    ? 'text-green-500 bg-gray-100 dark:bg-zinc-800'
                                    : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                <Bell size={24} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
                            </button>

                            {isNotificationOpen && (
                                <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                            )}
                        </div>
                    )}

                    {/* Theme Toggle (Desktop) */}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>

                    {/* User Actions / Auth */}
                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    name={user.name}
                                    avatarUrl={user.avatarUrl}
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                />
                            </div>
                            {isProfileMenuOpen && (
                                <ProfileDropdown
                                    user={user}
                                    onLogout={() => {
                                        setIsProfileMenuOpen(false); // Đóng dropdown cho gọn
                                        setIsLogoutModalOpen(true);  // Mở modal xác nhận
                                    }}
                                    onClose={() => setIsProfileMenuOpen(false)}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="md:hidden">
                                <ThemeToggle />
                            </div>
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="bg-green-500 text-white dark:bg-white dark:text-black font-bold px-6 py-2 rounded-full text-sm hover:scale-105 transition shadow-lg"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default Header;