import { useState } from 'react';
import { ChevronLeft, Plus, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import PlaylistModal from '../Sidebar/PlaylistModal';
import { usePlaylists } from '../Sidebar/usePlaylists';

interface PlaylistSelectionViewProps {
    songId: string;
    onBack: () => void;
    onClose: () => void;
}

const PlaylistSelectionView = ({ songId, onBack, onClose }: PlaylistSelectionViewProps) => {
    const { t } = useTranslation();
    const { playlists, isLoading, createNewPlaylist } = usePlaylists();
    const [isAdding, setIsAdding] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePlaylist = async (formData: FormData) => {
        setIsCreating(true);
        try {
            await createNewPlaylist(formData);
            return true;
        } catch (err) {
            alert(t('sidebar.create_error'));
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    const handleAddToPlaylist = async (playlistId: string) => {
        setIsAdding(true);
        try {
            const res = await api.post(`/playlist/${playlistId}/add/${songId}`);
            if (res.data.code === 1000) {
                alert(t('player.add_success'));
                onClose();
            }
        } catch (error: any) {
            console.error("Lỗi thêm bài hát:", error);
            const status = error?.response?.status;
            if (status === 409 || status === 400) {
                alert(t('player.add_duplicate'));
            } else {
                alert(t('player.add_fail'));
            }
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
                <span className="text-lg font-bold text-white">{t('player.add_to_playlist')}</span>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-500" size={32} /></div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-left group"
                        >
                            <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                                <Plus size={24} className="text-white" />
                            </div>
                            <span className="text-base font-bold text-white">{t('player.create_new_playlist')}</span>
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

            <PlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlaylist}
                isLoading={isCreating}
            />
        </div>
    );
};

export default PlaylistSelectionView;