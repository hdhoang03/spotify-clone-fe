import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '../../hooks/useSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const SearchInput = ({ onTabChange, activeTab }: SearchInputProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { query, setQuery, clearQuery } = useSearchStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const previousState = useRef({ path: "/", tab: "HOME" });

    // Tự động đóng và xóa chữ khi rời khỏi tab SEARCH, hoặc tự động mở khi vào tab SEARCH
    useEffect(() => {
        if (activeTab !== 'SEARCH' && isOpen) {
            setIsOpen(false);
            clearQuery();
        } else if (activeTab === 'SEARCH' && !isOpen) {
            setIsOpen(true);
        }
    }, [activeTab, isOpen, clearQuery]);

    // Focus cực nhanh (50ms) để không bị giật layout nhưng vẫn đem lại cảm giác tức thì
    useEffect(() => {
        if (isOpen) {
            const timeoutId = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    const handleToggleSearch = () => {
        if (!isOpen) {
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
        navigate(previousState.current.path);
        onTabChange(previousState.current.tab);
    };

    const handleClearOrClose = () => {
        if (query === "") {
            closeSearch();
        } else {
            clearQuery();
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex items-center justify-end">
            <motion.div
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                animate={{ width: isOpen ? 360 : 48 }}
                className={`flex items-center rounded-full overflow-hidden transition-colors ${isOpen ? 'bg-zinc-100 dark:bg-zinc-800 shadow-inner' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
            >
                <button onClick={handleToggleSearch} className="p-3 shrink-0">
                    <Search size={22} className={isOpen ? "text-zinc-900 dark:text-white" : "text-primary-500"} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            // Thêm nhẹ scale để input có cảm giác bung ra tự nhiên
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="flex-1 flex items-center pr-2"
                        >
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none w-full text-sm font-medium dark:text-white"
                                placeholder={t("search.placeholder")}
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