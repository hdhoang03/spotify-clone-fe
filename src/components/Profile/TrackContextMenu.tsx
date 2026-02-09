// components/Profile/TrackContextMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Heart, ListMusic, User, Disc, Share2, ChevronRight } from 'lucide-react';
import SongShareCard from '../MusicPlayer/SongShareCard'; // Import Share Card có sẵn

interface TrackContextMenuProps {
    song: any;
    onClose: () => void;
    position: { x: number, y: number } | null;
}

const TrackContextMenu = ({ song, onClose, position }: TrackContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);

    // Mock Playlists
    const myPlaylists = [{ id: '1', name: 'Nhạc Chill' }, { id: '2', name: 'Code Java' }];

    // Click outside để đóng
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

    const style = position ? { top: position.y, left: position.x - 220 } : { right: 0, top: '100%' };

    return (
        <div ref={menuRef} className="absolute z-50 bg-[#282828] border border-white/10 rounded-md shadow-2xl p-1 w-64 text-gray-200 text-sm animate-in fade-in zoom-in-95 duration-100" style={style}>

            {/* 1. Add to Playlist (Nested) */}
            <div className="relative group" onMouseEnter={() => setShowPlaylistMenu(true)} onMouseLeave={() => setShowPlaylistMenu(false)}>
                <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left">
                    <div className="flex items-center gap-3"><Plus size={16} /> <span>Add to playlist</span></div>
                    <ChevronRight size={16} />
                </button>
                {showPlaylistMenu && (
                    <div className="absolute top-0 right-full mr-1 w-56 bg-[#282828] border border-white/10 rounded-md shadow-xl p-1">
                        <div className="p-2 border-b border-white/10 sticky top-0 bg-[#282828]"><input type="text" placeholder="Find a playlist" className="w-full bg-[#3e3e3e] text-white text-xs py-1.5 px-2 rounded outline-none" /></div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#3e3e3e] rounded-sm text-left"><Plus size={16} /> <span>New playlist</span></button>
                        {myPlaylists.map(p => (
                            <button key={p.id} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#3e3e3e] rounded-sm text-left truncate"><ListMusic size={16} /> <span>{p.name}</span></button>
                        ))}
                    </div>
                )}
            </div>

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