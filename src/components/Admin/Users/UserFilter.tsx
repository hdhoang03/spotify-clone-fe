import { Search, Filter } from 'lucide-react';
import type { UserStatusFilter } from './useUserLogic';

interface UserFilterProps {
    keyword: string;
    onSearchChange: (val: string) => void;
    statusFilter: UserStatusFilter;
    onStatusChange: (val: UserStatusFilter) => void;
}

export const UserFilter = ({ keyword, onSearchChange, statusFilter, onStatusChange }: UserFilterProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo username, tên, email..."
                    value={keyword}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </div>

            {/* Status Filter */}
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as UserStatusFilter)}
                    className="w-full sm:w-48 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="banned">Đã khóa</option>
                </select>
            </div>
        </div>
    );
};