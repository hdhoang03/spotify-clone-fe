import { Play } from 'lucide-react';

export const TopSongsTable = ({ data }: { data: any[] }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Bài Hát</h3>

            <div className="space-y-3 md:space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {data.map((song, idx) => (
                    <div key={song.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition duration-200">

                        {/* --- LEFT SIDE: Rank + Info (Chiếm phần lớn không gian) --- */}
                        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
                            {/* Rank Number */}
                            <span className={`w-6 flex-shrink-0 text-center font-black text-sm md:text-base
                                ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-600 dark:text-gray-500'}`}>
                                {idx + 1}
                            </span>

                            {/* Cover Image */}
                            <img src={song.cover} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm flex-shrink-0" />

                            {/* Text Info (Tự động truncate nếu hết chỗ) */}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={song.title}>
                                    {song.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate mt-0.5" title={song.artist}>
                                    {song.artist}
                                </p>
                            </div>
                        </div>

                        {/* --- RIGHT SIDE: Play Count (Không được co lại) --- */}
                        <div className="flex-shrink-0 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <Play size={10} fill="currentColor" className="text-gray-400" />
                            <span>{song.streams.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};