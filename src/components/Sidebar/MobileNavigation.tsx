// components/MobileNavigation.tsx
import React from 'react';
import { Home, Search, Library } from 'lucide-react';

interface MobileNavigationProps {
	activeTab?: string;
	onTabChange?: (tab: string) => void;
}

const MobileNavigation = ({ activeTab = 'HOME', onTabChange }: MobileNavigationProps) => {
	return (
		<div className="
          md:hidden
          fixed bottom-0 left-0 right-0 z-40 
          h-16 bg-white dark:bg-black 
          border-t border-gray-200 dark:border-white/10
          flex items-center justify-around px-4 pb-2 pt-2
      ">
			<NavItem
				icon={<Home size={24} />}
				label="Trang chủ"
				isActive={activeTab === 'HOME'}
				onClick={() => onTabChange?.('HOME')}
			/>

			<NavItem
				icon={<Search size={24} />}
				label="Tìm kiếm"
				isActive={activeTab === 'SEARCH'}
				onClick={() => onTabChange?.('SEARCH')}
			/>

			<NavItem
				icon={<Library size={24} />}
				label="Thư viện"
				isActive={activeTab === 'LIBRARY'}
				onClick={() => onTabChange?.('LIBRARY')}
			/>
		</div>
	);
};

interface NavItemProps {
	icon: React.ReactNode;
	label: string;
	isActive: boolean;
	onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
	<div
		onClick={onClick}
		className={`
        flex flex-col items-center gap-1 cursor-pointer 
        p-2 transition-colors duration-200 
        ${isActive
				? 'text-green-500 dark:text-green-400'
				: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
			}
    `}
	>
		{icon}
		<span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
			{label}
		</span>
	</div>
);

export default MobileNavigation;