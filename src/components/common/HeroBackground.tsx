import useDominantColor from '../../hooks/useDominantColor';

interface HeroBackgroundProps {
    /** URL ảnh để trích màu chủ đạo */
    imageUrl?: string | null;
    /** Màu fallback nếu không trích được (default: '#535353') */
    fallbackColor?: string;
    /**
     * Chiều dài gradient kéo xuống bên dưới container (px).
     * Tăng nếu muốn màu lan xa hơn vào vùng content.
     * Default: 80
     */
    bleedPx?: number;
}

/**
 * HeroBackground
 * Background chung cho các trang hero (Album, Artist, Playlist, Profile…):
 *  - Trích màu chủ đạo từ ảnh bằng `useDominantColor`
 *  - Render lớp màu solid với transition mượt khi đổi ảnh
 *  - Gradient fade-to-page-background kéo xuống `bleedPx` bên dưới container
 *
 * Dùng cách "màu solid + gradient" giống Spotify thay vì blur CSS:
 *  → Màu sắc chuẩn, không bị washed-out, không có đường kẻ cứng.
 *
 * @example
 * // Trong AlbumHeader, ProfileHeader, PlaylistHero…:
 * <div className="relative overflow-visible" style={{ minHeight: 320 }}>
 *   <HeroBackground imageUrl={album.avatarUrl} bleedPx={100} />
 *   <div className="relative z-10">…nội dung…</div>
 * </div>
 */
const HeroBackground = ({ imageUrl, fallbackColor = '#535353', bleedPx = 80 }: HeroBackgroundProps) => {
    const dominantColor = useDominantColor(imageUrl, fallbackColor);

    return (
        <>
            {/* Lớp 1: Màu solid chủ đạo — chuyển mượt khi đổi ảnh */}
            <div
                className="absolute left-0 right-0 top-0 transition-colors duration-700"
                style={{
                    bottom: `-${bleedPx}px`,
                    backgroundColor: dominantColor,
                    opacity: 0.55,
                }}
            />

            {/* Lớp 2: Gradient light-mode — trong suốt trên → trắng dưới */}
            <div
                className="absolute left-0 right-0 top-0 pointer-events-none dark:hidden"
                style={{
                    bottom: `-${bleedPx}px`,
                    background: `linear-gradient(
                        to bottom,
                        rgba(255,255,255,0.05) 0%,
                        transparent              40%,
                        rgba(255,255,255,0.6)   78%,
                        white                  100%
                    )`,
                }}
            />

            {/* Lớp 3: Gradient dark-mode — trong suốt trên → #121212 dưới */}
            <div
                className="absolute left-0 right-0 top-0 pointer-events-none hidden dark:block"
                style={{
                    bottom: `-${bleedPx}px`,
                    background: `linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.08)    0%,
                        transparent         38%,
                        rgba(18,18,18,0.72) 76%,
                        #121212            100%
                    )`,
                }}
            />
        </>
    );
};

export default HeroBackground;
