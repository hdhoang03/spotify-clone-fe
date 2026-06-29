import React, { useState, useEffect, useRef } from 'react';
import useIsMobile from '../hooks/useIsMobile';
import SidebarDrawer from '../components/Sidebar/SidebarLibraryDrawer';
import Header from '../components/Header/Header';
import MusicPlayer from '../components/MusicPlayer';
import MobileNavigation from '../components/Sidebar/MobileNavigation';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContent';
import { AICompanion } from '../components/AICompanion';


interface MainLayoutProps {
	children: React.ReactNode;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

const MainLayout = ({ children, activeTab = 'HOME', onTabChange }: MainLayoutProps) => {
	const [localUser, setLocalUser] = useState<any>(null);
	const isMobile = useIsMobile();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const mainContentRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const { isSidebarPlayerOpen, setIsSidebarPlayerOpen } = useMusic();

	// 2. Logic đồng bộ User từ LocalStorage + Lắng nghe sự kiện
	useEffect(() => {
		const checkUser = () => {
			const stored = localStorage.getItem('user');
			setLocalUser(stored ? JSON.parse(stored) : null);
		};
		checkUser();
		window.addEventListener('user-update', checkUser);
		return () => window.removeEventListener('user-update', checkUser);
	}, []);

	// 3. Logic tự động mở/đóng Sidebar dựa trên User và Mobile
	useEffect(() => {
		if (localUser) {
			setIsSidebarOpen(isMobile ? false : true);
		} else {
			setIsSidebarOpen(false);
		}
	}, [localUser, isMobile]);

	// Tắt SidebarPlayer khi về mobile
	useEffect(() => {
		if (isMobile && isSidebarPlayerOpen) {
			setIsSidebarPlayerOpen(false);
		}
	}, [isMobile, isSidebarPlayerOpen, setIsSidebarPlayerOpen]);

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
		<div className="flex flex-col h-screen bg-zinc-50 dark:bg-black text-black dark:text-white overflow-hidden p-2 gap-2">
			<Header
				onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
				onNaviagate={handleSwitchTab}
				activeTab={activeTab || ''}
			/>

			<div className="flex flex-1 overflow-hidden relative gap-2">
				{/* Sidebar Library — chỉ hiển thị trên desktop */}
				{localUser && !isMobile && (
					<SidebarDrawer
						isOpen={isSidebarOpen}
						isMobile={false}
						onClose={() => setIsSidebarOpen(false)}
						activeTab={activeTab}
						onTabChange={handleSwitchTab}
						isCollapsed={isCollapsed}
						setIsCollapsed={setIsCollapsed}
					/>
				)}

				{/* Main Content */}
				<div className="flex-1 relative bg-white dark:bg-[#121212] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden shadow-sm min-w-0">
					<div className="absolute inset-0 z-0 dark:opacity-0 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(to bottom, #fff7ed 0%, #ffffff 80%)' }} />
					<div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-800 to-black opacity-0 dark:opacity-100 transition-opacity pointer-events-none" />

					<div
						id="main-content"
						ref={mainContentRef}
						className="relative z-10 w-full h-full overflow-y-auto pb-24 md:pb-0 transition-all duration-300"
					>
						{children}
					</div>
				</div>

				{/*
				 * ── Sidebar Player Slot ──
				 * Portal target: MusicPlayer sẽ render SidebarPlayer vào đây qua createPortal.
				 * Luôn tồn tại trong DOM trên desktop để portal hoạt động ổn định.
				 * Ẩn bằng width: 0 khi không dùng.
				 */}
				{!isMobile && (
					<div
						id="sidebar-player-slot"
						className="flex-shrink-0 h-full bg-black rounded-2xl overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
						style={{ width: isSidebarPlayerOpen ? 280 : 0 }}
					/>
				)}
			</div>

			<MusicPlayer />
			{isMobile && <MobileNavigation activeTab={activeTab} onTabChange={handleSwitchTab} />}
			<AICompanion />
		</div>
	);

};

export default MainLayout;