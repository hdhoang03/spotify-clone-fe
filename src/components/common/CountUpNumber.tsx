// components/common/CountUpNumber.tsx
import React, { useEffect, useState } from 'react';

interface CountUpNumberProps {
    endValue: number;
    duration?: number; // Thời gian chạy (ms)
}

const CountUpNumber = ({ endValue, duration = 1500 }: CountUpNumberProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            
            // Tính toán tỷ lệ hoàn thành (0 -> 1)
            const percentage = Math.min(progress / duration, 1);
            
            // Hàm Ease Out Expo: Chạy nhanh lúc đầu, chậm dần lúc cuối (tạo cảm giác mượt)
            const easeOut = (x: number) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            
            const currentCount = Math.floor(easeOut(percentage) * endValue);
            setCount(currentCount);

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(endValue); // Đảm bảo số cuối cùng chính xác
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [endValue, duration]);

    return <>{count.toLocaleString()}</>;
};

export default CountUpNumber;