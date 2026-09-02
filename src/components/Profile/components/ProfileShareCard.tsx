import { useRef, useState, useCallback, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { createPortal } from 'react-dom';
import { Download, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileShareCardProps {
    user: any; // Thay bằng UserProfile / Artist interface của bạn
    dominantColor: string; // Truyền màu từ ProfileHeader sang cho đồng bộ
    isOpen: boolean;
    onClose: () => void;
    type?: 'user' | 'artist';
}

/**
 * Fetch ảnh từ URL và convert thành blob URL (same-origin).
 * Giúp html-to-image không bị lỗi CORS khi tạo canvas.
 *
 * Ở local dev: dùng Vite proxy (/cloudinary-proxy) để fetch same-origin.
 * Ở production: fetch trực tiếp + cache-busting.
 */
const fetchImageAsBlobUrl = async (url: string): Promise<string | null> => {
    try {
        let fetchUrl = url;

        // Ở dev mode: rewrite Cloudinary URL qua Vite proxy để tránh CORS
        if (import.meta.env.DEV && url.includes('res.cloudinary.com')) {
            fetchUrl = url.replace('https://res.cloudinary.com', '/cloudinary-proxy');
        } else {
            // Production: thêm timestamp để bust cache (tránh cached response thiếu CORS headers)
            const separator = url.includes('?') ? '&' : '?';
            fetchUrl = `${url}${separator}_t=${Date.now()}`;
        }

        const response = await fetch(fetchUrl, {
            mode: 'cors',
            cache: 'no-cache',
        });
        if (!response.ok) return null;
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        console.warn('fetchImageAsBlobUrl failed, will use original URL:', err);
        return null;
    }
};

const ProfileShareCard = ({ user, dominantColor, isOpen, onClose, type = 'user' }: ProfileShareCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [blobAvatarUrl, setBlobAvatarUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation();

    // Link chia sẻ: domain/profile/user123 hoặc domain/artist/artist123
    const profileUrl = type === 'artist' || type === t('profile.artist')
        ? `${window.location.origin}/artist/${user.id}`
        : `${window.location.origin}/profile/${user.id || 'me'}`;

    // Pre-fetch ảnh avatar thành blob URL khi card mở
    useEffect(() => {
        if (!isOpen || !user.avatarUrl) return;
        let revoke: string | null = null;

        setBlobAvatarUrl(null);
        setImageError(false);

        // blob: URL đã là same-origin, không cần fetch lại
        if (user.avatarUrl.startsWith('blob:')) {
            setBlobAvatarUrl(user.avatarUrl);
            return;
        }

        fetchImageAsBlobUrl(user.avatarUrl).then((url) => {
            if (url) {
                revoke = url;
                setBlobAvatarUrl(url);
            } else {
                // Fallback: dùng URL gốc
                setBlobAvatarUrl(user.avatarUrl);
            }
        });

        return () => {
            if (revoke) URL.revokeObjectURL(revoke);
        };
    }, [isOpen, user.avatarUrl]);

    const handleDownloadImage = useCallback(async () => {
        if (!cardRef.current || isGenerating) return;

        if (imageRef.current && !imageRef.current.complete) {
            alert("Đang tải dữ liệu ảnh, vui lòng thử lại sau giây lát!");
            return;
        }

        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 200));

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: false, // Không cần cacheBust vì ảnh đã là blob URL
                pixelRatio: 3,
                backgroundColor: 'transparent',
                filter: (node) => (node as HTMLElement).tagName !== 'BUTTON',
            });

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `Springtunes_${type === 'artist' ? 'Artist' : 'Profile'}_${user.name?.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Lỗi tạo ảnh:", error);
            alert("Có lỗi khi tạo ảnh. Vui lòng thử lại!");
        } finally {
            setIsGenerating(false);
        }
    }, [user, isGenerating]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center
                        backdrop-blur-2xl p-4 animate-in fade-in duration-200"
            style={{
                background: `linear-gradient(to bottom, ${dominantColor}aa, #121212dd)`
            }}
        >
            <div className="mt-12 relative w-full max-w-sm flex flex-col items-center">

                <button
                    onClick={onClose}
                    disabled={isGenerating}
                    className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full
                            text-white hover:bg-white/20 transition disabled:opacity-50"
                >
                    <X size={24} />
                </button>

                {/* --- CARD CONTENT --- */}
                <div
                    ref={cardRef}
                    className="w-[320px] p-6 flex flex-col items-center text-center select-none relative overflow-hidden"
                    style={{
                        aspectRatio: '3/4.5', // Giữ tỉ lệ chuẩn story
                        background: `linear-gradient(to bottom right, ${dominantColor}, #000000)`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        borderRadius: '24px',
                        color: '#ffffff',
                    }}
                >
                    {/* Noise texture overlay (optional cho đẹp) */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=")' }}>
                    </div>

                    <div className="w-full h-full flex flex-col relative z-10 justify-between">

                        {/* 1. Phần Avatar & Info */}
                        <div className="flex flex-col items-center mt-4">
                            {/* Avatar Container - Làm tròn cho đúng chất Profile */}
                            <div
                                className="w-48 h-48 mb-6 relative shrink-0"
                                style={{
                                    borderRadius: '50%',
                                    padding: '8px',
                                    background: 'rgba(255,255,255,0.1)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                }}
                            >
                                {blobAvatarUrl ? (
                                    <img
                                        ref={imageRef}
                                        src={blobAvatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover rounded-full"
                                        onError={() => setImageError(true)}
                                    />
                                ) : user.avatarUrl ? (
                                    <div className="w-full h-full rounded-full flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white/50" size={32} />
                                    </div>
                                ) : (
                                    <div className="w-full h-full rounded-full bg-primary-500 flex items-center justify-center">
                                        <span className="text-6xl font-black uppercase">{user.name.charAt(0)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Tên User */}
                            <h2
                                className="text-3xl font-black uppercase tracking-tighter mb-2"
                                style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
                            >
                                {user.name}
                            </h2>

                            {/* Stats nhỏ (Optional - nhìn sẽ uy tín hơn) */}
                            <p className="text-sm font-medium opacity-90 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                                {user.followerCount || 0} {t('profile.followers')}
                            </p>
                        </div>

                        {/* 2. Phần Footer QR */}
                        <div className="flex items-end justify-between w-full mt-4">
                            <div className="text-left">
                                <p
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1"
                                >
                                    {type === 'artist' ? 'Artist on' : 'Profile on'}
                                </p>
                                <div className="flex items-center gap-2">
                                    {/* Logo app nếu có, hoặc text */}
                                    <p
                                        className="text-xl font-black tracking-tighter"
                                        style={{ color: '#22C55E' }}
                                    >
                                        Springtunes
                                    </p>
                                </div>
                            </div>

                            <div
                                className="p-1.5 bg-white rounded-lg shadow-lg"
                            >
                                <QRCodeCanvas
                                    value={profileUrl}
                                    size={70}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"M"}
                                    includeMargin={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button Download */}
                <button
                    onClick={handleDownloadImage}
                    disabled={isGenerating || (user.avatarUrl && !blobAvatarUrl) || imageError}
                    className="mt-6 w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-full flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                    {isGenerating ? 'Creating card...' : 'Download Card'}
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ProfileShareCard;
