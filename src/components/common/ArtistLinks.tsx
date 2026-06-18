import { useNavigate } from 'react-router-dom';
import type { SongResponse } from '../../types/backend';

interface ArtistLinksProps {
    song: Partial<SongResponse>;
    className?: string;
    spanClassName?: string;
    onNavigate?: () => void;
}

const ArtistLinks = ({ song, className = "", spanClassName = "", onNavigate }: ArtistLinksProps) => {
    const navigate = useNavigate();

    const handleNavigate = (e: React.MouseEvent, id?: string) => {
        e.stopPropagation();
        if (id) {
            if (onNavigate) onNavigate();
            // A slight delay to allow UI (like full screen player) to trigger collapse animation before route changes
            setTimeout(() => navigate(`/artist/${id}`), 100);
        }
    };

    return (
        <span className={`truncate ${className}`} title={[song.artist, ...(song.featuredArtists?.map(f => f.name) || [])].join(', ')}>
            <span
                className={`${song.artistId ? 'hover:underline cursor-pointer' : ''} ${spanClassName} transition-colors`}
                onClick={(e) => handleNavigate(e, song.artistId)}
            >
                {song.artist || 'Unknown Artist'}
            </span>
            {song.featuredArtists && song.featuredArtists.length > 0 && song.featuredArtists.map((feat) => (
                <span key={feat.id}>
                    {', '}
                    <span
                        className={`hover:underline cursor-pointer ${spanClassName} transition-colors`}
                        onClick={(e) => handleNavigate(e, feat.id)}
                    >
                        {feat.name}
                    </span>
                </span>
            ))}
        </span>
    );
};

export default ArtistLinks;
