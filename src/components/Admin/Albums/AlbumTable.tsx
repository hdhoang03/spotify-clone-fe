import { Edit, Trash2, Disc, Settings2, RotateCcw } from 'lucide-react';
import type { AlbumResponse } from '../../../types/backend';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../Shared/Pagination';

interface AlbumTableProps {
    albums: AlbumResponse[];
    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    isDeletedView: boolean; // Prop mới
    onPageChange: (page: number) => void;
    onEdit: (album: AlbumResponse) => void;
    onDelete: (id: string) => void;
    onManageSongs: (album: AlbumResponse) => void;
    onRestore: (id: string) => void; // Prop mới
}

export const AlbumTable = ({
    albums, startIndex, currentPage, totalPages, totalItems,
    isDeletedView, // Lấy prop
    onPageChange, onEdit, onDelete, onManageSongs, onRestore // Lấy prop
}: AlbumTableProps) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    {/* ... (Phần thead giữ nguyên) ... */}
                    <thead>
                        <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-4 w-12 hidden sm:table-cell">#</th>
                            <th className="px-4 py-4">Album</th>
                            <th className="px-6 py-4 hidden md:table-cell">Nghệ sĩ</th>
                            <th className="px-6 py-4 hidden lg:table-cell">Mô tả</th>
                            <th className="px-4 py-4 hidden sm:table-cell">Bài hát</th>
                            <th className="px-4 py-4 hidden xl:table-cell">Ngày phát hành</th>
                            <th className="px-4 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {albums.map((album, index) => (
                            <tr key={album.id}
                                onClick={() => navigate(`/admin/albums/${album.id}`)}
                                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">

                                {/* ... (Các cột dữ liệu giữ nguyên) ... */}
                                <td className="px-4 py-4 text-sm text-gray-400 hidden sm:table-cell">{startIndex + index + 1}</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                            <img src={album.avatarUrl} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate" title={album.name}>{album.name}</p>
                                            <p className="text-[10px] text-gray-500 md:hidden truncate">{album.artistName} • {album.songCount} bài</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-purple-600 hidden md:table-cell"><span className="truncate block max-w-[120px]">{album.artistName}</span></td>
                                <td className="px-6 py-4 hidden lg:table-cell"><p className="text-sm text-gray-500 truncate max-w-[150px]">{album.description || 'Chưa có mô tả'}</p></td>
                                <td className="px-4 py-4 hidden sm:table-cell"><span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">{album.songCount || 0}</span></td>
                                <td className="px-4 py-4 text-sm text-gray-500 hidden xl:table-cell">{album.releaseDate}</td>

                                {/* CẬP NHẬT CỘT THAO TÁC Ở ĐÂY */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {isDeletedView ? (
                                            /* Nút Khôi phục trong Thùng rác */
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onRestore(album.id); }}
                                                className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                                                title="Khôi phục album"
                                            >
                                                <RotateCcw size={18} />
                                            </button>
                                        ) : (
                                            /* Các nút cũ trong danh sách chính */
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onManageSongs(album); }}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                                    title="Quản lý bài hát"
                                                >
                                                    <Settings2 size={18} />
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(album); }}
                                                    className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition"
                                                    title="Chỉnh sửa album"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(album.id); }}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                                    title="Xóa vĩnh viễn"
                                                >
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

            {/* ... (Phần Pagination giữ nguyên) ... */}
            {totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    currentItemsCount={albums.length}
                    onPageChange={onPageChange}
                    activeColorClass="bg-orange-500 shadow-orange-500/30" // Màu cam cho Album
                />
            )}

            {albums.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                    <Disc className="text-gray-300 dark:text-zinc-700 mb-4 animate-pulse" size={64} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Kho nhạc trống</h3>
                    <p className="text-gray-500 dark:text-zinc-400">Không tìm thấy album nào phù hợp với tìm kiếm.</p>
                </div>
            )}
        </div>
    );
};