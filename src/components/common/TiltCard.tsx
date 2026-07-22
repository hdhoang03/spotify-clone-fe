import { useRef, useState } from 'react';
import { useCountUp } from '../../hooks/useCountUp';

export interface TiltCardProps {
    /** Nhãn hiển thị phía trên số */
    title: string;
    /** Giá trị số (hoặc string format) — sẽ được animate count-up */
    value: number | string;
    /** Lucide icon component */
    icon: React.ElementType;
    /** Tailwind class cho nền icon, e.g. "bg-blue-500" */
    color: string;
    /** Màu glow border khi hover, e.g. "rgba(59,130,246,0.4)" */
    glowColor: string;
    /** Màu spotlight radial theo chuột, e.g. "rgba(59,130,246,0.12)" */
    spotlightColor: string;
    /** Thứ tự để stagger animation fade-in */
    index?: number;
    /** Thời gian count-up animation (ms) */
    countUpDuration?: number;
}

/**
 * TiltCard — Card 3D tilt + spotlight theo chuột + count-up animation.
 *
 * Hiệu ứng:
 *  - 3D Perspective tilt: card nghiêng ±10° theo vị trí con trỏ
 *  - Spotlight: radial-gradient màu chạy theo cursor
 *  - Glow border: viền phát sáng theo màu riêng mỗi card
 *  - Count-up: số tự đếm từ 0 → target khi mount
 *
 * @example
 * <TiltCard
 *   title="Tổng người dùng"
 *   value={1234}
 *   icon={Users}
 *   color="bg-blue-500"
 *   glowColor="rgba(59,130,246,0.4)"
 *   spotlightColor="rgba(59,130,246,0.12)"
 *   index={0}
 * />
 */
export const TiltCard = ({
    title,
    value,
    icon: Icon,
    color,
    glowColor,
    spotlightColor,
    index = 0,
    countUpDuration = 1200,
}: TiltCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({
        rotateX: 0,
        rotateY: 0,
        spotX: 50,
        spotY: 50,
        isHovered: false,
    });

    const displayValue = useCountUp(value, countUpDuration);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        setTilt({
            rotateX: ((y - cy) / cy) * -10,
            rotateY: ((x - cx) / cx) * 10,
            spotX: (x / rect.width) * 100,
            spotY: (y / rect.height) * 100,
            isHovered: true,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50, isHovered: false });
    };

    return (
        /* Wrapper giữ perspective và stagger animation */
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: '800px',
                animationDelay: `${index * 100}ms`,
            }}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            {/* Card body — thực hiện transform 3D */}
            <div
                style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${tilt.isHovered ? 'scale(1.04)' : 'scale(1)'}`,
                    transition: tilt.isHovered
                        ? 'transform 0.1s ease-out'
                        : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                }}
                className="relative overflow-hidden bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm cursor-default"
            >
                {/* Spotlight overlay theo chuột */}
                <div
                    style={{
                        background: `radial-gradient(circle at ${tilt.spotX}% ${tilt.spotY}%, ${spotlightColor} 0%, transparent 65%)`,
                        opacity: tilt.isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    className="absolute inset-0 pointer-events-none rounded-lg z-0"
                />

                {/* Glow border khi hover */}
                <div
                    style={{
                        boxShadow: tilt.isHovered
                            ? `0 0 0 1px ${glowColor}, 0 20px 40px -10px ${glowColor}`
                            : 'none',
                        opacity: tilt.isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    className="absolute inset-0 rounded-lg pointer-events-none z-0"
                />

                {/* Nội dung — nổi lên trên các overlay */}
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                            {title}
                        </p>
                        <h3
                            style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                            className="text-3xl font-black text-gray-900 dark:text-white tabular-nums"
                        >
                            {displayValue}
                        </h3>
                    </div>

                    {/* Icon nổi cao hơn trên trục Z */}
                    <div
                        style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
                        className={`p-4 rounded-xl ${color} text-white shadow-lg`}
                    >
                        <Icon size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};
