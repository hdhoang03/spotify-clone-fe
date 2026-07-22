import { Edit, Trash2, PlayCircle, RotateCcw, XCircle, Mic2 } from 'lucide-react';
import type { SongResponse } from '../../../types/backend';
import { Pagination } from '../../../components/Shared/Pagination';

interface SongTableProps {
    songs: SongResponse[];
    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isDeletedView: boolean;
    onPageChange: (page: number) => void;
    onEdit: (song: SongResponse) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onHardDelete: (id: string) => void;
    onManageLyrics: (song: SongResponse) => void;
}

export const SongTable = ({
    songs, startIndex, currentPage, totalPages, totalItems, isDeletedView,
    onPageChange, onEdit, onDelete, onRestore, onHardDelete, onManageLyrics
}: SongTableProps) => {
    return (
        <div className="bg-white/75 dark:bg-zinc-950/45 backdrop-blur-xl rounded-lg border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200/60 dark:border-zinc-800/50 text-xs uppercase text-zinc-400 dark:text-zinc-500 font-extrabold tracking-wider">
                            <th className="p-4 w-[50px] text-center">#</th>
                            <th className="p-4 w-[300px]">Bài hát</th>
                            <th className="p-4">Nghệ sĩ</th>
                            <th className="p-4 text-center">Thể loại</th>
                            <th className="p-4 text-center">Năm</th>
                            <th className="p-4 text-right">Thời lượng</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/40">
                        {songs.map((song, index) => (
                            <tr key={song.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition duration-200 group">
                                <td className="p-4 text-zinc-400 dark:text-zinc-500 font-bold text-center text-xs">{startIndex + index + 1}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-md transition duration-300 ${isDeletedView ? 'grayscale opacity-60' : ''}`}>
                                            <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                                            {!isDeletedView && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                                    <PlayCircle size={18} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate leading-snug group-hover:text-emerald-500 transition-colors duration-250">{song.title}</p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{song.albumName || 'Single'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-semibold text-zinc-600 dark:text-zinc-300">{song.artist}</td>
                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 tracking-wider">
                                        {song.category || 'Chưa phân loại'}
                                    </span>
                                </td>
                                <td className="p-4 text-center text-sm text-zinc-500 font-medium">{song.createdAt ? new Date(song.createdAt).getFullYear() : '-'}</td>
                                <td className="p-4 text-right text-sm text-zinc-500 font-mono tracking-tighter">
                                    {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-1">
                                        {isDeletedView ? (
                                            <>
                                                <button onClick={() => onRestore(song.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition duration-300" title="Khôi phục">
                                                    <RotateCcw size={16} />
                                                </button>
                                                <button onClick={() => onHardDelete(song.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition duration-300" title="Xóa vĩnh viễn">
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => onEdit(song)} className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition duration-300" title="Sửa">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => onManageLyrics(song)} className="p-2 text-zinc-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-xl transition duration-300" title="Lời bài hát">
                                                    <Mic2 size={16} />
                                                </button>
                                                <button onClick={() => onDelete(song.id)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-550/10 rounded-xl transition duration-300" title="Chuyển vào thùng rác">
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalItems > 0 ? (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    currentItemsCount={songs.length}
                    onPageChange={onPageChange}
                    activeColorClass="bg-primary-500 shadow-primary-500/30"
                />
            ) : (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <p>{isDeletedView ? "Thùng rác đang trống." : "Không tìm thấy bài hát nào phù hợp."}</p>
                </div>
            )}
        </div>
    );
};