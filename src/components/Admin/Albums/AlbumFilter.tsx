// import { Search } from 'lucide-react';

// interface AlbumFilterProps {
//     searchTerm: string;
//     onSearchChange: (value: string) => void;
// }

// export const AlbumFilter = ({ searchTerm, onSearchChange }: AlbumFilterProps) => {
//     return (
//         <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//             <input
//                 type="text"
//                 placeholder="Tìm kiếm theo tên Album hoặc Nghệ sĩ..."
//                 value={searchTerm}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition"
//             />
//         </div>
//     );
// };

// src/pages/Admin/Albums/AlbumFilter.tsx
import { Search, Trash2, List } from 'lucide-react';

interface AlbumFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    isDeletedView: boolean; // Prop mới
    onToggleView: (val: boolean) => void; // Prop mới
}

export const AlbumFilter = ({ searchTerm, onSearchChange, isDeletedView, onToggleView }: AlbumFilterProps) => {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên Album hoặc Nghệ sĩ..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                />
            </div>

            {/* Nút chuyển đổi Thùng rác */}
            <button
                onClick={() => onToggleView(!isDeletedView)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-sm ${isDeletedView
                        ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30'
                        : 'bg-white text-gray-600 border border-gray-200 dark:bg-zinc-900 dark:border-white/10 dark:text-gray-400'
                    }`}
            >
                {isDeletedView ? <List size={18} /> : <Trash2 size={18} />}
                {isDeletedView ? 'Danh sách chính' : 'Thùng rác'}
            </button>
        </div>
    );
};