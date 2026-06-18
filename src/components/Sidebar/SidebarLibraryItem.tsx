// components/Sidebar/SidebarLibraryItem.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // 1. Import createPortal

interface SidebarItemProps {
    icon?: React.ReactNode;
    label: string;
    isActive?: boolean;
    imageUrl?: string;
    onClick?: () => void;
    variant?: 'nav' | 'playlist';
    isCollapsed?: boolean;
}

const SidebarItem = ({ icon, label, isActive, onClick, imageUrl, variant = 'nav', isCollapsed = false }: SidebarItemProps) => {
    const isPlaylist = variant === 'playlist';

    // 2. State để lưu vị trí hiển thị Tooltip
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    // 3. Hàm tính toán vị trí khi hover
    const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
        if (!isCollapsed) return;

        // Lấy tọa độ của Item hiện tại trên màn hình
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({
            top: rect.top + (rect.height / 2), // Căn giữa theo chiều dọc
            left: rect.right + 12              // Cách mép phải 12px
        });
        setIsHovered(true);
    };

    return (
        <>
            <li
                onClick={onClick}
                // Thêm sự kiện chuột
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                className="list-none group/item relative"
            >
                {/* --- Phần nội dung Item (Giữ nguyên code cũ) --- */}
                <div className={`
                    relative flex items-center transition-all duration-400 ease-out cursor-pointer active:scale-[0.97]
                    ${isCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2.5'}
                    ${isPlaylist ? 'rounded-2xl' : 'rounded-full'}
                    ${isActive
                        ? (isPlaylist
                            ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:bg-white/10 dark:shadow-none border border-black/5 dark:border-transparent'
                            : 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg')
                        : 'hover:bg-white/60 dark:hover:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/5'
                    }
                `}>
                    <div className={`
                        flex-shrink-0 overflow-hidden flex items-center justify-center transition-all duration-500 ease-out
                        ${isPlaylist
                            ? (isCollapsed ? 'w-10 h-10 rounded-[12px]' : 'w-[46px] h-[46px] rounded-[14px]')
                            : 'w-5 h-5 bg-transparent'
                        }
                        shadow-sm ring-1 ring-black/5 dark:ring-white/10 
                        group-hover/item:shadow-md group-hover/item:ring-black/10 dark:group-hover/item:ring-white/20
                        ${!imageUrl && isPlaylist ? 'bg-zinc-100 dark:bg-zinc-800' : ''}
                    `}>
                        {imageUrl ? (
                            <img src={imageUrl} alt={label} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700 ease-out" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                {React.isValidElement(icon) ? (
                                    React.cloneElement(icon as React.ReactElement<any>, {
                                        size: isPlaylist ? (isCollapsed ? 20 : 24) : 20,
                                        strokeWidth: isActive ? 2.5 : 2,
                                        className: `${isActive ? 'text-black dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`
                                    })
                                ) : icon}
                            </div>
                        )}
                    </div>

                    {/* Text Label (Chỉ hiện khi mở rộngss) */}
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0 flex-1 ml-1 animate-in fade-in duration-200 justify-center">
                            <span className={`truncate leading-tight ${isPlaylist ? 'text-[15px]' : 'text-sm'} ${isActive ? 'font-semibold text-black dark:text-white' : 'font-medium text-zinc-600 dark:text-zinc-300 group-hover/item:text-black dark:group-hover/item:text-white'}`}>
                                {label}
                            </span>
                        </div>
                    )}
                </div>
            </li>

            {/* 4. TOOLTIP PORTAL: Đẩy ra ngoài Body để không bị che */}
            {isCollapsed && isHovered && createPortal(
                <div
                    className="fixed z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                    style={{
                        top: tooltipPos.top,
                        left: tooltipPos.left,
                        transform: 'translateY(-50%)' // Để căn giữa chính xác tâm
                    }}
                >
                    <div className="bg-zinc-800 dark:bg-zinc-700 text-white text-xs font-bold px-3 py-2 rounded-md shadow-xl whitespace-nowrap relative border border-white/10">
                        {label}
                        {/* Mũi tên nhỏ chỉ vào */}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-zinc-800 dark:border-r-zinc-700"></div>
                    </div>
                </div>,
                document.body // Render trực tiếp vào body
            )}
        </>
    );
};

export default SidebarItem;