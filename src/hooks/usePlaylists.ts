// hooks/usePlaylists.ts
import { useState, useEffect } from 'react';

export interface Playlist {
    id: string;
    name: string;
    imageUrl?: string;
    type: 'playlist' | 'album';
    creator?: string;
}

export const usePlaylists = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setIsLoading(true);
                // Giả lập delay mạng
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockData: Playlist[] = [
                    { id: '1', name: 'Nhạc Lofi Chill', type: 'playlist', imageUrl: 'https://ih1.redbubble.net/image.3053774824.5137/st,small,507x507-pad,600x600,f8f8f8.jpg' },
                    { id: '2', name: 'Code Java 24/7', type: 'playlist', imageUrl: 'https://ih1.redbubble.net/image.3719288652.0902/flat,750x,075,f-pad,750x1000,f8f8f8.jpg' },
                    { id: '3', name: 'Nhạc US-UK', type: 'playlist', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png' },
                    { id: '4', name: 'Bolero Sầu Tím', type: 'playlist', imageUrl: '' }, 
                ];

                setPlaylists(mockData);
            } catch (err) {
                setError("Không thể tải danh sách");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    return { playlists, isLoading, error };
};