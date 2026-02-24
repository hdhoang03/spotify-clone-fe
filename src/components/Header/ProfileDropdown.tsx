// import { useNavigate } from 'react-router-dom';
// import {
//     User,
//     LogOut,
//     Settings,
//     HelpCircle,
//     ExternalLink,
//     ShieldCheck, // 1. Import icon cho Admin
//     LayoutDashboard
// } from 'lucide-react';
// import ThemeToggle from './ThemeToggle';

// interface ProfileDropdownProps {
//     user: { name: string; email: string, role?: string };
//     onLogout: () => void;
//     onClose?: () => void;
// }

// const ProfileDropdown = ({ user, onLogout, onClose }: ProfileDropdownProps) => {
//     const navigate = useNavigate();
//     const handleNavigate = (path: string) => {
//         navigate(path);
//         if (onClose) onClose();
//     };

//     const itemClass = "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition w-full text-left";

//     return (
//         <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
//             {/* Header thông tin user */}
//             <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
//                 <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
//             </div>

//             <div className="flex flex-col gap-1">

//                 {/* --- 3. PHẦN ADMIN (Chỉ hiện nếu role là ADMIN) --- */}
//                 {user.role === 'ADMIN' && (
//                     <>
//                         <button
//                             onClick={() => handleNavigate('/admin/dashboard')}
//                             className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition w-full text-left mb-1"
//                         >
//                             <ShieldCheck size={18} />
//                             Trang quản trị
//                         </button>
//                         <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1" />
//                     </>
//                 )}

//                 {/* Tài khoản */}
//                 <button
//                     onClick={() => handleNavigate('/account')}
//                     className={itemClass}
//                 >
//                     <User size={18} />
//                     Tài khoản
//                 </button>

//                 {/* Hồ sơ */}
//                 <button
//                     onClick={() => handleNavigate('/profile')}
//                     className={itemClass}
//                 >
//                     <ExternalLink size={18} />
//                     Hồ sơ
//                 </button>

//                 {/* Premium */}
//                 {/* <button
//                     onClick={() => handleNavigate('/premium')}
//                     className={itemClass}
//                 >
//                     <CreditCard size={18} />
//                     Nâng cấp lên Premium
//                 </button> */}

//                 {/* Hỗ trợ */}
//                 <button
//                     onClick={() => handleNavigate('/support')}
//                     className={itemClass}
//                 >
//                     <HelpCircle size={18} />
//                     Hỗ trợ
//                 </button>

//                 {/* Cài đặt */}
//                 <button
//                     onClick={() => handleNavigate('/settings')}
//                     className={itemClass}
//                 >
//                     <Settings size={18} />
//                     Cài đặt
//                 </button>

//                 {/* Theme Toggle (Mobile) */}
//                 <div
//                     className="md:hidden flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
//                     // onClick={() => {
//                     //     if (onClose) onClose();
//                     // }}
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <span className="text-sm text-gray-700 dark:text-gray-200">Giao diện</span>
//                     <ThemeToggle />
//                 </div>

//                 <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1" />

//                 {/* Đăng xuất */}
//                 <button
//                     onClick={() => {
//                         onLogout();
//                         if (onClose) onClose();
//                     }}
//                     className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition w-full text-left"
//                 >
//                     <LogOut size={18} />
//                     Đăng xuất
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProfileDropdown;

import { useNavigate } from 'react-router-dom';
import {
    User,
    LogOut,
    Settings,
    HelpCircle,
    ExternalLink,
    ShieldCheck, 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
// 1. Import Type UserResponse chuẩn từ backend
import type { UserResponse } from '../../types/backend';

interface ProfileDropdownProps {
    // 2. Sử dụng đúng type UserResponse
    user: UserResponse;
    onLogout: () => void;
    onClose?: () => void;
}

const ProfileDropdown = ({ user, onLogout, onClose }: ProfileDropdownProps) => {
    const navigate = useNavigate();
    const handleNavigate = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    // 3. Logic kiểm tra Role chuẩn Backend (Duyệt mảng roles tìm tên 'ADMIN')
    const isAdmin = user.roles?.some(role => role.name === 'ADMIN');

    const itemClass = "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition w-full text-left";

    return (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
            {/* Header thông tin user */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>

            <div className="flex flex-col gap-1">

                {/* --- 4. Sử dụng biến isAdmin đã tính toán ở trên --- */}
                {isAdmin && (
                    <>
                        <button
                            onClick={() => handleNavigate('/admin/dashboard')}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition w-full text-left mb-1"
                        >
                            <ShieldCheck size={18} />
                            Trang quản trị
                        </button>
                        <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1" />
                    </>
                )}

                {/* Tài khoản */}
                <button
                    onClick={() => handleNavigate('/account')}
                    className={itemClass}
                >
                    <User size={18} />
                    Tài khoản
                </button>

                {/* Hồ sơ */}
                <button
                    onClick={() => handleNavigate('/profile')}
                    className={itemClass}
                >
                    <ExternalLink size={18} />
                    Hồ sơ
                </button>

                {/* Hỗ trợ */}
                <button
                    onClick={() => handleNavigate('/support')}
                    className={itemClass}
                >
                    <HelpCircle size={18} />
                    Hỗ trợ
                </button>

                {/* Cài đặt */}
                <button
                    onClick={() => handleNavigate('/settings')}
                    className={itemClass}
                >
                    <Settings size={18} />
                    Cài đặt
                </button>

                {/* Theme Toggle (Mobile) */}
                <div
                    className="md:hidden flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="text-sm text-gray-700 dark:text-gray-200">Giao diện</span>
                    <ThemeToggle />
                </div>

                <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1" />

                {/* Đăng xuất */}
                <button
                    onClick={() => {
                        onLogout();
                        if (onClose) onClose();
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition w-full text-left"
                >
                    <LogOut size={18} />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;