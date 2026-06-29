import { useRef, useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { likeApi } from '../../services/likeApi';
import { useTranslation } from 'react-i18next';

const LikedSongsCard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [previewArtists, setPreviewArtists] = useState(t('playlist.loading'));

    // TiltCard state
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50, hovered: false });

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                const res = await likeApi.getMyLikedSongs(1, 5);
                if (res.data.code === 1000) {
                    const pageData = res.data.result;
                    setTotal(pageData.totalElements || pageData.content?.length || 0);
                    if (pageData.content?.length > 0) {
                        const artists = pageData.content
                            .map((item: any) => item.song?.artistName || item.song?.artist)
                            .filter(Boolean);
                        const uniqueArtists = Array.from(new Set(artists)).slice(0, 3) as string[];
                        setPreviewArtists(uniqueArtists.join(', ') + (uniqueArtists.length > 0 ? '...' : ''));
                    } else {
                        setPreviewArtists(t('playlist.empty_desc'));
                    }
                }
            } catch {
                setPreviewArtists(t('playlist.fetch_error'));
            }
        };
        fetchLikedSongs();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setTilt({
            rotateX: ((y - height / 2) / (height / 2)) * -6,
            rotateY: ((x - width / 2) / (width / 2)) * 6,
            spotX: (x / width) * 100,
            spotY: (y / height) * 100,
            hovered: true,
        });
    };

    const handleMouseLeave = () =>
        setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50, hovered: false });

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/collection/tracks')}
            style={{ perspective: '800px' }}
            className="col-span-2 row-span-1 cursor-pointer"
        >
            <div
                style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${tilt.hovered ? 'scale(1.03)' : 'scale(1)'}`,
                    transition: tilt.hovered
                        ? 'transform 0.1s ease-out'
                        : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                }}
                className="relative group bg-gradient-to-br from-primary-400 via-emerald-500 to-teal-600
                           dark:from-primary-600 dark:via-emerald-700 dark:to-teal-900
                           rounded-xl p-4 md:p-6 flex flex-col justify-between
                           shadow-lg shadow-primary-500/20 min-h-[140px] md:min-h-[180px] overflow-hidden"
            >
                {/* Spotlight */}
                <div
                    style={{
                        background: `radial-gradient(circle at ${tilt.spotX}% ${tilt.spotY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                        opacity: tilt.hovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                    className="absolute inset-0 pointer-events-none"
                />

                {/* Heart icon nổi góc trên phải */}
                <div
                    style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                    className="self-end"
                >
                    <Heart size={28} fill="white" className="text-white opacity-70" />
                </div>

                <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
                    <p className="text-white/80 line-clamp-2 text-xs md:text-sm mb-2">{previewArtists}</p>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-1">{t('playlist.liked_songs')}</h3>
                    <p className="text-white/80 font-medium text-xs md:text-sm">{total} {t('playlist.songs')}</p>
                </div>

                {/* Play button */}
                <div className="absolute bottom-4 right-4 w-10 h-10 md:w-11 md:h-11 bg-white/20 backdrop-blur-sm rounded-full
                                flex items-center justify-center shadow-xl
                                md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0
                                transition-all duration-300">
                    <Play fill="white" size={18} className="ml-0.5 text-white" />
                </div>
            </div>
        </div>
    );
};

export default LikedSongsCard;