import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type AccentColor = 'emerald' | 'java_blue' | 'purple' | 'rose' | 'amber' | 'cyan' | 'teal' | 'indigo';
type FontFamily = 'inter' | 'figtree' | 'lexend';

interface ThemeContextType {
    themeMode: ThemeMode;
    accentColor: AccentColor;
    fontFamily: FontFamily;
    setThemeMode: (mode: ThemeMode) => void;
    setAccentColor: (color: AccentColor) => void;
    setFontFamily: (font: FontFamily) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem('theme_mode') as ThemeMode) || 'system';
    });

    const [accentColor, setAccentColor] = useState<AccentColor>(() => {
        return (localStorage.getItem('theme_accent') as AccentColor) || 'emerald';
    });

    const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
        return (localStorage.getItem('theme_font') as FontFamily) || 'inter';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // 1. Handle Light/Dark Mode
        root.classList.remove('light', 'dark');
        
        if (themeMode === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(systemPrefersDark ? 'dark' : 'light');
        } else {
            root.classList.add(themeMode);
        }

        localStorage.setItem('theme_mode', themeMode);

        // 2. Handle Accent Color
        root.setAttribute('data-theme', accentColor);
        localStorage.setItem('theme_accent', accentColor);

        // 3. Handle Font Family
        root.setAttribute('data-font', fontFamily);
        localStorage.setItem('theme_font', fontFamily);

    }, [themeMode, accentColor, fontFamily]);

    // Handle system theme changes if set to 'system'
    useEffect(() => {
        if (themeMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeMode]);

    return (
        <ThemeContext.Provider value={{ themeMode, accentColor, fontFamily, setThemeMode, setAccentColor, setFontFamily }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
