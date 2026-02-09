import { Music } from 'lucide-react';

interface DynamicCoverProps {
    imageUrl?: string;      // Ảnh bìa chính (User upload)
    subImages?: string[];   // Ảnh của các bài hát trong album (nếu imageUrl rỗng)
    className?: string;
}

const DynamicCover = ({ imageUrl, subImages = [], className = "" }: DynamicCoverProps) => {
    // 1. Trường hợp có ảnh bìa chính (User đã upload)
    if (imageUrl) {
        return (
            <div className={`w-full h-full overflow-hidden ${className}`}>
                <img src={imageUrl} alt="Cover" className="w-full h-full object-cover shadow-lg" />
            </div>
        );
    }

    // 2. Trường hợp KHÔNG có ảnh bìa -> Logic ghép ảnh
    // Lấy tối đa 4 ảnh đầu tiên
    const gridImages = subImages.slice(0, 4);

    if (gridImages.length === 0) {
        // Không có bài hát nào -> Hiện Placeholder
        return (
            <div className={`w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 ${className}`}>
                <Music size={40} />
            </div>
        );
    }

    // 3. Logic hiển thị Grid (Nếu >= 4 ảnh thì chia 4, còn lại thì hiện 1 ảnh to của bài đầu tiên)
    if (gridImages.length >= 4) {
        return (
            <div className={`w-full h-full grid grid-cols-2 ${className}`}>
                {gridImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`cover-${idx}`} className="w-full h-full object-cover" />
                ))}
            </div>
        );
    }

    // Nếu chỉ có 1-3 bài, lấy ảnh bài đầu tiên làm cover tạm
    return (
        <div className={`w-full h-full overflow-hidden ${className}`}>
            <img src={gridImages[0]} alt="Cover" className="w-full h-full object-cover" />
        </div>
    );
};

export default DynamicCover;