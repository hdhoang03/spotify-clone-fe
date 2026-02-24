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
			transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 20 }}
			className="h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0 overflow-hidden relative z-20"
		>
			{/* 1. HEADER */}
			<div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-100 dark:border-white/5`}>
				{isCollapsed ? (
					<span className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/admin')}>A</span>
				) : (
					<span className="text-xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent whitespace-nowrap cursor-pointer" onClick={() => navigate('/admin')}>
						Admin Portal
					</span>
				)}
			</div>

			{/* 2. MENU ITEMS */}
			<nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
				{menuItems.map((item) => {
					// Gọi hàm checkActive đã sửa ở trên
					const isActive = checkActive(item.path);

					return (
						<button
							key={item.path}
							onClick={() => navigate(item.path)}
							title={isCollapsed ? item.label : ""}
							className={`w-full flex items-center rounded-lg transition-all duration-200 group relative
                                ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'}
                                ${isActive
									? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 font-bold'
									: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'
								}`}
						>
							<div className="shrink-0">{item.icon}</div>

							<AnimatePresence>
								{!isCollapsed && (
									<motion.span
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										className="text-sm whitespace-nowrap overflow-hidden"
									>
										{item.label}
									</motion.span>
								)}
							</AnimatePresence>

							{/* Dấu gạch Active */}
							{isActive && (
								<motion.div
									layoutId="active-pill"
									className="absolute left-0 top-0 bottom-0 my-auto w-1 h-8 bg-green-500 rounded-r-full"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
						</button>
					);
				})}
			</nav>

			{/* 3. FOOTER */}
			<div className="p-3 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2">
				<div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'} mb-1`}>
					<img
						src={user?.avatarUrl || "https://github.com/shadcn.png"}
						alt="Admin"
						className="w-8 h-8 rounded-full bg-gray-200 shrink-0 object-cover"
					/>
					{!isCollapsed && (
						<div className="flex-1 min-w-0 overflow-hidden">
							<p className="text-sm font-bold truncate dark:text-white">{user?.name}</p>
							<p className="text-xs text-gray-500 truncate">Administrator</p>
						</div>
					)}
				</div>

				{/* --- NÚT ĐĂNG XUẤT ĐÃ SỬA --- */}
				<button
					onClick={onSignOut}
					className={`flex items-center rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors
                        ${isCollapsed ? 'justify-center p-2' : 'justify-center gap-2 px-4 py-2'}
                    `}
					title="Đăng xuất"
				>
					<LogOut size={16} />
					{!isCollapsed && <span>Đăng xuất</span>}
				</button>

				<button
					onClick={toggleCollapse}
					className="mt-2 w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
				>
					{isCollapsed ? <ArrowRightToLine size={20} /> : <ArrowLeftToLine size={20} />}
				</button>
			</div>
		</motion.aside>
	);
};

export default AdminSidebar;