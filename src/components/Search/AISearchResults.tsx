import React from 'react';
import { useTranslation } from 'react-i18next';
import TrackRow from '../Profile/components/TrackRow';
import { useMusic } from '../../contexts/MusicContent';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { SongInfo } from '../AICompanion/types';

interface AISearchResultsProps {
    query: string;
    isSearching: boolean;
    error: string | null;
    resultIds: string[];
    systemSongs: SongInfo[];
}

const AISearchResults: React.FC<AISearchResultsProps> = ({ query, isSearching, error, resultIds, systemSongs }) => {
    const { t } = useTranslation();
    const { playPlaylist, currentSong, isPlaying, togglePlay } = useMusic();

    if (isSearching) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-emerald-600 dark:text-emerald-400">
                <Loader2 size={40} className="animate-spin mb-4" />
                <p className="text-lg font-medium">AI đang phân tích yêu cầu "{query}"...</p>
                <p className="text-sm text-zinc-500 mt-2">Đang tìm kiếm các bài hát phù hợp nhất</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
                <AlertCircle size={40} className="mb-4" />
                <p className="text-lg font-medium">{error}</p>
            </div>
        );
    }

    // Filter systemSongs to get only the matching ones
    const matchingSongs = resultIds
        .map(id => systemSongs.find(s => s.id === id || String(s.id) === id))
        .filter((s): s is SongInfo => !!s);

    if (matchingSongs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Sparkles size={40} className="mb-4 opacity-50" />
                <p className="text-lg font-medium text-center">AI không tìm thấy bài hát nào phù hợp với yêu cầu này.</p>
                <p className="text-sm mt-2 text-center">Hãy thử mô tả lại với các từ khóa khác xem sao!</p>
            </div>
        );
    }

    const handlePlaySong = (index: number) => {
        playPlaylist(matchingSongs as any[], index, `AI Search: ${query}`);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Gợi ý từ AI</h2>
                    <p className="text-sm text-zinc-500">Dựa trên yêu cầu: "{query}"</p>
                </div>
            </div>

            <div className="flex flex-col">
                {matchingSongs.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;
                    return (
                        <TrackRow
                            key={song.id}
                            index={index}
                            songId={song.id}
                            coverUrl={song.coverUrl}
                            title={song.title}
                            artist={song.artist}
                            artistId={song.artistId}
                            duration={song.duration || 0}
                            isActive={isCurrentSong}
                            isPlaying={isCurrentSong && isPlaying}
                            onClick={() => handlePlaySong(index)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AISearchResults;
