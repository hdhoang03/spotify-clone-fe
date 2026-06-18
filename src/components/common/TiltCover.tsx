import { useRef, useState } from 'react';
import { Music } from 'lucide-react';

interface TiltCoverProps {
    /** URL ảnh bìa */
    src?: string | null;
    /** Alt text */
    alt?: string;
    /** Kích thước Tailwind, e.g. "w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60" */
    sizeClass?: string;
    /** Border radius Tailwind, default: "rounded-xl" */
    radiusClass?: string;
    /** Góc tilt tối đa (độ), default: 8 */
    maxTilt?: number;
    /** Click handler (tùy chọn) */
    onClick?: () => void;
    /** Nội dung hiển thị khi hover (tuỳ chọn, ví dụ: nút edit) */
    hoverOverlay?: React.ReactNode;
}

/**
 * TiltCover
 * Ảnh bìa 3D tilt + spotlight + glow border khi hover.
 * Dùng chung cho Album, Playlist, Profile, Artist…
 *
 * @example
 * <TiltCover src={album.avatarUrl} alt={album.name} sizeClass="w-56 h-56" />
 */
const TiltCover = ({
    src,
    alt = 'cover',
    sizeClass = 'w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60',
    radiusClass = 'rounded-xl',
    maxTilt = 8,
    onClick,
    hoverOverlay,
}: TiltCoverProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50, hovered: false });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setTilt({
            rotateX: ((y - height / 2) / (height / 2)) * -maxTilt,
            rotateY: ((x - width / 2) / (width / 2)) * maxTilt,
            spotX: (x / width) * 100,
            spotY: (y / height) * 100,
            hovered: true,
        });
    };

    const handleMouseLeave = () =>
        setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50, hovered: false });

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ perspective: '800px' }}
            className={`flex-shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div
                style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${tilt.hovered ? 'scale(1.04)' : 'scale(1)'}`,
                    transition: tilt.hovered
                        ? 'transform 0.1s ease-out'
                        : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                }}
                className={`relative ${sizeClass} ${radiusClass} overflow-hidden shadow-2xl`}
            >
                {/* Ảnh hoặc placeholder */}
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        draggable={false}
                        onError={(e) => {
                            // Khi ảnh CORS bị chặn hoặc load lỗi → ẩn ảnh, hiện placeholder
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                                const placeholder = parent.querySelector('.img-placeholder') as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                            }
                        }}
                    />
                ) : null}
                <div
                    className="img-placeholder w-full h-full bg-zinc-800 items-center justify-center absolute inset-0"
                    style={{ display: src ? 'none' : 'flex' }}
                >
                    <Music size={52} className="text-zinc-500" />
                </div>

                {/* Spotlight theo chuột */}
                <div
                    style={{
                        background: `radial-gradient(circle at ${tilt.spotX}% ${tilt.spotY}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
                        opacity: tilt.hovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    className="absolute inset-0 pointer-events-none z-10"
                />

                {/* Glow border */}
                <div
                    style={{
                        boxShadow: tilt.hovered
                            ? '0 0 0 1px rgba(255,255,255,0.25), 0 20px 40px -10px rgba(0,0,0,0.6)'
                            : 'none',
                        opacity: tilt.hovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    className={`absolute inset-0 ${radiusClass} pointer-events-none z-10`}
                />

                {/* Hover overlay tuỳ chỉnh (vd: nút edit của Playlist) */}
                {hoverOverlay && (
                    <div
                        className="absolute inset-0 z-20 transition-opacity"
                        style={{ opacity: tilt.hovered ? 1 : 0 }}
                    >
                        {hoverOverlay}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TiltCover;
