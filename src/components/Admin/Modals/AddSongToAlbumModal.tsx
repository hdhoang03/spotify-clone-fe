import { useState, useEffect } from 'react';
import { X, Search, Plus, Check, Music } from 'lucide-react';
import api from '../../../services/api';
import type { SongResponse } from '../../../types/backend';

interface AddSongToAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    albumId: string;
    currentSongIds: string[];
    onAdd: (songId: string) => Promise<void>;
}

const AddSongToAlbumModal = ({ isOpen, onClose, albumId, currentSongIds, onAdd }: AddSongToAlbumModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [songs, setSongs] = useState<SongResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddingId, setIsAddingId] = useState<string | null>(null);

    // Fetch danh sách bài hát
    useEffect(() => {
        if (!isOpen) return;

        const fetchSongs = async () => {
            try {
                setIsLoading(true);
                const res = await api.get('/songs/list', {
                    params: { keyword: searchTerm, page: 1, size: 20 }
                });
                setSongs(res.data.result.content || []);
            } catch (error) {
                console.error("Lỗi tải danh sách bài hát:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => fetchSongs(), 500);
        return () => clearTimeout(timer);
    }, [isOpen, searchTerm]);

    const handleAdd = async (songId: string) => {
        setIsAddingId(songId);
        await onAdd(songId);
        setIsAddingId(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 1. Lớp Overlay tách riêng (Giống Category Modal) */}
            {/* Đã giữ -mt-20 và thêm sự kiện click ngoài để đóng */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />

            {/* 2. Khung Nội Dung Modal */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg md:max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thêm bài hát vào Album</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài hát để thêm..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List Songs */}
                <div className="flex-1 overflow-y-auto p-2">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm">Đang tìm kiếm...</p>
                        </div>
                    ) : songs.length > 0 ? (
                        <div className="space-y-1">
                            {songs.map(song => {
                                const isAdded = currentSongIds.includes(song.id);
                                const isAdding = isAddingId === song.id;

                                return (
                                    <div key={song.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-gray-200 dark:border-zinc-700">
                                                <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{song.title}</p>
                                                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleAdd(song.id)}
                                            disabled={isAdded || isAdding}
                                            className={`ml-4 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition ${isAdded
                                                    ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                                                    : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-600 dark:hover:text-white'
                                                }`}
                                        >
                                            {isAdded ? <><Check size={16} /> Đã có</> :
                                                isAdding ? '...' : <><Plus size={16} /> Thêm</>}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <Music className="mx-auto mb-2 opacity-20" size={40} />
                            <p>Không tìm thấy bài hát phù hợp</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSongToAlbumModal;