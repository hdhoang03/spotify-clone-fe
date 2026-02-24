// import React from 'react';
// import { Edit, Trash2, ChevronRight, Music, Tag, ListOrdered, RotateCcw } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import type { CategoryResponse } from '../../../types/backend';

// interface CategoryTableProps {
//     data: CategoryResponse[];
//     isDeletedView: boolean;
//     onEdit: (e: React.MouseEvent, cat: CategoryResponse) => void;
//     onDelete: (e: React.MouseEvent, id: string) => void;
//     onRestore: (id: string) => void;
// }

// // BỔ SUNG isDeletedView VÀ onRestore VÀO ĐÂY:
// const CategoryTable = ({ data, isDeletedView, onEdit, onDelete, onRestore }: CategoryTableProps) => {
//     const navigate = useNavigate();

//     return (
//         <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
//             <div className="overflow-x-auto w-full">
//                 <table className="w-full text-left border-collapse min-w-[900px]">
//                     <thead>
//                         <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
//                             <th className="p-4 w-[60px] sticky left-0 z-30 bg-gray-50 dark:bg-zinc-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">
//                                 <ListOrdered size={14} className="mx-auto" />
//                             </th>
//                             <th className="p-4 w-[300px] relative md:sticky md:left-[60px] z-20 md:bg-gray-50 md:dark:bg-zinc-800 md:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Thông tin</th>
//                             <th className="p-4">Mô tả</th>
//                             <th className="p-4 text-center">Phân loại</th>
//                             <th className="p-4 text-center">Trạng thái</th>
//                             <th className="p-4 text-center">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-white/5">
//                         {data.map((cat, idx) => (
//                             <tr
//                                 key={cat.id}
//                                 onClick={() => navigate(`/admin/categories/${cat.id}`)}
//                                 className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group cursor-pointer"
//                             >
//                                 {/* Cột số thứ tự hiển thị (Dùng displayOrder từ Backend) */}
//                                 <td className="p-4 text-gray-500 font-bold text-center sticky left-0 z-20 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
//                                     {cat.displayOrder ?? idx + 1}
//                                 </td>

//                                 <td className="p-4 relative md:sticky md:left-[60px] z-10 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800 md:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
//                                     <div className="flex items-center gap-3">
//                                         {/* Tích hợp backgroundColor cho khung ảnh */}
//                                         <div
//                                             className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-gray-200 dark:border-zinc-700 flex items-center justify-center"
//                                         >
//                                             <img
//                                                 src={cat.coverUrl}
//                                                 alt={cat.name}
//                                                 className="w-full h-full object-cover mix-blend-multiply"
//                                             />
//                                         </div>
//                                         <div className="min-w-0">
//                                             <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{cat.name}</p>
//                                             <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
//                                                 <Music size={10} /> {cat.songCount || 0} bài hát
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </td>

//                                 <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate">
//                                     {cat.description || 'Chưa có mô tả'}
//                                 </td>

//                                 {/* Cột Phân loại (GENRE, MOOD,...) */}
//                                 <td className="p-4 text-center">
//                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter border border-zinc-200 dark:border-zinc-700">
//                                         <Tag size={10} />
//                                         {cat.type}
//                                     </span>
//                                 </td>

//                                 <td className="p-4 text-center">
//                                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cat.active
//                                         ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
//                                         : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
//                                         {cat.active ? 'Active' : 'Hidden'}
//                                     </span>
//                                 </td>

//                                 <td className="p-4">
//                                     <div className="flex items-center justify-center gap-2">
//                                         {isDeletedView ? (
//                                             /* Nút Khôi phục trong Thùng rác */
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); onRestore(cat.id); }}
//                                                 className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
//                                                 title="Khôi phục danh mục"
//                                             >
//                                                 <RotateCcw size={18} />
//                                             </button>
//                                         ) : (
//                                             /* Các nút cũ trong danh sách chính */
//                                             <>
//                                                 <button
//                                                     onClick={(e) => onEdit(e, cat)}
//                                                     className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
//                                                 >
//                                                     <Edit size={18} />
//                                                 </button>
//                                                 <button
//                                                     onClick={(e) => onDelete(e, cat.id)}
//                                                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
//                                                 >
//                                                     <Trash2 size={18} />
//                                                 </button>
//                                             </>
//                                         )}
//                                         <div className="text-gray-300 px-1 md:block hidden"><ChevronRight size={16} /></div>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default CategoryTable;

import React from 'react';
import { Edit, Trash2, ChevronRight, Music, Tag, ListOrdered, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CategoryResponse } from '../../../types/backend';
import { Pagination } from '../../../components/Shared/Pagination'; // CHÚ Ý: Chỉnh lại đường dẫn import cho đúng thư mục dự án của bạn

interface CategoryTableProps {
    data: CategoryResponse[];
    isDeletedView: boolean;
    onEdit: (e: React.MouseEvent, cat: CategoryResponse) => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
    onRestore: (id: string) => void;

    // THÊM PROPS PHÂN TRANG
    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

const CategoryTable = ({
    data, isDeletedView, onEdit, onDelete, onRestore,
    startIndex, currentPage, totalPages, totalItems, onPageChange // Nhận props
}: CategoryTableProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                            <th className="p-4 w-[60px] sticky left-0 z-30 bg-gray-50 dark:bg-zinc-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">
                                <ListOrdered size={14} className="mx-auto" />
                            </th>
                            <th className="p-4 w-[300px] relative md:sticky md:left-[60px] z-20 md:bg-gray-50 md:dark:bg-zinc-800 md:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Thông tin</th>
                            <th className="p-4">Mô tả</th>
                            <th className="p-4 text-center">Phân loại</th>
                            <th className="p-4 text-center">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {data.map((cat, idx) => (
                            <tr
                                key={cat.id}
                                onClick={() => navigate(`/admin/categories/${cat.id}`)}
                                className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group cursor-pointer"
                            >
                                {/* Cột số thứ tự: Kết hợp startIndex để đếm đúng khi qua trang 2, 3... */}
                                <td className="p-4 text-gray-500 font-bold text-center sticky left-0 z-20 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    {cat.displayOrder ?? (startIndex + idx + 1)}
                                </td>

                                <td className="p-4 relative md:sticky md:left-[60px] z-10 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800 md:shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-gray-200 dark:border-zinc-700 flex items-center justify-center">
                                            <img src={cat.coverUrl} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{cat.name}</p>
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                                                <Music size={10} /> {cat.songCount || 0} bài hát
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate">
                                    {cat.description || 'Chưa có mô tả'}
                                </td>

                                <td className="p-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter border border-zinc-200 dark:border-zinc-700">
                                        <Tag size={10} /> {cat.type}
                                    </span>
                                </td>

                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${cat.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                                        {cat.active ? 'Active' : 'Hidden'}
                                    </span>
                                </td>

                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        {isDeletedView ? (
                                            <button onClick={(e) => { e.stopPropagation(); onRestore(cat.id); }} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition" title="Khôi phục danh mục">
                                                <RotateCcw size={18} />
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={(e) => onEdit(e, cat)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={(e) => onDelete(e, cat.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                        <div className="text-gray-300 px-1 md:block hidden"><ChevronRight size={16} /></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* GỌI COMPONENT PHÂN TRANG */}
            {totalItems > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    currentItemsCount={data.length}
                    onPageChange={onPageChange}
                    activeColorClass="bg-pink-600 shadow-pink-500/20" // Màu hồng đặc trưng của Category
                />
            )}
        </div>
    );
};

export default CategoryTable;