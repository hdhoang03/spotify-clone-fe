import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemeModeSelector from './ThemeModeSelector';
import AccentColorSelector from './AccentColorSelector';
import SettingsSection from './SettingsSection';

const ThemeSettings: React.FC = () => {
    const { themeMode, accentColor, setThemeMode, setAccentColor } = useTheme();

    return (
        <SettingsSection title="Giao diện (Theme & Colors)">
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
                        Màu chủ đạo (Accent Color)
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Tùy chỉnh màu sắc cho các nút bấm, icon và hiệu ứng của ứng dụng.
                    </p>
                </div>
                <AccentColorSelector 
                    accentColor={accentColor} 
                    onChange={setAccentColor} 
                />
            </div>
        </SettingsSection>
    );
};

export default ThemeSettings;
