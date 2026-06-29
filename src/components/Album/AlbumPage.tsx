import { Loader2 } from 'lucide-react';
import { useMusic } from '../../contexts/MusicContent';
import PlaybackActionBar from '../common/PlaybackActionBar';
import { useAlbumDetailLogic } from '../Admin/Albums/useAlbumDetailLogic';
import AlbumHeader from './AlbumHeader';
import AlbumTrackList from './AlbumTrackList';
import { useTranslation } from 'react-i18next';

const AlbumPage = () => {
    const { t } = useTranslation();
    const {
        navigate,
        album, albumSongs, isLoading,
        totalElements,
    } = useAlbumDetailLogic();

    const { playPlaylist, currentSong, isPlaying, togglePlay } = useMusic();

    const isAlbumActive = albumSongs.length > 0 && albumSongs.some(s => s.id === currentSong?.id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    if (!album) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#121212] text-zinc-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">{t('album.not_found')}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-primary-500 rounded-full font-bold text-black"
                >
                    {t('album.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#121212] text-zinc-900 dark:text-white transition-colors duration-300">
            {/* 1. Hero header: blurred bg + TiltCard cover + info + BackButton */}
            <AlbumHeader album={album} totalElements={totalElements} />

            {/* 2. Action bar tái sử dụng — nằm ngay dưới header, không sticky để tránh đường kẻ ngang */}
            <div className="px-6 md:px-10 lg:px-16">
                <PlaybackActionBar
                    isPlaying={isAlbumActive && (isPlaying ?? false)}
                    onPlayClick={() => {
                        if (albumSongs.length > 0) {
                            const songsWithAlbum = albumSongs.map(s => ({ ...s, albumId: s.albumId || album?.id }));
                            playPlaylist(songsWithAlbum as any, 0, album?.name);
                        }
                    }}
                    onTogglePlay={togglePlay}
                />
            </div>

            {/* 3. Danh sách bài hát: EqualizerBars + hover Play/Pause */}
            <div className="px-6 md:px-10 lg:px-16 pb-24">
                <AlbumTrackList
                    songs={albumSongs}
                    currentSongId={currentSong?.id}
                    globalIsPlaying={isPlaying ?? false}
                    onPlaySong={(idx) => {
                        const songsWithAlbum = albumSongs.map(s => ({ ...s, albumId: s.albumId || album?.id }));
                        playPlaylist(songsWithAlbum as any, idx, album?.name);
                    }}
                    onTogglePlay={togglePlay}
                />
            </div>
        </div>
    );
};

export default AlbumPage;
