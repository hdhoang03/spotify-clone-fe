import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const GreetingHeader: React.FC = () => {
    const { t } = useTranslation();
    const [greeting, setGreeting] = useState('');
    const [orbColors, setOrbColors] = useState({
        primary: 'bg-primary-400',
        secondary: 'bg-violet-500'
    });

    useEffect(() => {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            setGreeting('Chào buổi sáng!'); // Hoặc dùng t('home.good_morning')
            setOrbColors({ primary: 'bg-amber-400', secondary: 'bg-orange-500' });
        } else if (hour >= 12 && hour < 18) {
            setGreeting('Chiều năng suất nhé!'); // Hoặc dùng t('home.good_afternoon')
            setOrbColors({ primary: 'bg-sky-400', secondary: 'bg-cyan-500' });
        } else if (hour >= 18 && hour < 23) {
            setGreeting('Tối chill nhẹ nhàng thôi!'); // Hoặc dùng t('home.good_evening')
            setOrbColors({ primary: 'bg-purple-400', secondary: 'bg-pink-500' });
        } else {
            setGreeting('Khuya rồi, nghe nhạc thư giãn nhé!'); // Hoặc dùng t('home.good_night')
            setOrbColors({ primary: 'bg-indigo-500', secondary: 'bg-blue-600' });
        }
    }, [t]);

    return (
        <>
            {/* Ambient orbs */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute top-0 right-0 w-[520px] h-[520px]
                           rounded-full opacity-[0.08] dark:opacity-[0.05]
                           ${orbColors.primary} blur-[140px] -translate-y-1/4 translate-x-1/4 transition-colors duration-1000`}
            />
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 left-0 w-[460px] h-[460px]
                           rounded-full opacity-[0.07] dark:opacity-[0.04]
                           ${orbColors.secondary} blur-[160px] -translate-x-1/3 transition-colors duration-1000`}
            />

            {/* Greeting Text */}
            <div className="px-4 md:px-8 mt-6 mb-2 relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {greeting}
                </h1>
            </div>
        </>
    );
};
