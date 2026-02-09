// components/Artist/ArtistAbout.tsx
import React from 'react';

interface ArtistAboutProps {
    artistName: string;
    imageUrl: string;
    bio?: string;
    globalRank?: number;
}

const ArtistAbout = ({ artistName, imageUrl, bio, globalRank }: ArtistAboutProps) => {
    return (
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight pb-6">About</h2>
            
                <div className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] rounded-xl overflow-hidden group">
                    <img 
                        src={imageUrl} 
                        alt={artistName}
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                {/* Overlay tối dần xuống dưới */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Nội dung nổi lên trên */}
                <div className="absolute bottom-8 left-8 right-8 z-10">
                    
                    {/* Global Rank Badge */}
                    {globalRank && (
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xl text-white shadow-lg border-2 border-white">
                                #{globalRank}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/80">in the world</span>
                                <span className="text-sm font-bold text-white">Global Top Artist</span>
                            </div>
                        </div>
                    )}

                    {/* Bio Snippet */}
                    <div className="group-hover:translate-y-[-5px] transition-transform duration-300">
                        <p className="text-white font-medium line-clamp-3 text-lg leading-relaxed drop-shadow-md">
                            {bio || `${artistName} is an amazing artist delivering hits after hits. Tap to read more about their journey, achievements and upcoming tours.`}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArtistAbout;