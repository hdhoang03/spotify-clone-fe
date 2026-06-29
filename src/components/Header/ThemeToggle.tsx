import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
    const { themeMode, setThemeMode } = useTheme();

    const toggleTheme = () => {
        setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition text-yellow-500 dark:text-yellow-400"
            title={themeMode === 'dark' ? "Chuyển sang Sáng" : "Chuyển sang Tối"}
        >
            {themeMode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;