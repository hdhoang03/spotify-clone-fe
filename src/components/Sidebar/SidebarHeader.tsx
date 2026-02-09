// components/Sidebar/SidebarHeader.tsx
import { Library } from 'lucide-react';

interface SidebarHeaderProps {
    isActive: boolean;
    onClick: () => void;
}

const SidebarHeader = ({ isActive, onClick }: SidebarHeaderProps) => {
    return (
        <div className="hidden md:flex items-center justify-between mb-4 px-6 pt-6 md:px-4 md:pt-4">
            <button
                onClick={onClick}
                className={`group flex items-center gap-4 px-3 py-3 w-full transition-all duration-300 rounded-lg
                    ${isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800' // Nền đậm khi Active
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900' // Nền nhạt khi Hover
                    }
                `}
            >
                {/* Icon Library */}
                <div className={`transition-colors duration-300 
                    ${isActive
                        ? 'text-green-600 dark:text-green-500' // Icon Xanh khi Active
                        : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white'
                    }`}>
                    {/* strokeWidth={3} giúp icon đậm hơn khi active */}
                    <Library size={28} strokeWidth={isActive ? 3 : 2} />
                </div>

                <div className="flex flex-col items-start">
                    {/* Chữ Chính */}
                    <span className={`text-base transition-colors duration-300
                        ${isActive
                            ? 'font-extrabold text-black dark:text-white' // Chữ Đậm đen/trắng khi Active
                            : 'font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'
                        }`}>
                        Your Library
                    </span>

                    {/* Chữ Phụ (Gợi ý) - Chỉ hiện khi Hover hoặc Active */}
                    <span className={`text-[11px] font-medium transition-all duration-300
                        ${isActive
                            ? 'text-green-600 dark:text-green-500 opacity-100'
                            : 'text-zinc-400 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0'
                        }`}>
                        {isActive ? 'Đang xem thư viện' : 'Bấm để mở rộng'}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default SidebarHeader;