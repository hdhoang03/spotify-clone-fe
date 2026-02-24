// import { Search, Calendar, Mic2, Disc } from 'lucide-react';
// import type { SongFilterState } from './useSongLogic';

// interface SongFilterProps {
//     filters: SongFilterState;
//     onChange: (key: keyof SongFilterState, value: string) => void;
// }

// export const SongFilter = ({ filters, onChange }: SongFilterProps) => {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* 1. Keyword Search */}
//             <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                     type="text"
//                     placeholder="Tìm theo tên bài hát..."
//                     value={filters.keyword}
//                     onChange={(e) => onChange('keyword', e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm"
//                 />
//             </div>

//             {/* 2. Artist Filter */}
//             <div className="relative">
//                 <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                     type="text"
//                     placeholder="Lọc theo nghệ sĩ..."
//                     value={filters.artist}
//                     onChange={(e) => onChange('artist', e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm"
//                 />
//             </div>

//             {/* 3. Category Filter */}
//             <div className="relative">
//                 <Disc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <select
//                     value={filters.category}
//                     onChange={(e) => onChange('category', e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm appearance-none cursor-pointer"
//                 >
//                     <option value="">Tất cả thể loại</option>
//                     <option value="Pop">Pop</option>
//                     <option value="Ballad">Ballad</option>
//                     <option value="Rock">Rock</option>
//                     <option value="Indie">Indie</option>
//                     <option value="R&B">R&B</option>
//                 </select>
//             </div>

//             {/* 4. Year Filter */}
//             <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                     type="number"
//                     placeholder="Năm phát hành..."
//                     value={filters.year}
//                     onChange={(e) => onChange('year', e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm"
//                 />
//             </div>
//         </div>
//     );
// };

import { Search, Calendar, Mic2, Disc, CheckCircle, Trash2 } from 'lucide-react';
import type { SongFilterState } from './useSongLogic';

interface SongFilterProps {
    filters: SongFilterState;
    onChange: (key: keyof SongFilterState, value: string) => void;
    isDeletedView: boolean;
    onToggleView: (val: boolean) => void;
}

export const SongFilter = ({ filters, onChange, isDeletedView, onToggleView }: SongFilterProps) => {
    return (
        <div className="flex flex-col xl:flex-row gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                {/* 1. Keyword Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Tìm theo tên bài hát..." value={filters.keyword} onChange={(e) => onChange('keyword', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm shadow-sm" />
                </div>

                {/* 2. Artist Filter */}
                <div className="relative">
                    <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Tên nghệ sĩ..." value={filters.artist} onChange={(e) => onChange('artist', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm shadow-sm" />
                </div>

                {/* 3. Category Filter */}
                <div className="relative">
                    <Disc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select value={filters.category} onChange={(e) => onChange('category', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm appearance-none cursor-pointer shadow-sm">
                        <option value="">Tất cả thể loại</option>
                        <option value="Pop">Pop</option>
                        <option value="Ballad">Ballad</option>
                        <option value="Rock">Rock</option>
                        <option value="Indie">Indie</option>
                        <option value="R&B">R&B</option>
                    </select>
                </div>

                {/* 4. Year Filter */}
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="number" placeholder="Năm phát hành..." value={filters.year} onChange={(e) => onChange('year', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition text-sm shadow-sm" />
                </div>
            </div>

            {/* Nút Toggle Thùng rác */}
            <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 h-[42px]">
                <button onClick={() => onToggleView(false)} className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!isDeletedView ? 'bg-white dark:bg-zinc-700 text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}>
                    <CheckCircle size={16} /> Hoạt động
                </button>
                <button onClick={() => onToggleView(true)} className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isDeletedView ? 'bg-red-50 dark:bg-red-900/20 text-red-600 shadow-sm' : 'text-gray-500 hover:text-red-500 dark:text-gray-400'}`}>
                    <Trash2 size={16} /> Thùng rác
                </button>
            </div>
        </div>
    );
};