import { ListPlus, Disc, Mic2, Share2, Info, ChevronRight, Download, Crown } from 'lucide-react';
import api from '../../services/api';
import ScrollingText from '../MusicPlayer/MiniPlayer/ScrollingText';
import { useTranslation } from 'react-i18next';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';

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
    const { isPremium } = usePremiumStatus();

    const handleDownload = async () => {
        if (!isPremium) {
            alert(t('player.download_premium_only') || "Tính năng tải nhạc chỉ dành cho tài khoản Premium!");
            return;
        }

        try {
            // Có thể hiện trạng thái đang tải...
            alert(t('player.downloading') || "Đang chuẩn bị tải xuống...");

            // Dùng api (axios config sẵn Bearer Token)
            const response = await api.get(`/song/${song.id}/download`, {
                responseType: 'blob' // Rất quan trọng để nhận file nhị phân
            });

            // Tạo link ẩn để tải file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Lấy tên từ header Content-Disposition nếu có, nếu không lấy title bài hát
            let fileName = `${song.title}.mp3`;
            const disposition = response.headers['content-disposition'];
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error: any) {
            console.error("Lỗi tải nhạc:", error);
            // axios response error status
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                alert(t('player.download_premium_only') || "Tính năng tải nhạc chỉ dành cho tài khoản Premium!");
            } else {
                alert(t('player.download_failed') || "Có lỗi xảy ra khi tải nhạc.");
            }
        }
    };

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
        {
            id: 'download',
            icon: Download,
            label: (
                <div className="flex items-center gap-2">
                    {t('player.download') || 'Tải xuống'}
                    <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-500 border border-amber-500/30">
                        <Crown size={12} className="fill-amber-500/50" />
                        Premium
                    </span>
                </div>
            ) as any, // Ép kiểu vì mảng đang mong đợi string ở label cũ
            action: handleDownload
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