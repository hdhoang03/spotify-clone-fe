// // src/components/PlaylistDetail/PlaylistTrackList.tsx
// import { Play, Clock, MoreVertical, Calendar } from 'lucide-react';

// // Hàm format thời gian (ví dụ 225s -> 3:45)
// const formatDuration = (seconds: number) => {
//     if (!seconds) return '0:00';
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s < 10 ? '0' : ''}${s}`;
// };

// // Hàm format ngày
// const formatDate = (dateString?: string) => {
//     if (!dateString) return 'Vừa thêm';
//     return new Date(dateString).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' });
// };

// const PlaylistTrackList = ({ songs }: { songs: any[] }) => {
//     return (
//         <div className="px-4 md:px-8 relative z-10">
//             {/* Header Cột: Responsive Grid */}
//             <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[32px_minmax(120px,_4fr)_2fr_minmax(80px,_1fr)] lg:grid-cols-[32px_minmax(120px,_4fr)_2fr_2fr_minmax(80px,_1fr)] gap-3 md:gap-4 px-2 md:px-4 py-2 border-b border-zinc-200 dark:border-white/10 text-sm text-zinc-500 dark:text-zinc-400 mb-4 sticky top-16 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md z-20">
//                 <div className="text-center w-8 hidden md:block">#</div>
//                 <div className="md:hidden"></div> {/* Spacer cho khoảng trống ảnh bìa mobile */}
//                 <div>Tiêu đề</div>
//                 <div className="hidden md:block">Album</div>
//                 <div className="hidden lg:flex items-center gap-1"><Calendar size={14} /> Ngày thêm</div>
//                 <div className="flex justify-end"><Clock size={16} /></div>
//             </div>

//             {/* Danh sách */}
//             <div className="space-y-1">
//                 {songs.map((song, index) => (
//                     <div key={song.id} className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[32px_minmax(120px,_4fr)_2fr_minmax(80px,_1fr)] lg:grid-cols-[32px_minmax(120px,_4fr)_2fr_2fr_minmax(80px,_1fr)] gap-3 md:gap-4 px-2 md:px-4 py-2 md:py-3 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-md group items-center text-sm transition-colors">

//                         {/* Cột 1: STT / Icon Play (Ẩn số trên mobile cho gọn) */}
//                         <div className="text-center text-zinc-500 dark:text-zinc-400 relative w-8 hidden md:block">
//                             <span className="group-hover:hidden">{index + 1}</span>
//                             <Play size={14} fill="currentColor" className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-white cursor-pointer" />
//                         </div>

//                         {/* Cột 2: Ảnh + Tên bài hát */}
//                         <div className="flex items-center gap-3 overflow-hidden">
//                             <img src={song.coverUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 md:w-12 md:h-12 rounded-sm object-cover shrink-0" alt="cover" />
//                             <div className="truncate flex-1">
//                                 <div className="text-zinc-900 dark:text-white font-medium truncate cursor-pointer hover:underline text-base md:text-sm">{song.title}</div>
//                                 <div className="text-zinc-500 dark:text-zinc-400 text-xs truncate cursor-pointer hover:underline mt-0.5">{song.artist}</div>
//                             </div>
//                         </div>

//                         {/* Cột 3: Album (Ẩn trên Mobile) */}
//                         <div className="hidden md:block text-zinc-500 dark:text-zinc-400 truncate hover:underline cursor-pointer">{song.albumName || 'Single'}</div>

//                         {/* Cột 4: Ngày thêm (Ẩn trên Mobile & Tablet) */}
//                         <div className="hidden lg:block text-zinc-500 dark:text-zinc-400 truncate">{formatDate(song.addedAt)}</div>

//                         {/* Cột 5: Thời gian / Nút mở rộng (Mobile) */}
//                         <div className="flex items-center justify-end gap-3 text-zinc-500 dark:text-zinc-400">
//                             <span className="font-mono text-xs md:text-sm">{formatDuration(song.duration)}</span>
//                             {/* Nút 3 chấm phụ cho bài hát (chỉ hiện trên mobile thay vì phải hover) */}
//                             <button className="md:hidden p-2 -mr-2">
//                                 <MoreVertical size={18} />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//                 {songs.length === 0 && <div className="text-center text-zinc-500 py-10">Chưa có bài hát nào trong Playlist này. Hãy thêm bài hát nhé!</div>}
//             </div>
//         </div>
//     );
// };

// export default PlaylistTrackList;


// src/components/PlaylistDetail/PlaylistTrackList.tsx
import { useState } from 'react';
import { Play, Clock, Calendar, MoreHorizontal } from 'lucide-react';
import TrackContextMenu from '../Profile/TrackContextMenu';
import { playlistApi } from './playlistApi';

interface PlaylistTrackListProps {
    songs: any[];
    playlistId?: string;
    isOwner?: boolean;
    onPlaySong: (index: number) => void;
    onRemoveSuccess?: () => void; // Gọi lại hàm refetch để làm mới list sau khi xóa
}

// Hàm format thời gian và làm tròn số
const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const roundedSeconds = Math.round(seconds);
    const m = Math.floor(roundedSeconds / 60);
    const s = roundedSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Vừa thêm';
    return new Date(dateString).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PlaylistTrackList = ({ songs, playlistId, isOwner = true, onPlaySong, onRemoveSuccess }: PlaylistTrackListProps) => {
    // Quản lý state cho Context Menu
    const [contextMenu, setContextMenu] = useState<{ song: any, x: number, y: number } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, song: any) => {
        e.preventDefault(); // Ngăn menu mặc định của trình duyệt
        e.stopPropagation();
        setContextMenu({
            song,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleOptionsClick = (e: React.MouseEvent, song: any) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm phát nhạc

        // Tính toán vị trí mở menu từ icon ba chấm
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setContextMenu({
            song,
            x: rect.right,
            y: rect.bottom
        });
    };

    const handleRemoveSong = async (songId: string) => {
        if (!playlistId) return;
        try {
            const res = await playlistApi.removeSong(playlistId, songId);
            if (res.data.code === 1000) {
                alert("Đã xóa bài hát khỏi playlist!");
                if (onRemoveSuccess) onRemoveSuccess(); // Refresh lại danh sách
            }
        } catch (error) {
            console.error("Lỗi xóa bài hát:", error);
            alert("Không thể xóa bài hát!");
        }
    };

    return (
        <div className="px-4 md:px-8 relative z-10" onClick={() => setContextMenu(null)}>
            {/* Header Cột */}
            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[32px_minmax(120px,_4fr)_2fr_minmax(80px,_1fr)_40px] lg:grid-cols-[32px_minmax(120px,_4fr)_2fr_2fr_minmax(80px,_1fr)_40px] gap-3 md:gap-4 px-2 md:px-4 py-2 border-b border-zinc-200 dark:border-white/10 text-sm text-zinc-500 dark:text-zinc-400 mb-4 sticky top-16 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md z-20">
                <div className="text-center w-8 hidden md:block">#</div>
                <div className="md:hidden"></div>
                <div>Tiêu đề</div>
                <div className="hidden md:block">Album</div>
                <div className="hidden lg:flex items-center gap-1"><Calendar size={14} /> Ngày thêm</div>
                <div className="flex justify-end"><Clock size={16} /></div>
                <div className="w-10"></div> {/* Cột trống cho nút ba chấm */}
            </div>

            {/* Danh sách bài hát */}
            <div className="space-y-1">
                {songs.map((song, index) => (
                    <div
                        key={`${song.id}-${index}`}
                        className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[32px_minmax(120px,_4fr)_2fr_minmax(80px,_1fr)_40px] lg:grid-cols-[32px_minmax(120px,_4fr)_2fr_2fr_minmax(80px,_1fr)_40px] gap-3 md:gap-4 px-2 md:px-4 py-2 md:py-3 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-md group items-center text-sm transition-colors cursor-pointer"
                        onContextMenu={(e) => handleContextMenu(e, song)}
                        onClick={() => onPlaySong(index)} // Phát nhạc khi click vào dòng
                    >

                        {/* Cột 1: STT / Icon Play */}
                        <div className="text-center text-zinc-500 dark:text-zinc-400 relative w-8 hidden md:block">
                            <span className="group-hover:hidden">{index + 1}</span>
                            <Play size={14} fill="currentColor" className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-white" />
                        </div>

                        {/* Cột 2: Ảnh + Tên bài hát */}
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img src={song.coverUrl || 'https://via.placeholder.com/40'} className="w-10 h-10 md:w-12 md:h-12 rounded-sm object-cover shrink-0" alt="cover" />
                            <div className="truncate flex-1">
                                <div className="text-zinc-900 dark:text-white font-medium truncate group-hover:underline text-base md:text-sm">{song.title}</div>
                                <div className="text-zinc-500 dark:text-zinc-400 text-xs truncate mt-0.5">{song.artist}</div>
                            </div>
                        </div>

                        {/* Cột 3: Album */}
                        <div className="hidden md:block text-zinc-500 dark:text-zinc-400 truncate hover:underline">{song.albumName || 'Single'}</div>

                        {/* Cột 4: Ngày thêm */}
                        <div className="hidden lg:block text-zinc-500 dark:text-zinc-400 truncate">{formatDate(song.addedAt)}</div>

                        {/* Cột 5: Thời gian */}
                        <div className="flex items-center justify-end text-zinc-500 dark:text-zinc-400">
                            <span className="font-mono text-xs md:text-sm">{formatDuration(song.duration)}</span>
                        </div>

                        {/* Cột 6: Nút 3 chấm (More Options) */}
                        <div className="flex justify-center text-zinc-500 dark:text-zinc-400">
                            <button
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-black dark:hover:text-white transition-opacity p-2"
                                onClick={(e) => handleOptionsClick(e, song)}
                            >
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {songs.length === 0 && <div className="text-center text-zinc-500 py-10">Chưa có bài hát nào trong Playlist này. Hãy thêm bài hát nhé!</div>}
            </div>

            {/* Render Context Menu nếu có */}
            {contextMenu && (
                <TrackContextMenu
                    song={contextMenu.song}
                    position={{ x: contextMenu.x, y: contextMenu.y }}
                    onClose={() => setContextMenu(null)}
                    isOwner={isOwner}
                    onRemoveFromPlaylist={() => {
                        handleRemoveSong(contextMenu.song.id);
                        setContextMenu(null);
                    }}
                />
            )}
        </div>
    );
};

export default PlaylistTrackList;