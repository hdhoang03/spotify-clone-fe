import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// --- 1. LAYOUTS & CONTEXT ---
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { MusicProvider } from './contexts/MusicContent';
import AdminGuard from './components/Auth/AdminGuard';

// --- 2. CLIENT COMPONENTS ---
import HomePage from './components/HomePage/HomePage';
import SearchPage from './components/Search/Search';
import LibraryPage from './components/Sidebar/LibraryPage';
import ProfilePage from './components/Profile/Profile';
import SettingsPage from './components/Settings/Settings';
import HelpPage from './components/Help/Help';
import AccountPage from './components/Account/Account';
import ArtistPage from './components/Artist/Artist';

// --- 3. ADMIN COMPONENTS ---
// Đảm bảo bạn đã di chuyển file vào src/components/Admin/
import Dashboard from './components/Admin/Dashboard/Dashboard';
import UserManagement from './components/Admin/Users/Users';
import SongsManagement from './components/Admin/Songs/Songs';
import ArtistManagement from './components/Admin/Artists/Artists';
import AlbumManagement from './components/Admin/Albums/Albums';
import CategoriesManagement from './components/Admin/Categories/Categories';
import CategoryDetail from './components/Admin/Categories/CategoryDetail';
import AlbumDetail from './components/Admin/Albums/AlbumDetail';

// Component con: Chứa logic định tuyến (Nơi được phép dùng useLocation)
const AppRoutes = () => {
    const location = useLocation();

    // Helper: Xác định Active Tab
    const getActiveTab = (path: string) => {
        if (path === '/') return 'HOME';
        if (path.startsWith('/search')) return 'SEARCH';
        if (path.startsWith('/library')) return 'LIBRARY';
        if (path.startsWith('/profile')) return 'PROFILE';
        return '';
    };

    return (
        <MusicProvider>
            <Routes>
                {/* --- KHU VỰC ADMIN --- */}
                <Route element={<AdminGuard />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="songs" element={<SongsManagement />} />
                        <Route path="artists" element={<ArtistManagement />} />
                        <Route path="albums" element={<AlbumManagement />} />
                        <Route path="/admin/albums/:id" element={<AlbumDetail />} />
                        <Route path="categories" element={<CategoriesManagement />} />
                        <Route path="categories/:id" element={<CategoryDetail />} />
                    </Route>
                </Route>

                {/* --- KHU VỰC CLIENT (NGƯỜI DÙNG) --- */}
                <Route path="/*" element={
                    <MainLayout
                        activeTab={getActiveTab(location.pathname)}
                        onTabChange={() => { }}
                    >
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/library" element={<LibraryPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/support" element={<HelpPage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/artist/:id" element={<ArtistPage />} />

                            {/* 404 Page */}
                            <Route path="*" element={
                                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                    <h1 className="text-4xl font-bold mb-4">404</h1>
                                    <p>Không tìm thấy trang này</p>
                                </div>
                            } />
                        </Routes>
                    </MainLayout>
                } />
            </Routes>
        </MusicProvider>
    );
};

// Component Gốc: Bọc BrowserRouter tại đây để an toàn
const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;