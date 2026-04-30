// src/stores/usePlaylistStore.ts
import { create } from 'zustand';

export interface UserSummaryResponse {
    id: string;
    username: string;
    avatarUrl: string;
}

interface Playlist {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    isPublic: boolean;
    createdAt: string;
    user: UserSummaryResponse;
    songCount: number;
}

interface PlaylistStore {
    playlists: Playlist[];
    hasFetched: boolean;
    setPlaylists: (playlists: Playlist[]) => void;
    addPlaylist: (playlist: Playlist) => void;
    removePlaylist: (id: string | number) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
    playlists: [],
    hasFetched: false,

    setPlaylists: (playlists) => set({ playlists, hasFetched: true }),

    addPlaylist: (playlist) => set((state) => ({
        playlists: [playlist, ...state.playlists]
    })),

    removePlaylist: (id) => set((state) => {
        const targetId = String(id).trim();
        const newPlaylists = state.playlists.filter(
            playlist => String(playlist.id).trim() !== targetId
        );
        return { playlists: newPlaylists };
    }),
}));