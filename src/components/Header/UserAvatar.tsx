interface UserAvatarProps {
    name: string;
    avatarUrl?: string;
    onClick?: () => void;
}

const UserAvatar = ({ name, avatarUrl, onClick }: UserAvatarProps) => {
    // Logic: Lấy chữ cái đầu, in hoa
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
        // <button
        //     onClick={onClick}
        //     className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-green-500 transition relative bg-zinc-700 flex items-center justify-center group"
        // >

        <button
            onClick={onClick}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-green-500 ring-offset-2 dark:ring-offset-[#0a0a0a] ring-offset-white transition-all duration-300 active:scale-95 relative bg-zinc-700 flex items-center justify-center group"
        >
            {avatarUrl ? (
                <img src={avatarUrl} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm font-bold text-white select-none">
                    {initial}
                </span>
            )}
        </button>
    );
};

export default UserAvatar;