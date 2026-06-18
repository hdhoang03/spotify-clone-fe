import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import BackButton from '../common/BackButton';
import api from '../../services/api';
import { useMusic } from '../../contexts/MusicContent';
import PlaylistTrackList from '../Sidebar/PlaylistTrackList';
import HeroBackground from '../common/HeroBackground';
import { useTranslation } from 'react-i18next';

const CategoryDetailPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { playPlaylist, currentSong, isPlaying, togglePlay } = useMusic();

    const colorHex = location.state?.colorHex || '#535353'; // Màu mặc định nếu không có state

    const [category, setCategory] = useState<any>(null);
    const [songs, setSongs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                // 1. Lấy thông tin danh mục
                const catRes = await api.get(`/categories/${id}`);
                setCategory(catRes.data?.result || null);

                // 2. Lấy danh sách bài hát thuộc danh mục
                const songRes = await api.get(`/song/${id}/category`, {
                    params: { page: 1, size: 50 }
                });
                if (songRes.data?.result?.content) {
                    setSongs(songRes.data.result.content);
                }
            } catch (err) {
                console.error("Lỗi lấy dữ liệu danh mục:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategoryData();
    }, [id]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsStickyBarVisible(!entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: "-80px 0px 0px 0px"
            }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
                <Loader2 className="animate-spin text-zinc-500" size={32} />
            </div>
        );
    }

    if (!category) {
        return <div className="h-screen flex items-center justify-center">{t('category.not_found')}</div>;
    }

    const handlePlaySongAtIndex = (index: number) => {
        if (songs && songs.length > 0) {
            playPlaylist(songs, index, category.name);
        }
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-[#121212] overflow-hidden text-zinc-900 dark:text-white pb-32">

            <div className="absolute top-4 left-4 z-20">
                <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
            </div>
            {/* Background Color Effect */}
            <HeroBackground fallbackColor={colorHex} />

            {/* STICKY HEADER */}
            <div
                className={`fixed top-0 left-0 right-0 z-40 h-[72px] md:h-16 px-4 md:px-8 flex items-center gap-4 transition-all duration-300
                    ${isStickyBarVisible
                        ? 'bg-white dark:bg-[#121212] border-b border-black/5 dark:border-white/10 shadow-sm'
                        : 'bg-transparent'
                    }
                `}
            >
                <button
                    onClick={() => navigate(-1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                        ${isStickyBarVisible
                            ? 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20'
                            : 'bg-black/20 hover:bg-black/40 text-white backdrop-blur-md'
                        }
                    `}
                >
                    <ArrowLeft size={20} />
                </button>

                {isStickyBarVisible && (
                    <h1 className="font-bold text-lg truncate flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {category.name}
                    </h1>
                )}
            </div>

            {/* HERO SECTION */}
            <div ref={heroRef} className="relative z-10 pt-20 pb-8 px-4 md:px-8 md:pt-24 flex flex-col md:flex-row items-center md:items-end gap-6 border-b border-black/5 dark:border-white/5">
                {/* Cover Image */}
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-xl shadow-2xl shrink-0 overflow-hidden relative group">
                    <img
                        src={category.coverUrl || 'https://via.placeholder.com/240'}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-sm font-semibold tracking-wider uppercase mb-2">
                        {t('category.category')}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tighter w-full"
                        style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
                        {category.name}
                    </h1>
                    <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 opacity-90 font-medium">
                        <span className="font-semibold text-black dark:text-white">SpringTunes</span>
                        <span className="hidden md:inline">•</span>
                        <span>{songs.length} {t('playlist.songs')}</span>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5 h-64 pointer-events-none" />
                <div className="pt-6 relative">
                    <PlaylistTrackList
                        songs={songs}
                        isOwner={false}
                        onPlaySong={handlePlaySongAtIndex}
                        currentSongId={currentSong?.id}
                        globalIsPlaying={isPlaying}
                        onTogglePlay={togglePlay}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryDetailPage;
