import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Share2, Edit2, Ban } from 'lucide-react';
import { getAvatarUrl } from '../../../utils/avatarUrl';
import { useTranslation } from 'react-i18next';

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
    isLoggedIn?: boolean;
}

const ProfileActionBar = ({
    isOwnProfile,
    isFollowing,
    onToggleFollow,
    onEditProfile,
    onShareProfile,
    onToggleBlock,
    userName,
    avatarUrl,
    isSticky = false,
    isLoggedIn = false
}: ProfileActionBarProps) => {
    const { t } = useTranslation();
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
        <div className={`sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 py-3 transition-all duration-300 ease-in-out ${isSticky
            ? 'bg-zinc-100 dark:bg-[#121212] shadow-sm border-b border-zinc-200 dark:border-white/10'
            : 'bg-transparent border-transparent'
            }`}>

            {/* BÊN TRÁI: AVATAR & TÊN (Chỉ hiện khi isSticky = true, bình thường thu gọn về 0) */}
            <div className={`flex items-center transition-all duration-500 ease-in-out overflow-hidden ${isSticky ? 'max-w-[400px] opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
                }`}>
                <img
                    src={getAvatarUrl(avatarUrl, userName)}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                />
                <span className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white truncate max-w-[150px] md:max-w-[200px] ml-3">
                    {userName}
                </span>
            </div>

            {/* BÊN PHẢI: CÁC NÚT TƯƠNG TÁC (Tự động đẩy về bên phải nhờ ml-auto) */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto">

                {/* Chỉ hiện nút Follow nếu đang ở góc nhìn người khác và ĐÃ ĐĂNG NHẬP */}
                {!isOwnProfile && isLoggedIn && (
                    <button
                        onClick={onToggleFollow}
                        className={`px-6 py-2 rounded-full text-sm font-bold border transition active:scale-95 ${isFollowing
                            ? 'border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white hover:scale-105'
                            : 'bg-primary-500 text-white border-transparent hover:bg-primary-600 hover:scale-105'
                            }`}
                    >
                        {isFollowing ? t('profile.following_btn') : t('profile.follow_btn')}
                    </button>
                )}

                {/* Dấu 3 chấm — ẩn khi chưa đăng nhập */}
                {isLoggedIn && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-1 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                        >
                            <MoreHorizontal size={28} />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#282828] border border-zinc-200 dark:border-white/10 rounded-md shadow-2xl p-1 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">

                                {isOwnProfile && (
                                    <button onClick={() => { onEditProfile(); setIsDropdownOpen(false); }} className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-sm text-zinc-700 dark:text-white/90 hover:bg-zinc-100 dark:hover:bg-[#3e3e3e]">
                                        {t('profile.edit_profile')} <Edit2 size={16} />
                                    </button>
                                )}

                                <button onClick={() => { onShareProfile(); setIsDropdownOpen(false); }} className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-sm text-zinc-700 dark:text-white/90 hover:bg-zinc-100 dark:hover:bg-[#3e3e3e]">
                                    {t('profile.share_profile')} <Share2 size={16} />
                                </button>

                                {!isOwnProfile && (
                                    <>
                                        <div className="h-[1px] bg-zinc-200 dark:bg-white/10 my-1" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDropdownOpen(false);
                                                onToggleBlock();
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium"
                                        >
                                            {t('profile.block_user')}<Ban size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default ProfileActionBar;
