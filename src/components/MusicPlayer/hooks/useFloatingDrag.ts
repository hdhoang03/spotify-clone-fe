import { useState, useEffect, useRef, useMemo } from 'react';
import { useMotionValue } from 'framer-motion';

export const useFloatingDrag = () => {
    const savedDragPos = useMemo(() => {
        try {
            const raw = localStorage.getItem('floating-player-pos');
            return raw ? JSON.parse(raw) : { x: 0, y: 0 };
        } catch {
            return { x: 0, y: 0 };
        }
    }, []);

    const dragX = useMotionValue(savedDragPos.x);
    const dragY = useMotionValue(savedDragPos.y);
    const wasDragged = useRef(false);
    const [constraints, setConstraints] = useState({ left: -500, right: 500, top: -500, bottom: 50 });

    useEffect(() => {
        const updateConstraints = () => {
            const w = window.innerWidth, h = window.innerHeight;
            setConstraints({
                left: -(w / 2) + 150,
                right: (w / 2) - 150,
                top: -h + 150,
                bottom: 20
            });
        };

        const handleResize = () => {
            dragX.set(0);
            dragY.set(0);
            try {
                localStorage.removeItem('floating-player-pos');
            } catch { /* noop */ }
            updateConstraints();
        };

        updateConstraints();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dragX, dragY]);

    const handleDragStart = () => {
        wasDragged.current = false;
    };

    const handleDrag = () => {
        wasDragged.current = true;
    };

    const handleDragEnd = () => {
        const pos = { x: dragX.get(), y: dragY.get() };
        try {
            localStorage.setItem('floating-player-pos', JSON.stringify(pos));
        } catch { /* noop */ }
    };

    return {
        dragX,
        dragY,
        wasDragged,
        constraints,
        handleDragStart,
        handleDrag,
        handleDragEnd
    };
};
