// components/Artist/ArtistHeader.tsx
import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface ArtistHeaderProps {
    artist: any;
}

const ArtistHeader = ({ artist }: ArtistHeaderProps) => {
    return (
        <div className="flex flex-col justify-end h-full z-10 relative">
            <div className="flex flex-col gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-20">
                
                {/* Verified Badge */}
                {artist.isVerified && (
                    <div className="flex items-center gap-2 text-white/90 mb-1 md:mb-0">
                        <div className="bg-blue-500 text-blue p-0.5 rounded-full shadow-lg shadow-blue-500/20">
                           <BadgeCheck size={20} fill="white" className="text-blue-500" /> 
                        </div>
                        <span className="text-xs md:text-sm font-bold tracking-widest drop-shadow-md">Verified Artist</span>
                    </div>
                )}

                {/* Artist Name: Giảm size ở mobile (text-5xl) để không bị to quá khổ */}
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white
                                tracking-tighter drop-shadow-2xl text-left md:text-left
                                leading-none break-words line-clamp-2 max-w-full max-md:pb-2 md:pb-2 lg:pb-4">
                    {artist.name}
                </h1>

                {/* Monthly Listeners */}
                <p className="text-white/90 font-medium text-sm md:text-xl drop-shadow-lg text-left">
                    {artist.monthlyListeners.toLocaleString()} monthly listeners
                </p>
            </div>
        </div>
    );
};

export default ArtistHeader;