// components/Artist/Discography.tsx
import { useState, useMemo } from 'react';
import ProfileSection from '../Profile/ProfileSection';
import type { SectionItem } from '../Profile/ProfileSection';

interface DiscographyProps {
    items: SectionItem[];
}

type FilterType = 'all' | 'album' | 'single';

const Discography = ({ items }: DiscographyProps) => {
    const [filter, setFilter] = useState<FilterType>('all');

    // Lọc danh sách dựa trên type
    const filteredItems = useMemo(() => {
        if (filter === 'all') return items;
        return items.filter(item => item.type === filter);
    }, [items, filter]);

    if (!items || items.length === 0) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 mb-8">
            {/* Header: Title + Filter Pills */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Discography
                </h2>
                
                {/* Filter Pills */}
                <div className="flex gap-2">
                    {(['all', 'album', 'single'] as FilterType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`
                                px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize
                                ${filter === type 
                                    ? 'bg-green-500 text-white dark:bg-white dark:text-black' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]'}
                            `}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content: Tái sử dụng ProfileSection nhưng không truyền Title (vì đã render ở trên) */}
            <ProfileSection 
                items={filteredItems} 
                className="mb-0" // Reset margin mặc định của ProfileSection
            />
        </div>
    );
};

export default Discography;