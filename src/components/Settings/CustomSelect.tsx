// src/components/Shared/CustomSelect.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    options: Option[];
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string; // Để custom độ rộng tùy ý
}

const CustomSelect = ({ value, options, onChange, placeholder, className = "w-full" }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || "Chọn một mục...";

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button" // Quan trọng để không submit form nhầm
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-transparent focus:border-green-500 outline-none"
            >
                <span className={`truncate ${!value ? 'text-zinc-500' : 'text-zinc-900 dark:text-white'}`}>
                    {selectedLabel}
                </span>
                <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                                    ${value === opt.value
                                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-bold'
                                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'}
                                `}
                            >
                                {opt.label}
                                {value === opt.value && <Check size={16} />}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;