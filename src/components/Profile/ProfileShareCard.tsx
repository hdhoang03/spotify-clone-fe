import { useRef, useState, useCallback, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { createPortal } from 'react-dom';
import { Download, X, Loader2 } from 'lucide-react';

interface ProfileShareCardProps {
    user: any; // Thay bằng UserProfile interface của bạn
    dominantColor: string; // Truyền màu từ ProfileHeader sang cho đồng bộ
    isOpen: boolean;
    onClose: () => void;
}

const ProfileShareCard = ({ user, dominantColor, isOpen, onClose }: ProfileShareCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Link profile: domain/profile/user123
    const profileUrl = `${window.location.origin}/profile/${user.id || 'me'}`;

    // Bypass cache ảnh
    const corsAvatarUrl = useMemo(() => {
        if (!user.avatarUrl) return null;

        // Nếu là Blob URL (Mock data vừa upload) -> KHÔNG thêm timestamp (vì sẽ làm hỏng link blob)
        if (user.avatarUrl.startsWith('blob:')) {
            return user.avatarUrl;
        }

        // Nếu là URL thật (Cloudinary/S3...) -> Thêm timestamp để bypass cache
        return `${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;
    }, [user.avatarUrl]);

    const handleDownloadImage = useCallback(async () => {
        if (!cardRef.current || isGenerating) return;

        if (imageRef.current && !imageRef.current.complete) {
            alert("Đang tải dữ liệu ảnh, vui lòng thử lại sau giây lát!");
            return;
        }

        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: 'transparent',
                filter: (node) => (node as HTMLElement).tagName !== 'BUTTON',
            });

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `SpringTunes_Profile_${user.name.replace(/\s+/g, '_')}.png`;
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
                                {corsAvatarUrl ? (
                                    <img
                                        ref={imageRef}
                                        src={corsAvatarUrl}
                                        alt="avatar"
                                        crossOrigin="anonymous"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
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
                                {user.followersCount || 0} Followers
                            </p>
                        </div>

                        {/* 2. Phần Footer QR */}
                        <div className="flex items-end justify-between w-full mt-4">
                            <div className="text-left">
                                <p
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1"
                                >
                                    Profile on
                                </p>
                                <div className="flex items-center gap-2">
                                    {/* Logo app nếu có, hoặc text */}
                                    <p
                                        className="text-xl font-black tracking-tighter"
                                        style={{ color: '#22C55E' }}
                                    >
                                        SpringTunes
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
                    disabled={isGenerating || !!(corsAvatarUrl && imageRef.current && !imageRef.current.complete)}
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