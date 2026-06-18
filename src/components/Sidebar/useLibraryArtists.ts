import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

export interface FollowedArtist {
    id: string;
    name: string;
    avatarUrl: string;
    onClick: () => void;
}

/**
 * useLibraryArtists
 * Lấy danh sách nghệ sĩ mà user hiện tại đang follow.
 * Tái sử dụng endpoint: GET /user/follow/me/artist
 */
const useLibraryArtists = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [artists, setArtists] = useState<FollowedArtist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetch = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await api.get('/user/artist/me');
                if (!cancelled && res.data.result?.content) {
                    const formatted: FollowedArtist[] = res.data.result.content.map((a: any) => ({
                        id: String(a.id),
                        name: a.name,
                        avatarUrl: a.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.artistName)}`,
                        onClick: () => navigate(`/artist/${a.id}`),
                    }));
                    setArtists(formatted);
                }
            } catch {
                if (!cancelled) setError(t('library.fetch_artist_error'));
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetch();
        return () => { cancelled = true; };
    }, [navigate]);

    return { artists, isLoading, error };
};

export default useLibraryArtists;
