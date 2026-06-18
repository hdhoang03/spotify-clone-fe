import { Crown, Users, ListMusic, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import useDominantColor from '../../../hooks/useDominantColor';
import TiltCover from '../../common/TiltCover';
import { getAvatarUrl } from '../../../utils/avatarUrl';
import { useTranslation } from 'react-i18next';

interface ProfileHeaderProps {
    user: any;
    isOwnProfile: boolean;
    onEditClick: () => void;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
}

const StatPill = ({
    icon,
    value,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    onClick?: () => void;
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full
                   bg-white/20 dark:bg-black/30
                   backdrop-blur-md border border-white/20 dark:border-white/10
                   text-black dark:text-white
                   hover:bg-white/30 dark:hover:bg-white/10
                   transition-colors duration-200 cursor-pointer select-none"
    >
        <span className="text-black/60 dark:text-white/60">{icon}</span>
        <span className="text-sm font-black tabular-nums">{value}</span>
        <span className="text-xs font-medium text-black/50 dark:text-white/50 hidden sm:inline">{label}</span>
    </motion.button>
);

const ProfileHeader = ({ user, isOwnProfile, onEditClick, onShowFollowers, onShowFollowing }: ProfileHeaderProps) => {
    const { t } = useTranslation();
    const dominantColor = useDominantColor(user?.avatarUrl);
    const isPremium = Boolean(user?.isPremium);

    if (!user) return null;

    return (
        <div
            className="relative w-full h-[38vh] md:h-[48vh] flex items-end px-6 md:px-10 pb-8 overflow-hidden"
            style={{
                backgroundColor: dominantColor,
                transition: 'background-color 0.8s cubic-bezier(0.22,1,0.36,1)',
            }}
        >
            {/* Multi-layer gradient overlay for depthh */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Bottom fade to page bg */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-[#121212] dark:via-[#121212]/55 dark:to-transparent" />
                {/* Side vignette */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent dark:from-[#121212]/30 dark:via-transparent dark:to-transparent" />
                {/* Subtle noise for texture */}
                <div
                    className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '180px',
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10 w-full"
            >
                {/* ── Avatar ── */}
                <div className="relative shrink-0 self-center md:self-end">
                    {isPremium && (
                        <div
                            className="absolute rounded-full animate-[spin_7s_linear_infinite]"
                            style={{
                                inset: '-5px',
                                background: 'conic-gradient(from 0deg, #f59e0b, #fef08a, #f59e0b, #d97706, #f59e0b)',
                                borderRadius: '9999px',
                                zIndex: 0,
                            }}
                        />
                    )}

                    {/* Avatar image */}
                    <motion.div
                        className={`relative z-10 ${isPremium ? 'rounded-full ring-[3px] ring-amber-400/25' : ''}`}
                        whileHover={{ scale: isOwnProfile ? 1.02 : 1 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    >
                        <TiltCover
                            src={getAvatarUrl(user.avatarUrl, user.name || user.username, 'random')}
                            alt={user.name || user.username}
                            sizeClass="w-28 h-28 md:w-52 md:h-52"
                            radiusClass="rounded-full"
                            maxTilt={6}
                            onClick={isOwnProfile ? onEditClick : undefined}
                        />
                    </motion.div>

                    {/* Crown */}
                    {isPremium && (
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 25 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
                            className="absolute -top-5 right-3 md:right-6 z-20"
                        >
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-9 h-9 rounded-full bg-amber-400/40 blur-lg" />
                                <Crown
                                    size={28}
                                    className="relative text-amber-400 fill-amber-400"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.9))' }}
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ── Info ── */}
                <div className="flex flex-col text-center md:text-left text-black dark:text-white w-full min-w-0">
                    <span className="hidden md:block text-xs font-bold uppercase tracking-[0.18em] opacity-60 mb-2">
                        {t('profile.header_label')}
                    </span>

                    {/* Name */}
                    <h1
                        className={`text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter truncate pb-2 leading-tight
                            ${isPremium ? 'premium-name' : 'drop-shadow-sm'}`}
                    >
                        {user.name || user.username}
                    </h1>

                    {/* Premium badge */}
                    {isPremium && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 25 }}
                            className="flex justify-center md:justify-start mt-2 mb-3"
                        >
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-widest
                                bg-gradient-to-r from-amber-400 to-yellow-500 text-black
                                shadow-[0_0_16px_rgba(251,191,36,0.45)]">
                                <Crown size={10} className="fill-black" />
                                PREMIUM
                            </span>
                        </motion.div>
                    )}

                    {/* Stats as interactive pills */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                        <StatPill
                            icon={<ListMusic size={13} />}
                            value={user.playlistCount ?? 0}
                            label={t('profile.playlists')}
                        />
                        <StatPill
                            icon={<Users size={13} />}
                            value={user.followerCount ?? 0}
                            label={t('profile.followers')}
                            onClick={onShowFollowers}
                        />
                        <StatPill
                            icon={<UserCheck size={13} />}
                            value={user.followingCount ?? 0}
                            label={t('profile.following')}
                            onClick={onShowFollowing}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileHeader;
