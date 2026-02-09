// src/components/Settings/components/SettingsSelect.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface SettingsSelectProps {
    label: string;
    subLabel?: string;
    value: string;
    options: Option[];
    onChange: (val: string) => void;
}

const SettingsSelect = ({ label, subLabel, value, options, onChange }: SettingsSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
            {/* Phần Label: Mobile nằm trên, Desktop nằm trái */}
            <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-white">{label}</p>
                {subLabel && <p className="text-xs text-zinc-500 mt-0.5">{subLabel}</p>}
            </div>

            {/* Custom Dropdown */}
            <div className="relative w-full sm:w-64" ref={containerRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <span className="truncate">{selectedLabel}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden"
                        >
                            {options.map((opt) => (
                                <li
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between
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
        </div>
    );
};

export default SettingsSelect;