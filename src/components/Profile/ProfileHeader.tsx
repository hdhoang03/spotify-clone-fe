import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { MoreHorizontal, Share2, Edit2, Lock } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { useTheme } from '../../hooks/userTheme';
import ProfileShareCard from './ProfileShareCard';

interface ProfileHeaderProps {
    user: any; // Thay bằng UserProfile type
    isOwnProfile: boolean;
    onUpdateProfile: (name: string, file: File | null) => void;
}

const ProfileHeader = ({ user, isOwnProfile, onUpdateProfile }: ProfileHeaderProps) => {
    const [dominantColor, setDominantColor] = useState('#535353');
    const [isDarkBackground, setIsDarkBackground] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { theme } = useTheme();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Lấy màu trung bình từ Avatar
    useEffect(() => {
        if (user.avatarUrl) {
            const fac = new FastAverageColor();
            fac.getColorAsync(user.avatarUrl, { algorithm: 'dominant' })
                .then(color => {
                    setDominantColor(color.hex);
                    setIsDarkBackground(color.isDark);
                })
                .catch(() => {
                    setDominantColor('#535353');
                    setIsDarkBackground(true);
                });
        }
    }, [user.avatarUrl]);

    const gradientEndColor = theme === 'dark' ? '#121212' : '#ffffff';
    const dynamicTextColor = isDarkBackground ? 'text-white' : 'text-gray-900';
    const dynamicSubTextColor = isDarkBackground ? 'text-white/80' : 'text-gray-800';

    return (
        <>
            <div
                className="relative w-full h-[350px] md:h-[300px] flex items-end md:p-8 transition-colors duration-700 ease-in-out"
                style={{
                    background: user.avatarUrl
                        ? `linear-gradient(to bottom, ${dominantColor}, ${gradientEndColor})`
                        : `linear-gradient(to bottom, #16a34a, ${gradientEndColor})`
                }}
            >
                {/* Áp dụng dynamicTextColor vào container cha */}
                <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 w-full z-10 ${dynamicTextColor}`}>

                    {/* Avatar Lớn */}
                    <div className="w-[180px] h-[180px] md:w-[232px] md:h-[232px] rounded-full
                                    shadow-2xl overflow-hidden shrink-0 group relative cursor-pointer
                                    transition-transform duration-300 hover:scale-105"
                        onClick={() => isOwnProfile && setIsEditModalOpen(true)}
                    >
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-500">
                                <span className="text-black font-black text-7xl md:text-8xl uppercase drop-shadow-md select-none">
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        {/* Hover hint for edit */}
                        {isOwnProfile && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                <Edit2 size={32} className="text-white" />
                                <span className="text-white font-bold">Edit photo</span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <p className={`text-sm font-bold tracking-widest mb-2 drop-shadow-md ${dynamicSubTextColor}`}>
                            Profile
                        </p>

                        <h1
                            className="text-4xl md:text-[6rem] font-black tracking-tighter leading-none mb-6 cursor-pointer drop-shadow-lg"
                            onClick={() => isOwnProfile && setIsEditModalOpen(true)}
                        >
                            {user.name}
                        </h1>

                        <div className={`text-sm font-medium flex items-center justify-center md:justify-start gap-1 drop-shadow-md ${dynamicSubTextColor}`}>
                            {user.publicPlaylistsCount} Public Playlists
                            <span className="mx-1">•</span>
                            <span className="hover:underline cursor-pointer">{user.followingCount} Following</span>
                            <span className="mx-1">•</span>
                            <span className="hover:underline cursor-pointer">{user.followersCount} Followers</span>
                        </div>
                    </div>
                </div>

                {/* Background Overlay mờ */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-black/20 via-transparent to-transparent opacity-40 pointer-events-none"></div>
            </div>

            {/* Action Bar (Menu ...) */}
            <div className="px-8 py-6 flex items-center gap-4 relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-500 hover:text-black dark:text-[#b3b3b3] dark:hover:text-white transition"
                >
                    <MoreHorizontal size={32} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute top-14 left-8 bg-white dark:bg-[#282828]
                                    border border-gray-200 dark:border-transparent rounded
                                    shadow-xl p-1 z-20 w-48 animate-in fade-in zoom-in-95 duration-100">
                        {isOwnProfile && (
                            <button
                                onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
                                className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-white/90
                                            hover:bg-gray-100 dark:hover:bg-[#3e3e3e] 
                                            rounded-sm font-medium flex justify-between"
                            >
                                Edit profile <Edit2 size={14} />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setIsShareModalOpen(true);
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 
                                    dark:text-white/90 hover:bg-gray-100 dark:hover:bg-[#3e3e3e]
                                    rounded-sm font-medium flex justify-between"
                        >
                            Share profile <Share2 size={16} />
                        </button>
                        {/* Mục Privacy cho sau này */}
                        <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-1"></div>
                        <button className="w-full text-left px-3 py-2.5 text-sm text-gray-400 dark:text-white/50 cursor-not-allowed rounded-sm font-medium flex justify-between items-center">
                            Privacy Settings <Lock size={14} />
                        </button>
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentName={user.name}
                currentAvatar={user.avatarUrl}
                onSave={onUpdateProfile}
            />

            {/* --- COMPONENT SHARE CARD --- */}
            <ProfileShareCard
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                user={user}
                dominantColor={dominantColor}
            />
        </>
    );
};

export default ProfileHeader;