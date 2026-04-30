import { PlayCircle, Clock, Plus, Trash2 } from 'lucide-react';
import type { SongResponse } from '../../../types/backend';

interface CategorySongTableProps {
    songs: SongResponse[];
    totalSongsCount: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onAddClick: () => void;
    onRemoveClick: (songId: string) => void;
}

export const CategorySongTable = ({
    songs, totalSongsCount, currentPage, totalPages, itemsPerPage,
    onPageChange, onAddClick, onRemoveClick
}: CategorySongTableProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
                    Danh sách bài hát <span className="text-sm font-normal text-gray-500">({totalSongsCount})</span>
                </h2>
                <button
                    onClick={onAddClick}
                    className="text-sm bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-pink-600/20"
                >
                    <Plus size={18} /> Thêm bài hát
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                {songs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        Danh mục này chưa có bài hát nào. Hãy thêm bài hát mới nhé!
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                                <th className="hidden md:table-cell p-4 w-12 text-center">#</th>
                                <th className="p-4">Bài hát</th>
                                <th className="hidden md:table-cell p-4">Nghệ sĩ</th>
                                <th className="hidden lg:table-cell p-4">Album</th>
                                <th className="p-4 text-right"><Clock size={14} className="ml-auto" /></th>
                                <th className="p-4 text-center w-24">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {songs.map((song, idx) => (
                                <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group">
                                    <td className="hidden md:table-cell p-4 text-center text-gray-400 font-medium text-sm">
                                        {(currentPage - 1) * itemsPerPage + idx + 1}
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
                                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[180px] md:max-w-xs">{song.title}</p>
                                                <p className="text-xs text-gray-500 truncate md:hidden mt-0.5">{song.artist}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell p-4 text-sm text-gray-600 dark:text-gray-300">{song.artist}</td>
                                    <td className="hidden lg:table-cell p-4 text-sm text-gray-500">{song.albumName || '-'}</td>
                                    <td className="p-4 text-right text-sm text-gray-500 font-feature-settings-tnum">
                                        {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center">
                                            <button onClick={() => onRemoveClick(song.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Xóa khỏi danh mục">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-bold transition ${currentPage === page ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};