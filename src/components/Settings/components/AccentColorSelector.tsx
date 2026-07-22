import React from 'react';
import { useTranslation } from 'react-i18next';

type AccentColor = 'emerald' | 'java_blue' | 'purple' | 'rose' | 'amber' | 'cyan' | 'teal' | 'indigo';

interface AccentColorSelectorProps {
    accentColor: AccentColor;
    onChange: (color: AccentColor) => void;
}

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({ accentColor, onChange }) => {
    
    const { t } = useTranslation();
    
    // We can define the literal color hexes here just for the UI display block
    const colors: { id: AccentColor; name: string; desc: string; hex: string }[] = [
        { id: 'java_blue', name: 'Java Blue', desc: t('settings.accent_java_blue'), hex: '#3b82f6' },
        { id: 'emerald', name: 'Emerald', desc: t('settings.accent_emerald'), hex: '#10b981' },
        { id: 'purple', name: 'Purple', desc: t('settings.accent_purple'), hex: '#a855f7' },
        { id: 'rose', name: 'Rose', desc: t('settings.accent_rose'), hex: '#f43f5e' },
        { id: 'amber', name: 'Amber', desc: t('settings.accent_amber'), hex: '#f59e0b' },
        { id: 'cyan', name: 'Cyan', desc: t('settings.accent_cyan'), hex: '#06b6d4' },
        { id: 'teal', name: 'Teal', desc: t('settings.accent_teal'), hex: '#14b8a6' },
        { id: 'indigo', name: 'Indigo', desc: t('settings.accent_indigo'), hex: '#6366f1' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 py-4">
            {colors.map(color => {
                const isSelected = accentColor === color.id;
                return (
                    <button
                        key={color.id}
                        onClick={() => onChange(color.id)}
                        className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all overflow-hidden ${
                            isSelected 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                    >
                        {/* Decorative background shape like in the screenshot */}
                        <div 
                            className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 dark:opacity-20 transition-colors"
                            style={{ backgroundColor: color.hex }}
                        />

                        {/* Color square block */}
                        <div 
                            className="w-14 h-14 rounded-xl flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                        />

                        <div className="text-left flex-1 relative z-10">
                            <h4 className={`font-semibold text-[15px] ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                {color.name}
                            </h4>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                {color.desc}
                            </p>
                            
                            {/* Decorative mini dots like in screenshot */}
                            <div className="flex gap-1 mt-2">
                                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: color.hex }} />
                                <div className="w-3 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                                <div className="w-3 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            </div>
                        </div>

                        {isSelected && (
                            <div 
                                className="absolute right-4 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                                style={{ backgroundColor: color.hex }}
                            >
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default AccentColorSelector;
