import React from 'react';

const SettingsSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
            <span className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300">
                {icon}
            </span>
            {title}
        </h2>
        <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 shadow-sm">
            {children}
        </div>
    </div>
);
export default SettingsSection;