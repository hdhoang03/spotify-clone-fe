import { ArrowLeft, Music, PlayCircle, Clock, Plus, Trash2, Calendar } from 'lucide-react';
import AddSongToAlbumModal from '../Modals/AddSongToAlbumModal';
import { useAlbumDetailLogic } from './useAlbumDetailLogic';

const AlbumDetail = () => {
    const {
        navigate, album, albumSongs, isLoading,
        isAddModalOpen, setIsAddModalOpen,
        currentPage, setCurrentPage, totalPages, totalElements, ITEMS_PER_PAGE,
        handleAddSong, handleRemoveSong
    } = useAlbumDetailLogic();

    // Hiển thị màn hình loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!album) return <div className="p-8 text-center text-gray-500 font-medium">Không tìm thấy Album này.</div>;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* 1. THÔNG TIN ALBUM */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                {/* Dùng avatarUrl thay vì coverUrl */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800 flex-shrink-0 group relative">
                    <img src={album.avatarUrl} alt={album.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left w-full">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <button onClick={() => navigate('/admin/albums')} className="text-sm font-medium text-gray-500 hover:text-orange-500 flex items-center gap-1 transition">
                            <ArrowLeft size={16} /> <span className="hidden xs:inline">Quay lại</span>
                        </button>
                        <span className="text-gray-300">/</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                            Album
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {album.name}
                    </h1>

                    <div className="flex items-center justify-center md:justify-start gap-2 text-lg font-bold text-gray-700 dark:text-gray-200">
                        {album.artistName}
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed mx-auto md:mx-0">
                        {album.description || 'Chưa có mô tả cho album này.'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                            <Music size={16} className="text-orange-500" />
                            {totalElements} Bài hát
                        </div>
                        {album.releaseDate && (
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                                <Calendar size={16} className="text-orange-500" />
                                {album.releaseDate}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. DANH SÁCH BÀI HÁT */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
                        Danh sách bài hát <span className="text-sm font-normal text-gray-500">({totalElements})</span>
                    </h2>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-sm bg-orange-500 hover:bg-orange-600 text-white
                                py-2 px-4 rounded-lg font-bold flex items-center
                                gap-2 transition shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={18} /> Thêm bài hát
                    </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                    {albumSongs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Album này chưa có bài hát nào.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                                    <th className="hidden md:table-cell p-4 w-12 text-center">#</th>
                                    <th className="p-4">Bài hát</th>
                                    <th className="hidden md:table-cell p-4">Nghệ sĩ</th>
                                    <th className="p-4 text-center"><Clock size={14} className="mx-auto" /></th>
                                    <th className="p-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {albumSongs.map((song, idx) => (
                                    <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group">
                                        <td className="hidden md:table-cell p-4 text-center text-gray-400 font-medium text-sm">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden flex-shrink-0 group-hover:shadow-md transition cursor-pointer">
                                                    <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                        <PlayCircle size={20} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[180px] md:max-w-xs">
                                                        {song.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate md:hidden mt-0.5">
                                                        {song.artist}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell p-4 text-sm text-gray-600 dark:text-gray-300">
                                            {song.artist}
                                        </td>
                                        <td className="p-4 text-center text-sm text-gray-500 font-feature-settings-tnum">
                                            {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleRemoveSong(song.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                                title="Xóa khỏi Album"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Phân trang Backend */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-bold transition ${currentPage === page
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {album && (
                <AddSongToAlbumModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    albumId={album.id}
                    currentSongIds={albumSongs.map(s => s.id)}
                    onAdd={handleAddSong}
                />
            )}
        </div>
    );
};

export default AlbumDetail;