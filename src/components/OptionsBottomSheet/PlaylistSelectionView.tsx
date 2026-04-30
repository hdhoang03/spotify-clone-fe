import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface PlaylistSelectionViewProps {
    songId: string;
    onBack: () => void;
    onClose: () => void;
}

const PlaylistSelectionView = ({ songId, onBack, onClose }: PlaylistSelectionViewProps) => {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await api.get('/playlist/my', { params: { page: 1, size: 50 } });
                if (res.data.code === 1000) {
                    setPlaylists(res.data.result.content || []);
                }
            } catch (error) {
                console.error("Lỗi tải playlist:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

    const handleAddToPlaylist = async (playlistId: string) => {
        setIsAdding(true);
        try {
            const res = await api.post(`/playlist/${playlistId}/add/${songId}`);
            if (res.data.code === 1000) {
                alert("Đã thêm bài hát vào playlist thành công!");
                onClose();
            }
        } catch (error) {
            console.error("Lỗi thêm bài hát:", error);
            alert("Không thể thêm vào playlist lúc này.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition">
                    <ChevronLeft size={24} />
                </button>
                <span className="text-lg font-bold text-white">Thêm vào Playlist</span>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-500" size={32} /></div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-left group">
                            <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                                <Plus size={24} className="text-white" />
                            </div>
                            <span className="text-base font-bold text-white">Tạo Playlist mới</span>
                        </button>

                        {playlists.map((pl) => (
                            <button
                                key={pl.id}
                                onClick={() => handleAddToPlaylist(pl.id)}
                                disabled={isAdding}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-left"
                            >
                                <img src={pl.coverUrl || 'https://ui-avatars.com/api/?name=Playlist'} alt={pl.name} className="w-12 h-12 rounded-md object-cover" />
                                <span className="text-base font-bold text-white flex-1">{pl.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistSelectionView;