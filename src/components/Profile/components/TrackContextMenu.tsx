import React, { useState, useRef, useEffect } from 'react';
import { Plus, Heart, ListMusic, User, Disc, Share2, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import SongShareCard from '../../MusicPlayer/shared/SongShareCard';
import PlaylistModal from '../../Sidebar/PlaylistModal';
import { createPortal } from 'react-dom';
import api from '../../../services/api';
import { useLikeSong } from '../../../hooks/useLikeSong';
import { useTranslation } from 'react-i18next';
import { usePlaylistStore } from '../../../stores/usePlaylistStore';

interface TrackContextMenuProps {
    song: any;
    onClose: () => void;
    position: { x: number, y: number } | null;
    isOwner?: boolean;
    onRemoveFromPlaylist?: () => void;
    onNavigateToArtist?: (artistId: string) => void;
    onNavigateToAlbum?: (albumId: string) => void;
}

const TrackContextMenu = ({ song, onClose, position, isOwner, onRemoveFromPlaylist, onNavigateToArtist, onNavigateToAlbum }: TrackContextMenuProps) => {
    const { t } = useTranslation();
    const { addPlaylist } = usePlaylistStore();
    const menuRef = useRef<HTMLDivElement>(null);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { isLiked, toggleLike } = useLikeSong(song?.id);

    // --- 1. SỬA LỖI HOVER BỊ ẨN SỚM (Debounce/Delay) ---
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShowPlaylistMenu(true);
    };

    const handleMouseLeave = () => {
        // Đợi 300ms rồi mới đóng, giúp người dùng có thời gian lia chuột chéo qua
        timeoutRef.current = setTimeout(() => {
            setShowPlaylistMenu(false);
        }, 300);
    };

    // --- 2. XỬ LÝ CLICK DÀNH CHO MOBILE ---
    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowPlaylistMenu(prev => !prev);
    };

    useEffect(() => {
        if (showPlaylistMenu) {
            const fetchPlaylists = async () => {
                setIsLoading(true);
                try {
                    const res = await api.get('/playlist/my', { params: { page: 1, size: 50 } });
                    if (res.data.code === 1000) {
                        setMyPlaylists(res.data.result.content || []);
                    }
                } catch (error) {
                    console.error("Lỗi lấy danh sách playlist:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPlaylists();
        }
    }, [showPlaylistMenu]);

    const handleAddSong = async (e: React.MouseEvent, playlistId: string) => {
        e.stopPropagation(); // 3. CHẶN CLICK XUYÊN THỦNG XUỐNG DƯỚI
        try {
            const songId = song.id || song.songId;
            const res = await api.post(`/playlist/${playlistId}/add/${songId}`);
            if (res.data.code === 1000) {
                alert(t('player.add_success'));
                onClose();
            }
        } catch (error) {
            alert(t('player.add_fail'));
        }
    };

    const handleCreatePlaylist = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const res = await api.post('/playlist/create', formData);
            if (res.data.code === 1000) {
                const newPlaylist = res.data.result;
                const newPlaylistId = newPlaylist.id;
                addPlaylist(newPlaylist);
                
                // Add song to this new playlist
                const songId = song?.id || song?.songId;
                if (songId) {
                    await api.post(`/playlist/${newPlaylistId}/add/${songId}`);
                    alert(t('player.add_success'));
                }
                setIsCreateModalOpen(false);
                onClose();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi tạo playlist:", error);
            alert(t('player.add_fail'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Click outside để đóng toàn bộ Menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.closest('.track-menu-trigger')) {
                // Click vào bất kỳ nút 3 chấm nào -> bỏ qua, để onClick tự xử lý
                return;
            }
            if (menuRef.current && !menuRef.current.contains(target)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Cuộn trang quá 20px để tự ẩn Menu
    useEffect(() => {
        const scrollStates = new Map<EventTarget, { top: number; left: number }>();

        const handleScroll = (e: Event) => {
            const target = e.target;
            if (!target) return;

            let currentTop = 0;
            let currentLeft = 0;

            if (target === document || target === window) {
                currentTop = window.scrollY || window.pageYOffset || 0;
                currentLeft = window.scrollX || window.pageXOffset || 0;
            } else if (target instanceof Element) {
                currentTop = target.scrollTop;
                currentLeft = target.scrollLeft;
            }

            if (!scrollStates.has(target)) {
                scrollStates.set(target, { top: currentTop, left: currentLeft });
            } else {
                const start = scrollStates.get(target)!;
                const diffY = Math.abs(currentTop - start.top);
                const diffX = Math.abs(currentLeft - start.left);
                if (diffY > 20 || diffX > 20) {
                    onClose();
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });
    }, [onClose]);

    if (showShareCard) {
        return <SongShareCard song={song} isOpen={true} onClose={() => { setShowShareCard(false); onClose(); }} />;
    }

    if (isCreateModalOpen) {
        return <PlaylistModal 
            isOpen={true} 
            onClose={() => { setIsCreateModalOpen(false); onClose(); }} 
            onSubmit={handleCreatePlaylist} 
            isLoading={isLoading} 
        />;
    }

    const style: React.CSSProperties = { position: 'fixed', zIndex: 999999 }; // Tăng Z-index kịch kim
    if (position) {
        const isMobile = window.innerWidth <= 768;
        const menuHeight = 350; // Ước lượng chiều cao tối đa của menu

        // 1. CHỐNG TRÀN VIỀN DƯỚI: Nếu tọa độ Y + chiều cao menu vượt quá màn hình -> Đẩy menu lên trên
        if (position.y + menuHeight > window.innerHeight) {
            style.bottom = `${window.innerHeight - position.y + 10}px`;
            style.top = 'auto';
        } else {
            style.top = `${position.y - 10}px`;
            style.bottom = 'auto';
        }

        // Căn lề trái phải
        if (isMobile) {
            style.left = 'auto';
            style.right = '20px';
        } else {
            style.left = `${position.x - 260}px`;
        }
    }

    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const isLikedSongsPage = window.location.pathname.includes('/collection/tracks');

    // 🌟 Hàm xử lý khi click "Go to artist"
    const handleGoToArtist = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Lấy artistId từ object song
        const artistId = song?.artist?.id || song?.artistId;
        if (!artistId) {
            alert(t('player.already_on_artist'));
            return;
        }

        // Kiểm tra nếu URL hiện tại đã là trang của nghệ sĩ này rồi
        const isCurrentArtistPage = window.location.pathname === `/artist/${artistId}`;

        if (isCurrentArtistPage) {
            onClose(); // Đang ở đúng trang rồi thì chỉ cần đóng menu lại, không điều hướng nữa
        } else if (onNavigateToArtist) {
            onNavigateToArtist(artistId);
            onClose();
        }
    };

    // 🌟 Hàm xử lý khi click "Go to album"
    const handleGoToAlbum = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Lấy albumId từ object song
        const albumId = song?.album?.id || song?.albumId;
        if (!albumId) {
            alert(t('player.no_album'));
            return;
        }

        // Kiểm tra nếu URL hiện tại đã là trang của album này rồi
        const isCurrentAlbumPage = window.location.pathname === `/album/${albumId}`;

        if (isCurrentAlbumPage) {
            onClose(); // Đang ở đúng trang album rồi thì đóng menu
        } else if (onNavigateToAlbum) {
            onNavigateToAlbum(albumId);
            onClose();
        }
    };

    return createPortal(
        <div
            ref={menuRef}
            onClick={handleContainerClick} // CHẶN CLICK Ở CẤP CAO NHẤT CỦA MENU
            className="absolute bg-[#282828] border border-white/10 rounded-md shadow-2xl p-1 w-64 text-gray-200 text-sm animate-in fade-in zoom-in-95 duration-100"
            style={style}
        >
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    onClick={handleMenuClick} // Bấm để đóng mở trên điện thoại
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm cursor-pointer group"
                >
                    <div className="flex items-center gap-3"><Plus size={16} /> <span>{t('player.add_to_playlist')}</span></div>
                    <ChevronRight size={16} className="text-white/50 group-hover:text-white" />
                </div>

                {showPlaylistMenu && (
                    <div className="absolute right-full top-0 mr-1 w-56 bg-[#282828] text-white rounded-md shadow-2xl p-1 z-[999999] max-h-64 overflow-y-auto custom-scrollbar md:right-full md:left-auto max-md:left-0 max-md:top-full max-md:mt-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left font-bold"
                        >
                            <Plus size={16} /> <span>{t('player.create_new_playlist')}</span>
                        </button>
                        <div className="h-[1px] bg-white/10 my-1 mx-2" />

                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-white/50" size={16} /></div>
                        ) : (
                            myPlaylists.map(p => (
                                <button
                                    key={p.id}
                                    onClick={(e) => handleAddSong(e, p.id)} // Truyền Event e vào để gọi stopPropagation
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#3e3e3e] rounded-sm text-left truncate"
                                >
                                    <ListMusic size={16} className="shrink-0" />
                                    <span className="truncate">{p.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {isOwner && onRemoveFromPlaylist && !isLikedSongsPage && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemoveFromPlaylist(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-sm text-left transition-colors"
                    >
                        <Trash2 size={16} /> <span>{t('player.remove_from_playlist')}</span>
                    </button>
                    <div className="h-[1px] bg-white/10 my-1 mx-2" />
                </>
            )}

            <MenuItem
                icon={<Heart size={16} className={isLiked ? "text-primary-500 fill-primary-500" : ""} />}
                label={isLiked ? t('player.remove_from_liked') : t('player.save_to_liked')}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(); // Gọi hàm toggleLike
                }}
            />
            {/* <MenuItem icon={<ListMusic size={16} />} label="Add to queue" onClick={(e) => { e.stopPropagation(); }} /> */}
            <div className="h-[1px] bg-white/10 my-1 mx-2" />
            {/* 🌟 CẬP NHẬT SỰ KIỆN CLICK CHO ARTIST */}
            <MenuItem
                icon={<User size={16} />}
                label={t('player.view_artist')}
                onClick={handleGoToArtist}
            />

            {/* 🌟 CẬP NHẬT SỰ KIỆN CLICK CHO ALBUM */}
            <MenuItem
                icon={<Disc size={16} />}
                label={t('player.view_album')}
                onClick={handleGoToAlbum}
            />
            <div className="h-[1px] bg-white/10 my-1 mx-2" />
            <button
                onClick={(e) => { e.stopPropagation(); setShowShareCard(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left"
            >
                <Share2 size={16} /> <span>{t('player.share')}</span>
            </button>
        </div>,
        document.body
    );
};

const MenuItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left"
    >
        {icon} <span>{label}</span>
    </button>
);

export default TrackContextMenu;
