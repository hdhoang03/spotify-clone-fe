import React from 'react';

interface UnreadBadgeProps {
    /** Số lượng chưa đọc */
    count: number;
    /** Giới hạn tối đa hiển thị, default 99 */
    max?: number;
    /** Class thêm vào (vd: "absolute top-1 right-1" cho badge chuông) */
    className?: string;
}

/**
 * UnreadBadge
 * Badge số đỏ dùng chung cho notification bell và dropdown header.
 * Tự ẩn khi count <= 0.
 *
 * @example
 * // Trên icon chuông (absolute)
 * <UnreadBadge count={unreadCount} className="absolute top-1 right-1" />
 *
 * // Inline bên cạnh text
 * <UnreadBadge count={unreadCount} />
 */
const UnreadBadge = ({ count, max = 99, className = '' }: UnreadBadgeProps) => {
    if (count <= 0) return null;
    return (
        <span
            className={`inline-flex items-center justify-center
                min-w-[1.1rem] h-[1.1rem] px-1 rounded-full
                bg-red-500 text-white text-[10px] font-bold leading-none
                ${className}`}
        >
            {count > max ? `${max}+` : count}
        </span>
    );
};

export default UnreadBadge;
