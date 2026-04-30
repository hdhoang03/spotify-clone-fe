// src/components/PlaylistDetail/PlaylistHero.tsx
import { useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { Edit2, Globe, Lock } from 'lucide-react';

interface PlaylistHeroProps {
    playlist: any;
    songs: any[];
    isOwner: boolean;
    onEditClick: () => void;
    onColorExtracted: (color: string) => void;
}

const PlaylistHero = ({ playlist, songs, isOwner, onEditClick, onColorExtracted }: PlaylistHeroProps) => {
    // Tính tổng thời lượng (giả sử duration tính bằng giây)
    const totalSeconds = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const timeString = totalHours > 0 ? `${totalHours} giờ ${totalMinutes % 60} phút` : `${totalMinutes} phút`;

    // Trích xuất màu từ ảnh
    useEffect(() => {
        if (playlist?.coverUrl) {
            const fac = new FastAverageColor();
            fac.getColorAsync(playlist.coverUrl, { algorithm: 'dominant' })
                .then(color => onColorExtracted(color.hex))
                .catch(() => onColorExtracted('#535353')); // Màu xám mặc định nếu lỗi
        }
    }, [playlist?.coverUrl, onColorExtracted]);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 relative z-10">
            {/* Ảnh bìa có hiệu ứng Hover để sửa */}
            <div
                className={`relative w-56 h-56 md:w-60 md:h-60 shadow-2xl flex-shrink-0 group ${isOwner ? 'cursor-pointer' : ''} mb-2 md:mb-0`}
                onClick={isOwner ? onEditClick : undefined}
            >
                <img
                    src={playlist.coverUrl || 'https://via.placeholder.com/240'}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-sm"
                    crossOrigin="anonymous"
                />
                {isOwner && (
                    <div className="absolute inset-0 bg-black/60 hidden md:group-hover:flex flex-col items-center justify-center text-white transition-all rounded-sm">
                        <Edit2 size={32} className="mb-2" />
                        <span className="text-sm font-bold">Chọn ảnh</span>
                    </div>
                )}
            </div>

            {/* Khối chữ: Đảm bảo w-full và căn trái */}
            <div className="flex flex-col gap-3 w-full text-left">
                <div className="text-sm font-bold hidden md:flex items-center gap-2 text-zinc-800 dark:text-white">
                    {playlist.isPublic ? <Globe size={16} /> : <Lock size={16} />}
                    {playlist.isPublic ? 'Playlist Công khai' : 'Playlist Riêng tư'}
                </div>

                <h1
                    className="text-4xl md:text-7xl font-extrabold text-black dark:text-white cursor-pointer line-clamp-2 pb-1 leading-tight md:leading-normal"
                    onClick={isOwner ? onEditClick : undefined}
                >
                    {playlist.name}
                </h1>

                <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium line-clamp-2 md:line-clamp-none">{playlist.description}</p>

                <div className="flex flex-wrap items-center gap-2 text-sm font-medium mt-1 text-zinc-800 dark:text-white">
                    {playlist.user?.avatarUrl && <img src={playlist.user.avatarUrl} className="w-6 h-6 rounded-full" alt="avatar" />}
                    <span className="hover:underline cursor-pointer font-bold">{playlist.user?.username || 'Bạn'}</span>
                    <span className="opacity-80">• {playlist.songCount || 0} bài hát,</span>
                    <span className="opacity-60">{timeString}</span>
                </div>
            </div>
        </div>
    );
};

export default PlaylistHero;