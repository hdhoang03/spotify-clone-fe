import React from 'react';
import { ChevronDown, MoreHorizontal, Share2 } from 'lucide-react';
import { DragControls } from 'framer-motion';

interface PlayerHeaderProps {
    onCollapse: () => void;
    onShare: () => void;
    onMoreOptions: () => void;
    dragControls: DragControls; // Nhận controls từ cha truyền xuống
}

const PlayerHeader = ({ onCollapse, onShare, dragControls, onMoreOptions }: PlayerHeaderProps) => {
    return (
        <div 
            className="sticky top-0 z-10 flex justify-between items-center p-4 pt-12 md:pt-6 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
            style={{ touchAction: "none" }}
        >
            <button 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onCollapse}
                className="p-2 hover:bg-white/10 rounded-full transition"
            >
                <ChevronDown size={24} />
            </button>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full mt-2 md:mt-0" />

            <div className="text-center">
                <p className="text-xs font-bold tracking-widest uppercase opacity-70">Đang phát từ Playlist</p>
                <p className="text-xs font-bold">Dành cho bạn</p>
            </div>

            <button 
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={onMoreOptions} 
                className="p-2 hover:bg-white/10 rounded-full transition text-white"
            >
                <MoreHorizontal size={24} />
            </button>
        </div>
    );
};

export default React.memo(PlayerHeader);