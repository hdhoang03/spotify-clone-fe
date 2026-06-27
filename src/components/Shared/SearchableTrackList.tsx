import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PlaylistTrackList from '../Sidebar/PlaylistTrackList';
import { useTranslation } from 'react-i18next';

interface SearchableTrackListProps {
    songs: any[];
    playlistId?: string;
    isOwner?: boolean;
    onPlaySong: (index: number) => void;
    onRemoveSuccess?: () => void;
    currentSongId?: string;
    globalIsPlaying?: boolean;
    onTogglePlay?: () => void;

    // Config for search
    searchMode?: 'local' | 'api';
    onSearchApi?: (keyword: string) => void;
}

const SearchableTrackList = (props: SearchableTrackListProps) => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialKeyword = searchParams.get('q') || '';
    const [keyword, setKeyword] = useState(initialKeyword);
    const { songs, searchMode = 'local', onSearchApi } = props;

    // Handle input change and update URL params
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setKeyword(val);

        if (val.trim() === '') {
            searchParams.delete('q');
        } else {
            searchParams.set('q', val);
        }
        setSearchParams(searchParams, { replace: true });
    };

    // Debounce keyword cho API search
    useEffect(() => {
        if (searchMode === 'api' && onSearchApi) {
            const timer = setTimeout(() => {
                onSearchApi(keyword);
            }, 800); // Tăng lên 800ms để đỡ spam
            return () => clearTimeout(timer);
        }
    }, [keyword, searchMode, onSearchApi]);

    // Lọc local nếu searchMode === 'local'
    const displaySongs = useMemo(() => {
        if (searchMode === 'api' || !keyword.trim()) return songs;
        const lowerKeyword = keyword.trim().toLowerCase();
        return songs.filter(song =>
            song.title?.toLowerCase().includes(lowerKeyword) ||
            song.artist?.toLowerCase().includes(lowerKeyword) ||
            (song.albumName && song.albumName.toLowerCase().includes(lowerKeyword))
        );
    }, [songs, keyword, searchMode]);

    // Handle mapping the selected index to the original list index
    const handlePlaySong = (displayIndex: number) => {
        if (searchMode === 'api' || !keyword.trim()) {
            props.onPlaySong(displayIndex);
        } else {
            // Find the actual index in the original 'songs' array
            const targetSong = displaySongs[displayIndex];
            const originalIndex = songs.findIndex(s => s.id === targetSong.id);
            if (originalIndex !== -1) {
                props.onPlaySong(originalIndex);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="px-4 md:px-8 flex justify-between items-center relative z-20">
                {/* Thanh search */}
                <div className="relative w-full max-w-xs group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-900 dark:text-zinc-400 dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder={t('search.placeholder') || "Tìm bài hát hoặc nghệ sĩ..."}
                        value={keyword}
                        onChange={handleKeywordChange}
                        className="w-full bg-black/5 hover:bg-black/10 focus:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 dark:focus:bg-white/10 border border-transparent focus:border-black/20 dark:focus:border-white/20 rounded-md py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 transition-all outline-none"
                    />
                </div>
            </div>

            <PlaylistTrackList
                {...props}
                songs={displaySongs}
                onPlaySong={handlePlaySong}
            />
        </div>
    );
};

export default SearchableTrackList;
