import React from 'react';
import { Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type FontFamily = 'inter' | 'figtree' | 'lexend';

interface FontSelectorProps {
    fontFamily: FontFamily;
    onChange: (font: FontFamily) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ fontFamily, onChange }) => {
    const { t } = useTranslation();

    const fonts: { id: FontFamily; name: string; desc: string; previewClass: string }[] = [
        { id: 'inter', name: 'Inter', desc: t('settings.font_inter_desc'), previewClass: 'font-sans' },
        { id: 'figtree', name: 'Figtree', desc: t('settings.font_figtree_desc'), previewClass: 'font-sans' },
        { id: 'lexend', name: 'Lexend', desc: t('settings.font_lexend_desc'), previewClass: 'font-sans' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 py-4">
            {fonts.map(font => {
                const isSelected = fontFamily === font.id;
                return (
                    <button
                        key={font.id}
                        onClick={() => onChange(font.id)}
                        className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-lg border-2 transition-all ${
                            isSelected 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                        style={{ fontFamily: font.id === 'inter' ? 'Inter' : font.id === 'figtree' ? 'Figtree' : 'Lexend' }}
                    >
                        <Type size={32} className={isSelected ? 'text-primary-500' : 'text-zinc-400 dark:text-zinc-500'} />
                        <div className="text-center">
                            <h4 className={`font-bold text-[17px] tracking-tight ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-zinc-900 dark:text-white'}`}>
                                {font.name}
                            </h4>
                            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-1 tracking-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {font.desc}
                            </p>
                        </div>

                        {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-sm">
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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

export default FontSelector;
