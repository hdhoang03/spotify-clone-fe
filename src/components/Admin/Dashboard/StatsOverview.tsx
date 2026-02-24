import { Users, Music, Album, PlayCircle } from 'lucide-react';

interface StatsProps {
    data: {
        totalUsers: number;
        totalSongs: number;
        totalArtists: number;
        totalAlbums: number;
        monthlyStreams: string;
    }
}

export const StatsOverview = ({ data }: StatsProps) => {
    const cards = [
        { title: "Tổng người dùng", value: data.totalUsers, icon: Users, color: "bg-blue-500", shadow: "shadow-blue-500/20" },
        { title: "Tổng bài hát", value: data.totalSongs, icon: Music, color: "bg-green-500", shadow: "shadow-green-500/20" },
        { title: "Tổng Album", value: data.totalAlbums, icon: Album, color: "bg-pink-500", shadow: "shadow-pink-500/20" }, // Mới
        { title: "Lượt nghe (Tháng)", value: data.monthlyStreams, icon: PlayCircle, color: "bg-orange-500", shadow: "shadow-orange-500/20" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((item, index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{item.title}</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white">{item.value}</h3>
                    </div>
                    <div className={`p-4 rounded-xl ${item.color} text-white shadow-lg ${item.shadow}`}>
                        <item.icon size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};