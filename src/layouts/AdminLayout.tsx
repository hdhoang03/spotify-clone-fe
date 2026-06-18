import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import AdminSidebar from '../components/Admin/Sidebar';

const AdminLayout = () => {
    const navigate = useNavigate();
    // State quản lý việc đóng mở Sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">

            {/* --- ADMIN SIDEBAR (Tách biệt) --- */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
                {/* Admin Header */}
                <header className="h-16 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between px-8 shrink-0 z-10">
                    <div>
                        <h2 className="text-[17px] font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">
                            Admin Portal
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 transition-colors uppercase tracking-wider"
                        >
                            Go to client page
                        </button>
                    </div>
                </header>

                {/* Page Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;