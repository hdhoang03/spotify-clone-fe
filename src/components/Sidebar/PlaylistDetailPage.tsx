// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import { usePlaylistDetail } from './usePlaylistDetail';
// import { playlistApi } from './playlistApi';
// import PlaylistModal from './PlaylistModal';
// import { useMusic } from '../../contexts/MusicContent';
// import PlaylistHero from './PlaylistHero';
// import PlaylistActionBar from './PlaylistActionBar';
// import PlaylistTrackList from './PlaylistTrackList';
// import { usePlaylistStore } from '../../stores/usePlaylistStore';

// const PlaylistDetailPage = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     // Lấy thêm isLoadingSongs, hasMore, loadMoreSongs từ hook mới
//     const { playlist, songs, isLoading, isLoadingSongs, hasMore, loadMoreSongs, handleUpdate, refetch } = usePlaylistDetail(id);

//     const { playPlaylist } = useMusic();
//     const removePlaylist = usePlaylistStore(state => state.removePlaylist);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [dominantColor, setDominantColor] = useState('#535353');
//     const [isDeleting, setIsDeleting] = useState(false);

//     if (isDeleting) return <div className="h-screen bg-white dark:bg-[#121212] flex items-center justify-center text-white">Đang xử lý...</div>;
//     if (isLoading) return <div className="h-screen bg-white dark:bg-[#121212] flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2" /> Đang tải...</div>;
//     if (!playlist) return <div className="h-screen bg-white dark:bg-[#121212] flex items-center justify-center text-white">Không tìm thấy Playlist</div>;

//     const isOwner = true; // TODO: So sánh userId hiện tại với playlist.user.id

//     const handleDeletePlaylist = async () => {
//         if (window.confirm("Bạn có chắc chắn muốn xóa danh sách phát này không?")) {
//             try {
//                 if (!id) return;
//                 setIsDeleting(true);
//                 const res = await playlistApi.deletePlaylist(id);

//                 if (res.data.code === 1000) {
//                     removePlaylist(id);
//                     navigate('/library');
//                 } else {
//                     console.warn("API trả về code không phải 1000:", res.data.code);
//                     setIsDeleting(false);
//                 }
//             } catch (error) {
//                 setIsDeleting(false);
//                 console.error("Lỗi xóa playlist:", error);
//                 alert("Xóa thất bại!");
//             }
//         }
//     };

//     const handlePlaySongAtIndex = (index: number) => {
//         if (songs && songs.length > 0) {
//             playPlaylist(songs, index);
//         }
//     };

//     const handlePlayPlaylist = () => {
//         if (songs && songs.length > 0) {
//             playPlaylist(songs, 0);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-white dark:bg-[#121212] relative overflow-hidden">
//             <div
//                 className="absolute top-0 left-0 w-full h-[500px] transition-colors duration-1000 opacity-30 dark:opacity-50"
//                 style={{ background: `linear-gradient(to bottom, ${dominantColor} 0%, transparent 100%)` }}
//             />

//             <div className="p-4 md:hidden relative z-10">
//                 <button onClick={() => navigate(-1)} className="p-2 bg-black/10 dark:bg-black/50 rounded-full text-black dark:text-white hover:scale-105 transition"><ArrowLeft size={24} /></button>
//             </div>

//             <div className="pt-2">
//                 <PlaylistHero
//                     playlist={playlist}
//                     songs={songs}
//                     isOwner={isOwner}
//                     onEditClick={() => setIsEditModalOpen(true)}
//                     onColorExtracted={setDominantColor}
//                 />

//                 <PlaylistActionBar
//                     isOwner={isOwner}
//                     onEditClick={() => setIsEditModalOpen(true)}
//                     onDeleteClick={handleDeletePlaylist}
//                     onPlayClick={handlePlayPlaylist}
//                 />

//                 <PlaylistTrackList
//                     songs={songs}
//                     playlistId={playlist.id}
//                     isOwner={isOwner}
//                     onPlaySong={handlePlaySongAtIndex}
//                     onRemoveSuccess={() => {
//                         refetch();
//                     }}
//                 />

//                 {/* Nút Phân trang (Load More) */}
//                 {hasMore && (
//                     <div className="flex justify-center pb-32 pt-4 relative z-10">
//                         <button
//                             onClick={loadMoreSongs}
//                             disabled={isLoadingSongs}
//                             className="px-6 py-2 border border-zinc-400 dark:border-zinc-500 rounded-full text-zinc-700 dark:text-zinc-300 hover:text-black hover:border-black dark:hover:text-white dark:hover:border-white transition flex items-center gap-2"
//                         >
//                             {isLoadingSongs ? <Loader2 size={16} className="animate-spin" /> : null}
//                             {isLoadingSongs ? 'Đang tải...' : 'Xem thêm'}
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <PlaylistModal
//                 isOpen={isEditModalOpen}
//                 onClose={() => setIsEditModalOpen(false)}
//                 onSubmit={async (formData) => {
//                     const success = await handleUpdate(formData);
//                     if (success) {
//                         setIsEditModalOpen(false);
//                     }
//                     return success;
//                 }}
//                 initialData={{
//                     name: playlist.name,
//                     description: playlist.description,
//                     isPublic: playlist.isPublic,
//                     coverUrl: playlist.coverUrl
//                 }}
//             />
//         </div>
//     );
// };

// export default PlaylistDetailPage;

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Play } from 'lucide-react';
import { usePlaylistDetail } from './usePlaylistDetail';
import { playlistApi } from './playlistApi';
import PlaylistModal from './PlaylistModal';
import { useMusic } from '../../contexts/MusicContent';
import PlaylistHero from './PlaylistHero';
import PlaylistActionBar from './PlaylistActionBar';
import PlaylistTrackList from './PlaylistTrackList';
import { usePlaylistStore } from '../../stores/usePlaylistStore';

const PlaylistDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 1. Lấy dữ liệu từ hook (bao gồm cả logic phân trang bài hát)
    const {
        playlist,
        songs,
        isLoading,
        isLoadingSongs,
        hasMore,
        loadMoreSongs,
        handleUpdate,
        refetch
    } = usePlaylistDetail(id);

    const { playPlaylist } = useMusic();
    const removePlaylist = usePlaylistStore(state => state.removePlaylist);

    // States cho giao diện
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [dominantColor, setDominantColor] = useState('#535353'); // Màu mặc định trích xuất từ ảnh[cite: 108]
    const [isDeleting, setIsDeleting] = useState(false);
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

    // Refs để theo dõi vị trí cuộn trang
    const heroRef = useRef<HTMLDivElement>(null);

    // 2. Hiệu ứng Sticky Header: Hiện thanh điều khiển thu nhỏ khi cuộn qua Hero
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Hiện sticky bar khi Hero KHÔNG còn hiển thị trong khung nhìn
                setIsStickyBarVisible(!entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: "-80px 0px 0px 0px" // Kích hoạt khi gần chạm tới mép trên
            }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, [isLoading]);

    if (isDeleting) return <div className="h-screen bg-white dark:bg-[#121212] flex items-center justify-center text-zinc-900 dark:text-white">Đang xử lý...</div>;
    if (isLoading) return <div className="h-screen bg-white dark:bg-[#121212] flex items-center justify-center text-zinc-900 dark:text-white"><Loader2 className="animate-spin mr-2" /> Đang tải...</div>;
    if (!playlist) return <div className="h-screen bg-white dark:bg-[#121212] flex items-center justify-center text-zinc-900 dark:text-white">Không tìm thấy Playlist</div>;

    // const isOwner = true; // TODO: Logic so sánh userId hiện tại với playlist.user.id

    const handleDeletePlaylist = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh sách phát này không?")) {
            try {
                if (!id) return;
                setIsDeleting(true);
                const res = await playlistApi.deletePlaylist(id);

                if (res.data.code === 1000) {
                    removePlaylist(id);
                    navigate('/library');
                } else {
                    setIsDeleting(false);
                }
            } catch (error) {
                setIsDeleting(false);
                console.error("Lỗi xóa playlist:", error);
                alert("Xóa thất bại!");
            }
        }
    };

    const handlePlaySongAtIndex = (index: number) => {
        if (songs && songs.length > 0) {
            playPlaylist(songs, index);
        }
    };

    const handlePlayPlaylist = () => {
        if (songs && songs.length > 0) {
            playPlaylist(songs, 0);
        }
    };

    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    // 2. So sánh ID để xác định quyền sở hữu[cite: 113]
    // Lưu ý: playlist.user.id là ID trả về từ API[cite: 108]
    const isOwner = currentUser?.id === playlist?.user?.id;

    if (isLoading) return <div>Đang tải...</div>;
    if (!playlist) return <div>Không tìm thấy Playlist</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-[#121212] relative overflow-hidden transition-colors duration-500">

            {/* Lớp nền Gradient lấy màu từ ảnh bìa[cite: 108] */}
            <div
                className="absolute top-0 left-0 w-full h-[600px] transition-colors duration-1000 opacity-30 dark:opacity-50"
                style={{ background: `linear-gradient(to bottom, ${dominantColor} 0%, transparent 100%)` }}
            />

            {/* --- STICKY BAR: Hiện khi cuộn trang xuống dưới --- */}
            <div className={`fixed top-0 left-0 right-0 z-[45] h-16 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 px-6 flex items-center gap-4 transition-all duration-300 ${isStickyBarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <button
                    onClick={handlePlayPlaylist}
                    className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg shrink-0"
                >
                    <Play size={22} fill="black" className="ml-1" />
                </button>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white truncate">{playlist.name}</h2>
            </div>

            {/* Nút Back cho Mobile */}
            <div className="p-4 md:hidden relative z-50">
                <button onClick={() => navigate(-1)} className="p-2 bg-black/10 dark:bg-black/50 rounded-full text-black dark:text-white hover:scale-105 transition">
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="pt-2 relative z-10">
                {/* Phần Hero (Ảnh + Tên + Thông tin tổng quát)[cite: 108] */}
                <div ref={heroRef}>
                    <PlaylistHero
                        playlist={playlist}
                        songs={songs}
                        isOwner={isOwner}
                        onEditClick={() => setIsEditModalOpen(true)}
                        onColorExtracted={setDominantColor}
                    />
                </div>

                {/* Thanh điều khiển chính (Play, Shuffle, Thao tác khác)[cite: 107] */}
                <PlaylistActionBar
                    isOwner={isOwner}
                    onEditClick={() => setIsEditModalOpen(true)}
                    onDeleteClick={handleDeletePlaylist}
                    onPlayClick={handlePlayPlaylist}
                />

                {/* Danh sách bài hát chi tiết */}
                <PlaylistTrackList
                    songs={songs}
                    playlistId={playlist.id}
                    isOwner={isOwner}
                    onPlaySong={handlePlaySongAtIndex}
                    onRemoveSuccess={() => refetch()} // Gọi refetch để làm mới list sau khi xóa bài[cite: 112]
                />

                {/* Nút "Xem thêm" hỗ trợ phân trang */}
                {hasMore && (
                    <div className="flex justify-center pb-32 pt-10">
                        <button
                            onClick={loadMoreSongs}
                            disabled={isLoadingSongs}
                            className="px-8 py-2.5 border border-zinc-400 dark:border-zinc-500 rounded-full text-zinc-700 dark:text-zinc-300 font-bold hover:scale-105 hover:border-black dark:hover:border-white transition flex items-center gap-2"
                        >
                            {isLoadingSongs ? <Loader2 size={18} className="animate-spin" /> : null}
                            {isLoadingSongs ? 'Đang tải...' : 'Xem thêm'}
                        </button>
                    </div>
                )}

                {!hasMore && <div className="pb-32" />}
            </div>

            {/* Modal để sửa thông tin Playlist[cite: 106] */}
            <PlaylistModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={async (formData) => {
                    const success = await handleUpdate(formData);
                    if (success) {
                        setIsEditModalOpen(false);
                    }
                    return success;
                }}
                initialData={{
                    name: playlist.name,
                    description: playlist.description,
                    isPublic: playlist.isPublic,
                    coverUrl: playlist.coverUrl
                }}
            />
        </div>
    );
};

export default PlaylistDetailPage;