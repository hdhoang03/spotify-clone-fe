import { useState, useMemo, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainOptionsView from './MainOptionsView';
import ArtistSelectionView from './ArtistSelectionView';
import PlaylistSelectionView from './PlaylistSelectionView';

interface OptionsBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onCollapse?: () => void;  // Thu gọn FullScreenPlayer khi navigate
    song: any;
    onShare: () => void;
    onNavigate?: (Screen: string) => void;
}

type SheetView = 'OPTIONS' | 'ARTIST_SELECTION' | 'PLAYLIST_SELECTION';

const OptionsBottomSheet = ({ isOpen, onClose, onCollapse, song, onShare, onNavigate }: OptionsBottomSheetProps) => {
    const [currentView, setCurrentView] = useState<SheetView>('OPTIONS');
    const navigate = useNavigate();

    // const artistList = useMemo(() => {
    //     if (song.title === "Thằng Điên") {
    //         return [
    //             { id: 'justatee', name: 'JustaTee', avatar: 'https://tse1.explicit.bing.net/th/id/OIP.I547t6IIKHLCs7gshGWw0QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3' },
    //             { id: 'phuongly', name: 'Phương Ly', avatar: 'https://th.bing.com/th/id/OIP.i2IqTwWWYeR0eQ9iHCBxAwHaJP?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' }
    //         ];
    //     }
    //     return [{ id: 'main', name: song.artist || 'Unknown', avatar: song.coverUrl }];
    // }, [song]);

    const artistList = useMemo(() => {
        if (!song) return [];
        
        const list: any[] = [];
        const mainArtistName = song.artist || song.artistName;
        
        if (mainArtistName) {
            list.push({
                id: song.artistId || `artist_main`,
                name: mainArtistName.trim(),
                avatar: song.artistAvatar || song.coverUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(mainArtistName.trim())}&background=random`
            });
        }
        
        if (song.featuredArtists && Array.isArray(song.featuredArtists)) {
            song.featuredArtists.forEach((feat: any, index: number) => {
                list.push({
                    id: feat.id || `feat_${index}`,
                    name: feat.name.trim(),
                    avatar: feat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(feat.name.trim())}&background=random`
                });
            });
        }

        return list;
    }, [song]);

    // Reset view khi đóng mở
    useEffect(() => {
        if (isOpen) setCurrentView('OPTIONS');
    }, [isOpen]);

    // Điều hướng đến trang nghệ sĩ (thư muộn FullScreenPlayer ẩn trước)
    const handleNavigateToArtist = (selectedArtistId: string) => {
        onClose();
        
        // Nếu chọn ID cụ thể (từ danh sách artistList)
        if (selectedArtistId && selectedArtistId !== 'artist_main' && !selectedArtistId.startsWith('feat_')) {
            onCollapse?.();
            setTimeout(() => {
                navigate(`/artist/${selectedArtistId}`);
            }, 300);
        } else if (song?.artistId) {
            // Fallback về nghệ sĩ chính
            onCollapse?.();
            setTimeout(() => {
                navigate(`/artist/${song.artistId}`);
            }, 300);
        } else {
            if (onNavigate) onNavigate('ARTIST');
        }
    };

    // Điều hướng đến trang album
    const handleNavigateToAlbum = () => {
        if (song?.albumId) {
            onClose();
            onCollapse?.();           // Thu FullScreenPlayer
            setTimeout(() => {
                navigate(`/albums/${song.albumId}`);
            }, 300);                  // Đợi animation collapse xong rồi mới navigate
        }
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
                {/* <div className="flex-1 overflow-y-auto px-6 pb-12 pt-2 scrollbar-hide">

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

                </div> */}

                <div className="flex-1 overflow-y-auto px-6 pb-12 pt-2 scrollbar-hide">
                    {currentView === 'OPTIONS' ? (
                        <MainOptionsView
                            song={song}
                            artistList={artistList}
                            onShare={() => { onShare(); onClose(); }}
                            onRequestArtistSelection={() => setCurrentView('ARTIST_SELECTION')}
                            onNavigateToArtist={handleNavigateToArtist}
                            onNavigateToAlbum={handleNavigateToAlbum}
                            onRequestPlaylistSelection={() => setCurrentView('PLAYLIST_SELECTION')}
                        />
                    ) : currentView === 'ARTIST_SELECTION' ? (
                        <ArtistSelectionView
                            artists={artistList}
                            onBack={() => setCurrentView('OPTIONS')}
                            onSelectArtist={handleNavigateToArtist}
                        />
                    ) : (
                        <PlaylistSelectionView
                            songId={song.id || song.songId}
                            onBack={() => setCurrentView('OPTIONS')}
                            onClose={onClose}
                        />
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default memo(OptionsBottomSheet);