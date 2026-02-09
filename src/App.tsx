import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import HomePage from './components/HomePage/HomePage';
import SearchPage from './components/Search/Search';
import { MusicProvider } from './contexts/MusicContent';
import ProfilePage from './components/Profile/Profile';
import ArtistPage from './components/Artist/Artist';
import LibraryPage from './components/Sidebar/LibraryPage';
import SettingsPage from './components/Settings/Settings';
import HelpPage from './components/Help/Help';
import ScrollToTop from './components/common/ScrollToTop';
import AccountPage from './components/Account/Account';

// Tạo một component con để xử lý logic Layout (để dùng được useLocation)
const AppContent = () => {
	const location = useLocation();

	// Xác định activeTab dựa trên đường dẫn hiện tại (để Sidebar sáng đúng chỗ)
	const getActiveTab = (path: string) => {
		if (path === '/') return 'HOME';
		if (path.startsWith('/search')) return 'SEARCH';
		if (path.startsWith('/library')) return 'LIBRARY';
		if (path.startsWith('/profile')) return 'PROFILE';
		return '';
	};

	return (
		<MusicProvider>
			<MainLayout
				// Truyền activeTab dựa vào URL hiện tại
				activeTab={getActiveTab(location.pathname)}
				// onTabChange giờ sẽ không set state nữa mà MainLayout nên dùng Link/navigate (tùy bạn sửa sau)
				onTabChange={() => { }}
			>
				<Routes>
					{/* Định nghĩa các Route tương ứng với URL */}
					<Route path="/" element={<HomePage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/library" element={<LibraryPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="/support" element={<HelpPage />} />
					<Route path="/account" element={<AccountPage />} />
					<Route path="/premium" element={<div className="p-8 text-white">Trang Premium (Đang phát triển)</div>} />
					{/* QUAN TRỌNG: Route động để bắt link /artist/phuongly */}
					<Route path="/artist/:id" element={<ArtistPage />} />
				</Routes>
			</MainLayout>
		</MusicProvider>
	);
};

function App() {
	return (
		// 2. Bọc toàn bộ ứng dụng trong BrowserRouter để sửa lỗi useNavigate
		<BrowserRouter>
			<ScrollToTop />
			<AppContent />
		</BrowserRouter>
	);
};

export default App;