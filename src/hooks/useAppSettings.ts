import { useState, useEffect } from 'react';
import i18n from '../i18n';

const SUPPORTED_LANGS = ['vi', 'en', 'ko', 'ja'];

// Lấy ngôn ngữ hiện tại từ i18n (nguồn thật) — tránh mismatch với springtunes_settings
const getInitialLanguage = (): string => {
    const lang = i18n.language?.split('-')[0]; // "en-US" → "en"
    return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
};

const DEFAULT_SETTINGS = {
    autoplay: true,
    language: getInitialLanguage(),
    lowPerf: false,
};

export const useAppSettings = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('springtunes_settings');
        const parsed = saved ? JSON.parse(saved) : {};
        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
            // Luôn sync language từ i18n để dropdown hiển thị đúng ngôn ngữ đang dùng
            language: parsed.language ?? getInitialLanguage(),
        };
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (settings.lowPerf) {
            root.classList.add('low-perf');
        } else {
            root.classList.remove('low-perf');
        }
    }, [settings.lowPerf]);

    const updateSetting = (key: keyof typeof DEFAULT_SETTINGS, value: any) => {
        setSettings((prev: any) => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem('springtunes_settings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    return { settings, updateSetting };
};