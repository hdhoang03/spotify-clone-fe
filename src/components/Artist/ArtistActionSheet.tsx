// components/Artist/ArtistActionSheet.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ban, Flag, Share2, Copy } from 'lucide-react';
import { createPortal } from "react-dom";

interface ArtistActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    artistName: string;
    artistImage: string;
}

const ArtistActionSheet = ({ isOpen, onClose, artistName, artistImage }: ArtistActionSheetProps) => {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay: Giữ nguyên */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[100] md:hidden"
                    />
                    
                    {/* Sheet: Sửa lại class định vị */}
                    <motion.div 
                        initial={{ y: "100vh" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100vh" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }} 
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) onClose();
                        }}

                        /* FIX QUAN TRỌNG: 
                           1. Loại bỏ các class flex không cần thiết ở container cha.
                           2. Dùng h-fit để nó chỉ cao bằng nội dung bên trong.
                           3. Dùng pb-safe để tránh bị đè bởi thanh điều hướng iPhone (Home indicator).
                        */
                        className="fixed bottom-0 left-0 right-0 z-[101] md:hidden
                                   bg-white dark:bg-[#282828] 
                                   rounded-t-[16px] overflow-hidden shadow-[0_-8px_30px_rgb(0,0,0,0.3)]
                                   h-auto max-h-[85vh] flex flex-col"
                    >
                        {/* Tay cầm kéo */}
                        <div className="w-full flex justify-center py-3 touch-none">
                            <div className="w-9 h-1.5 bg-zinc-300 dark:bg-white/20 rounded-full" />
                        </div>

                        {/* Content Header: Thêm padding-bottom rõ ràng */}
                        <div className="px-6 pb-4 flex items-center gap-4 border-b border-zinc-100 dark:border-white/5">
                            <div className="w-14 h-14 flex-shrink-0 bg-zinc-200 dark:bg-zinc-800 rounded shadow-md overflow-hidden">
                                <img 
                                    src={artistImage || "https://tse1.explicit.bing.net/th/id/OIP.6Su3LVudXp80ED9_-cy7TgHaLY?rs=1&pid=ImgDetMain&o=7&rm=3" } 
                                    alt={artistName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white truncate">
                                    {artistName || "Phương Ly" }
                                </h2>
                                <span className="text-sm text-zinc-500">Artist</span>
                            </div>
                        </div>

                        {/* Menu Items: Đảm bảo có khoảng trống cuối cùng */}
                        <div className="pt-2 pb-20 overflow-y-auto">
                            <SheetItem icon={<Ban size={22}/>} label="Don't play this artist" />
                            <SheetItem icon={<Flag size={22}/>} label="Report" />
                            <div className="h-[1px] bg-zinc-100 dark:bg-white/5 my-2 mx-6"/>
                            <SheetItem icon={<Share2 size={22}/>} label="Share" />
                            <SheetItem icon={<Copy size={22}/>} label="Copy link to artist" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

const SheetItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="w-full flex items-center gap-4 px-6 py-4 text-[16px] font-semibold
                      text-zinc-800 dark:text-white/90 active:bg-zinc-100 dark:active:bg-white/10 transition-colors">
        <span className="text-zinc-500 dark:text-zinc-400">{icon}</span>
        <span>{label}</span>
    </button>
);

export default ArtistActionSheet;