import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistHeader from './ArtistHeader';
import ArtistActionBar from './ArtistActionBar';
import PopularTracks from './PopularTracks';
import Discography from './Discography';
import ArtistAbout from './ArtistAbout';
import RelatedArtists from './RelatedArtists';
import ProfileSection from '../Profile/ProfileSection';
import { useMusic } from '../../contexts/MusicContent';
import Footer from '../HomePage/Footer';
import ArtistAboutModal from './ArtistAboutModal';
import BackButton from '../common/BackButton';

// Import Custom Hook vừa tạo
import { useArtist } from './useArtist';

// Vẫn giữ MOCK DATA cho bài hát và album chờ API
import { ARTIST_POPULAR_TRACKS, ARTIST_DISCOGRAPHY, ARTIST_RELATED } from '../../constants/mockArtistData';

const ArtistPage = () => {
    const navigate = useNavigate();
    const { playPlaylist, currentSong } = useMusic();

    // Sử dụng logic từ Hook
    const { artistData, isLoading, error } = useArtist();

    // Các State xử lý UI
    const [isFollowing, setIsFollowing] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting);
            },
            { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, [artistData]); // Chạy lại khi có data

    const handlePlayArtist = () => {
        playPlaylist(ARTIST_POPULAR_TRACKS, 0);
    };

    const handlePlayTrack = (index: number) => {
        playPlaylist(ARTIST_POPULAR_TRACKS, index);
    };

    const handleToggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    // --- RENDER TRẠNG THÁI ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212]">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !artistData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212] text-zinc-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-green-500 rounded-full font-bold text-black">
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        // SỬA 1: Giữ -mt-6 -mx-6 để tràn viền, nhưng XÓA 'p-6' để fix lỗi sticky bị lệch
        <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-[#121212]">

            <div className="absolute top-4 left-4 z-20 md:hidden">
                <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
            </div>

            {/* 1. LỚP ẢNH NỀN */}
            <div className="sticky top-0 left-0 w-full h-[40vh] md:h-[60vh] z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${artistData.coverImage})` }}
                />
                <div className="absolute inset-0 bg-black/10 dark:bg-black/30 transition-colors duration-300" />
            </div>

            {/* 2. LỚP NỘI DUNG */}
            <div className="relative z-10">

                {/* Header Tên Nghệ Sĩ */}
                {/* SỬA 2: Thêm px-6 md:px-8 để bù lại p-6 đã xóa ở thẻ cha */}
                <div className="h-[10vh] flex flex-col justify-end pointer-events-none px-6 md:px-8 pb-6"
                    ref={headerRef}
                    // Đẩy header lên cao một chút để đè lên ảnh (tạo hiệu ứng layer)
                    style={{ marginTop: '-10vh' }}
                >
                    <ArtistHeader artist={artistData} />
                </div>

                {/* Body Chính */}
                <div className="bg-white dark:bg-[#121212] min-h-screen relative transition-colors duration-300">

                    {/* Gradient chuyển màu */}
                    <div className="absolute top-0 left-0 right-0 -mt-20 md:-mt-32 h-20 md:h-32 z-0 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }}
                    />

                    {/* Action Bar */}
                    {/* SỬA 3: Đặt sticky ở đây. Vì thẻ cha đã mất p-6 nên top-0 sẽ dính đúng mép trên cùng */}
                    <div className="sticky top-0 z-40 bg-white dark:bg-[#121212]">
                        <ArtistActionBar
                            isPlaying={currentSong?.artist?.includes(artistData.name) ?? false}
                            isFollowing={isFollowing}
                            isShuffling={isShuffling}
                            onTogglePlay={handlePlayArtist}
                            onToggleFollow={() => setIsFollowing(!isFollowing)}
                            onToggleShuffle={handleToggleShuffle}
                            artistName={artistData.name}
                            artistImage={artistData.avatarUrl}
                            isSticky={isSticky}
                        />
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="px-6 md:px-8 space-y-10 pb-24 pt-4 w-full">
                        <PopularTracks
                            tracks={ARTIST_POPULAR_TRACKS}
                            onPlayTrack={handlePlayTrack}
                        />

                        <Discography items={ARTIST_DISCOGRAPHY} />

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <ProfileSection
                                title={`Featuring ${artistData.name}`}
                                items={[]}
                            />
                        </div>

                        <div onClick={() => setIsAboutOpen(true)} className="cursor-pointer">
                            <ArtistAbout
                                artistName={artistData.name}
                                imageUrl={artistData.avatarUrl}
                                bio={artistData.bio}
                                globalRank={artistData.globalRank || undefined}
                            />
                        </div>

                        <RelatedArtists artists={ARTIST_RELATED} />
                    </div>
                    <Footer />
                </div>
            </div>

            <ArtistAboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
                artist={artistData}
            />
        </div>
    );
};

export default ArtistPage;