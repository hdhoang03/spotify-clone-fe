import { Globe, Lock, Edit2 } from 'lucide-react';
import TiltCover from '../common/TiltCover';
import useDominantColor from '../../hooks/useDominantColor';
import { useTranslation } from 'react-i18next';

interface PlaylistHeroProps {
    playlist: any;
    songs: any[];
    isOwner: boolean;
    onEditClick: () => void;
    onColorExtracted: (color: string) => void;
}

const PlaylistHero = ({ playlist, songs, isOwner, onEditClick, onColorExtracted }: PlaylistHeroProps) => {
    const { t } = useTranslation();
    const totalSeconds = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const timeString = totalHours > 0 ? `${totalHours} ${t('playlist.hours')} ${totalMinutes % 60} ${t('playlist.minutes')}` : `${totalMinutes} ${t('playlist.minutes')}`;

    // Tái sử dụng useDominantColor thay vì tự gọi FastAverageColor
    const dominantColor = useDominantColor(playlist?.coverUrl);

    // Bubble màu lên PlaylistDetailPage (giữ API tương thích)
    // Dùng callback ref pattern để tránh gọi lại liên tục
    if (dominantColor && dominantColor !== '#535353') {
        onColorExtracted(dominantColor);
    }

    return (
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 relative z-10">

            {/* Ảnh bìa — TiltCover thay thế img thô */}
            <TiltCover
                src={playlist.coverUrl || 'https://via.placeholder.com/240'}
                alt={playlist.name}
                sizeClass="w-56 h-56 md:w-60 md:h-60"
                radiusClass="rounded-md"
                maxTilt={7}
                onClick={isOwner ? onEditClick : undefined}
            />

            {/* Thông tin playlist */}
            <div className="flex flex-col gap-3 w-full text-left">

                {/* Badge Public / Private */}
                <div className="hidden md:inline-flex items-center gap-1.5 self-start
                                px-3 py-1 rounded-full text-xs font-semibold
                                bg-white/10 border border-white/20 backdrop-blur-sm
                                text-zinc-800 dark:text-white/90">
                    {playlist.isPublic
                        ? <Globe size={12} className="text-primary-400" />
                        : <Lock size={12} className="text-zinc-400" />
                    }
                    {playlist.isPublic ? t('playlist.public') : t('playlist.private')}
                </div>

                {/* Tên playlist */}
                <div className="group/title flex items-end gap-3">
                    <h1
                        className="text-4xl md:text-7xl font-extrabold text-black dark:text-white
                                   line-clamp-2 pb-1 leading-tight md:leading-normal drop-shadow-lg
                                   transition-opacity duration-200"
                        onClick={isOwner ? onEditClick : undefined}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                    >
                        {playlist.name}
                    </h1>
                    {/* Edit hint icon — chỉ hiện với owner khi hover tên */}
                    {isOwner && (
                        <button
                            onClick={onEditClick}
                            className="mb-2 md:mb-4 opacity-0 group/title:opacity-0 hover:opacity-100
                                       p-2 rounded-lg hover:bg-white/10 transition-all duration-200
                                       text-white/60 hover:text-white shrink-0"
                            title={t('playlist.edit_playlist')}
                        >
                            <Edit2 size={20} />
                        </button>
                    )}
                </div>

                {/* Mô tả */}
                <p className="text-zinc-600 dark:text-zinc-300 text-sm font-medium
                              line-clamp-2 md:line-clamp-none leading-relaxed">
                    {playlist.description}
                </p>

                {/* Meta: avatar + username + stats */}
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium mt-1 text-zinc-800 dark:text-white">
                    {playlist.user?.avatarUrl && (
                        <img
                            src={playlist.user.avatarUrl}
                            className="w-6 h-6 rounded-full ring-2 ring-white/20 object-cover"
                            referrerPolicy="no-referrer"
                            alt="avatar"
                        />
                    )}
                    <span className="hover:underline cursor-pointer font-bold">
                        {playlist.user?.username || t('playlist.you')}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">·</span>
                    <span className="font-semibold">{playlist.songCount || 0} {t('playlist.songs')}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">·</span>
                    <span className="opacity-60 font-normal">{timeString}</span>
                </div>
            </div>
        </div>
    );
};

export default PlaylistHero;