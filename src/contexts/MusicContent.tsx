import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu bài hát (tương tự MOCK_SONGS)
export interface Song {
    id: number | string;
    title: string;
    artist: string;
    coverUrl: string;
    duration: number;
    audioUrl: string; // Link file nhạc (mp3)
}

interface MusicContextType {
    currentSong: Song | null;
    playlist: Song[]; // Danh sách bài hát hiện tại (để next/prev)
    isPlaying: boolean;
    playSong: (song: Song) => void;
    playPlaylist: (songs: Song[], startIndex: number) => void;
    togglePlay: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const playSong = (song: Song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        // Nếu bài hát chưa có trong playlist hiện tại, thêm nó vào hoặc reset playlist
        // Ở đây mình làm đơn giản là set playlist chỉ có 1 bài này
        setPlaylist([song]); 
    };

    const playPlaylist = (songs: Song[], startIndex: number) => {
        setPlaylist(songs);
        setCurrentSong(songs[startIndex]);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <MusicContext.Provider value={{ currentSong, playlist, isPlaying, playSong, playPlaylist, togglePlay }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error('useMusic must be used within a MusicProvider');
    return context;
};