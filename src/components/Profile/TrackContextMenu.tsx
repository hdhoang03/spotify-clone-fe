// components/Profile/TrackContextMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Heart, ListMusic, User, Disc, Share2, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import SongShareCard from '../MusicPlayer/SongShareCard'; // Import Share Card có sẵn
import api from '../../services/api';

interface TrackContextMenuProps {
    song: any;
    onClose: () => void;
    position: { x: number, y: number } | null;
    isOwner?: boolean;
    onRemoveFromPlaylist?: () => void;
}

const TrackContextMenu = ({ song, onClose, position, isOwner, onRemoveFromPlaylist }: TrackContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

    // Gọi API thêm bài hát
    const handleAddSong = async (playlistId: string) => {
        try {
            const songId = song.id || song.songId; // Dự phòng tên trường
            const res = await api.post(`/playlist/${playlistId}/add/${songId}`);
            if (res.data.code === 1000) {
                alert("Đã thêm bài hát vào playlist!");
                onClose();
            }
        } catch (error) {
            alert("Lỗi khi thêm bài hát!");
        }
    };

    // Click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (showShareCard) {
        return <SongShareCard song={song} isOpen={true} onClose={() => { setShowShareCard(false); onClose(); }} />;
    }

    // const style = position ? { top: position.y, left: position.x - 220 } : { right: 0, top: '100%' };

    const style: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
    if (position) {
        // Cố gắng hiển thị menu phía dưới bên trái con trỏ/nút bấm
        style.top = position.y;
        style.left = position.x - 250;
    }

    return (
        <div ref={menuRef} className="absolute z-50 bg-[#282828] border border-white/10 rounded-md shadow-2xl p-1 w-64 text-gray-200 text-sm animate-in fade-in zoom-in-95 duration-100" style={style}>

            <div
                className="relative"
                onMouseEnter={() => setShowPlaylistMenu(true)}
                onMouseLeave={() => setShowPlaylistMenu(false)}
            >
                <div className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm cursor-pointer group">
                    <div className="flex items-center gap-3"><Plus size={16} /> <span>Add to playlist</span></div>
                    <ChevronRight size={16} className="text-white/50 group-hover:text-white" />
                </div>

                {showPlaylistMenu && (
                    <div className="absolute right-full top-0 mr-1 w-56 bg-[#282828] text-white rounded-md shadow-2xl p-1 z-50 max-h-64 overflow-y-auto custom-scrollbar">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left font-bold">
                            <Plus size={16} /> <span>New playlist</span>
                        </button>
                        <div className="h-[1px] bg-white/10 my-1 mx-2" />

                        {isLoading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-white/50" size={16} /></div>
                        ) : (
                            myPlaylists.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleAddSong(p.id)}
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

            {isOwner && onRemoveFromPlaylist && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemoveFromPlaylist(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-sm text-left transition-colors"
                    >
                        <Trash2 size={16} /> <span>Xóa khỏi Playlist này</span>
                    </button>
                    <div className="h-[1px] bg-white/10 my-1 mx-2" />
                </>
            )}

            <MenuItem icon={<Heart size={16} />} label="Save to Liked Songs" />
            <MenuItem icon={<ListMusic size={16} />} label="Add to queue" />
            <div className="h-[1px] bg-white/10 my-1 mx-2" />
            <MenuItem icon={<User size={16} />} label="Go to artist" />
            <MenuItem icon={<Disc size={16} />} label="Go to album" />
            <div className="h-[1px] bg-white/10 my-1 mx-2" />
            <button onClick={() => setShowShareCard(true)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left"><Share2 size={16} /> <span>Share</span></button>
        </div>
    );
};

const MenuItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left">{icon} <span>{label}</span></button>
);

export default TrackContextMenu;