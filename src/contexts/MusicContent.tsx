import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Định nghĩa kiểu dữ liệu bài hát (tương tự MOCK_SONGS)
export interface Song {
    id: string;
    title: string;
    artist: string;
    artistId?: string;    // ID nghệ sĩ để navigate
    albumId?: string;     // ID album để navigate (null nếu là single)
    albumName?: string;   // Tên album hiển thị
    coverUrl: string;
    duration: number;
    audioUrl: string;
    isLiked?: boolean;
    featuredArtists?: any[];
}

export type PlaybackSource = 'radio' | 'playlist' | null;

interface MusicContextType {
    currentSong: Song | null;
    playlist: Song[];
    isPlaying: boolean;
    playbackSource: PlaybackSource;
    /** Tên nguồn phát — vd: "Playlist X", "Tìm kiếm", "Ngẫu nhiên" */
    playlistName: string | null;
    playSong: (song: Song) => void;
    playPlaylist: (songs: Song[], startIndex: number, name?: string) => void;
    playRadio: (songs: Song[], startIndex: number, name?: string) => void;
    togglePlay: () => void;
    isShuffling: boolean;
    toggleShuffle: () => void;
    setIsPlaying: (playing: boolean) => void;
    updateCurrentSong: (updates: Partial<Song>) => void;
    /** Trạng thái sidebar player (panel phải bằng màn hình điện thoại) — chỉ desktop/tablet */
    isSidebarPlayerOpen: boolean;
    setIsSidebarPlayerOpen: (open: boolean) => void;
    isFullScreenPlayerOpen: boolean;
    setIsFullScreenPlayerOpen: (open: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [playbackSource, setPlaybackSource] = useState<PlaybackSource>(null);
    const [playlistName, setPlaylistName] = useState<string | null>(null);
    const [isSidebarPlayerOpen, setIsSidebarPlayerOpen] = useState(false);
    const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (currentSong) {
            document.title = `${currentSong.title} • ${currentSong.artist}`;
        } else {
            document.title = 'Springtunes | Nhái Spotify';
        }
    }, [currentSong]);

    const toggleShuffle = () => {
        setIsShuffling(prev => !prev);
    };

    const playSong = (song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setPlaylist([song]);
        setPlaybackSource(null);
        setPlaylistName(null);
    };

    const playPlaylist = (songs: Song[], startIndex: number, name?: string) => {
        setPlaylist(songs);
        setCurrentSong(songs[startIndex]);
        setIsPlaying(true);
        setPlaybackSource('playlist');
        setPlaylistName(name ?? null);
    };

    // Phát chế độ Radio: dùng cho Home và Search, khi hết bài sẽ tự fetch ngẫu nhiên
    const playRadio = (songs: Song[], startIndex: number, name?: string) => {
        setPlaylist(songs);
        setCurrentSong(songs[startIndex]);
        setIsPlaying(true);
        setPlaybackSource('radio');
        setPlaylistName(name ?? t('home.playing_randomly'));
        setIsShuffling(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const updateCurrentSong = (updates: Partial<Song>) => {
        setCurrentSong(prev => prev ? { ...prev, ...updates } : null);
        // Có thể cập nhật luôn trong playlist để đồng bộ
        setPlaylist(prevList => prevList.map(s =>
            s.id === currentSong?.id ? { ...s, ...updates } : s
        ));
    };

    return (
        <MusicContext.Provider value={{
            currentSong, playlist, isPlaying, playbackSource, playlistName,
            playSong, playPlaylist, playRadio, togglePlay, isShuffling, toggleShuffle,
            setIsPlaying, updateCurrentSong,
            isSidebarPlayerOpen, setIsSidebarPlayerOpen,
            isFullScreenPlayerOpen, setIsFullScreenPlayerOpen,
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error('useMusic must be used within a MusicProvider');
    return context;
};