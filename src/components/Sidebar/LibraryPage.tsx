import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { usePlaylists } from './usePlaylists';
import LibraryPlaylistsView from './LibraryPlaylistsView';
import LibraryArtistsView from './LibraryArtistsView';
import PlaylistModal from './PlaylistModal';
import { useTranslation } from 'react-i18next';

const FILTERS = ['Playlists', 'Artists'];

const LibraryPage = () => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState('Playlists');
    const { playlists, createNewPlaylist } = usePlaylists();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePlaylist = async (formData: FormData) => {
        setIsCreating(true);
        try {
            await createNewPlaylist(formData);
            return true;
        } catch (err) {
            alert(t('library.create_error'));
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    const renderContent = () => {
        switch (activeFilter) {
            case 'Playlists': return <LibraryPlaylistsView playlists={playlists} />;
            case 'Artists': return <LibraryArtistsView />;
            // case 'Albums': return <div className="text-center text-zinc-500 mt-10">Tính năng Albums đang phát triển...</div>;
            default: return null;
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-black md:bg-transparent">
            {/* --- MOBILE HEADER --- */}
            <div className="md:hidden pt-4 pb-2 px-4 sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-black dark:text-white">{t('library.title')}</h1>
                    <div className="flex items-center gap-4 text-black dark:text-white">
                        <button onClick={() => setIsCreateModalOpen(true)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                            <Plus size={24} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeFilter === filter
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-transparent text-black dark:text-white border-zinc-300 dark:border-zinc-700'
                                }`}>
                            {t(`library.${filter.toLowerCase()}`)}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- DESKTOP HEADER --- */}
            <div className="hidden md:flex items-center gap-4 pb-6 md:pb-8 py-2 bg-inherit w-full px-6 md:px-8 pt-6">
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        // Sửa lại class của active button: giữ nguyên green + white text cho cả 2 mode
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border border-transparent ${activeFilter === filter
                            ? 'bg-green-500 text-white shadow-md shadow-green-500/20 scale-105' // Xóa bỏ 'dark:bg-white dark:text-black'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]'
                            }`}>
                        {t(`library.${filter.toLowerCase()}`)}
                    </button>
                ))}
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-48">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>

            {/* Popup Tạo Playlist */}
            <PlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlaylist}
                isLoading={isCreating}
            />
        </div>
    );
};

export default LibraryPage;