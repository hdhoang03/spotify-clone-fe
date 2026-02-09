// components/Sidebar/SidebarDrawer.tsx
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './SidebarLibrary'; // Sidebar nội dung gốc của bạn

interface SidebarDrawerProps {
	isOpen: boolean;
	isMobile: boolean;
	onClose: () => void;
	activeTab?: string;
	onTabChange?: (tab: string) => void;
	isCollapsed: boolean;
	setIsCollapsed: (val: boolean) => void;
}

const SidebarDrawer = ({
	isOpen, isMobile, onClose, activeTab, onTabChange,
	isCollapsed, setIsCollapsed
}: SidebarDrawerProps) => {

	const desktopWidth = isCollapsed ? 72 : 256;

	return (
		<AnimatePresence mode='wait'>
			{isMobile && isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
				/>
			)}

			{/* Sidebar trượt */}
			{isOpen && (
				<motion.div
					// Logic Animation quan trọng ở đây
					initial={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
					animate={isMobile
						? { x: 0 }
						: { width: desktopWidth, opacity: 1 } // Dùng biến width đã tính toán
					}
					exit={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
					transition={{ duration: 0.3, type: "spring", bounce: 0, damping: 20 }}
					className={`
                        ${isMobile
							? 'fixed top-0 bottom-0 left-0 z-40 w-[65%] shadow-2xl'
							: 'relative flex-shrink-0 h-full overflow-hidden' // Thêm overflow-hidden để nội dung không bị tràn khi co lại
						}
                    `}
				>
					<Sidebar
						activeTab={activeTab}
						onTabChange={onTabChange}
						// Truyền props xuống
						isCollapsed={isCollapsed}
						onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SidebarDrawer;