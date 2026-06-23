import { ListPlus, Disc, Mic2, Share2, Info, ChevronRight } from 'lucide-react';
import ScrollingText from '../MusicPlayer/MiniPlayer/ScrollingText';
import { useTranslation } from 'react-i18next';

interface MainOptionsViewProps {
    song: any;
    artistList: any[];
    onShare: () => void;
    onRequestArtistSelection: () => void;
    onNavigateToArtist: (id: string) => void;
    onNavigateToAlbum: () => void;
    onRequestPlaylistSelection: () => void;
}

const MainOptionsView = ({
    song,
    artistList,
    onShare,
    onRequestArtistSelection,
    onNavigateToArtist,
    onNavigateToAlbum,
    onRequestPlaylistSelection
}: MainOptionsViewProps) => {
    const { t } = useTranslation();

    // Cấu hình danh sách options ngay tại đây
    const options = [
        {
            id: 'add_playlist',
            icon: ListPlus,
            label: t('player.add_to_playlist'),
            action: onRequestPlaylistSelection
        },

        {
            id: 'go_artist',
            icon: Mic2,
            label: t('player.view_artist'),
            action: () => {
                if (artistList.length > 1) {
                    onRequestArtistSelection();
                } else if (artistList.length > 0) {
                    const targetArtistId = artistList[0].id;

                    // Gọi trực tiếp để trigger onClose() và onCollapse() bên trong handleNavigateToArtist
                    onNavigateToArtist(targetArtistId);
                }
            }
        },
        // Chỉ hiện "Xem Album" nếu bài hát có thuộc album (không phải single)
        ...(song?.albumId ? [{
            id: 'go_album',
            icon: Disc,
            label: t('player.view_album'),
            action: onNavigateToAlbum
        }] : []),
        {
            id: 'share',
            icon: Share2,
            label: t('player.share'),
            action: onShare // Gọi hàm từ props
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            {/* Header: Song Info */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <img
                    src={song.coverUrl}
                    alt="thumb"
                    className="w-16 h-16 rounded-md object-cover shadow-lg"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <ScrollingText content={song.title} className="text-lg font-bold text-white" />
                    <ScrollingText content={artistList.map(a => a.name).join(', ')} className="text-zinc-400 mt-0.5" />
                </div>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={opt.action}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-left group"
                    >
                        <opt.icon className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
                        <span className="text-base font-medium text-zinc-200 group-hover:text-white flex-1">
                            {opt.label}
                        </span>
                        {/* Hiện mũi tên nếu là mục Artist có nhiều người */}
                        {opt.id === 'go_artist' && artistList.length > 1 && (
                            <ChevronRight size={20} className="text-zinc-600 group-hover:text-white" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainOptionsView;