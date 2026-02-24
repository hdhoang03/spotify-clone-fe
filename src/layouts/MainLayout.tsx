import React, { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import SidebarDrawer from '../components/Sidebar/SidebarLibraryDrawer';
import Header from '../components/Header/Header';
import MusicPlayer from '../components/MusicPlayer';
import MobileNavigation from '../components/Sidebar/MobileNavigation';
import { useNavigate } from 'react-router-dom';
// import { useUserProfile } from '../hooks/useUserProfile'; // Tạm thời không cần phụ thuộc vào hook này để tránh lỗi đồng bộ

interface MainLayoutProps {
	children: React.ReactNode;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

const MainLayout = ({ children, activeTab = 'HOME', onTabChange }: MainLayoutProps) => {
    // 1. Tự quản lý state User tại đây để đảm bảo cập nhật tức thì
    const [localUser, setLocalUser] = useState<any>(null);
	const isMobile = useIsMobile();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mặc định đóng
	const mainContentRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);

    // 2. Logic đồng bộ User từ LocalStorage + Lắng nghe sự kiện
    useEffect(() => {
        const checkUser = () => {
            const stored = localStorage.getItem('user');
            setLocalUser(stored ? JSON.parse(stored) : null);
        };

        // Kiểm tra ngay lúc đầu
        checkUser();

        // Lắng nghe sự kiện 'user-update' từ Header bắn sang
        window.addEventListener('user-update', checkUser);
        return () => window.removeEventListener('user-update', checkUser);
    }, []);

	// 3. Logic tự động mở/đóng Sidebar dựa trên User và Mobile
	useEffect(() => {
		if (localUser) {
            // Đã đăng nhập
			if (isMobile) {
				setIsSidebarOpen(false); // Mobile: Đóng chờ người dùng mở
			} else {
				setIsSidebarOpen(true);  // Desktop/Tablet: Tự động mở
			}
		} else {
            // Chưa đăng nhập
			setIsSidebarOpen(false);
		}
	}, [localUser, isMobile]);

	const handleSwitchTab = (tab: string) => {
		switch (tab) {
			case 'HOME': navigate('/'); break;
			case 'SEARCH': navigate('/search'); break;
			case 'LIBRARY': navigate('/library'); break;
			case 'PROFILE': navigate('/profile'); break;
			default: break;
		}
		if (onTabChange) onTabChange(tab);
	};

	return (
		<div className="flex flex-col h-screen bg-black text-white overflow-hidden">
			<Header
				onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
				onNaviagate={handleSwitchTab}
				activeTab={activeTab || ''}
			/>

			<div className="flex flex-1 overflow-hidden relative">
				{/* Chỉ render Sidebar khi localUser có dữ liệu */}
				{localUser && (
					<SidebarDrawer
						isOpen={isSidebarOpen}
						isMobile={isMobile}
						onClose={() => setIsSidebarOpen(false)}
						activeTab={activeTab}
						onTabChange={handleSwitchTab}
						isCollapsed={isCollapsed}
						setIsCollapsed={setIsCollapsed}
					/>
				)}

				<div
					id="main-content"
					ref={mainContentRef}
					className="flex-1 overflow-y-auto pb-24 md:pb-0 transition-all duration-300 relative bg-white dark:bg-black">
					
                    <div className="absolute inset-0 z-0 dark:opacity-0 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(to bottom, #fff7ed 0%, #ffffff 80%)' }} />
					<div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-800 to-black opacity-0 dark:opacity-100 transition-opacity pointer-events-none" />

					<div className="relative z-10 w-full">
						{children}
					</div>
				</div>
			</div>

			<MusicPlayer />
			<MobileNavigation activeTab={activeTab} onTabChange={handleSwitchTab} />
		</div>
	);
};

export default MainLayout;