import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import MainOptionsView from './MainOptionsView';
import ArtistSelectionView from './ArtistSelectionView';

interface OptionsBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    song: any;
    onShare: () => void;
    onNavigate?: (Screen: string) => void;
}

type SheetView = 'OPTIONS' | 'ARTIST_SELECTION';

const OptionsBottomSheet = ({ isOpen, onClose, song, onShare, onNavigate }: OptionsBottomSheetProps) => {
    const [currentView, setCurrentView] = useState<SheetView>('OPTIONS');

    // --- LOGIC XỬ LÝ DỮ LIỆU ---
    const artistList = useMemo(() => {
        if (song.title === "Thằng Điên") {
            return [
                { id: 'justatee', name: 'JustaTee', avatar: 'https://tse1.explicit.bing.net/th/id/OIP.I547t6IIKHLCs7gshGWw0QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' },
                { id: 'phuongly', name: 'Phương Ly', avatar: 'https://th.bing.com/th/id/OIP.i2IqTwWWYeR0eQ9iHCBxAwHaJP?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' }
            ];
        }
        return [{ id: 'main', name: song.artist || 'Unknown', avatar: song.coverUrl }];
    }, [song]);

    // Reset view khi đóng mở
    useEffect(() => {
        if (isOpen) setCurrentView('OPTIONS');
    }, [isOpen]);

    // Hàm điều hướng chung
    const handleNavigateToArtist = (artistId: string) => {
        console.log(`Navigating to Artist ID: ${artistId}`);
        if (onNavigate) {
            // Bạn có thể log thêm artistId để kiểm tra xem đang chọn ai
            console.log("Selected Artist ID:", artistId);
            onNavigate('ARTIST');
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet Container */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info: PanInfo) => {
                    if (info.offset.y > 100 || info.velocity.y > 500) {
                        onClose();
                    }
                }}
                className="fixed bottom-0 left-0 right-0 z-[70] bg-zinc-900 rounded-t-[2rem] overflow-hidden flex flex-col max-h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1.5 bg-zinc-600 rounded-full" />
                </div>

                {/* Content Container - Switch Views Here */}
                <div className="flex-1 overflow-y-auto px-6 pb-12 pt-2 scrollbar-hide">

                    {currentView === 'OPTIONS' ? (
                        <MainOptionsView
                            song={song}
                            artistList={artistList}
                            onShare={() => {
                                onShare();
                                onClose();
                            }}
                            onRequestArtistSelection={() => setCurrentView('ARTIST_SELECTION')}
                            onNavigateToArtist={handleNavigateToArtist}
                        />
                    ) : (
                        <ArtistSelectionView
                            artists={artistList}
                            onBack={() => setCurrentView('OPTIONS')}
                            onSelectArtist={handleNavigateToArtist}
                        />
                    )}

                </div>
            </motion.div>
        </>
    );
};

export default OptionsBottomSheet;