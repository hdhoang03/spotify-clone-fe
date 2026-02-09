import React from 'react';

export type TabType = 'ALL' | 'MUSIC' | 'POSTCARD';

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
            // THÊM: whitespace-nowrap (không xuống dòng), shrink-0 (không bị bóp méo)
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 border border-transparent whitespace-nowrap shrink-0
                ${isActive 
                    ? 'bg-green-500 text-white dark:bg-white dark:text-black shadow-md' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'
                } ${className}`}
        >
            {label}
        </button>
    );
};

const FilterBar = ({ activeTab, onTabChange, isFollowingMode, onToggleFollowing, isLoggedIn }: FilterBarProps) => {
    const showFollowingOption = isLoggedIn && activeTab !== 'ALL';
    return (
        <div className="sticky top-0 z-30 py-4 -mx-6 px-6 -mt-6
                        bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm
                        border-b border-black/5 dark:border-white/5
                        transition-colors duration-300
                        flex items-center justify-between"
        >
            
            {/* Group Scroll ngang: Thêm 'no-scrollbar' và padding phải để nội dung không bị cắt */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1 pr-6 mask-image-scroll">
                <FilterButton 
                    label="Tất cả" 
                    isActive={activeTab === 'ALL'} 
                    onClick={() => {
                        onTabChange('ALL');
                        if(isFollowingMode) onToggleFollowing(); 
                    }} 
                />
                <FilterButton 
                    label="Nhạc" 
                    isActive={activeTab === 'MUSIC'} 
                    onClick={() => onTabChange('MUSIC')} 
                />
                <FilterButton 
                    label="Podcast" 
                    isActive={activeTab === 'POSTCARD'} 
                    onClick={() => onTabChange('POSTCARD')} 
                />

                {/* --- GIẢI PHÁP MOBILE (Giống Spotify) --- */}
                {/* Nút 'Đang theo dõi' sẽ xuất hiện nối tiếp danh sách khi chọn tab con */}
                {showFollowingOption && (
                    <div className="md:hidden animate-in fade-in slide-in-from-right-4 duration-300 shrink-0">
                        <FilterButton 
                            label="Đang theo dõi" 
                            isActive={isFollowingMode} 
                            onClick={onToggleFollowing}
                            // Style riêng cho nút lọc phụ: Có viền để phân biệt
                            className={!isFollowingMode ? 'border-zinc-300 dark:border-zinc-700 bg-transparent dark:bg-transparent' : ''}
                        />
                    </div>
                )}
            </div>

            {/* --- DESKTOP (Giữ nguyên Toggle Switch) --- */}
            {showFollowingOption && (
                <div className="hidden md:flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300 pl-4 border-l border-gray-200 dark:border-zinc-800 ml-2 shrink-0">
                    <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                        Đang theo dõi
                    </span>
                    <ToggleSwitch isOn={isFollowingMode} onToggle={onToggleFollowing} />
                </div>
            )}
        </div>
    );
};

export default FilterBar;