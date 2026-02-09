import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/userTheme';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition text-yellow-500 dark:text-yellow-400"
            title={theme === 'dark' ? "Chuyển sang Sáng" : "Chuyển sang Tối"}
        >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;