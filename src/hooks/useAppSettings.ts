import { useState } from 'react';

const DEFAULT_SETTINGS = {
    autoplay: true,
    language: 'vi',
};

export const useAppSettings = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('springtunes_settings');
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    const updateSetting = (key: keyof typeof DEFAULT_SETTINGS, value: any) => {
        setSettings((prev: any) => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem('springtunes_settings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    return { settings, updateSetting };
};