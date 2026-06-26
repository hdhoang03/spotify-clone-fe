import { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserAvatar from './UserAvatar';
import AuthModal from '../Auth';
import LoginPreviewModal from '../Auth/LoginPreviewModal';
import ProfileDropdown from './ProfileDropdown';
import { useHeader } from './useHeader';
import NotificationDropdown from './NotificationDropdown';
import DesktopNavigation from './DesktopNavigation';
import LogoutModal from '../Auth/LogoutModal';
import UnreadBadge from '../common/UnreadBadge';

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
        unreadCount,
        fetchUnreadCount
    } = useHeader(undefined, onNaviagate);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    useEffect(() => {
        const handleShowPreview = () => setShowPreviewModal(true);
        window.addEventListener('show-login-preview-modal', handleShowPreview);
        return () => window.removeEventListener('show-login-preview-modal', handleShowPreview);
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleConfirmLogout = () => {
        // Xóa dữ liệu
        localStorage.removeItem('user');
        localStorage.removeItem('user_profile');
        localStorage.removeItem('token');

        setIsProfileMenuOpen(false);
        setIsLogoutModalOpen(false);
        window.location.href = '/';
    };

    return (
        <>
            <header className="h-16 shrink-0 w-full bg-white dark:bg-[#121212] text-black dark:text-white
                        flex items-center justify-between px-4 border border-black/5
                        dark:border-white/5 rounded-2xl z-50 transition-colors duration-300 shadow-sm">

                {/* Left Section */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="md:hidden flex items-center gap-2">
                        <span onClick={handleGoHome} className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent cursor-pointer">
                            Springtunes
                        </span>
                    </div>

                    {/* Nút hamburger chỉ hiện trên desktop (≥768px), khi mobile dùng bottom navigation */}
                    {user && (
                        <button
                            onClick={onMenuClick}
                            className="hidden md:block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            <Menu size={24} />
                        </button>
                    )}

                    <span onClick={handleGoHome} className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 ml-2 hidden md:block bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                        Springtunes
                    </span>
                </div>

                <div className="flex-1 flex justify-center px-4">
                    <DesktopNavigation activeTab={activeTab} onTabChange={onNaviagate} />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400"
                            >
                                <Bell size={24} />
                                <UnreadBadge count={unreadCount} className="absolute top-1 right-1" />
                            </button>

                            {isNotificationOpen && (
                                <NotificationDropdown
                                    onClose={() => setIsNotificationOpen(false)}
                                    onUpdateUnreadCount={fetchUnreadCount} // Truyền callback để update lại số
                                    externalUnreadCount={unreadCount}
                                />
                            )}
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
                                Log in
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
            <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />
            <LoginPreviewModal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} onLoginClick={() => { setShowPreviewModal(false); setIsAuthModalOpen(true); }} />
        </>
    );
};

export default Header;