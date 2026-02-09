import React, { useState, useRef, useEffect } from 'react';

interface ScrollingTextProps {
    content: string;
    className?: string;
    style?: React.CSSProperties;
}

const ScrollingText = ({ content, className = '', style = {} }: ScrollingTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const textWidth = textRef.current.scrollWidth;
                
                // Chỉ chạy nếu text dài hơn container
                // Thêm 1px buffer để tránh lỗi làm tròn pixel trên một số màn hình
                setShouldScroll(textWidth > containerWidth + 1);
            }
        };

        // 1. Check ngay lập tức
        checkOverflow();

        // 2. Check lại sau 1 khoảng nhỏ (đợi layout render xong, fix lỗi khi mở modal)
        const timer = setTimeout(checkOverflow, 100);

        // 3. Sử dụng ResizeObserver để lắng nghe sự thay đổi kích thước container
        // (Đây là phần quan trọng nhất để fix lỗi trên mobile/tablet khi xoay màn hình hoặc animation)
        const observer = new ResizeObserver(() => {
            checkOverflow();
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [content]);

    return (
        <div 
            ref={containerRef} 
            className="w-full overflow-hidden relative group"
            // Đảm bảo container cha có layout flex/grid hoạt động đúng
            style={{ display: 'flex', alignItems: 'center' }} 
        >
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    15% { transform: translateX(0); } /* Đứng yên lâu hơn chút để người dùng đọc */
                    100% { transform: translateX(-100%); } /* Chạy hết chữ */
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 8s linear infinite;
                    padding-left: 0;
                    min-width: fit-content; /* Quan trọng: để text luôn giữ độ rộng thật */
                    padding-right: 20px; /* Thêm khoảng đệm để khi lặp lại trông thoáng hơn (nếu có duplicate) */
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
            
            <div 
                ref={textRef}
                className={`whitespace-nowrap ${className} ${
                    shouldScroll ? 'animate-marquee' : 'truncate'
                }`}
                style={shouldScroll ? style : {}}
                title={content} // Tooltip hiển thị full text khi hover
            >
                {content}
            </div>
        </div>
    );
};

export default ScrollingText;