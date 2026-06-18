import { BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ArtistHeaderProps {
    artist: any;
}

const ArtistHeader = ({ artist }: ArtistHeaderProps) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col justify-end h-full z-10 relative">
            <div className="flex flex-col gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-20">

                {/* Verified Badge — glassmorphism 2026 */}
                {artist.isVerified && (
                    <div className="inline-flex items-center gap-1.5 self-start
                                    px-2.5 py-1 rounded-full
                                    bg-white/10 backdrop-blur-sm border border-white/20
                                    text-white/90 mb-1 md:mb-0">
                        <div className="bg-blue-500 p-0.5 rounded-full shadow-lg shadow-blue-500/40">
                            <BadgeCheck size={14} fill="white" className="text-blue-500" />
                        </div>
                        <span className="text-[11px] font-bold tracking-widest uppercase drop-shadow-sm">
                            {t('artist.verified_artist')}
                        </span>
                    </div>
                )}

                {/* Tên nghệ sĩ */}
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white
                               tracking-tighter leading-none break-words line-clamp-2
                               max-w-full max-md:pb-2 md:pb-2 lg:pb-4
                               drop-shadow-2xl"
                    style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                >
                    {artist.name}
                </h1>

                {/* Follower count — badge dạng pill */}
                <div className="flex items-center gap-2">
                    <p className="text-white/90 font-semibold text-sm md:text-base drop-shadow-lg">
                        <span className="font-bold text-white">
                            {artist.followerCount?.toLocaleString()}
                        </span>
                        {' '}{t('artist.followers_count')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ArtistHeader;