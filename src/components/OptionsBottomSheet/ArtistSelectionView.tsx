import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArtistSelectionViewProps {
    artists: any[];
    onBack: () => void;
    onSelectArtist: (id: string) => void;
}

const ArtistSelectionView = ({ artists, onBack, onSelectArtist }: ArtistSelectionViewProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300 h-full flex flex-col">
            {/* Sub Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <button 
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition"
                >
                    <ChevronLeft size={24} />
                </button>
                <span className="text-lg font-bold text-white">Nghệ sĩ tham gia</span>
            </div>

            {/* List Artists */}
            <div className="flex flex-col gap-3">
                {artists.map((artist) => (
                    <button
                        key={artist.id}
                        onClick={() => onSelectArtist(artist.id)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all text-left"
                    >
                        <img 
                            src={artist.avatar} 
                            alt={artist.name}
                            className="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                        <span className="text-base font-bold text-white flex-1">
                            {artist.name}
                        </span>
                        <ChevronRight size={20} className="text-zinc-500"/>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ArtistSelectionView;