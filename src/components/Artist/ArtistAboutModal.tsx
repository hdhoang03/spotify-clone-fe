import { X, Users, CheckCircle, Globe, Music, ArrowUpRight, Instagram, Facebook, Twitter, Link2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import CountUpNumber from '../common/CountUpNumber';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtistAboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    artist: any;
}

const ArtistAboutModal = ({ isOpen, onClose, artist }: ArtistAboutModalProps) => {
    const { t } = useTranslation();

    if (!artist) return null;

    const followerCount = artist.followerCount || 0;
    const songCount = artist.songCount || 0;

    let parsedSocials: Record<string, string> = {};
    if (artist.socialAccounts) {
        if (typeof artist.socialAccounts === 'string') {
            try {
                parsedSocials = JSON.parse(artist.socialAccounts);
            } catch (e) {
                console.error("Error parsing socialAccounts:", e);
            }
        } else {
            parsedSocials = artist.socialAccounts;
        }
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
                    {/* Glass Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-950 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col z-10"
                    >
                        {/* Ambient Glows */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white z-20 transition-all hover:scale-105 active:scale-95 border border-white/10"
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto no-scrollbar w-full h-full pb-12">
                            {/* Hero Image Section */}
                            <div className="relative h-[300px] md:h-[400px] w-full shrink-0">
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    src={artist.coverImage || artist.avatarUrl}
                                    alt={artist.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Soft fade to dark */}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                                {/* Header Info */}
                                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex flex-wrap items-center gap-3 mb-3"
                                    >
                                        {artist.isVerified && (
                                            <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 backdrop-blur-md">
                                                <CheckCircle size={14} className="fill-blue-500/20" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t('artist.verified_artist')}</span>
                                            </div>
                                        )}
                                        {artist.country && (
                                            <div className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                                                <Globe size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{artist.country}</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-xl"
                                    >
                                        {artist.name}
                                    </motion.h2>
                                </div>
                            </div>

                            {/* Body Content */}
                            <div className="px-8 md:px-10 space-y-8 relative z-10">

                                {/* Stats Grid */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-4"
                                >
                                    <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group">
                                        <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase mb-2 group-hover:text-zinc-300 transition-colors flex items-center gap-2">
                                            <Users size={14} /> {t('artist.followers_count')}
                                        </p>
                                        <p className="text-4xl font-black text-white tracking-tighter">
                                            <CountUpNumber endValue={followerCount} duration={1500} />
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-colors group">
                                        <p className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase mb-2 group-hover:text-zinc-300 transition-colors flex items-center gap-2">
                                            <Music size={14} /> {t('album.songs')}
                                        </p>
                                        <p className="text-4xl font-black text-white tracking-tighter">
                                            <CountUpNumber endValue={songCount} duration={2000} />
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Biography */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gradient-to-br from-white/[0.03] to-transparent p-6 md:p-8 rounded-[2rem] border border-white/5"
                                >
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Music size={16} />
                                        {t('artist.biography')}
                                    </h3>
                                    <p className="text-zinc-300 leading-relaxed text-base md:text-lg font-medium whitespace-pre-line">
                                        {artist.bio || t('artist.no_bio')}
                                    </p>
                                </motion.div>

                                {/* Social Links */}
                                {Object.keys(parsedSocials).length > 0 && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex flex-wrap gap-3"
                                    >
                                        {Object.entries(parsedSocials).map(([platform, url], index) => {
                                            const isPrimary = index === 0;
                                            const normalizedPlatform = platform.toLowerCase();

                                            // Chọn Icon phù hợp
                                            let Icon = Link2;
                                            if (normalizedPlatform === 'instagram') Icon = Instagram;
                                            else if (normalizedPlatform === 'facebook') Icon = Facebook;
                                            else if (normalizedPlatform === 'x' || normalizedPlatform === 'twitter') Icon = Twitter;
                                            else if (normalizedPlatform === 'website') Icon = Globe;

                                            return (
                                                <a
                                                    key={platform}
                                                    href={url as string}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all ${isPrimary
                                                        ? 'bg-white text-black'
                                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                                        }`}
                                                >
                                                    <Icon size={18} className={isPrimary ? "text-black" : "text-zinc-300"} />
                                                    <span className="capitalize">{normalizedPlatform === 'x' ? 'X (Twitter)' : platform}</span>
                                                    {!isPrimary && <ArrowUpRight size={16} className="text-zinc-400" />}
                                                </a>
                                            );
                                        })}
                                    </motion.div>
                                )}

                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ArtistAboutModal;