import { Search, Trash2, CheckCircle } from 'lucide-react';

interface ArtistFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    viewDeleted: boolean;
    onViewDeletedChange: (val: boolean) => void;
}

export const ArtistFilter = ({
    searchTerm,
    onSearchChange,
    viewDeleted,
    onViewDeletedChange
}: ArtistFilterProps) => (
    <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="text"
                placeholder="Tìm kiếm nghệ sĩ..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition shadow-sm"
            />
        </div>

        {/* Toggle View Mode */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
            <button
                onClick={() => onViewDeletedChange(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!viewDeleted
                        ? 'bg-white dark:bg-zinc-700 text-purple-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                    }`}
            >
                <CheckCircle size={16} /> Hoạt động
            </button>
            <button
                onClick={() => onViewDeletedChange(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewDeleted
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
                    }`}
            >
                <Trash2 size={16} /> Thùng rác
            </button>
        </div>
    </div>
);