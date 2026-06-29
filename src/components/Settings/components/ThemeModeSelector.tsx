import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThemeModeSelectorProps {
    themeMode: 'light' | 'dark' | 'system';
    onChange: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeModeSelector: React.FC<ThemeModeSelectorProps> = ({ themeMode, onChange }) => {
    const { t } = useTranslation();

    const modes = [
        { id: 'light', icon: Sun, label: 'Light', desc: 'Sáng sủa, dễ nhìn ban ngày' },
        { id: 'dark', icon: Moon, label: 'Dark', desc: 'Tối màu, bảo vệ mắt ban đêm' },
        { id: 'system', icon: Monitor, label: 'System', desc: 'Tự động theo thiết bị' }
    ] as const;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5 py-4">
            {modes.map(mode => {
                const isSelected = themeMode === mode.id;
                const Icon = mode.icon;
                return (
                    <button
                        key={mode.id}
                        onClick={() => onChange(mode.id)}
                        className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                            isSelected 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                    >
                        {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-primary-500' : 'text-zinc-500 dark:text-zinc-400'}`} />
                        <h4 className={`font-semibold ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                            {mode.label}
                        </h4>
                        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-1">
                            {mode.desc}
                        </p>
                    </button>
                );
            })}
        </div>
    );
};

export default ThemeModeSelector;
