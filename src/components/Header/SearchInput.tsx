import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '../../hooks/useSearch';
import { useLocation, useNavigate } from 'react-router-dom'; // Thêm hook

interface SearchInputProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const SearchInput = ({ onTabChange, activeTab }: SearchInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { query, setQuery, clearQuery } = useSearchStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = useRef({ path: "/", tab: "HOME" });

    const handleToggleSearch = () => {
        if (!isOpen) {
            // Chỉ lưu trạng thái cũ nếu hiện tại KHÔNG PHẢI là tab SEARCH
            if (activeTab !== 'SEARCH') {
                previousState.current = {
                    path: location.pathname,
                    tab: activeTab
                };
            }
            setIsOpen(true);
            onTabChange('SEARCH');
        } else if (query === "") {
            closeSearch();
        }
    };

    const closeSearch = () => {
        setIsOpen(false);
        // 1. Quay lại Path cũ (Ví dụ: /artist/1)
        navigate(previousState.current.path);
        // 2. Cập nhật lại State ở App/MainLayout để hiển thị đúng component
        onTabChange(previousState.current.tab);
    };

    const handleClearOrClose = () => {
        if (query !== "") {
            clearQuery();
            inputRef.current?.focus();
        } else {
            closeSearch();
        }
    }

    return (
        <div className="relative flex items-center h-12">
            <motion.div
                animate={{ width: isOpen ? 360 : 48 }}
                className={`flex items-center rounded-full overflow-hidden transition-colors ${isOpen ? 'bg-zinc-100 dark:bg-zinc-800 shadow-inner' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
            >
                <button onClick={handleToggleSearch} className="p-3 shrink-0">
                    <Search size={22} className={isOpen ? "text-zinc-900 dark:text-white" : "text-green-500"} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center pr-2"
                        >
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-sm font-medium dark:text-white"
                                placeholder="Bạn muốn nghe gì?"
                                autoFocus
                            />
                            <button onClick={handleClearOrClose} className="p-1 text-zinc-400 hover:text-zinc-600">
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SearchInput;