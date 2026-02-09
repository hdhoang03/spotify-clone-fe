import React from 'react';
import { Heart } from 'lucide-react';

interface SongDetailsProps {
    coverUrl: string;
    title: string;
    artist: string;
}

const SongDetails = ({ coverUrl, title, artist }: SongDetailsProps) => {
    return (
        <>
            <div className="w-full aspect-square relative shadow-2xl rounded-lg overflow-hidden mt-4">
                <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
            </div>

            <div className="flex justify-between items-end mt-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1">{title}</h2>
                    <p className="text-lg text-gray-300 opacity-80">{artist}</p>
                </div>
                <button className="text-green-500 hover:scale-110 transition">
                    <Heart size={28} fill="currentColor" />
                </button>
            </div>
        </>
    );
};

export default React.memo(SongDetails);