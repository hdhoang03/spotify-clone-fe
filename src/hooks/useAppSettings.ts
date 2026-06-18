import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
    autoplay: true,
    language: 'vi',
    lowPerf: false,
};

export const useAppSettings = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('springtunes_settings');
        const parsed = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        // Merge with DEFAULT_SETTINGS to handle updates to DEFAULT_SETTINGS
        return { ...DEFAULT_SETTINGS, ...parsed };
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