// layouts/MainLayout.tsx
import React, { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import SidebarDrawer from '../components/Sidebar/SidebarLibraryDrawer';
import Header from '../components/Header/Header';
import MusicPlayer from '../components/MusicPlayer';
import MobileNavigation from '../components/Sidebar/MobileNavigation';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
	children: React.ReactNode;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

const MainLayout = ({ children, activeTab = 'HOME', onTabChange }: MainLayoutProps) => {
	const isMobile = useIsMobile();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const mainContentRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);

	useEffect(() => {
		setIsSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (mainContentRef.current) {
			mainContentRef.current.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}, [activeTab]);

	// 3. Hàm xử lý logic điều hướng: Từ Tên Tab -> Đường dẫn URL
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
			{/* 1. HEADER */}
			<Header
				onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
				onNaviagate={handleSwitchTab}
				activeTab={activeTab}
			/>

			<div className="flex flex-1 overflow-hidden relative">

				{/* 2. SIDEBAR SECTION */}

				{/* A. Mobile Sidebar Drawer (Chỉ hiện và hoạt động logic trên Mobile) */}
				<SidebarDrawer
					isOpen={isSidebarOpen}
					isMobile={isMobile}
					onClose={() => setIsSidebarOpen(false)}
					activeTab={activeTab}
					onTabChange={handleSwitchTab}
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
				/>

				{/* 3. MAIN CONTENT */}
				<div
					id="main-content"
					ref={mainContentRef}
					className="flex-1 overflow-y-auto pb-24 md:pb-0 transition-all duration-300 relative bg-white dark:bg-black">

					<div
						className="absolute inset-0 z-0 dark:opacity-0 transition-opacity duration-300 pointer-events-none"
						style={{ background: 'linear-gradient(to bottom, #fff7ed 0%, #ffffff 80%)' }}
					/>
					<div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-800 to-black opacity-0 dark:opacity-100 transition-opacity duration-300 pointer-events-none" />

					{/* Content Wrapper */}
					<div className="relative z-10 w-full">
						{children}
					</div>
				</div>
			</div>

			{/* 4. FOOTER PLAYER */}
			<MusicPlayer />

			{/* 5. MOBILE NAV (Chỉ hiện ở Mobile - class md:hidden đã có trong component MobileNavigation) */}
			<MobileNavigation activeTab={activeTab} onTabChange={handleSwitchTab} />
		</div>
	);
};

export default MainLayout;