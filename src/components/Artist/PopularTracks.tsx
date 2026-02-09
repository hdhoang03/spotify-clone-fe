// components/Artist/PopularTracks.tsx
import React, { useState } from 'react';
import TrackRow from '../Profile/TrackRow'; // Tận dụng lại TrackRow bạn đã có

interface PopularTracksProps {
    tracks: any[];
    onPlayTrack: (index: number) => void;
}

const PopularTracks = ({ tracks, onPlayTrack }: PopularTracksProps) => {
    const [showAll, setShowAll] = useState(false);
    const visibleTracks = showAll ? tracks.slice(0, 10) : tracks.slice(0, 5);

return (
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Popular</h2>
            
            {/* Header Table (Chỉ hiện Desktop) */}
            <div className="hidden md:grid grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] gap-4 px-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-white/10 mb-2">
                <span>#</span>
                <span>Title</span>
                <span className="text-right pr-8">Plays</span>
                <span className="text-right flex justify-end gap-10">
                    <span className="mr-8">Time</span>
                </span>
            </div>

            <div className="flex flex-col">
                {visibleTracks.map((track, index) => (
                    <TrackRow 
                        key={track.id}
                        index={index}
                        coverUrl={track.coverUrl}
                        title={track.title}
                        artist={track.artist}
                        duration={track.duration}
                        // Mock stream count ngẫu nhiên
                        // streamCount={Math.floor(Math.random() * (50000000 - 1000000) + 1000000)}
                        streamCount={track.streamCount || Math.floor(Math.random() * 50000000)}
                        onClick={() => onPlayTrack(index)}
                        isArtistView={true}
                    />
                ))}
            </div>
            
            {tracks.length > 5 && (
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition"
                >
                    {showAll ? 'Show less' : 'See more'}
                </button>
            )}
        </section>
    );
};

export default PopularTracks;