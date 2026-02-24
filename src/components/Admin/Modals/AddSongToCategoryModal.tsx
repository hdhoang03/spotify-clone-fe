// src/pages/Admin/Categories/Modals/AddSongToCategoryModal.tsx
import { useState } from 'react';
import { X, Search, Plus, Music } from 'lucide-react';
import { MOCK_SONGS } from '../../../constants/mockData';
import type { SongResponse } from '../../../types/backend';

interface AddSongModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId: string;
    currentSongIds: string[]; // Danh sách ID các bài đã có trong category để loại trừ
    onAdd: (songId: string) => Promise<void>;
}

const AddSongToCategoryModal = ({ isOpen, onClose, currentSongIds, onAdd }: AddSongModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [songs] = useState<SongResponse[]>(MOCK_SONGS);
    const [isLoading, setIsLoading] = useState(false);

    // Filter: Chỉ hiện bài hát KHÔNG nằm trong category hiện tại & Khớp từ khóa tìm kiếm
    const availableSongs = songs.filter(song =>
        !currentSongIds.includes(song.id) &&
        (song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (!isOpen) return null;

    const handleAddClick = async (songId: string) => {
        setIsLoading(true);
        try {
            await onAdd(songId);
            // Sau khi thêm thành công, bài hát sẽ tự động biến mất khỏi list này (do currentSongIds thay đổi ở parent)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />

            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thêm bài hát vào danh mục</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài hát để thêm..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List Songs */}
                <div className="flex-1 overflow-y-auto p-2">
                    {availableSongs.length > 0 ? (
                        <div className="space-y-1">
                            {availableSongs.map(song => (
                                <div key={song.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-gray-200 dark:border-zinc-700">
                                            <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{song.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{song.artist} • <span className="text-pink-500">{song.category || 'Chưa phân loại'}</span></p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAddClick(song.id)}
                                        disabled={isLoading}
                                        className="p-2 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white rounded-full transition-colors dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-600 dark:hover:text-white"
                                        title="Thêm vào danh mục này"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            ))}
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

export default AddSongToCategoryModal;