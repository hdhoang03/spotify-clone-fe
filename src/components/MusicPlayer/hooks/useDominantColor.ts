import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';

export const useDominantColor = (coverUrl?: string, songId?: string | number) => {
    const [dominantColor, setDominantColor] = useState<string>('#121212');

    useEffect(() => {
        if (!coverUrl) {
            setDominantColor('#121212');
            return;
        }

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = coverUrl;
        img.onload = () => {
            const fac = new FastAverageColor();
            fac.getColorAsync(img, {
                algorithm: 'dominant',
                left: Math.floor(img.width * 0.2),
                top: Math.floor(img.height * 0.2),
                width: Math.floor(img.width * 0.6),
                height: Math.floor(img.height * 0.6),
            })
                .then(c => setDominantColor(c.hex))
                .catch(() => setDominantColor('#121212'))
                .finally(() => fac.destroy());
        };
        img.onerror = () => setDominantColor('#121212');
    }, [coverUrl, songId]);

    return dominantColor;
};
