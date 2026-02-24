// import { Edit, Trash2, PlayCircle } from 'lucide-react';
// import type { SongResponse } from '../../../types/backend';
// import { Pagination } from '../../Shared/Pagination';

// interface SongTableProps {
//     songs: SongResponse[];
//     startIndex: number;
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     onPageChange: (page: number) => void;
//     onEdit: (song: SongResponse) => void;
//     onDelete: (id: string) => void;
// }

// export const SongTable = ({
//     songs,
//     startIndex,
//     currentPage,
//     totalPages,
//     totalItems,
//     onPageChange,
//     onEdit,
//     onDelete
// }: SongTableProps) => {
//     return (
//         <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
//             <div className="overflow-x-auto w-full">
//                 <table className="w-full text-left border-collapse min-w-[800px]">
//                     <thead>
//                         <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
//                             {/* Thay đổi: Chỉ sticky từ màn hình md trở lên */}
//                             <th className="p-4 w-[50px] md:sticky left-0 z-10 md:z-20 bg-gray-50 dark:bg-zinc-800">#</th>
//                             <th className="p-4 w-[300px] md:sticky left-[50px] z-10 md:z-20 bg-gray-50 dark:bg-zinc-800">Bài hát</th>
//                             <th className="p-4">Nghệ sĩ</th>
//                             <th className="p-4 text-center">Thể loại</th>
//                             <th className="p-4 text-center">Năm</th>
//                             <th className="p-4 text-right">Thời lượng</th>
//                             <th className="p-4 text-center">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-white/5">
//                         {songs.map((song, index) => (
//                             <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group">
//                                 {/* Thay đổi: Bỏ sticky mặc định, dùng md:sticky */}
//                                 <td className="p-4 text-gray-500 font-medium md:sticky left-0 z-10 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800">
//                                     {startIndex + index + 1}
//                                 </td>

//                                 <td className="p-4 md:sticky left-[50px] z-10 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800">
//                                     <div className="flex items-center gap-3">
//                                         {/* Hình ảnh và thông tin bài hát */}
//                                         <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 group-hover:shadow-md transition cursor-pointer">
//                                             <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
//                                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                                                 <PlayCircle size={20} className="text-white" />
//                                             </div>
//                                         </div>
//                                         <div className="min-w-0">
//                                             <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[150px] md:max-w-[200px]">{song.title}</p>
//                                             <p className="text-xs text-gray-500 truncate max-w-[150px] md:max-w-[200px]">{song.albumName || 'Single'}</p>
//                                         </div>
//                                     </div>
//                                 </td>

//                                 <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{song.artist}</td>

//                                 <td className="p-4 text-center">
//                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
//                                         {song.category || 'Chưa phân loại'}
//                                     </span>
//                                 </td>

//                                 <td className="p-4 text-center text-sm text-gray-500">
//                                     {song.createdAt ? new Date(song.createdAt).getFullYear() : '-'}
//                                 </td>

//                                 <td className="p-4 text-right text-sm text-gray-500 font-medium font-feature-settings-tnum">
//                                     {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
//                                 </td>

//                                 <td className="p-4">
//                                     <div className="flex items-center justify-center gap-2">
//                                         <button onClick={() => onEdit(song)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Sửa">
//                                             <Edit size={18} />
//                                         </button>
//                                         <button onClick={() => onDelete(song.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Xóa">
//                                             <Trash2 size={18} />
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination Controls */}
//             {totalItems > 0 ? (
//                 <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     totalItems={totalItems}
//                     startIndex={startIndex}
//                     currentItemsCount={songs.length}
//                     onPageChange={onPageChange}
//                     activeColorClass="bg-green-500 shadow-green-500/30" // Màu xanh lá cho Song
//                 />
//             ) : (
//                 <div className="p-12 text-center text-gray-500 flex flex-col items-center">
//                     <p>Không tìm thấy bài hát nào phù hợp.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

import { Edit, Trash2, PlayCircle, RotateCcw, XCircle } from 'lucide-react';
import type { SongResponse } from '../../../types/backend';
import { Pagination } from '../../../components/Shared/Pagination';

interface SongTableProps {
    songs: SongResponse[];
    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    isDeletedView: boolean; // Bổ sung
    onPageChange: (page: number) => void;
    onEdit: (song: SongResponse) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void; // Bổ sung
    onHardDelete: (id: string) => void; // Bổ sung
}

export const SongTable = ({
    songs, startIndex, currentPage, totalPages, totalItems, isDeletedView,
    onPageChange, onEdit, onDelete, onRestore, onHardDelete
}: SongTableProps) => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                            <th className="p-4 w-[50px]">#</th>
                            <th className="p-4 w-[300px]">Bài hát</th>
                            <th className="p-4">Nghệ sĩ</th>
                            <th className="p-4 text-center">Thể loại</th>
                            <th className="p-4 text-center">Năm</th>
                            <th className="p-4 text-right">Thời lượng</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {songs.map((song, index) => (
                            <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group">
                                <td className="p-4 text-gray-500 font-medium">{startIndex + index + 1}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`relative w-10 h-10 rounded overflow-hidden flex-shrink-0 group-hover:shadow-md transition cursor-pointer ${isDeletedView ? 'grayscale opacity-60' : ''}`}>
                                            <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                                            {!isDeletedView && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    <PlayCircle size={20} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{song.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{song.albumName || 'Single'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{song.artist}</td>
                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                                        {song.category || 'Chưa phân loại'}
                                    </span>
                                </td>
                                <td className="p-4 text-center text-sm text-gray-500">{song.createdAt ? new Date(song.createdAt).getFullYear() : '-'}</td>
                                <td className="p-4 text-right text-sm text-gray-500 font-medium font-feature-settings-tnum">
                                    {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        {isDeletedView ? (
                                            <>
                                                <button onClick={() => onRestore(song.id)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition" title="Khôi phục">
                                                    <RotateCcw size={18} />
                                                </button>
                                                <button onClick={() => onHardDelete(song.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Xóa vĩnh viễn">
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => onEdit(song)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition" title="Sửa">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => onDelete(song.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Chuyển vào thùng rác">
                                                    <Trash2 size={18} />
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
                    activeColorClass="bg-green-500 shadow-green-500/30"
                />
            ) : (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <p>{isDeletedView ? "Thùng rác đang trống." : "Không tìm thấy bài hát nào phù hợp."}</p>
                </div>
            )}
        </div>
    );
};