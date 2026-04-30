// src/components/Profile/ProfileActionBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Share2, Edit2, Ban } from 'lucide-react';

interface ProfileActionBarProps {
    isOwnProfile: boolean;
    isFollowing: boolean;
    onToggleFollow: () => void;
    onEditProfile: () => void;
    onShareProfile: () => void;
    onToggleBlock: () => void;
    userName: string;
    avatarUrl: string;
    isSticky?: boolean;
}

const ProfileActionBar = ({ isOwnProfile, isFollowing, onToggleFollow, onEditProfile, onShareProfile, onToggleBlock, userName, avatarUrl, isSticky = false }: ProfileActionBarProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className={`flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3 sticky top-0 z-40 transition-all duration-300 ease-in-out border-b ${isSticky ? 'bg-white dark:bg-[#121212] border-zinc-200 dark:border-white/10 shadow-sm' : 'bg-transparent border-transparent'}`}>

            {/* Thu nhỏ tên và ảnh khi cuộn xuống */}
            <div className={`flex items-center gap-3 transition-all duration-500 overflow-hidden ${isSticky ? 'opacity-100 translate-y-0 w-auto mr-4' : 'opacity-0 translate-y-4 w-0 m-0'}`}>
                <img src={avatarUrl || `https://ui-avatars.com/api/?name=${userName}`} alt="avatar" className="w-10 h-10 rounded-full object-cover shadow-md" />
                <span className="text-xl font-bold text-zinc-900 dark:text-white truncate max-w-[150px] md:max-w-xs">{userName}</span>
            </div>

            {/* Nút Follow (chỉ hiện khi xem người khác) */}
            {!isOwnProfile && (
                <button
                    onClick={onToggleFollow}
                    className={`whitespace-nowrap px-6 py-1.5 rounded-full border text-sm font-bold tracking-wider transition ${isFollowing ? 'border-green-500 text-green-500 hover:scale-105' : 'border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:scale-105'}`}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            )}

            {/* Menu 3 chấm */}
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition flex items-center p-2">
                    <MoreHorizontal size={32} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 rounded shadow-2xl p-1 w-56 z-50 bg-white dark:bg-[#282828] border border-zinc-200 dark:border-white/10 animate-in fade-in zoom-in-95 origin-top-left">
                        {isOwnProfile && (
                            <button onClick={() => { onEditProfile(); setIsDropdownOpen(false); }} className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-sm text-zinc-700 dark:text-white/90 hover:bg-zinc-100 dark:hover:bg-[#3e3e3e]">
                                Edit profile <Edit2 size={16} />
                            </button>
                        )}
                        <button onClick={() => { onShareProfile(); setIsDropdownOpen(false); }} className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-sm text-zinc-700 dark:text-white/90 hover:bg-zinc-100 dark:hover:bg-[#3e3e3e]">
                            Share profile <Share2 size={16} />
                        </button>

                        {!isOwnProfile && (
                            <>
                                <div className="h-[1px] bg-zinc-200 dark:bg-white/10 my-1" />
                                <button
                                    onClick={() => { onToggleBlock(); setIsDropdownOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium"
                                >
                                    Chặn người dùng <Ban size={16} />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileActionBar;