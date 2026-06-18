import { useTranslation } from 'react-i18next';

export type TabType = 'ALL' | 'MUSIC' | 'ARTIST';

interface FilterBarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    isFollowingMode: boolean;
    onToggleFollowing: () => void;
    isLoggedIn: boolean;
}

// Toggle Switch cho Desktop (Giữ nguyên)
const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${isOn ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-700'}`}
        >
            <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 transform
                    ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );
};

const FilterButton = ({
    label,
    isActive,
    onClick,
    className = ''
}: {
    label: string,
    isActive: boolean,
    onClick: () => void
    className?: string
}) => {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300 border border-transparent whitespace-nowrap shrink-0
                ${isActive
                    ? 'bg-green-500 text-black dark:bg-[#1ed760] dark:text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:shadow-[0_0_20px_rgba(30,215,96,0.25)] scale-105'
                    : 'bg-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                } ${className}`}
        >
            {label}
        </button>
    );
};

const FilterBar = ({ activeTab, onTabChange, isFollowingMode, onToggleFollowing, isLoggedIn }: FilterBarProps) => {
    const { t } = useTranslation();
    const showFollowingOption = isLoggedIn && activeTab !== 'ALL';
    return (
        <div className="sticky top-4 z-30 flex items-center justify-between pointer-events-none transition-all duration-300 mb-8"
        >
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 px-4 pointer-events-auto mask-image-scroll">
                {/* Floating Pill Container */}
                <div className="flex items-center gap-1 p-1 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/10">
                    <FilterButton
                        label={t('filter.all')}
                        isActive={activeTab === 'ALL'}
                        onClick={() => {
                            onTabChange('ALL');
                            if (isFollowingMode) onToggleFollowing();
                        }}
                    />
                    <FilterButton
                        label={t('filter.music')}
                        isActive={activeTab === 'MUSIC'}
                        onClick={() => onTabChange('MUSIC')}
                    />
                    <FilterButton
                        label={t('filter.artist')}
                        isActive={activeTab === 'ARTIST'}
                        onClick={() => onTabChange('ARTIST')}
                    />

                    {/* --- GIẢI PHÁP MOBILE (Giống Spotify) --- */}
                    {showFollowingOption && (
                        <div className="md:hidden animate-in fade-in slide-in-from-right-4 duration-300 shrink-0 border-l border-black/10 dark:border-white/10 ml-1 pl-2">
                            <FilterButton
                                label={t('filter.following')}
                                isActive={isFollowingMode}
                                onClick={onToggleFollowing}
                                className={!isFollowingMode ? 'bg-transparent dark:bg-transparent' : ''}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* --- DESKTOP (Giữ nguyên Toggle Switch nhưng cho nổi) --- */}
            {showFollowingOption && (
                <div className="hidden md:flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 px-4 py-1.5 mr-4 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/5 dark:border-white/10 pointer-events-auto shrink-0">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {t('filter.following')}
                    </span>
                    <ToggleSwitch isOn={isFollowingMode} onToggle={onToggleFollowing} />
                </div>
            )}
        </div>
    );
};

export default FilterBar;