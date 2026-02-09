const SettingsToggle = ({ label, desc, checked, onChange }: { label: string, desc?: string, checked: boolean, onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 cursor-pointer" onClick={onChange}>
        <div className="pr-4 flex-1">
            <p className="font-medium text-zinc-900 dark:text-white">{label}</p>
            {desc && <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>}
        </div>
        <div className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 shrink-0 ${checked ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </div>
    </div>
);
export default SettingsToggle;