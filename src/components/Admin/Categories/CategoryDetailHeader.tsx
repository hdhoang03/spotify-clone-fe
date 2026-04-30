import { ArrowLeft, Music } from 'lucide-react';
import type { CategoryResponse } from '../../../types/backend';

interface CategoryDetailHeaderProps {
    category: CategoryResponse;
    songCount: number;
    onBack: () => void;
}

export const CategoryDetailHeader = ({ category, songCount, onBack }: CategoryDetailHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800 flex-shrink-0 group relative">
                <img src={category.coverUrl} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left w-full">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-pink-500 flex items-center gap-1 transition">
                        <ArrowLeft size={16} /> <span className="hidden xs:inline">Quay lại</span>
                    </button>
                    <span className="text-gray-300">/</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded">
                        {category.type || 'Category'}
                    </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    {category.name}
                </h1>

                <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed mx-auto md:mx-0">
                    {category.description || 'Chưa có mô tả cho danh mục này.'}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Music size={18} className="text-pink-500" />
                        {songCount} Bài hát
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${category.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {category.active ? 'Đang hoạt động' : 'Đã ẩn'}
                    </div>
                </div>
            </div>
        </div>
    );
};