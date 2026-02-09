import React, { useRef, useState, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, X, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SongShareCardProps {
    song: any;
    isOpen: boolean;
    onClose: () => void;
}

const SongShareCard = ({ song, isOpen, onClose }: SongShareCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const songUrl = `${window.location.origin}/song/${song.id || '123'}`;
    const dominantColor = song.dominantColor || '#333333';
    // Thêm timestamp để bypass browser cache, đảm bảo ảnh load mới có header CORS
    const corsCoverUrl = `${song.coverUrl}?t=${new Date().getTime()}`;

    const handleDownloadImage = useCallback(async () => {
        if (!cardRef.current || isGenerating) return;

        // Check kỹ ảnh đã load xong chưa
        if (imageRef.current && !imageRef.current.complete) {
            alert("Đang tải dữ liệu ảnh, vui lòng thử lại sau vài giây!");
            return;
        }

        setIsGenerating(true);

        try {
            // Buffer nhỏ để UI ổn định trước khi chụp
            await new Promise(resolve => setTimeout(resolve, 100));

            // Cấu hình html-to-image
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true, // Ép tải lại resource để tránh cache lỗi
                pixelRatio: 3,   // Tăng độ nét (tương đương scale: 3)
                backgroundColor: 'transparent', // Giữ nền trong suốt (nếu có bo góc)
                // Filter bỏ qua các phần tử không muốn chụp (như nút button nếu nó nằm trong card)
                filter: (node) => {
                    const element = node as HTMLElement;
                    return element.tagName !== 'BUTTON'; 
                },
            });

            // Tải ảnh về
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `SpringTunes_${song.title.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Lỗi tạo ảnh:", error);
            alert("Có lỗi khi tạo ảnh (CORS hoặc trình duyệt chặn). Vui lòng thử lại!");
        } finally {
            setIsGenerating(false);
        }
    }, [song, isGenerating]);

    if (!isOpen) return null;

    return createPortal (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center
                        backdrop-blur-2xl p-4 animate-in fade-in duration-200"
            style={{
                background: `linear-gradient(to bottom, ${dominantColor}aa, #121212dd)`
            }}
        >
            <div className="relative w-full max-w-sm flex flex-col items-center">
                
                {/* Nút đóng */}
                <button 
                    onClick={onClose} 
                    disabled={isGenerating}
                    className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full
                            text-white hover:bg-white/20 transition disabled:opacity-50"
                >
                    <X size={24} />
                </button>

                {/* --- KHUNG THẺ BÀI (Vùng sẽ được chụp) --- */}
                {/* Lưu ý: html-to-image xử lý tốt rounded và shadow của Tailwind, 
                    nhưng để an toàn tuyệt đối với các biến màu lạ, ta vẫn giữ inline style cơ bản */}
                <div 
                    ref={cardRef}
                    className="w-[368px] p-2 flex flex-col items-center text-center select-none relative overflow-hidden"
                    style={{ 
                        aspectRatio: '3/4.5',
                        background: `linear-gradient(to bottom right, ${dominantColor}, #000000)`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        borderRadius: '16px',
                        color: '#ffffff',
                    }} 
                >
                    {/* Background Overlay */}
                    <div 
                        className="absolute inset-0 pointer-events-none" 
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} 
                    />

                    {/* Inner Content */}
                    <div 
                        className="w-full h-full p-4 flex flex-col relative z-10"
                        style={{ borderRadius: '12px' }}
                    >
                        {/* Artwork */}
                        <div 
                            className="w-full aspect-square mb-2 relative overflow-hidden shrink-1 min-h-0"
                            style={{ 
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <img 
                                ref={imageRef}
                                src={corsCoverUrl}
                                alt="cover" 
                                crossOrigin="anonymous"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Title & Artist */}
                        <div className="text-left mt-2 shrink-0">
                            <h2 
                                className="text-2xl font-black uppercase leading-snug tracking-tighter line-clamp-2 min-h-[2rem] flex items-center"
                                style={{ 
                                    color: '#ffffff',
                                    textShadow: '0 4px 3px rgba(0,0,0,0.5)'
                                }}
                            >
                                {song.title}
                            </h2>
                            <p 
                                className="text-sm font-bold uppercase tracking-widest truncate"
                                style={{ 
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textShadow: '0 2px 2px rgba(0,0,0,0.3)'
                                }}
                            >
                                {song.artist}
                            </p>
                        </div>

                        {/* Footer */}
                        <div 
                            className="flex items-end justify-between"
                            // style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }} //Thanh gạch ngang
                        >
                            <div className="text-left">
                                <p 
                                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                >
                                    Listen on
                                </p>
                                <p 
                                    className="text-lg font-black tracking-tighter"
                                    style={{ 
                                        color: '#22C55E',
                                        textShadow: '0 2px 2px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    SpringTunes
                                </p>
                            </div>
                            
                            {/* QR Box */}
                            <div 
                                className="p-1.5"
                                style={{ 
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '8px'
                                }}
                            >
                                <QRCodeCanvas 
                                    value={songUrl}
                                    size={75}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"M"}
                                    includeMargin={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Action */}
                <button 
                    onClick={handleDownloadImage}
                    disabled={isGenerating || !!(imageRef.current && !imageRef.current.complete)}
                    className="mt-6 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.2)' }}
                >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                    {isGenerating ? 'Đang tạo ảnh...' : 'Lưu thẻ về máy'}
                </button>
                 
                 {imageRef.current && !imageRef.current.complete && (
                    <p className="text-white/50 text-xs mt-2">Đang tải dữ liệu ảnh...</p>
                )}
            </div>
        </div>,
        document.body
    );
};

export default SongShareCard;