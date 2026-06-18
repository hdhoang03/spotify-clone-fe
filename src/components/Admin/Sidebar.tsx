import { LayoutDashboard, Users, Music, Mic2, LogOut, ArrowLeftToLine, ArrowRightToLine, Album, Save } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeader } from '../../components/Header/useHeader';

interface AdminSidebarProps {
	isCollapsed: boolean;
	toggleCollapse: () => void;
}

const AdminSidebar = ({ isCollapsed, toggleCollapse }: AdminSidebarProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, handleLogout } = useHeader();

	const menuItems = [
		{ path: '/admin/dashboard', icon: <LayoutDashboard size={22} />, label: 'Tổng quan' },
		{ path: '/admin/users', icon: <Users size={22} />, label: 'Người dùng' },
		{ path: '/admin/songs', icon: <Music size={22} />, label: 'Bài hát' },
		{ path: '/admin/artists', icon: <Mic2 size={22} />, label: 'Nghệ sĩ' },
		{ path: '/admin/albums', icon: <Album size={22} />, label: 'Album' },
		{ path: '/admin/categories', icon: <Save size={22} />, label: 'Danh mục' },
	];

	// --- LOGIC XỬ LÝ ACTIVE TAB ---
	const checkActive = (path: string) => {
		// 1. Trường hợp đặc biệt: Nếu URL là /admin thì mặc định active Dashboard
		if (location.pathname === '/admin' && path === '/admin/dashboard') {
			return true;
		}
		// 2. Logic thông thường: Kiểm tra URL hiện tại có bắt đầu bằng path của item không
		// Ví dụ: đang ở /admin/songs/add vẫn sẽ active tab /admin/songs
		return location.pathname.startsWith(path);
	};

	// --- LOGIC ĐĂNG XUẤT VÀ CHUYỂN HƯỚNG ---
	const onSignOut = () => {
		handleLogout(); // 1. Xóa token/storage
		navigate('/');  // 2. Đá về trang chủ Client
	};

	return (
		<motion.aside
			initial={{ width: 256 }}
			animate={{ width: isCollapsed ? 80 : 256 }}
			transition={{ duration: 0.45, type: "spring", stiffness: 120, damping: 22 }}
			className="h-screen bg-white dark:bg-[#0c0c0e] border-r border-zinc-200/60 dark:border-zinc-850/80 flex flex-col shrink-0 overflow-hidden relative z-20"
		>
			{/* 1. HEADER */}
			<div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-zinc-100 dark:border-zinc-900/60`}>
				{isCollapsed ? (
					<span className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/admin')}>A</span>
				) : (
					<span className="text-lg font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap cursor-pointer tracking-wider" onClick={() => navigate('/admin')}>
						ADMIN PORTAL
					</span>
				)}
			</div>

			{/* 2. MENU ITEMS */}
			<nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
				{menuItems.map((item) => {
					// Gọi hàm checkActive đã sửa ở trên
					const isActive = checkActive(item.path);

					return (
						<button
							key={item.path}
							onClick={() => navigate(item.path)}
							title={isCollapsed ? item.label : ""}
							className={`w-full flex items-center rounded-xl transition-all duration-300 group relative
                                ${isCollapsed ? 'justify-center px-0 py-3.5' : 'gap-3 px-4 py-3'}
                                ${isActive
									? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-extrabold shadow-[0_2px_8px_rgba(16,185,129,0.04)]'
									: 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200'
								}`}
						>
							<div className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-emerald-500' : 'text-zinc-400'}`}>
								{item.icon}
							</div>

							<AnimatePresence>
								{!isCollapsed && (
									<motion.span
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -10 }}
										transition={{ duration: 0.2 }}
										className="text-[14px] whitespace-nowrap overflow-hidden tracking-wide"
									>
										{item.label}
									</motion.span>
								)}
							</AnimatePresence>

							{/* Dấu gạch Active */}
							{isActive && (
								<motion.div
									layoutId="active-pill"
									className="absolute left-0 top-0 bottom-0 my-auto w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
						</button>
					);
				})}
			</nav>

			{/* 3. FOOTER */}
			<div className="p-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3 bg-zinc-50/50 dark:bg-black/20">
				<div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'} mb-0.5`}>
					<img
						src={user?.avatarUrl || "https://github.com/shadcn.png"}
						alt="Admin"
						className="w-9 h-9 rounded-full bg-zinc-200 shrink-0 object-cover ring-2 ring-emerald-500/10"
					/>
					{!isCollapsed && (
						<div className="flex-1 min-w-0 overflow-hidden">
							<p className="text-[13px] font-bold truncate text-zinc-800 dark:text-zinc-100">{user?.name}</p>
							<p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Administrator</p>
						</div>
					)}
				</div>

				{/* --- NÚT ĐĂNG XUẤT ĐÃ SỬA --- */}
				<button
					onClick={onSignOut}
					className={`flex items-center rounded-xl text-xs font-bold text-rose-600 border border-rose-200/50 dark:border-rose-950/20 bg-rose-50/25 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-700 transition-colors
                        ${isCollapsed ? 'justify-center p-2.5' : 'justify-center gap-2 px-4 py-2.5'}
                    `}
					title="Đăng xuất"
				>
					<LogOut size={15} />
					{!isCollapsed && <span>Đăng xuất</span>}
				</button>

				<button
					onClick={toggleCollapse}
					className="w-full flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-900 rounded-xl transition-colors"
				>
					{isCollapsed ? <ArrowRightToLine size={18} /> : <ArrowLeftToLine size={18} />}
				</button>
			</div>
		</motion.aside>
	);
};

export default AdminSidebar;