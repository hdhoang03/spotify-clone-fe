import React from 'react';

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-4 mt-8 first:mt-0">
        <div className="flex items-center gap-2.5 mb-3 px-1">
            <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                {title}
            </h2>
        </div>
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm relative">
            {children}
        </div>
    </div>
);

export default SettingsSection;
