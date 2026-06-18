import { Library } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarHeaderProps {
    isActive: boolean;
    onClick: () => void;
    isCollapsed?: boolean;
}

const SidebarHeader = ({ isActive, onClick, isCollapsed = false }: SidebarHeaderProps) => {
    const { t } = useTranslation();
    return (
        <div className={`hidden md:flex items-center justify-between mb-2 pt-6 md:pt-4 ${isCollapsed ? 'px-0 justify-center w-full' : 'px-6 md:px-4'}`}>
            <button
                onClick={onClick}
                className={`group flex items-center transition-colors duration-300 ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}
            >
                {/* Icon Library */}
                <div className={`transition-colors duration-300 flex-shrink-0
                    ${isActive
                        ? 'text-black dark:text-white'
                        : 'text-zinc-500 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white'
                    }`}>
                    <Library size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {!isCollapsed && (
                    <div className="flex flex-col items-start min-w-0 animate-in fade-in duration-300">
                        {/* Chữ Chính s*/}
                        <span className={`text-[15px] truncate transition-all duration-300 tracking-wide
                            ${isActive
                                ? 'font-bold text-black dark:text-white drop-shadow-sm'
                                : 'font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'
                            }`}>
                            {t('sidebar.your_library')}
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default SidebarHeader;