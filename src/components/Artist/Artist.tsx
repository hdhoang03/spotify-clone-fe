import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistHeader from './ArtistHeader';
import ArtistActionBar from './ArtistActionBar';
import PopularTracks from './PopularTracks';
import Discography from './Discography';
import ArtistAbout from './ArtistAbout';
import RelatedArtists from './RelatedArtists';
import ProfileSection from '../Profile/components/ProfileSection';
import { useMusic } from '../../contexts/MusicContent';
import Footer from '../HomePage/Footer';
import ArtistAboutModal from './ArtistAboutModal';
import BackButton from '../common/BackButton';
import { useArtist } from './useArtist';
import { Loader2 } from 'lucide-react';
import ProfileShareCard from '../Profile/components/ProfileShareCard';
import { useTranslation } from 'react-i18next';
import { getUICache } from '../../utils/userStorage';

const ArtistPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { playPlaylist, currentSong, isPlaying: globalIsPlaying, togglePlay } = useMusic();
    const { artistData, popularTracks, discography, relatedArtists, isLoading, error, toggleFollow } = useArtist();
    const isLoggedIn = !!getUICache();
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading || !artistData) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsSticky(!entry.isIntersecting);
        }, { threshold: 0 });

        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, [isLoading, artistData]);

    const handlePlayTrack = (index: number) => {
        if (popularTracks && popularTracks.length > 0) {
            playPlaylist(popularTracks, index, artistData?.name);
        }
    };

    const handleToggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    const isThisArtistActive = currentSong?.artist?.includes(artistData?.name || '') ?? false;

    const handleTogglePlayArtist = () => {
        if (isThisArtistActive) {
            // Nếu nhạc của nghệ sĩ này đang active -> Bấm nút to sẽ Pause/Resume
            if (togglePlay) togglePlay();
        } else {
            // Nếu đang nghe người khác -> Bấm nút to sẽ phát từ đầu playlist
            if (popularTracks && popularTracks.length > 0) {
                playPlaylist(popularTracks, 0, artistData?.name);
            }
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/artist/${artistData?.id}`;
        navigator.clipboard.writeText(url).then(() => {
            alert(t('artist.link_copied'));
        });
    };

    // --- RENDER TRẠNG THÁI ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    if (error || !artistData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212] text-zinc-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary-500 rounded-full font-bold text-black">
                    {t('artist.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-[#121212]">

            <div className="absolute top-4 left-4 z-20">
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
                            // isPlaying={currentSong?.artist?.includes(artistData.name) ?? false}
                            isPlaying={isThisArtistActive && (globalIsPlaying ?? false)}
                            isFollowing={isLoggedIn ? (artistData?.isFollowed ?? false) : false}
                            isShuffling={isShuffling}
                            onTogglePlay={handleTogglePlayArtist}
                            onToggleFollow={toggleFollow}
                            onToggleShuffle={handleToggleShuffle}
                            artistName={artistData.name}
                            artistImage={artistData.avatarUrl}
                            isSticky={isSticky}
                            isLoggedIn={isLoggedIn}
                            onShareArtist={() => setIsShareModalOpen(true)}
                            onCopyLink={handleCopyLink}
                        />
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="px-6 md:px-8 space-y-10 pb-24 pt-4 w-full">
                        <PopularTracks
                            tracks={popularTracks}
                            onPlayTrack={handlePlayTrack}
                            onTogglePlay={togglePlay} //Pause/Resume
                            currentSongId={currentSong?.id}
                            globalIsPlaying={globalIsPlaying}
                        />

                        <Discography items={discography} />

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <ProfileSection
                                title={t('artist.featuring', { name: artistData.name })}
                                items={[]} // Chờ API
                            />
                        </div>

                        <div onClick={() => setIsAboutOpen(true)} className="cursor-pointer">
                            <ArtistAbout
                                artistName={artistData.name}
                                imageUrl={artistData.avatarUrl}
                                bio={artistData.bio}
                            // globalRank={artistData.globalRank || undefined}
                            />
                        </div>

                        {relatedArtists && relatedArtists.length > 0 && (
                            <RelatedArtists artists={relatedArtists} />
                        )}
                    </div>
                    <Footer />
                </div>
            </div>

            <ArtistAboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
                artist={artistData}
            />

            {artistData && (
                <ProfileShareCard
                    user={artistData}
                    dominantColor="#22c55e"
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    type="artist"
                />
            )}
        </div>
    );
};

export default ArtistPage;