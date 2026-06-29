// components/Artist/Discography.tsx
import { useState, useMemo } from 'react';
import ProfileSection from '../Profile/components/ProfileSection';
import type { SectionItem } from '../Profile/components/ProfileSection';
import { useTranslation } from 'react-i18next';

interface DiscographyProps {
    items: SectionItem[];
}

type FilterType = 'all' | 'album' | 'single';

const Discography = ({ items }: DiscographyProps) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredItems = useMemo(() => {
        if (filter === 'all') return items;
        return items.filter(item => item.type === filter);
    }, [items, filter]);

    if (!items || items.length === 0) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 mb-8">
            {/* Header: Title + Filter Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                    {t('artist.discography')}
                </h2>

                {/* Filter Pills — glassmorphism 2026 */}
                <div className="flex gap-1.5">
                    {(['all', 'album', 'single'] as FilterType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`
                                px-3.5 py-1.5 rounded-full text-xs font-semibold
                                transition-all duration-200 capitalize
                                ${filter === type
                                    ? 'bg-primary-500 text-white dark:bg-white dark:text-black'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]'
                                }
                            `}
                        >
                            {t(`artist.${type}`)}
                        </button>
                    ))}
                </div>
            </div>

            <ProfileSection
                items={filteredItems}
                className="mb-0"
            />
        </div>
    );
};

export default Discography;