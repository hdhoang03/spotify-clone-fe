import { Users, Music, Album, PlayCircle } from 'lucide-react';
import { TiltCard } from '../../common/TiltCard';

interface StatsProps {
    data: {
        totalUsers: number;
        totalSongs: number;
        totalArtists: number;
        totalAlbums: number;
        monthlyStreams: string;
    };
}

const STAT_CARDS = [
    {
        key: 'totalUsers' as const,
        title: 'Tổng người dùng',
        icon: Users,
        color: 'bg-blue-500',
        glowColor: 'rgba(59,130,246,0.4)',
        spotlightColor: 'rgba(59,130,246,0.12)',
    },
    {
        key: 'totalSongs' as const,
        title: 'Tổng bài hát',
        icon: Music,
        color: 'bg-green-500',
        glowColor: 'rgba(34,197,94,0.4)',
        spotlightColor: 'rgba(34,197,94,0.12)',
    },
    {
        key: 'totalAlbums' as const,
        title: 'Tổng Album',
        icon: Album,
        color: 'bg-pink-500',
        glowColor: 'rgba(236,72,153,0.4)',
        spotlightColor: 'rgba(236,72,153,0.12)',
    },
    {
        key: 'monthlyStreams' as const,
        title: 'Lượt nghe (Tháng)',
        icon: PlayCircle,
        color: 'bg-orange-500',
        glowColor: 'rgba(249,115,22,0.4)',
        spotlightColor: 'rgba(249,115,22,0.12)',
    },
];

export const StatsOverview = ({ data }: StatsProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map(({ key, ...rest }, index) => (
            <TiltCard key={key} value={data[key]} index={index} {...rest} />
        ))}
    </div>
);