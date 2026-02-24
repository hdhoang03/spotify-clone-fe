import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    currentItemsCount: number;
    onPageChange: (page: number) => void;
    activeColorClass?: string;
}

export const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    currentItemsCount,
    onPageChange,
    activeColorClass = 'bg-blue-600 shadow-blue-500/20'
}: PaginationProps) => {
    if (totalItems === 0) return null;

    return (
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-zinc-800/30 rounded-b-xl border-t border-gray-100 dark:border-white/5">

            {/* Chữ hiển thị mượt mà, đồng nhất, không in đậm */}
            <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + currentItemsCount, totalItems)} trong số {totalItems}
            </span>

            {/* Cụm nút bấm */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed text-gray-500 dark:text-gray-400"
                >
                    <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-all duration-200
                            ${currentPage === page
                                ? `${activeColorClass} text-white shadow-sm`
                                : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed text-gray-500 dark:text-gray-400"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};