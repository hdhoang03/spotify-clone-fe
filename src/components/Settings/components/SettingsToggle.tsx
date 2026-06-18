import { motion } from 'framer-motion';

const SettingsToggle = ({
    label,
    desc,
    checked,
    onChange,
    disabled = false,
}: {
    label: string;
    desc?: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}) => (
    <div
        className={`flex items-center justify-between px-5 py-4 transition-colors duration-200
            ${disabled
                ? 'opacity-40 cursor-not-allowed'
                : 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5'
            }
            [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100 dark:[&:not(:last-child)]:border-zinc-800/70`}
        onClick={() => !disabled && onChange()}
    >
        <div className="pr-6 flex-1 min-w-0">
            <p className="font-semibold text-base text-zinc-900 dark:text-white">{label}</p>
            {desc && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{desc}</p>
            )}
        </div>

        {/* Toggle pill */}
        <div
            className={`relative flex-shrink-0 rounded-full transition-all duration-300 shadow-inner
                ${checked
                    ? 'bg-green-500 shadow-green-500/30'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
            style={{ width: '2.75rem', height: '1.5rem' }}
        >
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 600, damping: 35 }}
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                style={{ left: checked ? 'calc(100% - 1.375rem)' : '0.125rem' }}
            />
        </div>
    </div>
);

export default SettingsToggle;
