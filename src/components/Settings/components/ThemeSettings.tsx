import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeModeSelector from './ThemeModeSelector';
import AccentColorSelector from './AccentColorSelector';
import FontSelector from './FontSelector';
import SettingsSection from './SettingsSection';
import { useTranslation } from 'react-i18next';

const ThemeSettings: React.FC = () => {
    const { themeMode, accentColor, fontFamily, setThemeMode, setAccentColor, setFontFamily } = useTheme();
    const { t } = useTranslation();

    return (
        <SettingsSection title={t('settings.theme_section_title')}>
            {/* Light/Dark/System Selection */}
            <div className="pt-2">
                <ThemeModeSelector
                    themeMode={themeMode}
                    onChange={setThemeMode}
                />
            </div>

            {/* Accent Color Selection */}
            <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/70 pt-2">
                <div className="px-5 py-2">
                    <h3 className="font-semibold text-[15px] text-zinc-900 dark:text-white">
                        {t('settings.accent_title')}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {t('settings.accent_desc')}
                    </p>
                </div>
                <AccentColorSelector
                    accentColor={accentColor}
                    onChange={setAccentColor}
                />
            </div>

            {/* Font Family Selection */}
            <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/70 pt-2">
                <div className="px-5 py-2">
                    <h3 className="font-semibold text-[15px] text-zinc-900 dark:text-white">
                        {t('settings.font_title')}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {t('settings.font_desc')}
                    </p>
                </div>
                <FontSelector
                    fontFamily={fontFamily}
                    onChange={setFontFamily}
                />
            </div>
        </SettingsSection>
    );
};

export default ThemeSettings;
