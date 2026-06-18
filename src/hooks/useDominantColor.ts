import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

// 1. TẠO CACHE: Lưu trữ mã màu của các ảnh đã tính toán
// Giúp tránh việc gọi lại API Google khi component re-render hoặc người dùng chuyển trang
const colorCache = new Map<string, string>();

/**
 * useDominantColor
 * Trích xuất màu chủ đạo từ một URL ảnh bằng fast-average-color.
 *
 * @param imageUrl  URL của ảnh cần phân tích
 * @param fallback  Màu mặc định khi không trích được (default: '#535353')
 * @returns         Hex color string, e.g. '#1a7a4f'
 */
const useDominantColor = (imageUrl?: string | null, fallback = '#535353'): string => {
    // Khởi tạo state: Nếu ảnh đã có trong cache thì lấy luôn, không cần fallback
    const [color, setColor] = useState<string>(() => {
        if (imageUrl && colorCache.has(imageUrl)) {
            return colorCache.get(imageUrl)!;
        }
        return fallback;
    });

    useEffect(() => {
        if (!imageUrl) {
            setColor(fallback);
            return;
        }

        // Nếu đã có trong cache thì set màu và dừng luôn (Ngăn chặn 429 Too Many Requests)
        if (colorCache.has(imageUrl)) {
            setColor(colorCache.get(imageUrl)!);
            return;
        }

        let cancelled = false;

        // 2. TỰ CẤU HÌNH IMAGE: Thay vì truyền string cho fac, ta tạo Image thủ công
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.referrerPolicy = 'no-referrer'; // Bắt buộc phải có để lấy ảnh Google

        img.onload = () => {
            // Truyền trực tiếp đối tượng img đã load xong vào fac
            fac.getColorAsync(img, { algorithm: 'dominant' })
                .then(result => {
                    if (!cancelled) {
                        setColor(result.hex);
                        colorCache.set(imageUrl, result.hex); // Lưu kết quả vào cache
                    }
                })
                .catch(() => {
                    if (!cancelled) setColor(fallback);
                });
        };

        img.onerror = () => {
            if (!cancelled) setColor(fallback);
        };

        // Bắt đầu tải ảnh
        img.src = imageUrl;

        return () => { cancelled = true; };
    }, [imageUrl, fallback]);

    return color;
};

export default useDominantColor;