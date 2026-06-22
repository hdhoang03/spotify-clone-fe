import { useState } from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { formatTime } from '../../../utils/formatTime';
import TrackContextMenu from './TrackContextMenu';
import { useNavigate } from 'react-router-dom';
import EqualizerBars from '../../common/EqualizerBars';
import ArtistLinks from '../../common/ArtistLinks';
import { useTranslation } from 'react-i18next';

interface TrackRowProps {
    index: number;
    songId?: string;
    coverUrl: string;
    title: string;
    artist: string;
    artistId?: string;
    featuredArtists?: any[];
    duration: number;
    streamCount?: number;
    userStreamCount?: number;
    isPlaying?: boolean;
    onClick?: () => void;
    isArtistView?: boolean;
    onTogglePlayPause?: () => void;
    isActive?: boolean;
    isDeleted?: boolean;
}

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

const TrackRow = ({ index, songId, coverUrl, title, artist, artistId, featuredArtists, duration, streamCount, userStreamCount, isPlaying, onClick, onTogglePlayPause, isArtistView = false, isActive = false, isDeleted = false }: TrackRowProps) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
    const navigate = useNavigate();

    return (
        <div
            className={`group flex items-center justify-between p-2 md:px-4 md:py-2 rounded-md ${isDeleted ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer'} transition relative ${isMenuOpen ? 'z-50' : 'z-0'}`}
            onMouseEnter={() => !isDeleted && setIsHovered(true)}
            onMouseLeave={() => !isDeleted && setIsHovered(false)}
            onClick={() => {
                if (isDeleted) return;
                if (onClick) onClick();
            }}
            title={isDeleted ? t('playlist.content_unavailable') : undefined}
        >
            {/* --- LEFT: Index & Info --- */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div
                    className={`w-6 text-center text-gray-500 font-medium text-sm hidden md:block transition-transform ${isDeleted ? '' : 'cursor-pointer hover:scale-110'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isDeleted) return;
                        if (isActive && onTogglePlayPause) {
                            onTogglePlayPause(); // Nếu đang là bài này thì Pause/Resume
                        } else if (onClick) {
                            onClick(); // Nếu là bài khác thì phát lại từ đầu
                        }
                    }}
                >
                    {isHovered ? (
                        // Hover: luôn hiện Play/Pause icon
                        isPlaying && isActive
                            ? <Pause size={16} className="text-green-500 mx-auto" />
                            : <Play size={16} className={`mx-auto ${isActive ? 'text-green-500' : 'text-white'}`} />
                    ) : isActive && isPlaying ? (
                        // Đang phát, không hover: hiện equalizer animation
                        <EqualizerBars />
                    ) : isActive ? (
                        // Active nhưng paused: hiện Play màu xanh
                        <Play size={16} className="text-green-500 mx-auto" />
                    ) : (
                        // Bình thường: hiện số thứ tự
                        <span>{index + 1}</span>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={coverUrl} alt={title} className="w-10 h-10 md:w-10 md:h-10 rounded shadow-md object-cover shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className={`font-bold truncate text-sm md:text-base ${isActive ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                            {title}
                        </span>
                        <div className="block md:hidden text-xs text-gray-500 dark:text-gray-400">
                            {isArtistView ? (
                                <span className="font-medium">{streamCount ? formatNumber(streamCount) : '0'}</span>
                            ) : (
                                <ArtistLinks song={{ artist, artistId, featuredArtists }} className="max-w-[200px]" />
                            )}
                        </div>
                        <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400 truncate group-hover:text-black dark:group-hover:text-white transition">
                            <ArtistLinks song={{ artist, artistId, featuredArtists }} />
                        </span>
                    </div>
                </div>
            </div>

            {streamCount && (
                <div className="hidden md:flex flex-1 justify-end mr-8 text-sm text-gray-500 dark:text-gray-400 font-variant-numeric tabular-nums">
                    {formatNumber(streamCount)}
                </div>
            )}

            {/* --- RIGHT: Actions & Duration --- */}
            <div className="flex items-center gap-4 justify-end">

                {/* Lượt nghe cá nhân user - chỉ hiện khi có userStreamCount */}
                {userStreamCount !== undefined && (
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-variant-numeric tabular-nums">
                        <span>{formatNumber(userStreamCount)}</span>
                        <span className="text-xs opacity-70 text-green-500">{t('profile.plays')}</span>
                    </div>
                )}

                {/* SỬA 3: Thêm 'hidden md:block' để ẩn số phút trên màn hình điện thoại */}
                <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 font-variant-numeric w-10 text-right">
                    {duration ? formatTime(duration) : '--:--'}
                </div>

                {/* SỬA 4: Bọc nút 3 chấm trong w-8 để cân bằng tỉ lệ cột với Header ở trên */}
                <div className="relative flex items-center justify-center w-8">
                    <button
                        className={`text-gray-400 hover:text-black dark:hover:text-white transition p-1
                                    ${isHovered || menuPosition ? 'opacity-100' : 'opacity-0 md:opacity-0 opacity-100'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuPosition({ x: e.clientX, y: e.clientY });
                        }}
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {menuPosition && (
                        <TrackContextMenu
                            song={{ id: songId, title, artist, coverUrl }}
                            onClose={() => setMenuPosition(null)}
                            position={menuPosition}
                            onNavigateToArtist={(artistId) => navigate(`/artist/${artistId}`)}
                            onNavigateToAlbum={(albumId) => navigate(`/album/${albumId}`)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackRow;
