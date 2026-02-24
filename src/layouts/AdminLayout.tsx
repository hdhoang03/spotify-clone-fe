import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import AdminSidebar from '../components/Admin/Sidebar';

const AdminLayout = () => {
    const navigate = useNavigate();
    // State quản lý việc đóng mở Sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans overflow-hidden">

            {/* --- ADMIN SIDEBAR (Tách biệt) --- */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
                {/* Admin Header */}
                <header className="h-16 bg-white dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                            Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:hover:bg-zinc-800 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
                        </button>
                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm font-bold text-green-600 hover:text-green-700 dark:text-green-500 hover:underline"
                        >
                            Về trang Client
                        </button>
                    </div>
                </header>

                {/* Page Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;